# Contributing to NASA Exoplanet AI

We welcome contributions from the community! This project was built for the NASA Space Apps Challenge 2024 and aims to make exoplanet discovery accessible to everyone.

## 🌟 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the top right of the repository page
- Clone your fork locally:
  ```bash
  git clone https://github.com/YOUR_USERNAME/nasa-exoplanet-ai.git
  cd nasa-exoplanet-ai
  ```

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes
- Follow the coding standards (see below)
- Add tests if applicable
- Update documentation as needed

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add amazing feature: brief description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/amazing-feature
```
Then create a Pull Request on GitHub.

## 🛠️ Development Setup

### Prerequisites
- Node.js 18.x or higher
- Python 3.9 or higher
- MongoDB 6.0 or higher
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nasa-exoplanet-ai.git
cd nasa-exoplanet-ai

# Run setup script
chmod +x setup.sh
./setup.sh

# Start development
npm run dev
```

### Manual Setup
```bash
# Install dependencies
npm run install-all

# Train AI model
cd ai
pip install -r requirements.txt
python train_model.py
cd ..

# Start MongoDB
mongod

# Start application
npm run dev
```

## 📋 Coding Standards

### JavaScript/React
- Use ESLint configuration
- Follow React best practices
- Use functional components with hooks
- Use TypeScript for new components (optional)
- Write meaningful commit messages

### Python
- Follow PEP 8 style guide
- Use type hints where possible
- Add docstrings to functions
- Use meaningful variable names

### General
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use consistent naming conventions

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

### AI Model Testing
```bash
cd ai
python -m pytest tests/
```

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Update README.md for new features
- Document API endpoints
- Add inline comments for complex logic

### Pull Request Template
When creating a PR, include:
- Description of changes
- Screenshots (if UI changes)
- Testing instructions
- Breaking changes (if any)

## 🐛 Bug Reports

When reporting bugs, include:
1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node.js version, browser, etc.
6. **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features:
1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed description of the feature
3. **Mockups**: Visual representations if applicable
4. **Alternatives**: Other solutions considered

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 🚀 Release Process

1. **Version Bumping**: Update version in package.json files
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update README.md if needed
5. **Release**: Create GitHub release with tag

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing private information without permission
- Other unprofessional conduct

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: support@nasa-exoplanet-ai.com
- **Discord**: Join our community server (if available)

## 🏆 Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Social media mentions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to NASA Exoplanet AI! 🚀✨**

*Together, we're exploring the cosmos, one exoplanet at a time.*
