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
git commit -m "Release v1.1: Chrome Web Store compliance and permission fixes (October 8, 2025)

- Updated version from 1.0 to 1.1 in manifest.json
- Fixed Chrome Web Store policy violation by removing unused 'scripting' permission
- Updated all documentation (README, CHANGELOG, RELEASE_NOTES) for v1.1
- Enhanced security by reducing permission attack surface
- Extension now fully compliant with Chrome Web Store policies
- Updated popup.html version display to 1.1
- Added clickable donation link to Saweria in popup extension
- Updated all dates to October 8, 2025

Made with ❤️ for UT Toton"

# Set main branch
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Push completed successfully!"
echo "🔗 Repository: https://github.com/vnot-programming/tuton-ext-chrome"


