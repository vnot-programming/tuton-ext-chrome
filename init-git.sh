#!/bin/bash

# Script untuk inisialisasi Git repository untuk UT E-Learning Extension

echo "🚀 Initializing Git repository for UT E-Learning Extension..."

# Inisialisasi Git repository
git init

# Tambahkan remote origin (ganti dengan URL repository GitHub Anda)
echo "📝 Please add your GitHub repository URL:"
echo "   git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git"

# Tambahkan semua file ke staging
git add .

# Buat commit pertama
git commit -m "Initial commit: UT E-Learning Text Grabber & AI Assistant

- Chrome extension untuk membantu mahasiswa UT
- Auto text extraction dari forum UT e-learning
- Multi-model AI support (Gemini, OpenAI, Claude)
- Secure API integration dengan server
- Modern UI design
- Copy functionality untuk AI responses

Features:
✅ Auto text extraction
✅ Multi-model AI support
✅ Secure API integration
✅ Modern UI
✅ Copy function
✅ Professional documentation

Made with ❤️ for UT students"

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create repository di GitHub: https://github.com/new"
echo "2. Add remote origin:"
echo "   git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git"
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎉 Repository siap untuk development dan collaboration!"
