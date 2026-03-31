# Integration Guide

## Connecting Fusion 360, GitHub, Figma, Digi-Key, Mouser & MISUMI to Your PLM Stack

---

## 📦 InvenTree Integrations

### Autodesk Fusion 360 BOM Import

#### Method 1: CSV Export from Fusion 360
1. In Fusion 360, open your design
2. Go to **Manage** → **Bill of Materials**
3. Click the **Export** dropdown
4. Select **CSV** format
5. Save to `imports/inventree/` folder

#### Method 2: Fusion 360 → InvenTree Workflow
1. Export BOM as CSV from Fusion
2. In InvenTree, go to **Part** → **Import Parts**
3. Upload your CSV file
4. Map columns:
   | Fusion 360 Column | InvenTree Field |
   |-------------------|-----------------|
   | Name | Part Name |
   | Part Number | SKU |
   | Quantity | Stock |
   | Material | Description |

#### Sample Fusion BOM CSV Format
```csv
name,description,sku,quantity,unit,material,cost
M3x10_Socket_Cap,Hex Socket Cap Screw M3x10,Screw_M3x10,10,pcs,Steel 18-8,0.15
Resistor_10k,10k Ohm Resistor 0603,RES-10K-0603,50,pcs,Thick Film,0.01
Capacitor_100n,100nF Ceramic Cap 0805,CAP-100N-0805,20,pcs,MLCC,0.05
```

---

### Digi-Key Plugin Setup

#### Installation
```powershell
# SSH into InvenTree container
docker exec -it plm_inventree bash

# Install Digi-Key plugin
cd /home/inventree/InvenTree
pip install inventree-Plugin digikey-api

# Exit container
exit

# Restart InvenTree
docker compose restart inventree
```

#### Configuration
1. Go to **InvenTree** → **Settings** → **Plugin Settings**
2. Enable **DigikeyPlugin**
3. Enter your Digi-Key API credentials:
   - **Developer Key**: Get from https://developer.digikey.com
   - **Client ID/Secret**: From Digi-Key OAuth app
4. Save and test connection

#### Using Digi-Key Plugin
- Search Digi-Key catalog directly from InvenTree
- One-click part pricing lookup
- Auto-fill manufacturer part numbers
- Stock availability checks

---

### Mouser Integration

#### Setup
```powershell
# Install Mouser plugin
docker exec -it plm_inventree bash
cd /home/inventree/InvenTree
pip install inventree-mouser
exit
docker compose restart inventree
```

#### Configuration
1. Get API key from https://www.mouser.com/api/
2. In InvenTree, enable Mouser plugin
3. Enter your API key
4. Enable "Search Parts" integration

---

### MISUMI Integration

#### Setup
1. Request MISUMI API access (for qualified businesses)
2. Go to **Settings** → **Integrations**
3. Add MISUMI credentials
4. Configure part sync options

---

## 📋 Odoo Integrations

### User Management (Admin Controls)

#### Creating Users (Admin Only)
1. Log into Odoo as **admin**
2. Go to **Settings** → **Users & Companies** → **Users**
3. Click **Create**
4. Fill in:
   - **Name**: Full name
   - **Email**: Login email
   - **Login**: Email address
   - **Password**: Set initial password (user can change later)
5. Under **Access Rights**, assign:
   - ✅ **Project User** or **Project Admin**
   - ✅ **Inventory User** (for InvenTree sync)
6. Click **Save**

#### Team Roles
| Role | Permissions |
|------|-------------|
| **Project Admin** | Full control, user management, all projects |
| **Project User** | Create/edit own tasks, view all projects |
| **Project Viewer** | Read-only access to projects |

#### Managing Existing Users
1. Go to **Settings** → **Users & Companies** → **Users**
2. Click on any user to edit
3. Options:
   - **Reset Password**: Send password reset email
   - **Deactivate**: Disable account (keeps history)
   - **Change Rights**: Update permissions
   - **Add to Projects**: Assign to specific projects

---

### Project & Task Management

#### Initial Setup
1. Log into Odoo at http://localhost:8069
2. Create new database: `plm_db`
3. Install these apps:
   - ✅ **Project** (includes Tasks & Gantt)
   - ✅ **CRM** (for customer tracking)
   - ✅ **Sales** (for quotes/orders)

