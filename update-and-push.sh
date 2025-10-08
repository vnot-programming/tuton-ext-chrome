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
git commit -m "Update: Chrome Extension v1.0.0-alpha with QR Code Donation

- Added CHANGELOG.md and RELEASE_NOTES.md for v1.0.0-alpha
- Added QR code donation section with Saweria integration
- Added 'Jazakumullah Khairan' message for donations
- Updated .gitignore to exclude internal scripts
- Enhanced documentation with comprehensive release notes
- Added assets/qr-saweria.png for donation QR code

Made with ❤️ for UT Toton"

# Set main branch
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Push completed successfully!"
echo "🔗 Repository: https://github.com/vnot-programming/tuton-ext-chrome"


