# 🚀 Quick Deploy Guide

## Super Simple Deployment (5 minutes!)

### Step 1: Install Google Cloud CLI
1. Go to: https://cloud.google.com/sdk/docs/install
2. Download and install for your operating system
3. Restart your terminal

### Step 2: Deploy Your App
```bash
# Make the script executable
chmod +x deploy-to-google-cloud.sh

# Run the deployment script
./deploy-to-google-cloud.sh
```

That's it! The script will:
- ✅ Check if you're logged in (and log you in if needed)
- ✅ Set up your Google Cloud project
- ✅ Enable required APIs
- ✅ Build and deploy your app
- ✅ Give you the live URL

### Step 3: Add API Keys (Optional but Recommended)
```bash
# Run the API setup script
chmod +x setup-api-keys.sh
./setup-api-keys.sh
```

This adds:
- 🧠 **Google Gemini AI** for adaptive difficulty
- 🎤 **ElevenLabs Voice** for premium voice synthesis

## What You Get

### 🌐 **Live Website**
Your app will be available at a URL like:
`https://dinoalphabet-pals-xxxxx-uc.a.run.app`

### 💰 **Cost**
- **Cloud Run**: $0-5/month (pay only when used)
- **App Engine**: $5-20/month
- **Firebase**: Free tier available

### 🔒 **Security**
- HTTPS automatically enabled
- Google Cloud security
- No server management needed

## Troubleshooting

### "gcloud not found"
Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install

### "Project not found"
Make sure you have a Google Cloud project created at: https://console.cloud.google.com

### "Permission denied"
Run: `gcloud auth login` and follow the prompts

### "Build failed"
Check that all files are present and run: `npm install` first

## Need Help?

1. **Check the logs**: Go to Google Cloud Console → Cloud Run → Your service → Logs
2. **Redeploy**: Just run the script again
3. **Reset**: Delete the service and run the script again

## What's Next?

1. **Custom Domain**: Set up your own domain name
2. **Monitoring**: Set up alerts and monitoring
3. **API Keys**: Add Gemini AI and ElevenLabs for enhanced features
4. **Updates**: Just run the deploy script again to update

---

**Made with 💚 for Jeffrey from Uncle Adam!**