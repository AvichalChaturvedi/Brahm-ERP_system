# ============================================
# PLM Stack Setup Script for Windows
# ============================================
# Run this as Administrator in PowerShell
# One-click setup for Brahm-ERP PLM Stack
# ============================================

#Requires -RunAsAdministrator

param(
    [switch]$SkipDockerCheck,
    [switch]$SkipClone,
    [switch]$Help
)

# Color codes for output
function Write-Step { param($Message) Write-Host "`n[STEP] $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# Banner
Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║         Brahm-ERP PLM Stack Setup for Windows                 ║
║         InvenTree + Odoo + PostgreSQL                        ║
║         Free & Open Source PLM Solution                       ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

if ($Help) {
    Write-Host @"
Usage: .\setup.ps1 [-SkipDockerCheck] [-SkipClone] [-Help]

Options:
  -SkipDockerCheck  Skip Docker Desktop verification
  -SkipClone        Skip git clone (use existing files)
  -Help             Show this help message

Examples:
  .\setup.ps1                    # Full setup
  .\setup.ps1 -SkipDockerCheck    # Skip Docker verification
  .\setup.ps1 -SkipClone          # Use existing files

"@
    exit 0
}

# ============================================
# STEP 1: Get local network IP
# ============================================
Write-Step "Detecting local network IP address..."

# Method 1: Try to get IP from network adapter
try {
    $networkAdapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'VPN|Hyper-V|VMware|VirtualBox' }
    foreach ($adapter in $networkAdapters) {
        $ipConfig = Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
        if ($ipConfig -and $ipConfig.IPAddress -ne '127.0.0.1') {
            $hostIP = $ipConfig.IPAddress
            break
        }
    }
} catch {
    # Silently continue to next method
}

# Method 2: Fallback to ipconfig parsing
if (-not $hostIP) {
    $ipconfigOutput = ipconfig
    $adapterSection = $false
    foreach ($line in $ipconfigOutput) {
        if ($line -match 'adapter|Adaptateur') { $adapterSection = $false }
        if ($line -match 'Ethernet|Wi-Fi|Wireless') { $adapterSection = $true }
        if ($adapterSection -and $line -match 'IPv4.*?:\s*(\d+\.\d+\.\d+\.\d+)') {
            $hostIP = $matches[1]
            break
        }
    }
}

if (-not $hostIP) {
    Write-Warning "Could not detect IP automatically."
    Write-Host "Please run 'ipconfig' in another PowerShell window to find your IP"
    $hostIP = Read-Host "Enter your local network IP (e.g., 192.168.1.100)"
}

Write-Success "Detected IP: $hostIP"

# ============================================
# STEP 2: Check Docker Desktop
# ============================================
if (-not $SkipDockerCheck) {
    Write-Step "Checking Docker Desktop..."
    
    # Check if Docker is running
    $dockerRunning = $false
    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerRunning = $true
            Write-Success "Docker Desktop is running"
        }
    } catch {
        $dockerRunning = $false
    }
    
    if (-not $dockerRunning) {
        Write-Error "Docker Desktop is not running!"
        Write-Host @"

Please start Docker Desktop and wait for it to fully initialize.
1. Open Docker Desktop from Start Menu
2. Wait for the whale icon to stabilize
3. Re-run this script

"@
        exit 1
    }
    
    # Check WSL2
    Write-Step "Checking WSL2..."
    $wslEnabled = (dism.exe /Online /Get-Features /FeatureName:Microsoft-Windows-Subsystem-Linux 2>&1 | Select-String "Enabled").Count -gt 0
    if ($wslEnabled) {
        Write-Success "WSL2 is enabled"
    } else {
        Write-Warning "WSL2 may not be enabled. Docker Desktop on Windows requires WSL2."
    }
}

# ============================================
# STEP 3: Create directory structure
# ============================================
Write-Step "Creating directory structure..."
$baseDir = $PSScriptRoot
$dirs = @(
    "backups/postgres",
    "backups/inventree",
    "backups/odoo",
    "imports/inventree",
    "imports/odoo",
    "extra-addons",
    "ssl"
)

