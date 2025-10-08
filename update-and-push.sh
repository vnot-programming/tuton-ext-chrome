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
git commit -m "Fix: Remove unused 'scripting' permission for Chrome Web Store compliance

- Removed unused 'scripting' permission from manifest.json
- Updated README.md to reflect correct permissions
- Fixed Chrome Web Store policy violation (Purple Potassium)
- Extension now only requests necessary permissions:
  * activeTab: For accessing current page
  * storage: For saving user settings
- Content scripts are injected via manifest content_scripts, not scripting API

Made with ❤️ for UT Toton"

# Set main branch
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Push completed successfully!"
echo "🔗 Repository: https://github.com/vnot-programming/tuton-ext-chrome"


