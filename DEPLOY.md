#!/usr/bin/env node
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
// You'll need to create a service account key from Firebase Console
// For now, this is a guide

console.log('To deploy to Firebase Hosting:');
console.log('');
console.log('Option 1: Use Firebase Console');
console.log('1. Go to https://console.firebase.google.com');
console.log('2. Select "brahmerp-51190" project');
console.log('3. Go to Hosting tab');
console.log('4. Manual upload option (available in beta)');
console.log('');
console.log('Option 2: Use Firebase CLI (requires authentication)');
console.log('1. Run: npx firebase-tools login');
console.log('2. Then: npx firebase deploy --only hosting');
console.log('');
console.log('Deployment folder: erp-app/public/');
