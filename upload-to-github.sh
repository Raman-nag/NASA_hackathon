#!/bin/bash

# NASA Exoplanet AI - GitHub Upload Script
# This script helps you upload the project to GitHub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    print_success "Git is installed"
}

# Initialize git repository
init_git() {
    if [ ! -d ".git" ]; then
        print_status "Initializing Git repository..."
        git init
        print_success "Git repository initialized"
    else
        print_warning "Git repository already exists"
    fi
}

# Add files to git
add_files() {
    print_status "Adding files to Git..."
    git add .
    print_success "Files added to Git"
}

# Create initial commit
create_commit() {
    print_status "Creating initial commit..."
    git commit -m "Initial commit: NASA Exoplanet AI - A World Away Challenge

- Complete full-stack web application for exoplanet detection
- React frontend with modern UI and interactive visualizations  
- Node.js/Express backend with RESTful API
- Python AI/ML model for exoplanet classification
- MongoDB database integration
- Docker deployment configuration
- Comprehensive documentation and setup scripts

Built for NASA Space Apps Challenge 2024"
    print_success "Initial commit created"
}

# Get GitHub username
get_github_username() {
    if [ -z "$GITHUB_USERNAME" ]; then
        echo -n "Enter your GitHub username: "
        read GITHUB_USERNAME
    fi
    
    if [ -z "$GITHUB_USERNAME" ]; then
        print_error "GitHub username is required"
        exit 1
    fi
    
    print_success "GitHub username: $GITHUB_USERNAME"
}

# Add remote origin
add_remote() {
    print_status "Adding GitHub remote origin..."
    git remote add origin https://github.com/$GITHUB_USERNAME/nasa-exoplanet-ai.git || {
        print_warning "Remote origin already exists, updating..."
        git remote set-url origin https://github.com/$GITHUB_USERNAME/nasa-exoplanet-ai.git
    }
    print_success "Remote origin added"
}

# Push to GitHub
push_to_github() {
    print_status "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    print_success "Code pushed to GitHub successfully!"
}

# Display next steps
show_next_steps() {
    echo
    echo "================================================"
    print_success "Upload completed successfully! 🎉"
    echo
    print_status "Next steps:"
    echo "1. Go to https://github.com/$GITHUB_USERNAME/nasa-exoplanet-ai"
    echo "2. Add repository description and topics"
    echo "3. Enable GitHub Pages (optional)"
    echo "4. Create a release (optional)"
    echo "5. Add collaborators (if working in a team)"
    echo
    print_status "Repository URL:"
    echo "https://github.com/$GITHUB_USERNAME/nasa-exoplanet-ai"
    echo
    print_status "To make changes and push updates:"
    echo "git add ."
    echo "git commit -m 'Your commit message'"
    echo "git push origin main"
    echo
    print_status "Happy exoplanet hunting! 🚀✨"
    echo
}

# Main function
main() {
    echo "🚀 NASA Exoplanet AI - GitHub Upload Script"
    echo "=============================================="
    echo
    
    check_git
    init_git
    add_files
    create_commit
    get_github_username
    add_remote
    push_to_github
    show_next_steps
}

# Run main function
main "$@"
