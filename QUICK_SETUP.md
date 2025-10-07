# 🚀 Quick Setup Guide

## ❌ **Error yang Terjadi:**
```
Author identity unknown
*** Please tell me who you are.
fatal: unable to auto-detect email address
```

## ✅ **Solusi:**

### **1. Fix Git Configuration:**
```bash
cd /home/my/tuton-ext-chrome
chmod +x fix-git-config.sh
./fix-git-config.sh
```

### **2. Atau Manual Fix:**
```bash
# Set Git user identity
git config --global user.name "vnot-programming"
git config --global user.email "vnot-programming@users.noreply.github.com"

# Add remote origin
git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git

# Add files and commit
git add .
git commit -m "Initial commit: UT E-Learning Extension"

# Set main branch
git branch -M main
```

### **3. Create GitHub Repository:**
1. **Buka**: https://github.com/new
2. **Repository name**: `tuton-ext-chrome`
3. **Description**: `Chrome extension untuk membantu mahasiswa UT dalam forum diskusi dengan AI`
4. **Visibility**: Public atau Private
5. **Initialize**: ❌ Jangan centang README, .gitignore, atau license
6. **Click**: "Create repository"

### **4. Push to GitHub:**
```bash
git push -u origin main
```

## 🎯 **Verifikasi:**
1. **Buka repository**: https://github.com/vnot-programming/tuton-ext-chrome
2. **Check files**: Semua file extension sudah ter-upload
3. **Test clone**: 
   ```bash
   git clone https://github.com/vnot-programming/tuton-ext-chrome.git test-clone
   ```

## 📁 **File yang Akan Ter-upload:**
- ✅ `manifest.json` - Extension configuration
- ✅ `popup.html` - Extension UI
- ✅ `popup.js` - Extension logic
- ✅ `content.js` - Text extraction
- ✅ `background.js` - Background worker
- ✅ `icons/icon.png` - Extension icon
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - MIT License
- ✅ `.gitignore` - Git ignore rules
- ✅ `.github/` - GitHub templates

## 🚀 **Setelah Setup:**
1. **Development**: Mulai develop features baru
2. **Issues**: Buat issues untuk bugs/features
3. **Pull Requests**: Collaborate dengan contributors
4. **Releases**: Tag versions untuk releases
5. **Chrome Web Store**: Upload extension ke store

---

**Happy Coding! 🎉**
