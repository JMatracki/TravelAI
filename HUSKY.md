# 🐕 Husky Git Hooks Configuration

## Overview

This project uses **Husky** to enforce code quality and prevent bad commits from reaching the repository. Git hooks automatically run checks before commits and pushes.

## Configured Hooks

### 🔍 Pre-commit Hook (`.husky/pre-commit`)

**Runs before every commit:**

- ✅ **ESLint with auto-fix** - Finds and fixes code issues
- ✅ **Prettier formatting** - Ensures consistent code style
- ✅ **TypeScript type checking** - Validates types on staged files
- ✅ **Test suite** - Runs all tests to prevent breaking changes

**What it does:**

```bash
# Automatically fixes linting issues
eslint --fix

# Formats code consistently
prettier --write

# Checks TypeScript types
tsc --noEmit

# Runs full test suite
npm test
```

### 🚀 Pre-push Hook (`.husky/pre-push`)

**Runs before every push:**

- ✅ **Full TypeScript check** - Validates entire project
- ✅ **Complete test suite** - All 76 tests must pass
- ✅ **Build verification** - Ensures production build works

### 📝 Commit Message Hook (`.husky/commit-msg`)

**Enforces conventional commit format:**

- ✅ **Conventional Commits** - Standardized commit messages
- ✅ **Type validation** - Must use valid commit types
- ✅ **Length validation** - Descriptive but concise

## Commit Message Format

```
<type>[optional scope]: <description>

Examples:
✅ feat: add lazy loading for components
✅ fix: resolve API timeout issues
✅ docs: update README with setup instructions
✅ refactor(api): improve error handling
✅ test: add edge cases for form validation
✅ perf: optimize component re-renders
✅ chore: update dependencies
```

### Valid Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Revert previous commit

## Benefits

### 🛡️ **Quality Assurance**

- Prevents buggy code from being committed
- Ensures consistent code style across team
- Catches TypeScript errors before they reach repo

### 🚀 **Automation**

- No manual linting/formatting needed
- Automatic test running prevents regressions
- Build verification prevents deployment issues

### 📚 **Documentation**

- Standardized commit messages improve git history
- Easy to generate changelogs
- Better collaboration and code reviews

## Troubleshooting

### Skip Hooks (Emergency Only)

```bash
# Skip pre-commit (NOT recommended)
git commit --no-verify -m "emergency fix"

# Skip pre-push (NOT recommended)
git push --no-verify
```

### Hook Failures

If hooks fail:

1. **Fix the issues** - Address linting/test failures
2. **Stage changes** - `git add .`
3. **Commit again** - Hooks will re-run

### Manual Commands

Run the same checks manually:

```bash
# Run linting with fix
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm test

# Build check
npm run build
```

## Installation for New Developers

When cloning the project:

```bash
# Install dependencies (includes husky setup)
npm install

# Husky hooks are automatically installed
# No additional setup needed!
```

---

**🎯 Result: Every commit is guaranteed to be high-quality, tested, and properly formatted!**