#### Creating Your First Project
1. Go to **Project** app
2. Click **Create**
3. Enter project name (e.g., "Widget v2.0")
4. Add team members to project (click **Add** under **Members**)
5. Create tasks with:
   - **Milestone**: Phase in development
   - **Assigned to**: Team member
   - **Deadline**: Due date
   - **Tags**: Category labels

#### Assigning Tasks to Other Users
1. Create or open a task
2. Click on **Assigned to** field
3. Select team member from dropdown
4. Save the task
5. The assigned user will see the task in their:
   - **My Tasks** view
   - **Dashboard**
   - **Email notification** (if enabled)

#### Gantt Chart View
1. Open any project
2. Click **Gantt** view (top right)
3. Drag tasks to reschedule
4. Color-code by:
   - Status (To Do/In Progress/Done)
   - Assignee
   - Priority

---

### Adding Pictures/Attachments to Tasks

#### Method 1: Direct Upload
1. Open any task
2. Click **Attachments** tab (paperclip icon)
3. Click **Add** button
4. Select image files from your computer
5. Supported formats: JPG, PNG, GIF, PDF, DOCX
6. Images appear as thumbnails

#### Method 2: Drag & Drop
1. Open any task
2. Drag image files directly onto the task
3. Drop in the attachment area
4. File uploads automatically

#### Method 3: Screenshot in Task
1. Create/edit a task
2. Copy screenshot (Win+Shift+S on Windows)
3. Paste directly into task description (Ctrl+V)
4. Image embedded in description

#### Method 4: Camera/Mobile Upload
1. Open Odoo mobile app
2. Navigate to task
3. Tap camera icon
4. Take photo or select from gallery
5. Photo uploads to task

#### Photo Best Practices
| Use Case | Recommendation |
|----------|----------------|
| **Progress photos** | Use JPG, max 2MB per image |
| **Screenshots** | PNG format preserves quality |
| **Documents** | PDF format for printouts |
| **Before/After** | Upload both for comparison |

#### Viewing Image Gallery
1. Go to **Attachments** tab on any task
2. Click **Gallery** view (grid icon)
3. Browse all images in project
4. Click any image for full-size view

---

### Task Completion with Photo Documentation

#### Workflow: Complete Task with Evidence
1. **Start Task**: Click **Start Progress** button
2. **Work on Task**: Complete the work
3. **Document Work**:
   - Add photos showing completion
   - Upload test results
   - Add any relevant documents
4. **Mark Complete**:
   - Click **Done** button
   - Add completion notes
   - All attachments stay with task for records

#### Completion Checklist
- [ ] All photos uploaded showing finished work
- [ ] Test results attached (if applicable)
- [ ] Notes added explaining completion
- [ ] Task marked as **Done**
- [ ] Assigned person notified

---

### Email Notifications

#### Enabling Notifications
1. Go to **Settings** → **Technical** → **Email**
2. Configure outgoing email server (SMTP)
3. Enable **Task Notifications**

#### Notification Triggers
| Event | Notification Sent To |
|-------|---------------------|
| Task assigned | Assigned user |
| Task deadline approaching | Assigned user |
| Task completed | Task creator, watchers |
| New comment added | All watchers |
| Project updated | All project members |


---

### GitHub Integration

#### Setup
1. Install **GitHub** app from Odoo Apps
2. Connect your GitHub account (Settings → Integrations → GitHub)
3. Link repositories to projects

#### Features
- Sync issues with tasks
- Link commits to tasks
- Track development progress

---

## 🔄 Workflow Automation

### BOM to Task Creation

#### InvenTree BOM → Odoo Tasks
```powershell
# Create a simple automation script
# This would be a custom integration point

# 1. Export BOM from InvenTree
docker exec plm_inventree python manage.py shell
# In shell:
from inventree.bom import *
bom_export = export_bom_csv(part_id=1)
# Save to file for Odoo import

# 2. Import to Odoo via API
```

#### Using Odoo API
```python
import xmlrpc.client

# Odoo connection
url = 'http://localhost:8069'
db = 'plm_db'
username = 'admin'
password = 'your_password'

common = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/common')
uid = common.authenticate(db, username, password, {})
models = xmlrpc.client.ServerProxy(f'{url}/xmlrpc/2/object')

# Create task
task_id = models.execute_kw(db, uid, password,
    'project.task', 'create', [{
        'name': 'Source M3 Screws',
        'project_id': 1,
        'user_ids': [(4, 1)],  # Assigned to user 1
    }])
```

