#!/bin/bash

# Exit on error
set -e

echo "🏗️ Building Woke O Meter app..."

# Navigate to React app directory
cd wokeometer

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the React app
echo "🔨 Building the app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
  echo "❌ Build failed! The build directory was not created."
  exit 1
fi

# Navigate back to root
cd ..

# Remove old files from root (except for specific directories/files)
echo "🧹 Cleaning up root directory..."
find . -maxdepth 1 -type f -not -name "README.md" -not -name "CNAME" -not -name "build.sh" -not -name ".gitignore" -not -name ".nojekyll" -delete
find . -maxdepth 1 -type d -not -path "./wokeometer" -not -path "." -not -path "./.git" -not -path "./.github" -exec rm -rf {} \;

# Copy build files to root (includes processed public files)
echo "📋 Copying build files to root..."
cp -r wokeometer/build/* .

# Verify that index.html exists in root
echo "🔍 Verifying build files..."
if [ ! -f "index.html" ]; then
  echo "❌ Build verification failed! index.html was not copied to root."
  exit 1
else
  echo "✓ Build files verified."
fi

# Create a .nojekyll file to disable GitHub Pages Jekyll processing
touch .nojekyll

echo "✅ Build complete! Files are ready for GitHub Pages."
