#!/bin/bash

# Google Cloud Deployment Script for DinoAlphabet Pals
# Make this file executable: chmod +x deploy.sh

set -e

echo "🦕 Deploying DinoAlphabet Pals to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please login to Google Cloud first:"
    gcloud auth login
fi

# Set project (you'll need to replace this with your project ID)
echo "📋 Please enter your Google Cloud Project ID:"
read -r PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty"
    exit 1
fi

gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Choose deployment method
echo "🚀 Choose deployment method:"
echo "1) Cloud Run (Recommended - Serverless, auto-scaling)"
echo "2) App Engine (Managed platform)"
echo "3) Firebase Hosting (Static hosting)"
read -p "Enter choice (1-3): " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        echo "🏃 Deploying to Cloud Run..."
        
        # Build and deploy with Cloud Build
        gcloud builds submit --config cloudbuild.yaml .
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app will be available at:"
        gcloud run services describe dinoalphabet-pals --region=us-central1 --format="value(status.url)"
        ;;
    2)
        echo "🏗️ Deploying to App Engine..."
        
        # Deploy to App Engine
        gcloud app deploy app.yaml --quiet
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app will be available at:"
        gcloud app browse --no-launch-browser
        ;;
    3)
        echo "🔥 Deploying to Firebase Hosting..."
        
        # Check if Firebase CLI is installed
        if ! command -v firebase &> /dev/null; then
            echo "Installing Firebase CLI..."
            npm install -g firebase-tools
        fi
        
        # Build for static export
        echo "📦 Building static export..."
        npm run build
        
        # Initialize Firebase (if not already done)
        if [ ! -f "firebase.json" ]; then
            firebase init hosting
        fi
        
        # Deploy
        firebase deploy
        
        echo "✅ Deployment complete!"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 DinoAlphabet Pals is now live!"
echo "📊 Monitor your deployment:"
echo "   - Cloud Console: https://console.cloud.google.com"
echo "   - Logs: gcloud logs tail"
echo "   - Metrics: Check Cloud Monitoring"
echo ""
echo "🔧 To update your app:"
echo "   - Just run this script again!"
echo "   - Or use: gcloud run deploy dinoalphabet-pals --source ."