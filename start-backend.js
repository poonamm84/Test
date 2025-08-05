#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Restaurant Management System Backend...\n');

// Function to start a process
function startProcess(command, args, cwd, name) {
    const process = spawn(command, args, {
        cwd: path.join(__dirname, cwd),
        stdio: 'inherit',
        shell: true
    });

    process.on('error', (error) => {
        console.error(`❌ Error starting ${name}:`, error);
    });

    process.on('close', (code) => {
        console.log(`🔴 ${name} exited with code ${code}`);
    });

    return process;
}

// Check which backend to start based on available dependencies
const fs = require('fs');

if (fs.existsSync(path.join(__dirname, 'server', 'package.json'))) {
    console.log('📦 Starting Node.js Backend (Recommended)...');
    console.log('🌐 Server will be available at: http://localhost:5000');
    console.log('📖 API Documentation: http://localhost:5000/');
    console.log('🏥 Health Check: http://localhost:5000/health\n');
    
    startProcess('npm', ['start'], 'server', 'Node.js Backend');
} else if (fs.existsSync(path.join(__dirname, 'backend', 'requirements.txt'))) {
    console.log('🐍 Starting FastAPI Backend...');
    console.log('🌐 Server will be available at: http://localhost:8000');
    console.log('📖 API Documentation: http://localhost:8000/docs\n');
    
    startProcess('python', ['run.py'], 'backend', 'FastAPI Backend');
} else {
    console.error('❌ No backend configuration found!');
    console.log('Please ensure either server/package.json or backend/requirements.txt exists.');
    process.exit(1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down backend servers...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down backend servers...');
    process.exit(0);
});