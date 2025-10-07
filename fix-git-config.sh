#!/bin/bash

# Script untuk fix Git configuration dan setup repository

echo "🔧 Fixing Git configuration..."

# Set Git user identity
git config --global user.name "vnot-programming"
git config --global user.email "feri@unu-jogja.ac.id"

echo "✅ Git user identity configured"

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "📝 Remote origin already exists"
    git remote -v
else
    echo "📝 Adding remote origin..."
    git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git
fi

# Add all files to staging
echo "📁 Adding files to staging..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
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

Made with ❤️ for UT Tutor"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "✅ Git configuration fixed and repository ready!"
echo ""
echo "📋 Next steps:"
echo "1. Create repository di GitHub: https://github.com/new"
echo "   - Repository name: tuton-ext-chrome"
echo "   - Description: Chrome extension untuk membantu mahasiswa UT dalam forum diskusi dengan AI"
echo "   - Set as Public atau Private"
echo "   - DON'T initialize with README (already exists)"
echo ""
echo "2. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "🎉 Repository siap untuk development dan collaboration!"
