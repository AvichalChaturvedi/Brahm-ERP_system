# Complete Open-Source Hardware Product Stack
## For Product-Based Companies Using Fusion 360, VS Code, GitHub, Figma, and Procurement APIs

---

## TABLE OF CONTENTS
1. [Architecture Overview](#architecture-overview)
2. [Tool Selection & Justification](#tool-selection)
3. [Complete Integration Workflow](#integration-workflow)
4. [Setup Instructions](#setup-instructions)
5. [Data Flow Diagrams](#data-flows)

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                     HARDWARE PRODUCT PLATFORM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DESIGN & DEVELOPMENT (Existing Tools)                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Fusion 360 (Mechanical + Electronics)                 │   │
│  │  • Figma (Industrial Design & UI)                        │   │
│  │  • VS Code + GitHub (Firmware)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  EXPORT & IMPORT LAYER (CSV, JSON, API)                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • BOM Export (Fusion 360 → CSV)                         │   │
│  │  • GitHub Webhooks → Project Status                      │   │
│  │  • Figma API → Design Reviews                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CORE PLATFORM (100% Open-Source, Docker)               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ INVENTORY & BOM MANAGEMENT                      │    │   │
│  │  │  • InvenTree (BOM, parts, stock tracking)       │    │   │
│  │  │  • Port: 8000                                   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ PROJECT & TASK MANAGEMENT                       │    │   │
│  │  │  • Taiga (Open-source Agile)                    │    │   │
│  │  │  • Gantt charts, sprints, kanban                │    │   │
│  │  │  • Port: 9000                                   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ PROCUREMENT & SUPPLIER INTEGRATION              │    │   │
│  │  │  • Custom Python API (Digi-Key, Mouser, etc.)  │    │   │
│  │  │  • Real-time pricing & availability             │    │   │
│  │  │  • Port: 5000                                   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ VERSION CONTROL INTEGRATION                     │    │   │
│  │  │  • GitHub API integration                       │    │   │
│  │  │  • Firmware versioning + release tracking       │    │   │
│  │  │  • Port: 5001                                   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ UNIFIED DASHBOARD & API                         │    │   │
│  │  │  • Vue.js / React frontend                      │    │   │
│  │  │  • RESTful API gateway                          │    │   │
│  │  │  • Port: 3000                                   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │ DATABASE LAYER                                  │    │   │
│  │  │  • PostgreSQL (primary data store)              │    │   │
│  │  │  • Redis (caching & sessions)                   │    │   │
│  │  │  • Elasticsearch (search & analytics)           │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PROCUREMENT & SUPPLIER APIs (External)                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Digi-Key API (pricing, stock)                         │   │
│  │  • Mouser API (pricing, stock)                           │   │
│  │  • Element14 API (pricing, stock)                        │   │
│  │  • MISUMI API (custom parts)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## TOOL SELECTION & JUSTIFICATION

### **1. INVENTORY & BOM MANAGEMENT: InvenTree**
- **Why:** Purpose-built for electronics BOM management
- **Features:**
  - Import BOMs from Fusion 360 (CSV)
  - Track parts, suppliers, pricing
  - Stock level management
  - Multi-language support
  - RESTful API for integrations
- **Cost:** FREE (Open Source)
- **Port:** 8000

### **2. PROJECT MANAGEMENT: Taiga**
- **Why:** Better than Odoo for hardware teams (Agile-focused, lighter)
- **Features:**
  - User stories, sprints, kanban boards
  - Gantt charts for project timeline
  - Task assignment and team collaboration
  - Multi-project support
  - Time tracking
- **Cost:** FREE (Open Source)
- **Port:** 9000

### **3. PROCUREMENT INTEGRATION: Custom Python API**
- **Why:** Connect to Digi-Key, Mouser, Element14, MISUMI APIs
- **Features:**
  - Real-time pricing from suppliers
  - Stock availability checks
  - Automated part matching
  - Quote generation
  - Purchase order generation
- **Cost:** FREE (Custom built)
- **Port:** 5000

### **4. VERSION CONTROL INTEGRATION: GitHub API Sync**
- **Why:** Link firmware versions to projects
- **Features:**
  - Auto-sync GitHub releases to projects
  - Commit history tracking
  - Version tagging in BOM
  - Release notes automation
- **Cost:** FREE (You already use GitHub)
- **Port:** 5001

### **5. UNIFIED DASHBOARD: Vue.js / React**
- **Why:** Single entry point for all systems
- **Features:**
  - Real-time project status
  - BOM view with supplier pricing
  - GitHub commit history
  - Procurement status
  - Team dashboard
- **Cost:** FREE (Open Source frameworks)
- **Port:** 3000

### **6. DATABASES**
- **PostgreSQL:** Primary data store (FREE, Open Source)
- **Redis:** Session caching (FREE, Open Source)
- **Elasticsearch:** Full-text search (FREE, Open Source)

---

## COMPLETE INTEGRATION WORKFLOW

### **SCENARIO: Launch a New Hardware Product**

#### **STEP 1: Design Phase (Existing Tools)**
```
Mechanical Design → Fusion 360
Electronics Design → Fusion 360
Industrial Design → Figma
UI/UX → Figma
Firmware → VS Code + GitHub
```

#### **STEP 2: BOM Export & Import**
```
Fusion 360 (Export as CSV)
    ↓
InvenTree (Import BOM)
    ↓
Auto-match parts from Digi-Key, Mouser, Element14, MISUMI
    ↓
Populate pricing and availability
    ↓
Generate procurement cost estimate
```

#### **STEP 3: Project Creation**
```
Taiga
    ├─ Create Project "Product Name"
    ├─ Add Team Members
    ├─ Create Epics (Hardware, Firmware, Industrial Design)
    ├─ Create User Stories
    └─ Link to BOM from InvenTree
```

#### **STEP 4: Task Assignment & Tracking**
```
Taiga (Task Management)
    ├─ Assign tasks to team members
    ├─ Track progress with Gantt charts
    ├─ Sprint planning
    └─ Burn-down charts
```

#### **STEP 5: GitHub Integration**
```
VS Code (Firmware Development)
    ↓
GitHub Push (commit)
    ↓
GitHub API Webhook
    ↓
Dashboard Auto-Updates (commit message, branch, PR status)
    ↓
Taiga Auto-Links (if commit mentions task ID)
```

#### **STEP 6: Real-Time Supplier Pricing**
```
Every 24 hours (Cron Job)
    ↓
Fetch latest pricing from:
    • Digi-Key API
    • Mouser API
    • Element14 API
    • MISUMI API
    ↓
Update InvenTree parts with current pricing
    ↓
Alert if stock is critical or price increased
```

#### **STEP 7: Procurement & PO Generation**
```
InvenTree (Select parts for purchase)
    ↓
Custom API generates PO
    ↓
Multi-supplier optimization (lowest cost, fastest delivery)
    ↓
Export PO as PDF/CSV
    ↓
Supplier integration (auto-email or API integration)
```

#### **STEP 8: Design Review**
```
Figma Design Ready
    ↓
Figma API fetches latest designs
    ↓
Dashboard displays design thumbnails
    ↓
Team comments in Taiga
    ↓
Approve/Reject → Move to next phase
```

#### **STEP 9: Project Status Dashboard**
```
Single Dashboard Shows:
├─ BOM Status (InvenTree)
├─ Project Progress (Taiga Gantt)
├─ Firmware Status (GitHub Commits)
├─ Design Review Status (Figma)
├─ Procurement Status (Supplier APIs)
└─ Team Activity Feed
```

---

## SETUP INSTRUCTIONS

### **QUICK START: 30 Minutes**

#### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/hardware-product-stack.git
cd hardware-product-stack
```

#### **2. Start All Services (Docker Compose)**
```bash
# Copy .env template
cp .env.example .env

# Edit .env with your API keys
nano .env

# Start all services
docker-compose up -d

# Check status
docker ps
```

#### **3. Access Services**
```
InvenTree:          http://localhost:8000
Taiga:              http://localhost:9000
Dashboard:          http://localhost:3000
Procurement API:    http://localhost:5000
GitHub Sync API:    http://localhost:5001
PostgreSQL:         localhost:5432
Redis:              localhost:6379
Elasticsearch:      http://localhost:9200
```

---

## DETAILED COMPONENT SETUP

### **A. INVENTREE (BOM Management)**

#### **Import BOM from Fusion 360:**

**Step 1: Export from Fusion 360**
```
File → Export → CSV
Columns needed:
- Part Number
- Description
- Quantity
- Unit
- Supplier Part Number
- MPN (Manufacturer Part Number)
```

**Step 2: InvenTree Import**
```
1. Login to http://localhost:8000
2. Settings → Import → Upload CSV
3. Map columns to InvenTree fields
4. Auto-match with supplier databases
```

**Step 3: Link Suppliers (API)**
```
InvenTree automatically queries:
- Digi-Key API → Get pricing & stock
- Mouser API → Get pricing & stock
- Element14 API → Get pricing & stock
- MISUMI API → Get lead time
```

**Example API Call (from Python):**
```python
# inventree_sync.py
from inventree.api import InvenTreeAPI
from digikey.v3.productinformation import KeywordSearchRequest

# Initialize InvenTree
api = InvenTreeAPI(
    host='http://localhost:8000',
    username='admin',
    password='admin'
)

# Get all parts without supplier pricing
parts = api.part.all(supplier_price__isnull=True)

for part in parts:
    # Query Digi-Key
    search = KeywordSearchRequest(
        keywords=part.MPN,
        recordCount=1
    )
    results = search.submitRequest()
    
    if results:
        part.supplier_price = results[0]['unitPrice']
        part.supplier = 'Digi-Key'
        part.save()
```

---

### **B. TAIGA (Project Management)**

#### **Setup Taiga for Hardware Projects:**

**Project Structure:**
```
Hardware Product Project
├─ Epic: Mechanical Design
│  ├─ User Story: CAD Design
│  ├─ User Story: 3D Printing Tests
│  └─ User Story: Final Assembly
├─ Epic: Electronics Design
│  ├─ User Story: Schematic
│  ├─ User Story: PCB Layout
│  └─ User Story: Testing
├─ Epic: Firmware
│  ├─ User Story: Core Features
│  ├─ User Story: Testing & QA
│  └─ User Story: Documentation
└─ Epic: Procurement
   ├─ User Story: BOM Review
   ├─ User Story: PO Generation
   └─ User Story: Supplier Coordination
```

**Custom Fields in Taiga:**
```
Project Settings → Custom Fields → Add:
- BOM_ID (link to InvenTree)
- GitHub_Repo (firmware repo link)
- Figma_Design (design link)
- Critical_Path (yes/no)
- Supplier_Status (pending/ordered/arrived)
```

---

### **C. PROCUREMENT API (Custom Python)**

#### **Real-Time Supplier Integration:**

**File: `procurement_api/suppliers.py`**
```python
import requests
from typing import Dict, List
from datetime import datetime

class SupplierAPI:
    """Unified supplier pricing API"""
    
    def __init__(self, api_keys: Dict[str, str]):
        self.api_keys = api_keys
        self.cache = {}
        
    def get_part_price_digikey(self, mpn: str) -> Dict:
        """Get pricing from Digi-Key API"""
        headers = {
            'Authorization': f"Bearer {self.api_keys['DIGIKEY_TOKEN']}"
        }
        url = f"https://api.digikey.com/products/search"
        params = {'keywords': mpn}
        
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                'supplier': 'Digi-Key',
                'mpn': mpn,
                'price': data['unitPrice'],
                'stock': data['quantity'],
                'lead_time': data['leadTime'],
                'timestamp': datetime.now().isoformat()
            }
        return None
    
    def get_part_price_mouser(self, mpn: str) -> Dict:
        """Get pricing from Mouser API"""
        url = "https://api.mouser.com/api/v1/search/keyword"
        params = {
            'apiKey': self.api_keys['MOUSER_API_KEY'],
            'keyword': mpn
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                'supplier': 'Mouser',
                'mpn': mpn,
                'price': data['unitPrice'],
                'stock': data['quantity'],
                'lead_time': data['leadTime'],
                'timestamp': datetime.now().isoformat()
            }
        return None
    
    def get_best_price(self, mpn: str) -> Dict:
        """Compare all suppliers and return best price"""
        prices = []
        
        digikey_price = self.get_part_price_digikey(mpn)
        if digikey_price:
            prices.append(digikey_price)
        
        mouser_price = self.get_part_price_mouser(mpn)
        if mouser_price:
            prices.append(mouser_price)
        
        # Sort by price and lead time
        best = min(prices, key=lambda x: (x['price'], x['lead_time']))
        return best
    
    def generate_po(self, parts: List[Dict]) -> Dict:
        """Generate purchase order optimizing for cost & delivery"""
        po_groups = {}
        
        for part in parts:
            best_supplier = self.get_best_price(part['mpn'])
            supplier = best_supplier['supplier']
            
            if supplier not in po_groups:
                po_groups[supplier] = []
            
            po_groups[supplier].append({
                'mpn': part['mpn'],
                'quantity': part['quantity'],
                'unit_price': best_supplier['price'],
                'lead_time': best_supplier['lead_time']
            })
        
        return {
            'po_number': self.generate_po_number(),
            'date': datetime.now().isoformat(),
            'groups': po_groups,
            'total_cost': sum(
                item['unit_price'] * item['quantity'] 
                for group in po_groups.values() 
                for item in group
            )
        }

# Flask API endpoint
from flask import Flask, request, jsonify

app = Flask(__name__)
supplier = SupplierAPI(api_keys={
    'DIGIKEY_TOKEN': os.getenv('DIGIKEY_TOKEN'),
    'MOUSER_API_KEY': os.getenv('MOUSER_API_KEY'),
})

@app.route('/api/suppliers/price/<mpn>', methods=['GET'])
def get_price(mpn):
    """Get best price for part"""
    return jsonify(supplier.get_best_price(mpn))

@app.route('/api/procurement/generate-po', methods=['POST'])
def generate_po():
    """Generate optimized purchase order"""
    parts = request.json.get('parts', [])
    po = supplier.generate_po(parts)
    return jsonify(po)
```

---

### **D. GITHUB INTEGRATION (Firmware Tracking)**

#### **Automatic GitHub Sync:**

**File: `github_sync/webhook_handler.py`**
```python
from flask import Flask, request
import requests
from inventree.api import InvenTreeAPI

app = Flask(__name__)

@app.route('/github/webhook', methods=['POST'])
def github_webhook():
    """GitHub webhook receiver"""
    event = request.headers.get('X-GitHub-Event')
    payload = request.json
    
    if event == 'push':
        handle_push(payload)
    elif event == 'release':
        handle_release(payload)
    elif event == 'pull_request':
        handle_pr(payload)
    
    return {'status': 'ok'}

def handle_push(payload):
    """Handle GitHub push event"""
    repo = payload['repository']['full_name']
    commits = payload['commits']
    
    # Update Taiga with commit info
    for commit in commits:
        # Parse commit message for task ID
        # Format: "Fix #123: Update firmware"
        match = re.search(r'#(\d+)', commit['message'])
        if match:
            task_id = match.group(1)
            # Link to Taiga task
            update_taiga_task(task_id, {
                'comment': f"Commit: {commit['message']}\n{commit['url']}",
                'status': 'in_progress'
            })

def handle_release(payload):
    """Handle GitHub release event"""
    release = payload['release']
    version = release['tag_name']
    
    # Create version in InvenTree
    inventree_api = InvenTreeAPI(
        host='http://localhost:8000',
        username='admin',
        password='admin'
    )
    
    # Create firmware version record
    inventree_api.firmware_version.create({
        'version': version,
        'release_date': release['published_at'],
        'release_notes': release['body'],
        'github_url': release['html_url']
    })

def handle_pr(payload):
    """Handle GitHub PR event"""
    pr = payload['pull_request']
    
    # Update project status
    if pr['state'] == 'open':
        status = 'In Code Review'
    elif pr['merged']:
        status = 'Merged'
    else:
        status = 'Closed'
    
    # Link PR to Taiga task
    match = re.search(r'#(\d+)', pr['title'])
    if match:
        task_id = match.group(1)
        update_taiga_task(task_id, {
            'comment': f"PR: {pr['title']}\n{pr['html_url']}",
            'status': status
        })
```

---

### **E. UNIFIED DASHBOARD (Vue.js)**

#### **Real-Time Project Status View:**

**File: `dashboard/src/components/ProjectDashboard.vue`**
```vue
<template>
  <div class="project-dashboard">
    <h1>{{ projectName }}</h1>
    
    <!-- Overview Cards -->
    <div class="cards-grid">
      <card title="BOM Status" :data="bomStatus">
        <div>{{ bomStatus.total }} parts</div>
        <div class="status">{{ bomStatus.quoted }} quoted</div>
      </card>
      
      <card title="Project Progress" :data="projectProgress">
        <div class="progress-bar">
          <div class="progress" :style="{width: projectProgress.percent + '%'}"></div>
        </div>
        <div>{{ projectProgress.percent }}% complete</div>
      </card>
      
      <card title="Firmware Status" :data="firmwareStatus">
        <div>Latest: {{ firmwareStatus.latestVersion }}</div>
        <div class="status">{{ firmwareStatus.lastUpdate }}</div>
      </card>
      
      <card title="Procurement" :data="procurementStatus">
        <div>Cost: ${{ procurementStatus.totalCost }}</div>
        <div class="status">{{ procurementStatus.deliveryDate }}</div>
      </card>
    </div>
    
    <!-- Gantt Chart -->
    <section class="gantt-section">
      <h2>Timeline (Gantt Chart)</h2>
      <div ref="ganttContainer" class="gantt-container">
        <!-- Rendered by frappe-gantt library -->
      </div>
    </section>
    
    <!-- BOM with Live Pricing -->
    <section class="bom-section">
      <h2>Bill of Materials</h2>
      <table class="bom-table">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Best Price</th>
            <th>Supplier</th>
            <th>Stock</th>
            <th>Lead Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="part in bomParts" :key="part.id">
            <td>{{ part.mpn }}</td>
            <td>{{ part.description }}</td>
            <td>{{ part.quantity }}</td>
            <td>${{ part.bestPrice }}</td>
            <td>{{ part.bestSupplier }}</td>
            <td :class="part.stock > 0 ? 'in-stock' : 'out-of-stock'">
              {{ part.stock }}
            </td>
            <td>{{ part.leadTime }} days</td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <!-- GitHub Commits -->
    <section class="commits-section">
      <h2>Recent Firmware Commits</h2>
      <div v-for="commit in recentCommits" :key="commit.id" class="commit">
        <div class="commit-message">{{ commit.message }}</div>
        <div class="commit-meta">
          {{ commit.author }} • {{ commit.date }}
        </div>
      </div>
    </section>
    
    <!-- Design Review -->
    <section class="design-section">
      <h2>Latest Design (from Figma)</h2>
      <div class="figma-embed">
        <img :src="designImage" />
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import FrappeGantt from 'frappe-gantt'

export default {
  name: 'ProjectDashboard',
  data() {
    return {
      projectName: 'Awesome Hardware Product v1.0',
      bomStatus: { total: 47, quoted: 45 },
      projectProgress: { percent: 72 },
      firmwareStatus: { latestVersion: 'v2.3.1', lastUpdate: '2 hours ago' },
      procurementStatus: { totalCost: 5230, deliveryDate: '2024-05-15' },
      bomParts: [],
      recentCommits: [],
      designImage: null,
      ganttChart: null
    }
  },
  
  async mounted() {
    await this.fetchBOMData()
    await this.fetchFirmwareCommits()
    await this.fetchDesignImage()
    this.renderGanttChart()
  },
  
  methods: {
    async fetchBOMData() {
      try {
        const response = await axios.get('http://localhost:5000/api/bom/with-pricing')
        this.bomParts = response.data
      } catch (error) {
        console.error('Failed to fetch BOM:', error)
      }
    },
    
    async fetchFirmwareCommits() {
      try {
        const response = await axios.get('http://localhost:5001/api/github/commits')
        this.recentCommits = response.data.slice(0, 5)
      } catch (error) {
        console.error('Failed to fetch commits:', error)
      }
    },
    
    async fetchDesignImage() {
      try {
        const response = await axios.get('http://localhost:5000/api/figma/latest-design')
        this.designImage = response.data.image_url
      } catch (error) {
        console.error('Failed to fetch design:', error)
      }
    },
    
    renderGanttChart() {
      const tasks = [
        {
          id: 'design',
          name: 'Mechanical Design',
          start: '2024-04-01',
          end: '2024-04-15',
          progress: 100
        },
        {
          id: 'pcb',
          name: 'PCB Design',
          start: '2024-04-10',
          end: '2024-04-25',
          progress: 85,
          dependencies: 'design'
        },
        {
          id: 'firmware',
          name: 'Firmware Development',
          start: '2024-04-15',
          end: '2024-05-05',
          progress: 60,
          dependencies: 'pcb'
        },
        {
          id: 'procurement',
          name: 'Procurement',
          start: '2024-04-20',
          end: '2024-05-10',
          progress: 50
        },
        {
          id: 'assembly',
          name: 'Assembly & Testing',
          start: '2024-05-10',
          end: '2024-05-25',
          progress: 0
        }
      ]
      
      this.ganttChart = new FrappeGantt(this.$refs.ganttContainer, tasks, {
        on_change: () => { /* update project */ },
        on_click: () => { /* navigate to task */ },
        on_date_change: () => { /* update timeline */ }
      })
    }
  }
}
</script>

<style scoped>
.project-dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.bom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.bom-table th,
.bom-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.bom-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.in-stock {
  color: green;
  font-weight: bold;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}

.commit {
  padding: 10px;
  border-left: 3px solid #2196F3;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.commit-message {
  font-weight: bold;
  margin-bottom: 5px;
}

.commit-meta {
  font-size: 0.9em;
  color: #666;
}

.gantt-container {
  height: 300px;
  border: 1px solid #ddd;
  margin-top: 15px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}
</style>
```

---

## DATA FLOWS

### **Flow 1: BOM Import → Supplier Pricing**
```
Fusion 360 (CSV Export)
    ↓
InvenTree (Import)
    ↓
Python Script (Run hourly)
    ├─ Query Digi-Key API
    ├─ Query Mouser API
    ├─ Query Element14 API
    └─ Query MISUMI API
    ↓
InvenTree Updates (pricing, stock, lead time)
    ↓
Dashboard (Real-time pricing display)
```

### **Flow 2: Task Creation → Firmware Status → Dashboard**
```
Taiga (Create Task #123)
    ↓
Developer (Codes in VS Code)
    ↓
GitHub Commit (Mention #123 in message)
    ↓
GitHub Webhook
    ↓
GitHub Sync API (receives event)
    ↓
Update Taiga Task (link PR)
    ↓
Dashboard (shows: In Progress → Code Review → Merged)
```

### **Flow 3: Project Status Real-Time Sync**
```
Taiga (Update task status)
    ↓
Taiga Webhook
    ↓
Dashboard API (receives update)
    ↓
Dashboard (WebSocket push)
    ↓
Team Sees Real-Time Update (no refresh needed)
```

---

## DOCKER COMPOSE SETUP

### **File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: hardware_postgres
    environment:
      POSTGRES_DB: hardware_db
      POSTGRES_USER: hardware
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hardware"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    container_name: hardware_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    container_name: hardware_elasticsearch
    environment:
      discovery.type: single-node
      xpack.security.enabled: "false"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  # InvenTree (BOM Management)
  inventree:
    image: inventree/inventree:latest
    container_name: hardware_inventree
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      INVENTREE_DB_ENGINE: postgresql
      INVENTREE_DB_HOST: postgres
      INVENTREE_DB_NAME: inventree_db
      INVENTREE_DB_USER: hardware
      INVENTREE_DB_PASSWORD: ${DB_PASSWORD}
      INVENTREE_ALLOWED_HOSTS: "*"
    ports:
      - "8000:8000"
    volumes:
      - inventree_data:/home/inventree/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Taiga (Project Management)
  taiga:
    image: taigaio/taiga:latest
    container_name: hardware_taiga
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      TAIGA_DB_HOST: postgres
      TAIGA_DB_NAME: taiga_db
      TAIGA_DB_USER: hardware
      TAIGA_DB_PASSWORD: ${DB_PASSWORD}
      TAIGA_SECRET_KEY: ${TAIGA_SECRET_KEY}
      TAIGA_ALLOWED_HOSTS: "*"
    ports:
      - "9000:9000"
    volumes:
      - taiga_data:/taiga-data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/api/v1/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Procurement API (Custom)
  procurement_api:
    build:
      context: ./procurement_api
      dockerfile: Dockerfile
    container_name: hardware_procurement
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://hardware:${DB_PASSWORD}@postgres:5432/hardware_db
      REDIS_URL: redis://redis:6379/0
      DIGIKEY_API_KEY: ${DIGIKEY_API_KEY}
      DIGIKEY_CLIENT_ID: ${DIGIKEY_CLIENT_ID}
      MOUSER_API_KEY: ${MOUSER_API_KEY}
      ELEMENT14_API_KEY: ${ELEMENT14_API_KEY}
    ports:
      - "5000:5000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # GitHub Sync API (Custom)
  github_sync:
    build:
      context: ./github_sync
      dockerfile: Dockerfile
    container_name: hardware_github_sync
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://hardware:${DB_PASSWORD}@postgres:5432/hardware_db
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      GITHUB_WEBHOOK_SECRET: ${GITHUB_WEBHOOK_SECRET}
    ports:
      - "5001:5001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Dashboard Frontend
  dashboard:
    build:
      context: ./dashboard
      dockerfile: Dockerfile
    container_name: hardware_dashboard
    depends_on:
      - procurement_api
      - github_sync
    environment:
      VUE_APP_API_URL: http://localhost:5000
      VUE_APP_GITHUB_API_URL: http://localhost:5001
      VUE_APP_INVENTREE_URL: http://localhost:8000
      VUE_APP_TAIGA_URL: http://localhost:9000
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: hardware_nginx
    depends_on:
      - dashboard
      - inventree
      - taiga
      - procurement_api
      - github_sync
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
  inventree_data:
  taiga_data:

networks:
  default:
    name: hardware_network
```

### **File: `.env.example`**
```bash
# Database
DB_PASSWORD=your_secure_password_here

# Taiga
TAIGA_SECRET_KEY=your_taiga_secret_key_here

# Supplier APIs
DIGIKEY_API_KEY=your_digikey_api_key
DIGIKEY_CLIENT_ID=your_digikey_client_id
MOUSER_API_KEY=your_mouser_api_key
ELEMENT14_API_KEY=your_element14_api_key

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Figma (optional)
FIGMA_API_TOKEN=your_figma_token
```

---

## QUICK START (Copy & Paste)

```bash
# 1. Clone repo
git clone https://github.com/yourusername/hardware-product-stack.git
cd hardware-product-stack

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys
nano .env

# 3. Start all services
docker-compose up -d

# 4. Wait for services to start (2-3 minutes)
sleep 180

# 5. Check status
docker ps

# 6. Initialize databases
docker-compose exec postgres psql -U hardware -d hardware_db -f init.sql

# 7. Access services
echo "InvenTree: http://localhost:8000"
echo "Taiga: http://localhost:9000"
echo "Dashboard: http://localhost:3000"
echo "Procurement API: http://localhost:5000"
echo "GitHub Sync: http://localhost:5001"
```

---

## COST BREAKDOWN

| Component | Cost | Notes |
|-----------|------|-------|
| **InvenTree** | FREE | Open Source |
| **Taiga** | FREE | Open Source |
| **PostgreSQL** | FREE | Open Source |
| **Redis** | FREE | Open Source |
| **Elasticsearch** | FREE | Open Source |
| **Custom APIs** | FREE | You build them |
| **Dashboard (Vue.js)** | FREE | Open Source |
| **Nginx** | FREE | Open Source |
| **Docker** | FREE | Open Source |
| **Total** | **$0** | Completely FREE |

### **Only Paid External Services:**
- **Digi-Key API:** FREE tier available (up to 100 requests/month)
- **Mouser API:** FREE (need API key)
- **Element14 API:** FREE
- **MISUMI API:** FREE
- **GitHub:** FREE tier for public repos
- **Figma:** FREE tier for design files

---

## NEXT STEPS

1. **Create GitHub Repository:**
   ```bash
   git clone https://github.com/yourusername/hardware-product-stack.git
   ```

2. **Get API Keys:**
   - Digi-Key: https://developer.digikey.com
   - Mouser: https://www.mouser.com/api
   - Element14: https://partnumber.element14.com/docs/read
   - MISUMI: Contact sales

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

4. **Configure Your First Project:**
   - Create project in Taiga
   - Export BOM from Fusion 360
   - Import to InvenTree
   - Link GitHub repo
   - Connect Figma designs

5. **Start Using:**
   - Assign tasks in Taiga
   - Track BOM pricing in real-time
   - Monitor firmware in dashboard
   - Generate POs automatically

---

**You now have a complete, free, open-source hardware product platform!**
