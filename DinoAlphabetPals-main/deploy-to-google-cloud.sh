#!/bin/bash

# Simple Google Cloud Deployment Script for DinoAlphabet Pals
# This script will handle everything for you!

set -e

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🦕 DinoAlphabet Pals - Google Cloud Deployment"
echo "=============================================="
echo -e "${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found!${NC}"
    echo ""
    echo "Please install it first:"
    echo "1. Go to: https://cloud.google.com/sdk/docs/install"
    echo "2. Download and install the Google Cloud CLI"
    echo "3. Run this script again"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}🔐 Please login to Google Cloud first...${NC}"
    gcloud auth login
fi

# Get or set project ID
echo -e "${BLUE}📋 Setting up your Google Cloud project...${NC}"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$CURRENT_PROJECT" ]; then
    echo "Please enter your Google Cloud Project ID:"
    echo "(You can find this in the Google Cloud Console)"
    read -r PROJECT_ID
    
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ Project ID cannot be empty${NC}"
        exit 1
    fi
    
    gcloud config set project "$PROJECT_ID"
else
    echo "Current project: $CURRENT_PROJECT"
    echo "Use this project? (y/n)"
    read -r USE_CURRENT
    
    if [[ $USE_CURRENT =~ ^[Nn]$ ]]; then
        echo "Enter your Google Cloud Project ID:"
        read -r PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    else
        PROJECT_ID="$CURRENT_PROJECT"
    fi
fi

echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Choose deployment method
echo -e "${BLUE}🚀 Choose your deployment method:${NC}"
echo "1) Cloud Run (Recommended - Serverless, pay-per-use)"
echo "2) App Engine (Managed platform)"
echo "3) Firebase Hosting (Static hosting)"
read -p "Enter choice (1-3): " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        echo -e "${GREEN}🏃 Deploying to Cloud Run...${NC}"
        
        # Build and deploy with one command
        echo -e "${BLUE}📦 Building and deploying your app...${NC}"
        gcloud run deploy dinoalphabet-pals \
            --source . \
            --region=us-central1 \
            --platform=managed \
            --allow-unauthenticated \
            --port=3000 \
            --memory=512Mi \
            --cpu=1 \
            --max-instances=10 \
            --set-env-vars="NODE_ENV=production"
        
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo -e "${BLUE}🌐 Your app is available at:${NC}"
        gcloud run services describe dinoalphabet-pals --region=us-central1 --format="value(status.url)"
        ;;
    2)
        echo -e "${GREEN}🏗️ Deploying to App Engine...${NC}"
        
        # Deploy to App Engine
        gcloud app deploy app.yaml --quiet
        
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo -e "${BLUE}🌐 Your app is available at:${NC}"
        gcloud app browse --no-launch-browser
        ;;
    3)
        echo -e "${GREEN}🔥 Deploying to Firebase Hosting...${NC}"
        
        # Check if Firebase CLI is installed
        if ! command -v firebase &> /dev/null; then
            echo "Installing Firebase CLI..."
            npm install -g firebase-tools
        fi
        
        # Build for static export
        echo -e "${BLUE}📦 Building static export...${NC}"
        npm run build
        
        # Initialize Firebase if needed
        if [ ! -f "firebase.json" ]; then
            echo -e "${BLUE}🔧 Setting up Firebase...${NC}"
            firebase login
            firebase init hosting --project "$PROJECT_ID"
        fi
        
        # Deploy
        firebase deploy --project "$PROJECT_ID"
        
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 DinoAlphabet Pals is now live!${NC}"
echo ""
echo -e "${BLUE}📊 What you can do now:${NC}"
echo "• Monitor your app in the Google Cloud Console"
echo "• Set up custom domain (optional)"
echo "• Add your API keys for enhanced features"
echo "• Monitor logs and performance"
echo ""
echo -e "${BLUE}🔧 To update your app:${NC}"
echo "• Just run this script again!"
echo "• Or use: gcloud run deploy dinoalphabet-pals --source ."
echo ""
echo -e "${BLUE}💰 Cost estimate:${NC}"
echo "• Cloud Run: ~$0-5/month (pay per use)"
echo "• App Engine: ~$5-20/month"
echo "• Firebase: Free tier available"
echo ""
echo -e "${GREEN}Made with 💚 for Jeffrey from Uncle Adam!${NC}"