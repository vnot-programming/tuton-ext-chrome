#!/bin/bash

# Script untuk check user dan setup Git yang tepat

echo "🔍 Checking current user and Git configuration..."

# Check current user
echo "👤 Current user: $(whoami)"
echo "🏠 Home directory: $HOME"
echo "📁 Current directory: $(pwd)"

# Check existing Git config
echo ""
echo "📋 Current Git configuration:"
git config --global --list | grep -E "(user\.name|user\.email)" || echo "No Git user config found"

# Check if we're in the right directory
if [[ $(pwd) == *"tuton-ext-chrome"* ]]; then
    echo "✅ We're in the correct extension directory"
else
    echo "❌ We're not in the extension directory"
    echo "Please run: cd /home/my/tuton-ext-chrome"
    exit 1
fi

echo ""
echo "🤔 Which GitHub account should we use?"
echo "1. vnot01 (GitHub account)"
echo "2. vnot-programming (GitHub account)"
echo "3. Custom GitHub account"
echo "4. Current VM user ($(whoami))"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        USER_NAME="vnot01"
        USER_EMAIL="feri.febria@gmail.com"
        GITHUB_USER="vnot01"
        REPO_URL="https://github.com/vnot01/tuton-ext-chrome.git"
        ;;
    2)
        USER_NAME="ngajar-feri"
        USER_EMAIL="feri@unu-jogja.ac.id"
        GITHUB_USER="ngajar-feri"
        REPO_URL="https://github.com/vnot-programming/tuton-ext-chrome.git"
        ;;
    3)
        read -p "Enter GitHub username: " GITHUB_USER
        read -p "Enter your name: " USER_NAME
        read -p "Enter your email: " USER_EMAIL
        REPO_URL="https://github.com/$GITHUB_USER/tuton-ext-chrome.git"
        ;;
    4)
        USER_NAME="$(whoami)"
        USER_EMAIL="$(whoami)@users.noreply.github.com"
        GITHUB_USER="$(whoami)"
        REPO_URL="https://github.com/$(whoami)/tuton-ext-chrome.git"
        ;;
    *)
        echo "Invalid choice. Using vnot01."
        USER_NAME="ngajar-feri"
        USER_EMAIL="feri@unu-jogja.ac.id"
        GITHUB_USER="ngajar-feri"
        REPO_URL="https://github.com/vnot-programming/tuton-ext-chrome.git"
        ;;
esac

echo ""
echo "🔧 Setting Git configuration..."
echo "Name: $USER_NAME"
echo "Email: $USER_EMAIL"

# Set Git user identity
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"

echo "✅ Git user identity configured"

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "📝 Remote origin already exists:"
    git remote -v
    echo "🔄 Updating remote URL to: $REPO_URL"
    git remote set-url origin "$REPO_URL"
else
    echo "📝 Adding remote origin..."
    git remote add origin "$REPO_URL"
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

Made with ❤️ for UT Tutor

Committed by: $USER_NAME <$USER_EMAIL>"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "✅ Git configuration completed!"
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
echo ""
echo "👤 Git configured for: $USER_NAME <$USER_EMAIL>"
echo "🔗 GitHub repository: https://github.com/$GITHUB_USER/tuton-ext-chrome"
echo "📡 Remote URL: $REPO_URL"
