@echo off
REM NASA Exoplanet AI - GitHub Upload Script for Windows
REM This script helps you upload the project to GitHub

echo.
echo 🚀 NASA Exoplanet AI - GitHub Upload Script
echo ==============================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [SUCCESS] Git is installed

REM Initialize git repository if it doesn't exist
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
    echo [SUCCESS] Git repository initialized
) else (
    echo [WARNING] Git repository already exists
)

REM Add files to git
echo [INFO] Adding files to Git...
git add .
echo [SUCCESS] Files added to Git

REM Create initial commit
echo [INFO] Creating initial commit...
git commit -m "Initial commit: NASA Exoplanet AI - A World Away Challenge

- Complete full-stack web application for exoplanet detection
- React frontend with modern UI and interactive visualizations  
- Node.js/Express backend with RESTful API
- Python AI/ML model for exoplanet classification
- MongoDB database integration
- Docker deployment configuration
- Comprehensive documentation and setup scripts

Built for NASA Space Apps Challenge 2024"
echo [SUCCESS] Initial commit created

REM Get GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo [ERROR] GitHub username is required
    pause
    exit /b 1
)
echo [SUCCESS] GitHub username: %GITHUB_USERNAME%

REM Add remote origin
echo [INFO] Adding GitHub remote origin...
git remote add origin https://github.com/%GITHUB_USERNAME%/nasa-exoplanet-ai.git 2>nul || (
    echo [WARNING] Remote origin already exists, updating...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/nasa-exoplanet-ai.git
)
echo [SUCCESS] Remote origin added

REM Push to GitHub
echo [INFO] Pushing to GitHub...
git branch -M main
git push -u origin main
echo [SUCCESS] Code pushed to GitHub successfully!

echo.
echo ================================================
echo [SUCCESS] Upload completed successfully! 🎉
echo.
echo [INFO] Next steps:
echo 1. Go to https://github.com/%GITHUB_USERNAME%/nasa-exoplanet-ai
echo 2. Add repository description and topics
echo 3. Enable GitHub Pages (optional)
echo 4. Create a release (optional)
echo 5. Add collaborators (if working in a team)
echo.
echo [INFO] Repository URL:
echo https://github.com/%GITHUB_USERNAME%/nasa-exoplanet-ai
echo.
echo [INFO] To make changes and push updates:
echo git add .
echo git commit -m "Your commit message"
echo git push origin main
echo.
echo [INFO] Happy exoplanet hunting! 🚀✨
echo.
pause
