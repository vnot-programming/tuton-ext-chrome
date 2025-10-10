#!/bin/bash

# Build script for UT E-Learning Chrome Extension
# Automatically reads version from manifest.json and creates zip file

echo "🚀 Building UT E-Learning Chrome Extension..."

# Check if manifest.json exists
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found!"
    exit 1
fi

# Extract version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
    echo "❌ Error: Could not extract version from manifest.json"
    exit 1
fi

echo "📦 Version detected: $VERSION"

# Create zip filename
ZIP_NAME="tuton-ext-chrome-v${VERSION}.zip"

# Remove existing zip file if it exists
if [ -f "$ZIP_NAME" ]; then
    echo "🗑️  Removing existing zip file: $ZIP_NAME"
    rm "$ZIP_NAME"
fi

# Create zip file excluding build artifacts and unnecessary files
echo "📁 Creating zip file: $ZIP_NAME"
zip -r "$ZIP_NAME" . \
    -x "*.git*" \
    -x "*.DS_Store*" \
    -x "build.sh" \
    -x "*.zip" \
    -x "node_modules/*" \
    -x "*.log" \
    -x ".vscode/*" \
    -x "*.md" \
    -x "update-and-push.sh" \
    -x "push-with-auth.sh"

# Check if zip was created successfully
if [ -f "$ZIP_NAME" ]; then
    echo "✅ Build successful!"
    echo "📦 Created: $ZIP_NAME"
    echo "📊 File size: $(du -h "$ZIP_NAME" | cut -f1)"
    echo ""
    echo "🎯 Ready for Chrome Web Store upload!"
    echo "🔗 You can now upload $ZIP_NAME to Chrome Web Store"
else
    echo "❌ Error: Failed to create zip file"
    exit 1
fi
