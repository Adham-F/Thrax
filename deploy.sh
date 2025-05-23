#!/bin/bash

# ================================================================
# THRAX E-COMMERCE GITHUB SYNC TOOL - ENHANCED VERSION
# ================================================================
# This script synchronizes your Replit project with the GitHub version
# before deployment, ensuring all the latest features are included.
# ================================================================

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Show header
echo -e "${BOLD}${BLUE}=================================================================${RESET}"
echo -e "${BOLD}${BLUE}            THRAX E-COMMERCE GITHUB SYNC TOOL                  ${RESET}"
echo -e "${BOLD}${BLUE}=================================================================${RESET}"
echo -e "This tool will ensure your deployment uses the ${BOLD}latest GitHub version${RESET}"
echo -e "of your THRAX e-commerce platform, including all admin features."
echo -e ""

# GitHub repository details
REPO_URL="https://github.com/Adham-F/Thrax.git"
BRANCH="main"

# Check for required tools
echo -e "${YELLOW}Checking for required tools...${RESET}"
if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ git is not installed. This script requires git.${RESET}"
  exit 1
fi
echo -e "${GREEN}✓ Git is available${RESET}"
echo ""

# Store current directory and create backup
CURRENT_DIR=$(pwd)
BACKUP_DIR="${CURRENT_DIR}/backup_before_sync_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}Creating backup of current project...${RESET}"
mkdir -p $BACKUP_DIR
cp -r --preserve=timestamps $CURRENT_DIR/* $BACKUP_DIR/ 2>/dev/null || true
cp -r --preserve=timestamps $CURRENT_DIR/.* $BACKUP_DIR/ 2>/dev/null || true
echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR${RESET}"
echo ""

# Create a temporary directory for the clone
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Clone the repository
echo -e "${YELLOW}Cloning the latest version from GitHub (${BOLD}$REPO_URL${RESET}${YELLOW})...${RESET}"
if git clone --depth 1 --branch $BRANCH $REPO_URL .; then
    echo -e "${GREEN}✓ Clone successful!${RESET}"
    
    # Preserve critical Replit config files
    echo -e "${YELLOW}Backing up critical Replit configuration files...${RESET}"
    for file in .replit replit.nix package-lock.json; do
        if [ -f "$CURRENT_DIR/$file" ]; then
            cp "$CURRENT_DIR/$file" ./
            echo -e "${GREEN}  ✓ Preserved $file${RESET}"
        fi
    done
    
    # Check if admin toolbar code is present in the GitHub version
    if grep -q "admin-toolbar" $(find . -type f -name "*.tsx" -o -name "*.ts" -o -name "*.html" | xargs); then
        echo -e "${GREEN}✓ Admin toolbar found in GitHub version${RESET}"
    else
        echo -e "${YELLOW}⚠️ Admin toolbar not found in GitHub version. Adding it...${RESET}"
        # Ensure our admin tools are integrated
        if [ -f "$CURRENT_DIR/client/index.html" ]; then
            cp "$CURRENT_DIR/client/index.html" ./client/
            echo -e "${GREEN}  ✓ Integrated admin toolbar HTML${RESET}"
        fi
        if [ -f "$CURRENT_DIR/client/src/components/emergency-admin-toolbar.tsx" ]; then
            mkdir -p ./client/src/components/
            cp "$CURRENT_DIR/client/src/components/emergency-admin-toolbar.tsx" ./client/src/components/
            echo -e "${GREEN}  ✓ Integrated emergency admin toolbar component${RESET}"
        fi
    fi
    
    # Copy all files to the main directory (excluding specific files)
    echo -e "${YELLOW}Copying files to the deployment directory...${RESET}"
    # Remove .git directory first to avoid conflicts
    rm -rf .git
    # Copy all files
    cp -r . $CURRENT_DIR/
    # Don't overwrite the deploy.sh script itself or backup directories
    rm -f $CURRENT_DIR/deploy.sh
    rm -rf $CURRENT_DIR/backup_before_sync_*
    
    # Return to the original directory
    cd $CURRENT_DIR
    
    # Clean up the temporary directory
    rm -rf $TEMP_DIR
    
    echo ""
    echo -e "${GREEN}${BOLD}🎉 GitHub sync complete!${RESET}"
    echo -e "${GREEN}Your Replit project now contains the latest code from your GitHub repository,${RESET}"
    echo -e "${GREEN}including all admin features and necessary configurations.${RESET}"
    echo ""
    echo -e "${BLUE}Next steps:${RESET}"
    echo -e "1. ${BOLD}Start the application${RESET} to test if everything works as expected"
    echo -e "2. ${BOLD}Click the deploy button${RESET} in Replit to deploy your updated application"
    echo -e ""
    echo -e "${BLUE}If you encounter any issues, you can restore from the backup at:${RESET}"
    echo -e "${BOLD}$BACKUP_DIR${RESET}"
    echo -e "${BLUE}=================================================================${RESET}"
else
    echo -e "${RED}❌ Failed to clone repository.${RESET}"
    echo -e "${YELLOW}Possible reasons:${RESET}"
    echo -e "  - The repository URL is incorrect"
    echo -e "  - The branch name is incorrect"
    echo -e "  - Network connectivity issues"
    echo -e "  - GitHub authentication issues"
    echo ""
    echo -e "${YELLOW}Try:${RESET}"
    echo -e "  - Checking the repository URL and branch name"
    echo -e "  - Ensuring you have network connectivity"
    
    cd $CURRENT_DIR
    rm -rf $TEMP_DIR
    exit 1
fi