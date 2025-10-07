# 👥 Multi-GitHub Account Setup Guide

## 🔍 **Situasi:**
Ada multiple GitHub accounts yang tersedia:
- `vnot01` (GitHub account)
- `vnot-programming` (GitHub account)
- Current VM user: `my`

## ✅ **Solusi:**

### **1. Check Current User:**
```bash
cd /home/my/tuton-ext-chrome
chmod +x check-user-and-setup.sh
./check-user-and-setup.sh
```

### **2. Pilih GitHub Account:**
Script akan menampilkan pilihan:
1. **vnot01** - GitHub account vnot01
2. **vnot-programming** - GitHub account vnot-programming  
3. **Custom GitHub account** - untuk GitHub account lain
4. **Current VM user** - untuk user VM yang sedang aktif

### **3. Manual Setup (Alternatif):**

#### **Untuk GitHub account vnot01:**
```bash
git config --global user.name "vnot01"
git config --global user.email "vnot01@users.noreply.github.com"
git remote add origin https://github.com/vnot01/tuton-ext-chrome.git
```

#### **Untuk GitHub account vnot-programming:**
```bash
git config --global user.name "vnot-programming"
git config --global user.email "feri@unu-jogja.ac.id"
git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git
```

#### **Untuk custom GitHub account:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git remote add origin https://github.com/yourusername/tuton-ext-chrome.git
```

## 🎯 **Rekomendasi:**

### **Pilih salah satu GitHub account:**

#### **vnot01:**
- ✅ Repository: `https://github.com/vnot01/tuton-ext-chrome.git`
- ✅ Email: `vnot01@users.noreply.github.com`
- ✅ GitHub username: `vnot01`

#### **vnot-programming:**
- ✅ Repository: `https://github.com/vnot-programming/tuton-ext-chrome.git`
- ✅ Email: `feri@unu-jogja.ac.id` (professional)
- ✅ GitHub username: `vnot-programming`

### **Setup Command untuk vnot01:**
```bash
cd /home/my/tuton-ext-chrome

# Set Git config untuk vnot01
git config --global user.name "vnot01"
git config --global user.email "vnot01@users.noreply.github.com"

# Add remote origin
git remote add origin https://github.com/vnot01/tuton-ext-chrome.git

# Add files and commit
git add .
git commit -m "Initial commit: UT E-Learning Extension"

# Set main branch
git branch -M main
```

### **Setup Command untuk vnot-programming:**
```bash
cd /home/my/tuton-ext-chrome

# Set Git config untuk vnot-programming
git config --global user.name "vnot-programming"
git config --global user.email "feri@unu-jogja.ac.id"

# Add remote origin
git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git

# Add files and commit
git add .
git commit -m "Initial commit: UT E-Learning Extension"

# Set main branch
git branch -M main
```

## 📋 **Verifikasi Setup:**
```bash
# Check Git config
git config --global --list | grep -E "(user\.name|user\.email)"

# Check remote
git remote -v

# Check status
git status
```

## 🚀 **Push to GitHub:**
```bash
git push -u origin main
```

## 🔧 **Troubleshooting:**

### **Jika ada conflict dengan user lain:**
```bash
# Check semua Git config
git config --global --list

# Reset Git config
git config --global --unset user.name
git config --global --unset user.email

# Set ulang
git config --global user.name "vnot-programming"
git config --global user.email "feri@unu-jogja.ac.id"
```

### **Jika remote sudah ada:**
```bash
# Check remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/vnot-programming/tuton-ext-chrome.git
```

## 📁 **File Structure:**
```
/home/my/tuton-ext-chrome/
├── check-user-and-setup.sh    # Interactive setup script
├── fix-git-config.sh          # Quick fix script
├── MULTI_USER_SETUP.md        # This guide
├── manifest.json              # Extension config
├── popup.html                 # Extension UI
├── popup.js                   # Extension logic
├── content.js                 # Text extraction
├── background.js              # Background worker
├── icons/icon.png             # Extension icon
├── README.md                  # Documentation
├── LICENSE                    # MIT License
└── .github/                   # GitHub templates
```

## 🎉 **Setelah Setup:**
1. **Repository live** di: https://github.com/vnot-programming/tuton-ext-chrome
2. **Professional documentation** dengan README lengkap
3. **Issue templates** untuk bug reports dan feature requests
4. **Pull request templates** untuk collaboration
5. **MIT License** untuk open source

---

**Choose the right user account and happy coding! 🚀**
