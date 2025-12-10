#!/bin/bash

# Fix Workload Identity Federation for GitHub Actions
# This script configures Google Cloud Workload Identity Pool to allow GitHub Actions

set -e

# Variables
PROJECT_ID="lauren-staging"
PROJECT_NUMBER="458046725650"
POOL_NAME="github"
PROVIDER_NAME="github-oidc-provider"
SERVICE_ACCOUNT="github-workflow@lauren-staging.iam.gserviceaccount.com"
GITHUB_REPO="YOUR_GITHUB_ORG/woori-front"  # ⚠️ REPLACE THIS WITH YOUR ACTUAL REPO

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fixing Workload Identity Federation ===${NC}"
echo ""

# Step 1: Check if Workload Identity Pool exists
echo -e "${YELLOW}[1/6] Checking Workload Identity Pool...${NC}"
if gcloud iam workload-identity-pools describe $POOL_NAME \
  --project=$PROJECT_ID \
  --location=global &>/dev/null; then
  echo -e "${GREEN}✓ Pool '$POOL_NAME' exists${NC}"
else
  echo -e "${RED}✗ Pool '$POOL_NAME' not found. Creating...${NC}"
  gcloud iam workload-identity-pools create $POOL_NAME \
    --project=$PROJECT_ID \
    --location=global \
    --display-name="GitHub Actions Pool"
  echo -e "${GREEN}✓ Pool created${NC}"
fi
echo ""

# Step 2: Check if provider exists
echo -e "${YELLOW}[2/6] Checking OIDC Provider...${NC}"
if gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=$POOL_NAME &>/dev/null; then
  echo -e "${GREEN}✓ Provider '$PROVIDER_NAME' exists${NC}"
else
  echo -e "${RED}✗ Provider '$PROVIDER_NAME' not found. Creating...${NC}"
  gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
    --project=$PROJECT_ID \
    --location=global \
    --workload-identity-pool=$POOL_NAME \
    --display-name="GitHub OIDC Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="assertion.repository_owner == 'YOUR_GITHUB_ORG'" \
    --issuer-uri="https://token.actions.githubusercontent.com"
  echo -e "${GREEN}✓ Provider created${NC}"
fi
echo ""

# Step 3: Update provider attribute condition to allow your repository
echo -e "${YELLOW}[3/6] Updating provider attribute condition...${NC}"
gcloud iam workload-identity-pools providers update-oidc $PROVIDER_NAME \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=$POOL_NAME \
  --attribute-condition="assertion.repository == '$GITHUB_REPO' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')"

echo -e "${GREEN}✓ Attribute condition updated to allow:${NC}"
echo -e "  - Repository: $GITHUB_REPO"
echo -e "  - Branches: main, develop"
echo ""

# Step 4: Grant workloadIdentityUser role to service account
echo -e "${YELLOW}[4/6] Granting IAM permissions...${NC}"

# For main branch
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT \
  --project=$PROJECT_ID \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$GITHUB_REPO"

echo -e "${GREEN}✓ IAM binding added for repository: $GITHUB_REPO${NC}"
echo ""

# Step 5: Verify configuration
echo -e "${YELLOW}[5/6] Verifying configuration...${NC}"
echo ""
echo -e "${GREEN}Provider details:${NC}"
gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
  --project=$PROJECT_ID \
  --location=global \
  --workload-identity-pool=$POOL_NAME \
  --format="table(name,state,attributeCondition)"
echo ""

echo -e "${GREEN}Service account IAM policy:${NC}"
gcloud iam service-accounts get-iam-policy $SERVICE_ACCOUNT \
  --project=$PROJECT_ID \
  --format=json | grep -A 5 "workloadIdentityUser" || echo "No workloadIdentityUser binding found"
echo ""

# Step 6: Test configuration
echo -e "${YELLOW}[6/6] Configuration complete!${NC}"
echo ""
echo -e "${GREEN}=== Next Steps ===${NC}"
echo -e "1. Update this script and replace:"
echo -e "   ${YELLOW}GITHUB_REPO=\"YOUR_GITHUB_ORG/woori-front\"${NC}"
echo -e "   with your actual GitHub organization and repository name"
echo ""
echo -e "2. Re-run this script after updating the GITHUB_REPO variable"
echo ""
echo -e "3. Test by pushing to main or develop branch"
echo ""
echo -e "${GREEN}=== Configuration Summary ===${NC}"
echo -e "Project ID: $PROJECT_ID"
echo -e "Project Number: $PROJECT_NUMBER"
echo -e "Workload Identity Pool: $POOL_NAME"
echo -e "Provider: $PROVIDER_NAME"
echo -e "Service Account: $SERVICE_ACCOUNT"
echo -e "Allowed Repository: $GITHUB_REPO"
echo -e "Allowed Branches: main, develop"
echo ""
echo -e "${GREEN}✓ Done!${NC}"
