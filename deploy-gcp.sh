#!/bin/bash

# Configuration
PROJECT_ID="your-project-id"
REGION="asia-northeast1" # Tokyo
SERVICE_NAME="refer-api"

echo "🚀 Starting Refer 2.0 Deployment to GCP..."

# 1. Build the image using Cloud Build
echo "📦 Building container image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 2. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

echo "✅ Deployment complete!"
