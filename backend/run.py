#!/usr/bin/env python3
"""
Restaurant Management System Backend Runner
Run this file to start the backend server
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Starting Restaurant Management System Backend...")
    print("📊 Database will be automatically initialized on first run")
    print("🌐 API will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔧 Admin Panel APIs: /api/admin/*")
    print("👑 Super Admin APIs: /api/super-admin/*")
    print("\n" + "="*50)
    print("DEMO CREDENTIALS:")
    print("="*50)
    print("🏪 Restaurant Admin Login:")
    print("   - Golden Spoon: GS001 / admin123")
    print("   - Sakura Sushi: SS002 / admin123") 
    print("   - Mama's Italian: MI003 / admin123")
    print("\n👑 Super Admin Login:")
    print("   - Email: owner@restaurantai.com")
    print("   - Password: superadmin2025")
    print("   - Security Code: 777888")
    print("="*50 + "\n")
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )