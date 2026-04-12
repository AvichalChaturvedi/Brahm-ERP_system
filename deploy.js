#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// Configuration
const PROJECT_ID = 'brahmerp-51190';
const BUILD_DIR = path.join(__dirname, 'erp-app/public');

console.log('Firebase Hosting Deployment');
console.log('==========================\n');

// Check if build files exist
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory not found:', BUILD_DIR);
  console.error('Run: npm run build in erp-app/');
  process.exit(1);
}

const files = fs.readdirSync(BUILD_DIR);
console.log('✓ Found build files:', files.join(', '));
console.log('\nDeployment folder:', BUILD_DIR);
console.log('Project ID:', PROJECT_ID);

console.log('\n📋 To deploy, run one of these commands:\n');

console.log('Option 1 - Using Firebase CLI (Recommended):');
console.log('  npx firebase deploy --only hosting --project ' + PROJECT_ID);

console.log('\nOption 2 - Using gcloud CLI:');
console.log('  gcloud firebase hosting:channel:deploy CHANNEL_ID --project=' + PROJECT_ID);

console.log('\nOption 3 - Manual deployment via Firebase Console:');
console.log('  1. Go to: https://console.firebase.google.com/project/' + PROJECT_ID + '/hosting/dashboard');
console.log('  2. Click "Upload files" button');
console.log('  3. Select all files from: ' + BUILD_DIR);
console.log('  4. Confirm upload\n');

console.log('Your app will be live at:');
console.log('  https://' + PROJECT_ID + '.web.app');
console.log('  https://' + PROJECT_ID + '.firebaseapp.com\n');
