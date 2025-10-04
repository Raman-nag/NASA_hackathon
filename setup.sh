#!/bin/bash

# NASA Exoplanet AI - Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up NASA Exoplanet AI Application..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18.x or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18.x or higher is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) is installed"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.9 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    if [ "$(echo "$PYTHON_VERSION < 3.9" | bc -l)" -eq 1 ]; then
        print_error "Python 3.9 or higher is required. Current version: $(python3 --version)"
        exit 1
    fi
    print_success "Python $(python3 --version) is installed"
    
    # Check MongoDB (optional)
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed. You can use Docker or install MongoDB manually."
    else
        print_success "MongoDB is installed"
    fi
}

# Install Node.js dependencies
install_node_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    # Install root dependencies
    npm install
    print_success "Root dependencies installed"
    
    # Install server dependencies
    cd server
    npm install
    print_success "Server dependencies installed"
    cd ..
    
    # Install client dependencies
    cd client
    npm install
    print_success "Client dependencies installed"
    cd ..
}

# Install Python dependencies
install_python_dependencies() {
    print_status "Installing Python dependencies..."
    
    cd ai
    pip3 install -r requirements.txt
    print_success "Python dependencies installed"
    cd ..
}

# Train the AI model
train_ai_model() {
    print_status "Training AI model..."
    
    cd ai
    python3 train_model.py
    print_success "AI model trained successfully"
    cd ..
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads
    mkdir -p ai/models
    print_success "Directories created"
}

# Set up environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    if [ ! -f server/.env ]; then
        cp server/env.example server/.env
        print_success "Environment file created at server/.env"
        print_warning "Please edit server/.env with your configuration"
    else
        print_warning "Environment file already exists at server/.env"
    fi
}

# Start MongoDB (if available)
start_mongodb() {
    if command -v mongod &> /dev/null; then
        print_status "Starting MongoDB..."
        if ! pgrep -x "mongod" > /dev/null; then
            mongod --fork --logpath /tmp/mongodb.log
            print_success "MongoDB started"
        else
            print_warning "MongoDB is already running"
        fi
    else
        print_warning "MongoDB not found. Please start MongoDB manually or use Docker."
    fi
}

# Main setup function
main() {
    echo
    print_status "Starting NASA Exoplanet AI setup..."
    echo
    
    check_requirements
    create_directories
    install_node_dependencies
    install_python_dependencies
    train_ai_model
    setup_environment
    start_mongodb
    
    echo
    echo "================================================"
    print_success "Setup completed successfully! 🎉"
    echo
    print_status "Next steps:"
    echo "1. Edit server/.env with your configuration"
    echo "2. Start MongoDB (if not already running):"
    echo "   - Using Docker: docker run -d -p 27017:27017 --name mongodb mongo:6.0"
    echo "   - Or start your local MongoDB instance"
    echo "3. Start the application:"
    echo "   - Development: npm run dev"
    echo "   - Production: npm start"
    echo
    print_status "Access the application:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:5000"
    echo
    print_status "Happy exoplanet hunting! 🚀✨"
    echo
}

# Run main function
main "$@"

