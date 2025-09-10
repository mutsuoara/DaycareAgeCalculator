#!/bin/bash

echo "Adding Firebase secrets to GitHub repository..."

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI not found. Please install it first:"
    echo "winget install --id GitHub.cli"
    echo "Then restart your terminal and run this script again."
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Not authenticated with GitHub. Please run: gh auth login"
    exit 1
fi

echo "GitHub CLI found and authenticated!"

# Firebase configuration values
declare -A secrets=(
    ["FIREBASE_API_KEY"]="AIzaSyB6-gLp_JMkRPD6fbboLu8b0Kr1F1LhNx0"
    ["FIREBASE_AUTH_DOMAIN"]="agecalculator-6d153.firebaseapp.com"
    ["FIREBASE_PROJECT_ID"]="agecalculator-6d153"
    ["FIREBASE_STORAGE_BUCKET"]="agecalculator-6d153.firebasestorage.app"
    ["FIREBASE_MESSAGING_SENDER_ID"]="999362485187"
    ["FIREBASE_APP_ID"]="1:999362485187:web:84b6e300de0a7dea843b76"
)

# Add each secret
for secret_name in "${!secrets[@]}"; do
    secret_value="${secrets[$secret_name]}"
    echo "Adding secret: $secret_name"
    
    if gh secret set "$secret_name" --body "$secret_value"; then
        echo "✓ Successfully added $secret_name"
    else
        echo "✗ Failed to add $secret_name"
    fi
done

echo ""
echo "All secrets have been processed!"
echo "You can verify them in your GitHub repository settings."

