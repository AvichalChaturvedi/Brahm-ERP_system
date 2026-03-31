# Brahm-ERP PLM Stack

## Complete Free & Open Source PLM Solution for Hardware Teams

A production-ready, local network PLM stack combining **InvenTree** (BOM/Inventory/Procurement) and **Odoo** (Project Management/Tasks/Gantt Charts) for 4-person hardware teams.

---

## 🎯 What You Get

| Application | Purpose | Port | URL |
|-------------|---------|------|-----|
| **InvenTree** | Bill of Materials, Inventory, Procurement | 8000 | http://localhost:8000 |
| **Odoo** | Project Tasks, Gantt, CRM, Reviews | 8069 | http://localhost:8069 |
| **PostgreSQL** | Shared Database | 5432 | (Internal) |

---

## ⚡ Quick Start

### Prerequisites
- Windows 10/11 with Docker Desktop installed
- 8GB+ RAM recommended
- 20GB+ free disk space

### One-Click Setup

1. **Open PowerShell as Administrator**
   ```powershell
   cd C:\path\to\plm-stack
   .\setup.ps1
   ```

2. **Wait for services to start** (5-10 minutes first time)

3. **Access the applications:**
   - InvenTree: http://localhost:8000
   - Odoo: http://localhost:8069

---

## 🔧 Manual Setup (Alternative)

```powershell
# 1. Create .env from template
copy .env.example .env

# 2. Edit .env with your settings
notepad .env

# 3. Get your IP address
ipconfig

# 4. Start services
docker compose up -d

# 5. Check status
docker compose ps
```

---

## 🌐 Accessing from Team PCs

### Find Your Local IP
```powershell
ipconfig
```
Look for `IPv4 Address` under your active network adapter (e.g., `192.168.1.100`)

### Team Access URLs
Replace `YOUR_IP` with your actual IP:

| Service | URL |
|---------|-----|
| InvenTree | http://YOUR_IP:8000 |
| Odoo | http://YOUR_IP:8069 |

### Firewall Setup (if needed)
```powershell
# Allow ports through Windows Firewall
netsh advfirewall firewall add rule name="InvenTree" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Odoo" dir=in action=allow protocol=TCP localport=8069
```

---

## 📋 First-Time Setup Checklist

### InvenTree Setup
1. Navigate to http://localhost:8000
2. Create admin account
3. Configure company settings
4. Import parts from Fusion 360 (see integration-guide.md)
5. Set up Digi-Key plugin for procurement

### Odoo Setup
1. Navigate to http://localhost:8069
2. Create database (e.g., `plm_db`)
3. Install apps:
   - ✅ Project Management
   - ✅ Tasks (if separate)
   - ✅ CRM (for customer tracking)
4. Create team members (Admin: Settings → Users → Create)
5. Set up Gantt project structure

### Team Collaboration Features
- **User Management**: Admin creates/controls all team user accounts
- **Task Assignment**: Assign tasks to any team member
- **Photo Uploads**: Attach images to tasks for documentation
- **Email Notifications**: Get notified when assigned tasks change
- **Mobile Access**: Use Odoo app on phones for on-the-go updates

---

## 💾 Backup & Restore

### Manual Backup
```powershell
# Backup InvenTree data
docker exec plm_inventree backup.sh

# Backup PostgreSQL
docker exec -t plm_postgres pg_dump -U plm_admin plm_db > backup.sql
```

### Auto-Backup (Schedule in Windows Task Scheduler)
```powershell
# Create backup script
@echo off
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "datestamp=%dt:~0,8%-%dt:~8,6%"
docker exec -t plm_postgres pg_dump -U plm_admin plm_db > "backups/postgres/plm_backup_%datestamp%.sql"
```

### Restore from Backup
```powershell
# Stop services
docker compose down

# Restore database
docker exec -i plm_postgres psql -U plm_admin plm_db < backup.sql

# Restart services
docker compose up -d
```

---

## 🔄 Common Commands

```powershell
# View logs
docker compose logs -f
docker compose logs -f inventree  # Just InvenTree
docker compose logs -f odoo        # Just Odoo

# Restart services
docker compose restart

# Stop services
docker compose down

# Update images
docker compose pull
docker compose up -d

# SSH into container
docker exec -it plm_inventree bash
docker exec -it plm_odoo bash
docker exec -it plm_postgres psql -U plm_admin

# Check resource usage
docker stats
```

---

## 🧹 Cleanup & Reset

### Remove all data (CAREFUL!)
```powershell
docker compose down -v
docker volume rm plm_postgres_data plm_inventree_data plm_inventree_db plm_odoo_data
```

### Fresh start keeping .env
```powershell
docker compose down
docker compose up -d
```

---

## 🛠️ Troubleshooting

### Docker Desktop won't start
1. Enable WSL2: `wsl --install`
2. Update Docker Desktop to latest version
3. Enable "Use WSL 2 based engine" in Docker settings

### Services won't start
```powershell
# Check logs
docker compose logs

# Check port conflicts
netstat -ano | findstr "8000 8069"
```

### Slow performance
1. Increase Docker Desktop memory to 4GB+
2. Increase CPU cores
3. Use SSD for Docker data location

### Database connection errors
```powershell
# Wait longer for PostgreSQL
Start-Sleep -Seconds 30

# Check if PostgreSQL is healthy
docker compose ps
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 6GB | 8GB+ |
| CPU | 2 cores | 4 cores |
| Storage | 15GB | 30GB+ |
| OS | Windows 10 | Windows 11 |

---

## 📁 Folder Structure

```
plm-stack/
├── docker-compose.yml      # Service definitions
├── .env                    # Configuration (your secrets)
├── .env.example            # Template
├── setup.ps1               # One-click setup script
├── README.md               # This file
├── nginx.conf              # Reverse proxy config
├── integration-guide.md    # Fusion/DigiKey/etc guides
├── backups/                # Database backups
│   ├── postgres/
│   ├── inventree/
│   └── odoo/
├── imports/                # CSV import files
│   ├── inventree/
│   └── odoo/
├── extra-addons/           # Custom Odoo modules
└── ssl/                    # SSL certificates (optional)
```

---

## 🔒 Security Notes

1. **Change default passwords** in .env immediately
2. Use strong PostgreSQL passwords (20+ characters)
3. Keep Docker images updated
4. For internet-facing access, add SSL certificates
5. Regularly backup your data

---

## 📞 Resources

- **InvenTree Docs**: https://inventree.readthedocs.io/
- **Odoo Docs**: https://www.odoo.com/documentation/
- **Docker Desktop**: https://docs.docker.com/desktop/windows/
- **Digi-Key Plugin**: https://inventree.org/forum/

---

## ✅ Production Checklist

Before going live with your team:

- [ ] Change all default passwords
- [ ] Configure email notifications
- [ ] Set up automated backups
- [ ] Test restore from backup
- [ ] Train team members
- [ ] Document company-specific workflows
- [ ] Set up SSL if exposing to internet

---

**Built with ❤️ for hardware teams who want full control of their data.**
