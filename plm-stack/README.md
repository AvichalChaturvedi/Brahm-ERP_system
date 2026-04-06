# Hardware Portal - Complete Setup

A professional web portal for hardware project management with full team collaboration, BOM management, cost comparison, and GitHub integration — all running in Docker.

## Quick Start

### Prerequisites
- Docker Desktop (already installed)
- Windows 10/11 or Linux/Mac

### Run the Portal

**Windows:**
Double-click `START.bat` or run:
```bash
.\START.bat
```

**Linux/Mac:**
```bash
bash START.sh
```

The portal will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432

### First Time Setup

1. Open http://localhost:3000 in your browser
2. Click "Sign up" and create your admin account
3. Login with your credentials
4. Go to **Team** tab to add team members
5. Use **Tasks** tab to assign work
6. Use **BOM** tab to upload and manage BOMs

## Stop the Portal

**Windows:**
```bash
.\STOP.bat
```

**Linux/Mac:**
```bash
bash STOP.sh
```

Or:
```bash
docker-compose down
```

## Project Structure

```
plm-stack/
├── backend/                 # Flask API backend
│   ├── app.py              # Main application (all routes & models)
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styling
│   │   └── main.jsx        # Entry point
│   ├── package.json        # NPM dependencies
│   ├── vite.config.js      # Vite config
│   ├── index.html          # HTML template
│   └── Dockerfile          # Frontend container
├── docker-compose.yml      # Docker services configuration
├── .env                    # Environment variables
├── START.bat / START.sh    # Quick start script
└── STOP.bat / STOP.sh      # Stop script
```

## Features

✅ **User Management** - Admin creates team members, assigns tasks  
✅ **Task Management** - Create, assign, and track tasks with priorities  
✅ **BOM Management** - Upload CSV BOMs, query pricing from suppliers  
✅ **Cost Comparison** - Automatically compare part costs  
✅ **GitHub Integration** - Track commits and releases  
✅ **Order Placement** - Direct ordering framework (JLC, Lion Circuits)  
✅ **Professional Dashboard** - Clean, responsive UI

## API Endpoints

### Authentication
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/<id>` - Update task

### BOMs
- `GET /api/boms` - List BOMs
- `POST /api/boms/upload` - Upload BOM CSV file
- `GET /api/boms/<id>/parts` - Get BOM parts with pricing

### Admin
- `GET /api/admin/users` - List users (admin only)
- `POST /api/admin/users` - Add user (admin only)
- `DELETE /api/admin/users/<id>` - Delete user (admin only)

### GitHub
- `POST /api/github/sync` - Sync GitHub commits

## Environment Configuration

Edit `.env` to configure API keys and database credentials:

```env
DB_USER=portal_user
DB_PASSWORD=portal_pass
DB_NAME=portal_db
JWT_SECRET_KEY=your-secret-key-here
GITHUB_TOKEN=your_github_token
OCTOPARTS_API_KEY=your_key
JLC_API_KEY=your_key
LION_API_KEY=your_key
```

## Database Models

- **User**: email, password, full_name, is_admin, github_username, jlc_username, lion_username
- **Task**: title, description, assigned_to (FK), status, priority, due_date, github_issue_url
- **BOM**: name, project_name, uploaded_by (FK), created_at, parts (relationship)
- **BOMPart**: mpn, quantity, octoparts_price, jlc_price, lion_price, best_price, best_supplier

## Troubleshooting

**Ports already in use:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

**View specific service logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Reset database:**
```bash
docker volume rm plm-stack_portal_postgres_data
docker-compose up -d
```

## Notes

- First user created becomes admin
- JWT tokens expire in 30 days
- PostgreSQL data persists in Docker volume
- All containers auto-restart on failure
- Production-ready with CORS, security headers, and rate limiting placeholders

## Next Steps

1. Set JWT_SECRET_KEY in .env to a strong random value
2. Add API keys for GitHub, OctoParts, JLC, and Lion Circuits
3. Customize task priorities and statuses as needed
4. Add more team members through the admin panel
5. Start uploading and managing BOMs
