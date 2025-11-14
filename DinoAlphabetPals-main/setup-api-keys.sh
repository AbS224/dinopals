#!/bin/bash

# API Keys Setup Script for DinoAlphabet Pals
# This helps you configure your API keys after deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🔑 DinoAlphabet Pals - API Keys Setup"
echo "===================================="
echo -e "${NC}"

echo "This script will help you set up API keys for enhanced features:"
echo "• 🧠 Google Gemini AI (for adaptive difficulty)"
echo "• 🎤 ElevenLabs Voice (for premium voice synthesis)"
echo ""

# Check current deployment
echo -e "${BLUE}🔍 Checking your current deployment...${NC}"

# Try to find Cloud Run service
if gcloud run services describe dinoalphabet-pals --region=us-central1 >/dev/null 2>&1; then
    DEPLOYMENT_TYPE="cloudrun"
    SERVICE_URL=$(gcloud run services describe dinoalphabet-pals --region=us-central1 --format="value(status.url)")
    echo -e "${GREEN}✅ Found Cloud Run deployment: $SERVICE_URL${NC}"
elif gcloud app describe >/dev/null 2>&1; then
    DEPLOYMENT_TYPE="appengine"
    SERVICE_URL=$(gcloud app browse --no-launch-browser 2>/dev/null || echo "App Engine URL")
    echo -e "${GREEN}✅ Found App Engine deployment${NC}"
else
    echo -e "${YELLOW}⚠️  No Google Cloud deployment found. This script works for Cloud Run and App Engine.${NC}"
    DEPLOYMENT_TYPE="unknown"
fi

echo ""

# Google Gemini AI Setup
echo -e "${BLUE}🧠 Google Gemini AI Setup${NC}"
echo "This enables adaptive difficulty and personalized encouragement."
echo ""
echo "1. Go to: https://makersuite.google.com/app/apikey"
echo "2. Create a new API key"
echo "3. Copy the API key"
echo ""
read -p "Enter your Gemini API key (or press Enter to skip): " GEMINI_KEY

# ElevenLabs Setup
echo ""
echo -e "${BLUE}🎤 ElevenLabs Voice Setup${NC}"
echo "This enables premium, natural-sounding voice synthesis."
echo ""
echo "1. Go to: https://elevenlabs.io"
echo "2. Sign up for an account"
echo "3. Go to your profile and copy your API key"
echo ""
read -p "Enter your ElevenLabs API key (or press Enter to skip): " ELEVENLABS_KEY

# Voice ID (optional)
if [ ! -z "$ELEVENLABS_KEY" ]; then
    echo ""
    echo "Optional: Choose a voice ID"
    echo "• pNInz6obpgDQGcFmaJgB (Default child-friendly voice)"
    echo "• Or leave blank for default"
    read -p "Enter voice ID (or press Enter for default): " VOICE_ID
    
    if [ -z "$VOICE_ID" ]; then
        VOICE_ID="pNInz6obpgDQGcFmaJgB"
    fi
fi

# Apply the configuration
if [ "$DEPLOYMENT_TYPE" = "cloudrun" ]; then
    echo ""
    echo -e "${BLUE}🚀 Updating Cloud Run service with API keys...${NC}"
    
    ENV_VARS=""
    if [ ! -z "$GEMINI_KEY" ]; then
        ENV_VARS="$ENV_VARS,NEXT_PUBLIC_GEMINI_API_KEY=$GEMINI_KEY"
    fi
    if [ ! -z "$ELEVENLABS_KEY" ]; then
        ENV_VARS="$ENV_VARS,NEXT_PUBLIC_ELEVENLABS_API_KEY=$ELEVENLABS_KEY"
        ENV_VARS="$ENV_VARS,NEXT_PUBLIC_ELEVENLABS_VOICE_ID=$VOICE_ID"
    fi
    
    if [ ! -z "$ENV_VARS" ]; then
        # Remove leading comma
        ENV_VARS=${ENV_VARS#,}
        
        gcloud run services update dinoalphabet-pals \
            --region=us-central1 \
            --set-env-vars="$ENV_VARS"
        
        echo -e "${GREEN}✅ API keys configured successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  No API keys provided, skipping configuration.${NC}"
    fi
    
elif [ "$DEPLOYMENT_TYPE" = "appengine" ]; then
    echo ""
    echo -e "${BLUE}🚀 For App Engine, you need to update app.yaml and redeploy...${NC}"
    
    # Update app.yaml
    if [ ! -z "$GEMINI_KEY" ] || [ ! -z "$ELEVENLABS_KEY" ]; then
        echo "Adding environment variables to app.yaml..."
        
        # Backup original
        cp app.yaml app.yaml.backup
        
        # Add env vars section if it doesn't exist
        if ! grep -q "env_variables:" app.yaml; then
            echo "" >> app.yaml
            echo "env_variables:" >> app.yaml
        fi
        
        if [ ! -z "$GEMINI_KEY" ]; then
            echo "  NEXT_PUBLIC_GEMINI_API_KEY: \"$GEMINI_KEY\"" >> app.yaml
        fi
        if [ ! -z "$ELEVENLABS_KEY" ]; then
            echo "  NEXT_PUBLIC_ELEVENLABS_API_KEY: \"$ELEVENLABS_KEY\"" >> app.yaml
            echo "  NEXT_PUBLIC_ELEVENLABS_VOICE_ID: \"$VOICE_ID\"" >> app.yaml
        fi
        
        echo "Redeploying with new configuration..."
        gcloud app deploy app.yaml --quiet
        
        echo -e "${GREEN}✅ API keys configured and deployed!${NC}"
    else
        echo -e "${YELLOW}⚠️  No API keys provided, skipping configuration.${NC}"
    fi
    
else
    echo ""
    echo -e "${YELLOW}⚠️  Manual configuration required${NC}"
    echo "Add these environment variables to your deployment:"
    
    if [ ! -z "$GEMINI_KEY" ]; then
        echo "NEXT_PUBLIC_GEMINI_API_KEY=$GEMINI_KEY"
    fi
    if [ ! -z "$ELEVENLABS_KEY" ]; then
        echo "NEXT_PUBLIC_ELEVENLABS_API_KEY=$ELEVENLABS_KEY"
        echo "NEXT_PUBLIC_ELEVENLABS_VOICE_ID=$VOICE_ID"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}✨ What you get with these API keys:${NC}"

if [ ! -z "$GEMINI_KEY" ]; then
    echo "🧠 Google Gemini AI:"
    echo "   • Adaptive difficulty based on the learner's performance"
    echo "   • Personalized encouragement messages"
    echo "   • Smart learning pattern analysis"
fi

if [ ! -z "$ELEVENLABS_KEY" ]; then
    echo "🎤 ElevenLabs Voice:"
    echo "   • High-quality, natural voice synthesis"
    echo "   • Emotional expressions (happy, excited, gentle)"
    echo "   • Multiple voice options"
fi

echo ""
echo -e "${BLUE}🔗 Your app: $SERVICE_URL${NC}"
echo ""
echo "Test the enhanced features by playing the game!"
echo "The AI and voice features will activate automatically."