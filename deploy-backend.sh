#!/bin/bash
# Usage: bash deploy-backend.sh
# Make sure you are authenticated with gcloud and have set your project and region.

# Set these variables
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
SERVICE_NAME="doculix-backend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

# 1. Build Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME . || { echo "Docker build failed"; exit 1; }

# 2. Authenticate Docker to GCR
echo "Authenticating Docker to GCR..."
gcloud auth configure-docker || { echo "GCR auth failed"; exit 1; }

# 3. Push image to GCR
echo "Pushing image to GCR..."
docker push $IMAGE_NAME || { echo "Docker push failed"; exit 1; }

# 4. Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

echo "Deployment complete!"
echo "Get the service URL with: gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)'"