---

## 🎨 Figma Integration

### Exporting to InvenTree
1. In Figma, create a **Component** for each part
2. Add custom properties:
   - Part Number
   - Material
   - Dimensions
3. Export as **CSV** using plugin like "Figma to CSV"
4. Import to InvenTree

### Recommended Figma → InvenTree Mapping
| Figma Property | InvenTree Field |
|----------------|-----------------|
| Part Number | SKU |
| Material | Base Material |
| Dimensions | Parameter (length/width/height) |
| Finish | Finish/Coating |

---

## 📊 Data Synchronization Best Practices

### Weekly Sync Routine
1. **Monday**: Review InvenTree stock levels → Update Odoo tasks
2. **Friday**: Update Odoo project progress → Export for reporting

### Monthly Audit
1. Export InvenTree inventory report
2. Compare with Odoo project completion
3. Generate procurement plan for low-stock items

---

## 🔧 Custom Integration Development

### InvenTree API Basics
```python
import requests

# API Token from InvenTree Settings → API Token
token = "your_api_token_here"
base_url = "http://localhost:8000/api"

headers = {
    "Authorization": f"Token {token}",
    "Content-Type": "application/json"
}

# Get all parts
response = requests.get(f"{base_url}/part/", headers=headers)
parts = response.json()

# Create new part
new_part = {
    "name": "Custom Widget",
    "description": "3D printed widget",
    "SKU": "WIDGET-001",
    "stock": 100
}
response = requests.post(f"{base_url}/part/", headers=headers, json=new_part)
```

### Webhook Setup (Advanced)
```python
# InvenTree can send webhooks on inventory changes
# Configure in: Settings → Webhooks

# Example: Send to Discord/Slack when stock is low
{
    "event": "stock.stockitem.depleted",
    "url": "https://hooks.slack.com/...",
    "payload": {
        "text": "⚠️ Low stock alert: {part_name}"
    }
}
```

---

## 📱 Mobile Access

### Odoo Mobile App
1. Download "Odoo" from App Store/Play Store
2. Enter your server URL: `http://YOUR_IP:8069`
3. Login with team credentials

### InvenTree (Web Only)
- Responsive design works on mobile browsers
- Add to home screen for app-like experience

---

## 🛡️ Backup & Sync Strategy

### Cloud Backup Options
1. **Google Drive**: Sync backups folder to Google Drive
2. **Dropbox**: Use Dropbox client on server PC
3. **OneDrive**: Already on Windows! Sync backups folder

### Automated Backup Script
```powershell
# Create scheduled task for daily backup
$backupScript = @"
@echo off
set timestamp=%date:~-4%%date:~3,2%%date:~0,2%
docker exec -t plm_postgres pg_dump -U plm_admin plm_db > "C:\plm-stack\backups\postgres\backup_%timestamp%.sql"
"C:\Program Files\7-Zip\7z.exe" a "C:\plm-stack\backups\plm_backup_%timestamp%.zip" "C:\plm-stack\backups\postgres"
del "C:\plm-stack\backups\postgres\backup_%timestamp%.sql"
"@

$taskName = "PLM-Daily-Backup"
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c $backupScript"
$trigger = New-ScheduledTaskTrigger -Daily -At "2am"
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger
```

---

## 📞 Troubleshooting Integrations

### Common Issues

| Problem | Solution |
|---------|----------|
| Digi-Key API rate limit | Add delays between requests |
| Fusion CSV import fails | Check for special characters in names |
| Odoo API timeout | Increase timeout in Odoo settings |
| Plugin won't load | Check Docker logs: `docker compose logs inventree` |

### Getting Help
- **InvenTree Forum**: https://inventree.org/forum/
- **InvenTree Discord**: https://discord.gg/inventree
- **Odoo Forum**: https://www.odoo.com/forum
- **GitHub Issues**: 
  - InvenTree: https://github.com/inventree/InvenTree/issues
  - Odoo: https://github.com/odoo/odoo/issues

---

## 🔮 Future Integrations

### Planned/Experimental
- **SolidWorks** PDM connector
- **Altium** BOM export integration
- **Jira** sync for enterprise teams
- **Slack** notifications
- **Microsoft Teams** integration

---

**Questions?** Open an issue on the main repository or reach out to the community forums!
