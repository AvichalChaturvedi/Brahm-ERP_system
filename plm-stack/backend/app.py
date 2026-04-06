from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import requests
import json
import csv
from io import StringIO, BytesIO

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///portal.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ============================================
# DATABASE MODELS
# ============================================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    github_username = db.Column(db.String(120))
    jlc_username = db.Column(db.String(120))
    lion_username = db.Column(db.String(120))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    priority = db.Column(db.String(20), default='medium')
    due_date = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    github_issue_url = db.Column(db.String(500))
    bom_id = db.Column(db.Integer, db.ForeignKey('bom.id'))
    
    assignee = db.relationship('User', foreign_keys=[assigned_to])
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'assigned_to': self.assignee.to_dict() if self.assignee else None,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat(),
            'github_issue_url': self.github_issue_url
        }

class BOM(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_path = db.Column(db.String(500))
    project_name = db.Column(db.String(200))
    
    uploader = db.relationship('User')
    parts = db.relationship('BOMPart', backref='bom', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'uploaded_by': self.uploader.full_name if self.uploader else None,
            'created_at': self.created_at.isoformat(),
            'project_name': self.project_name,
            'part_count': len(self.parts),
            'total_cost': sum(part.best_price * part.quantity for part in self.parts if part.best_price)
        }

class BOMPart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bom_id = db.Column(db.Integer, db.ForeignKey('bom.id'), nullable=False)
    part_number = db.Column(db.String(100))
    description = db.Column(db.String(300))
    quantity = db.Column(db.Integer, default=1)
    unit = db.Column(db.String(20), default='pcs')
    mpn = db.Column(db.String(100))
    manufacturer = db.Column(db.String(100))
    footprint = db.Column(db.String(100))
    value = db.Column(db.String(100))
    
    # Pricing from different sources
    octoparts_price = db.Column(db.Float)
    jlc_price = db.Column(db.Float)
    lion_price = db.Column(db.Float)
    best_price = db.Column(db.Float)
    best_supplier = db.Column(db.String(50))
    
    # Stock info
    octoparts_stock = db.Column(db.Integer)
    jlc_stock = db.Column(db.Integer)
    lion_stock = db.Column(db.Integer)
    
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'part_number': self.part_number,
            'description': self.description,
            'quantity': self.quantity,
            'unit': self.unit,
            'mpn': self.mpn,
            'manufacturer': self.manufacturer,
            'footprint': self.footprint,
            'value': self.value,
            'pricing': {
                'octoparts': {'price': self.octoparts_price, 'stock': self.octoparts_stock},
                'jlc': {'price': self.jlc_price, 'stock': self.jlc_stock},
                'lion': {'price': self.lion_price, 'stock': self.lion_stock}
            },
            'best_price': self.best_price,
            'best_supplier': self.best_supplier,
            'line_cost': (self.best_price or 0) * self.quantity
        }

class GerberFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bom_id = db.Column(db.Integer, db.ForeignKey('bom.id'))
    filename = db.Column(db.String(500))
    file_path = db.Column(db.String(500))
    file_type = db.Column(db.String(20))  # gerber, kicad, eagle, altium
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'file_type': self.file_type,
            'uploaded_at': self.uploaded_at.isoformat()
        }

# ============================================
# AUTHENTICATION ROUTES
# ============================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password') or not data.get('full_name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    user = User(
        email=data['email'],
        full_name=data['full_name'],
        is_admin=False
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Registration successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'User account is inactive'}), 403
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

# ============================================
# ADMIN ROUTES
# ============================================

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    return wrapper

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def list_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    if 'is_active' in data:
        user.is_active = data['is_active']
    if 'github_username' in data:
        user.github_username = data['github_username']
    if 'jlc_username' in data:
        user.jlc_username = data['jlc_username']
    if 'lion_username' in data:
        user.lion_username = data['lion_username']
    
    db.session.commit()
    
    return jsonify(user.to_dict()), 200

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted'}), 200

# ============================================
# TASK ROUTES
# ============================================

@app.route('/api/tasks', methods=['GET'])
@jwt_required()
def list_tasks():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Admin sees all tasks, others see assigned to them
    if user.is_admin:
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(assigned_to=user_id).all()
    
    return jsonify([task.to_dict() for task in tasks]), 200

