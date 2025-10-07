# 🚀 Git Setup Guide untuk UT E-Learning Extension

## 📋 Langkah-langkah Setup Git Repository

### 1. **Inisialisasi Git Repository**

```bash
cd /home/my/tuton-ext-chrome
chmod +x init-git.sh
./init-git.sh
```

### 2. **Buat Repository di GitHub**

1. **Login ke GitHub**: https://github.com
2. **Click "New repository"** atau https://github.com/new
3. **Repository name**: `tuton-ext-chrome`
4. **Description**: `Chrome extension untuk membantu mahasiswa UT dalam forum diskusi dengan AI`
5. **Visibility**: Public (untuk open source) atau Private
6. **Initialize dengan**: ❌ Jangan centang README, .gitignore, atau license (sudah ada)
7. **Click "Create repository"**

### 3. **Connect Local Repository ke GitHub**

```bash
# Ganti 'yourusername' dengan username GitHub Anda
git remote add origin https://github.com/yourusername/tuton-ext-chrome.git

# Set main branch
git branch -M main

# Push ke GitHub
git push -u origin main
```

### 4. **Verifikasi Setup**

1. **Buka repository di GitHub**: https://github.com/yourusername/tuton-ext-chrome
2. **Check apakah semua file sudah ter-upload**
3. **Test clone repository**:
   ```bash
   git clone https://github.com/yourusername/tuton-ext-chrome.git test-clone
   ```

## 📁 File yang Sudah Disiapkan

### **Core Extension Files**
- ✅ `manifest.json` - Extension configuration
- ✅ `popup.html` - Extension UI
- ✅ `popup.js` - Extension logic
- ✅ `content.js` - Text extraction script
- ✅ `background.js` - Background service worker
- ✅ `icons/icon.png` - Extension icon

### **Documentation & Git Files**
- ✅ `README.md` - Comprehensive documentation
- ✅ `LICENSE` - MIT License
- ✅ `.gitignore` - Git ignore rules
- ✅ `.github/` - GitHub templates dan workflows

### **Development Files**
- ✅ `init-git.sh` - Git initialization script
- ✅ `GIT_SETUP_GUIDE.md` - Setup guide ini

## 🔧 Development Workflow

### **Daily Development**
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Add new feature: description"

# Push to GitHub
git push origin main
```

### **Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Implement new feature"

# Push feature branch
git push origin feature/new-feature

# Create Pull Request di GitHub
```

### **Bug Fixes**
```bash
# Create bugfix branch
git checkout -b bugfix/fix-issue-123

# Fix bug and commit
git add .
git commit -m "Fix: description of fix"

# Push and create PR
git push origin bugfix/fix-issue-123
```

## 📝 Commit Message Guidelines

### **Format**
```
type: brief description

Detailed description of changes
- What was changed
- Why it was changed
- Any breaking changes

Closes #issue-number
```

### **Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### **Examples**
```bash
git commit -m "feat: add support for Claude AI model

- Add Claude API integration
- Update UI to include Claude option
- Add error handling for Claude responses

Closes #15"

git commit -m "fix: resolve text extraction issue on forum pages

- Fix selector for forum post content
- Add fallback extraction methods
- Improve error handling

Fixes #23"
```

## 🏷️ Version Management

### **Semantic Versioning**
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### **Creating Releases**
```bash
# Update version in manifest.json
# Commit version bump
git commit -m "chore: bump version to 1.1.0"

# Create tag
git tag -a v1.1.0 -m "Release version 1.1.0"

# Push tag
git push origin v1.1.0

# Create release di GitHub dengan tag v1.1.0
```

## 🤝 Collaboration

### **Contributing Guidelines**
1. **Fork repository**
2. **Create feature branch**
3. **Make changes**
4. **Test thoroughly**
5. **Create Pull Request**
6. **Follow code review process**

### **Code Review Checklist**
- [ ] Code follows project style
- [ ] No console errors
- [ ] Tested on UT e-learning pages
- [ ] Documentation updated
- [ ] No breaking changes

## 🔍 Repository Structure

```
tuton-ext-chrome/
├── .github/                 # GitHub templates & workflows
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── icons/                   # Extension icons
│   └── icon.png
├── .gitignore              # Git ignore rules
├── .github/                # GitHub configuration
├── background.js           # Background service worker
├── content.js              # Content script
├── init-git.sh             # Git initialization script
├── LICENSE                 # MIT License
├── manifest.json           # Extension manifest
├── popup.html              # Extension popup UI
├── popup.js                # Extension popup logic
├── README.md               # Project documentation
└── GIT_SETUP_GUIDE.md      # This file
```

## 🎯 Next Steps

1. **Setup repository** menggunakan guide ini
2. **Test extension** di development mode
3. **Create issues** untuk bugs atau features
4. **Start development** dengan feature pertama
5. **Setup CI/CD** untuk automated testing
6. **Publish to Chrome Web Store** setelah testing

## 📞 Support

Jika mengalami masalah dengan Git setup:
1. Check [GitHub Documentation](https://docs.github.com/)
2. Create [Issue](../../issues) di repository
3. Contact maintainer untuk bantuan

---

**Happy Coding! 🚀**
