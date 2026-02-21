# Contributing to LiveStockSafe 🐄

Thank you for your interest in contributing to **LiveStockSafe** — a smart livestock monitoring and management platform!

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a **feature branch**: `git checkout -b feature/your-feature-name`
4. Make your changes with clear, descriptive commits
5. **Push** and open a **Pull Request**

## 🧑‍💻 Development Setup

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- npm >= 9.x

### Installation
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Running Locally
```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm start
```

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `chore:` | Maintenance tasks |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |

**Example:**
```
feat: add GPS fence alert for sheep

Add geofencing support to detect when livestock
exits defined safe zones and trigger real-time alerts.

Co-authored-by: Pratham <prathammk2003@gmail.com>
```

## 🐛 Reporting Issues

- Use the **Issues** tab on GitHub
- Include steps to reproduce, expected vs actual behavior
- Attach screenshots or logs if applicable

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together! 🙌

## 📬 Contact

- **Kalpavruksha**: beshu4959gowdaman@gmail.com  
- **Pratham**: prathammk2003@gmail.com