@app.route('/api/tasks', methods=['POST'])
@admin_required
def create_task():
    data = request.get_json()
    
    task = Task(
        title=data.get('title'),
        description=data.get('description'),
        assigned_to=data.get('assigned_to'),
        priority=data.get('priority', 'medium'),
        created_by=get_jwt_identity()
    )
    
    if data.get('due_date'):
        task.due_date = datetime.fromisoformat(data['due_date'])
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Only admin or assigned user can update
    if not user.is_admin and task.assigned_to != user_id:
        return jsonify({'error': 'Not authorized'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']
    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date'])
    if 'github_issue_url' in data:
        task.github_issue_url = data['github_issue_url']
    
    db.session.commit()
    
    return jsonify(task.to_dict()), 200

# ============================================
# BOM ROUTES
# ============================================

@app.route('/api/boms', methods=['GET'])
@jwt_required()
def list_boms():
    boms = BOM.query.all()
    return jsonify([bom.to_dict() for bom in boms]), 200

@app.route('/api/boms', methods=['POST'])
@jwt_required()
def create_bom():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    project_name = request.form.get('project_name', 'Unnamed Project')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Parse CSV BOM
    if file.filename.endswith('.csv'):
        stream = StringIO(file.stream.read().decode('utf8'), newline=None)
        csv_reader = csv.DictReader(stream)
        
        bom = BOM(
            name=file.filename,
            project_name=project_name,
            uploaded_by=get_jwt_identity()
        )
        db.session.add(bom)
        db.session.flush()
        
        for row in csv_reader:
            part = BOMPart(
                bom_id=bom.id,
                part_number=row.get('Part Number'),
                description=row.get('Description'),
                quantity=int(row.get('Quantity', 1)),
                mpn=row.get('MPN'),
                manufacturer=row.get('Manufacturer'),
                footprint=row.get('Footprint'),
                value=row.get('Value')
            )
            db.session.add(part)
        
        db.session.commit()
        
        return jsonify(bom.to_dict()), 201
    
    return jsonify({'error': 'Only CSV files supported'}), 400

@app.route('/api/boms/<int:bom_id>', methods=['GET'])
@jwt_required()
def get_bom(bom_id):
    bom = BOM.query.get(bom_id)
    if not bom:
        return jsonify({'error': 'BOM not found'}), 404
    
    return jsonify({
        **bom.to_dict(),
        'parts': [part.to_dict() for part in bom.parts]
    }), 200

@app.route('/api/boms/<int:bom_id>/parts/<int:part_id>/pricing', methods=['GET'])
@jwt_required()
def get_part_pricing(bom_id, part_id):
    part = BOMPart.query.get(part_id)
    if not part:
        return jsonify({'error': 'Part not found'}), 404
    
    # Query pricing from suppliers
    query_pricing(part)
    
    db.session.commit()
    
    return jsonify(part.to_dict()), 200

@app.route('/api/boms/<int:bom_id>/pricing', methods=['POST'])
@jwt_required()
def get_all_pricing(bom_id):
    bom = BOM.query.get(bom_id)
    if not bom:
        return jsonify({'error': 'BOM not found'}), 404
    
    for part in bom.parts:
        query_pricing(part)
    
    db.session.commit()
    
    return jsonify({
        **bom.to_dict(),
        'parts': [part.to_dict() for part in bom.parts],
        'total_cost': sum(part.best_price * part.quantity for part in bom.parts if part.best_price)
    }), 200

def query_pricing(part):
    """Query pricing from multiple suppliers"""
    
    # Query OctoParts (if available)
    if part.mpn:
        try:
            # Mock OctoParts call - implement with real API
            part.octoparts_price = 1.50  # Mock data
            part.octoparts_stock = 1000
        except:
            pass
    
    # Query JLC (if available)
    try:
        # Mock JLC call
        part.jlc_price = 1.25
        part.jlc_stock = 500
    except:
        pass
    
    # Query Lion Circuits (if available)
    try:
        # Mock Lion call
        part.lion_price = 1.75
        part.lion_stock = 800
    except:
        pass
    
    # Determine best price
    prices = []
    if part.octoparts_price:
        prices.append(('OctoParts', part.octoparts_price))
    if part.jlc_price:
        prices.append(('JLC', part.jlc_price))
    if part.lion_price:
        prices.append(('Lion', part.lion_price))
    
    if prices:
        best_supplier, best_price = min(prices, key=lambda x: x[1])
        part.best_supplier = best_supplier
        part.best_price = best_price
    
    part.last_updated = datetime.utcnow()

# ============================================
# GITHUB INTEGRATION
# ============================================

@app.route('/api/github/sync', methods=['POST'])
@jwt_required()
def sync_github():
    data = request.get_json()
    repo = data.get('repo')
    
    if not repo:
        return jsonify({'error': 'Repository URL required'}), 400
    
    # This would integrate with GitHub API
    # For now, return mock data
    
    return jsonify({
        'status': 'synced',
        'commits': [
            {
                'sha': 'abc123',
                'message': 'Add PWM control',
                'author': 'John Doe',
                'date': datetime.utcnow().isoformat(),
                'url': 'https://github.com/example'
            }
        ]
    }), 200

# ============================================
# GERBER VIEWER
# ============================================

@app.route('/api/gerber/upload', methods=['POST'])
@jwt_required()
def upload_gerber():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    bom_id = request.form.get('bom_id')
    
    if not file.filename.endswith(('.gbr', '.gbl', '.gts', '.gbs', '.gtp', '.gbp', '.xln')):
        return jsonify({'error': 'Invalid Gerber file'}), 400
    
    gerber = GerberFile(
        bom_id=bom_id,
        filename=file.filename,
        file_path=f'uploads/gerber/{file.filename}',
        file_type='gerber'
    )
    
    db.session.add(gerber)
    db.session.commit()
    
    return jsonify(gerber.to_dict()), 201

# ============================================
# ORDERING
# ============================================

@app.route('/api/orders/create', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    bom_id = data.get('bom_id')
    supplier = data.get('supplier')  # 'jlc', 'lion', 'octoparts'
    
    bom = BOM.query.get(bom_id)
    if not bom:
        return jsonify({'error': 'BOM not found'}), 404
    
    # Get parts for selected supplier
    parts = [part for part in bom.parts if part.best_supplier.lower() == supplier.lower()]
    
    total_cost = sum(part.best_price * part.quantity for part in parts)
    
    # Integration with supplier APIs would go here
    # For JLC: Send order via their API
    # For Lion: Send order via their API
    
    return jsonify({
        'status': 'order_created',
        'supplier': supplier,
        'parts': len(parts),
        'total_cost': total_cost,
        'order_id': 'ORD-' + str(datetime.utcnow().timestamp())[:10]
    }), 201

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
