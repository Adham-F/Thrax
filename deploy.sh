#!/bin/bash

# Script to pull the latest GitHub version before deployment

echo "======================================================="
echo "THRAX E-COMMERCE GITHUB SYNC TOOL"
echo "======================================================="
echo "This script will sync your Replit project with the latest"
echo "version from your GitHub repository before deployment."
echo ""

# GitHub repository details - update these with your actual details
REPO_URL="https://github.com/Adham-F/Thrax.git"
BRANCH="main"

echo "🔄 Syncing with GitHub repository: $REPO_URL ($BRANCH branch)"
echo ""

# Store the current directory
CURRENT_DIR=$(pwd)

# Create a temporary directory for the clone
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Clone the repository
echo "📥 Cloning the latest version from GitHub..."
if git clone --depth 1 --branch $BRANCH $REPO_URL .; then
    echo "✅ Clone successful!"
    
    # Copy all files to the main directory (excluding git files and certain config files)
    echo "📋 Copying files to the deployment directory..."
    rsync -av \
        --exclude='.git' \
        --exclude='deploy.sh' \
        --exclude='.replit' \
        --exclude='package-lock.json' \
        --exclude='replit.nix' \
        ./ $CURRENT_DIR/
    
    # Return to the original directory
    cd $CURRENT_DIR
    
    # Clean up the temporary directory
    rm -rf $TEMP_DIR
    
    echo ""
    echo "🌟 GitHub sync complete! Your Replit project now contains"
    echo "   the latest code from your GitHub repository."
    echo ""
    echo "Now you can deploy your application using Replit's deploy button."
    echo "======================================================="
else
    echo "❌ Failed to clone repository. Please check the URL and your internet connection."
    cd $CURRENT_DIR
    rm -rf $TEMP_DIR
    exit 1
fi