foreach ($dir in $dirs) {
    $fullPath = Join-Path $baseDir $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

Write-Success "Directory structure created"

# ============================================
# STEP 4: Create .env file
# ============================================
Write-Step "Creating .env configuration file..."
$envFile = Join-Path $baseDir ".env"

# Generate secure password
function Generate-SecurePassword {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    $password = ""
    for ($i = 0; $i -lt 20; $i++) {
        $password += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $password
}

$dbPassword = Generate-SecurePassword
$odooPassword = Generate-SecurePassword

$envContent = @"
# ============================================
# PLM Stack Environment Configuration
# ============================================
# Generated by setup.ps1 on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================

# ============================================
# HOST CONFIGURATION
# ============================================
HOST_IP=$hostIP

# ============================================
# POSTGRESQL DATABASE
# ============================================
POSTGRES_DB=plm_db
POSTGRES_USER=plm_admin
POSTGRES_PASSWORD=$dbPassword

# ============================================
# INVERTREE SETTINGS
# ============================================
INVENTREE_SECRET_KEY=$(Generate-SecurePassword)

# ============================================
# ODOO SETTINGS
# ============================================
ODOO_MASTER_PASSWORD=$odooPassword

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_USE_TLS=True
EMAIL_FROM=noreply@plm.local

# ============================================
# BACKUP SETTINGS
# ============================================
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
"@

Set-Content -Path $envFile -Value $envContent -Force
Write-Success "Configuration file created: .env"

# ============================================
# STEP 5: Create nginx.conf
# ============================================
Write-Step "Creating nginx configuration..."
$nginxConfig = @"
events {
    worker_connections 1024;
}

http {
    upstream inventree {
        server inventree:8000;
    }
    
    upstream odoo {
        server odoo:8069;
    }
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        listen 80;
        server_name _;
        
        # InvenTree
        location /inventree/ {
            proxy_pass http://inventree/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Odoo
        location / {
            proxy_pass http://odoo;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # WebSocket support for Odoo
        location /websocket {
            proxy_pass http://odoo;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
        }
    }
}
"@

Set-Content -Path (Join-Path $baseDir "nginx.conf") -Value $nginxConfig -Force
Write-Success "Nginx configuration created"

# ============================================
# STEP 6: Pull Docker images
# ============================================
Write-Step "Pulling Docker images (this may take a while)..."
Write-Host "Pulling PostgreSQL..." -NoNewline
docker pull postgres:15-alpine | Out-Null
Write-Success "PostgreSQL pulled"

Write-Host "Pulling InvenTree..." -NoNewline
docker pull inventree/inventree:latest | Out-Null
Write-Success "InvenTree pulled"

Write-Host "Pulling Odoo..." -NoNewline
docker pull odoo:17.0 | Out-Null
Write-Success "Odoo pulled"

# ============================================
# STEP 7: Start services
# ============================================
Write-Step "Starting PLM Stack services..."
Set-Location $baseDir

# Start with profiles for optional nginx
docker compose --profile with-nginx up -d

Write-Success "Services started"

# ============================================
# STEP 8: Wait for services to be ready
# ============================================
Write-Step "Waiting for services to be ready..."
Write-Host "This may take 2-5 minutes for initial setup..." -ForegroundColor Yellow

$maxWait = 300
$waited = 0

# Wait for PostgreSQL
Write-Host "  - Waiting for PostgreSQL..." -NoNewline
while ($waited -lt $maxWait) {
    $pgReady = docker exec plm_postgres pg_isready -U plm_admin 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 5
    $waited += 5
    Write-Host "." -NoNewline
}
if ($LASTEXITCODE -eq 0) { Write-Success " PostgreSQL ready" } else { Write-Warning " PostgreSQL timeout" }

Start-Sleep -Seconds 10

# ============================================
# STEP 9: Display access information
# ============================================
Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                    SETUP COMPLETE!                          ║
╚══════════════════════════════════════════════════════════════╝

ACCESS URLs (from this PC):
  - InvenTree: http://localhost:8000
  - Odoo:      http://localhost:8069

ACCESS URLs (from other PCs on network):
  - InvenTree: http://$hostIP`:8000
  - Odoo:      http://$hostIP`:8069

DEFAULT CREDENTIALS (change these immediately!):
  - InvenTree: admin / inventree (first login)
  - Odoo:      Create account on first access

SERVICE STATUS:
  - PostgreSQL: $(if (docker ps --filter "name=plm_postgres" --format "{{.Names}}" 2>$null) { "Running" } else { "Stopped" })
  - InvenTree: $(if (docker ps --filter "name=plm_inventree" --format "{{.Names}}" 2>$null) { "Running" } else { "Stopped" })
  - Odoo:      $(if (docker ps --filter "name=plm_odoo" --format "{{.Names}}" 2>$null) { "Running" } else { "Stopped" })

USEFUL COMMANDS:
  - View logs:      docker compose logs -f
  - Stop services:  docker compose down
  - Restart:        docker compose restart
  - Status:         docker compose ps

FILES LOCATION:
  - Config: $baseDir\.env
  - Backups: $baseDir\backups
  - Imports: $baseDir\imports

"@ -ForegroundColor Green

Write-Host "IMPORTANT: Update email settings in .env for notifications" -ForegroundColor Yellow
Write-Host "Next: Import your BOM data from Fusion 360 (see integration-guide.md)" -ForegroundColor Cyan

# ============================================
# STEP 10: Open browser
# ============================================
$openBrowser = Read-Host "`nOpen InvenTree in browser? (Y/N)"
if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Start-Process "http://localhost:8000"
}
