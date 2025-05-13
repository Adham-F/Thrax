#!/bin/bash

# Create a temporary directory for the project files
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Copy all relevant project files to the temporary directory
echo "Copying project files..."
cp -r \
  client \
  server \
  shared \
  components.json \
  drizzle.config.ts \
  package.json \
  postcss.config.js \
  tailwind.config.ts \
  tsconfig.json \
  vite.config.ts \
  README.md \
  .gitignore \
  $TEMP_DIR/

# Remove node_modules and other unnecessary files
echo "Removing unnecessary files..."
find $TEMP_DIR -name "node_modules" -type d -exec rm -rf {} +
find $TEMP_DIR -name ".git" -type d -exec rm -rf {} +
find $TEMP_DIR -name ".DS_Store" -exec rm -f {} \;

# Create the TAR.GZ file in the project root directory
CURRENT_DIR=$(pwd)
TAR_FILE="$CURRENT_DIR/thrax-ecommerce.tar.gz"
echo "Creating TAR.GZ file: $TAR_FILE"
cd $TEMP_DIR
tar -czf "$TAR_FILE" .

echo "TAR.GZ file created at: $TAR_FILE"
echo "You can download this file from Replit using the Files panel"

# Clean up
rm -rf $TEMP_DIR
echo "Temporary directory removed"