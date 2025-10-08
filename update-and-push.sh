#!/bin/bash

echo "🚀 Updating and pushing to GitHub..."

# Set Git config
git config --global user.name "ngajar-feri"
git config --global user.email "feri@unu-jogja.ac.id"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git remote add origin https://github.com/vnot-programming/tuton-ext-chrome.git
else
    echo "✅ Git repository already initialized"
fi

# Add all changes
echo "📁 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update: Chrome Extension with updated Chrome ID

- Updated Chrome extension ID
- Improved extension functionality
- Enhanced security features
- Updated API integration

Made with ❤️ for UT Tutor"

# Set main branch
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Push completed successfully!"
echo "🔗 Repository: https://github.com/vnot-programming/tuton-ext-chrome"


