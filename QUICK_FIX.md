# 🚀 Quick Fix for Workload Identity Error

## ⚡ Fastest Solution

Run this ONE command (replace `YOUR_ORG` with your GitHub organization name):

```bash
# Example: If your repo is https://github.com/mycompany/woori-front
# Then YOUR_ORG is "mycompany"

GITHUB_ORG="YOUR_ORG" && \
gcloud iam workload-identity-pools providers update-oidc github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github \
  --attribute-condition="assertion.repository == '$GITHUB_ORG/woori-front' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')" && \
gcloud iam service-accounts add-iam-policy-binding \
  github-workflow@lauren-staging.iam.gserviceaccount.com \
  --project=lauren-staging \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/458046725650/locations/global/workloadIdentityPools/github/attribute.repository/$GITHUB_ORG/woori-front" && \
echo "✅ Fixed! Now try pushing to main or develop branch."
```

## 📝 Step-by-Step Instructions

### 1. Find Your GitHub Organization

Go to your repository URL:
- Example: `https://github.com/mycompany/woori-front`
- Your organization is: `mycompany`

### 2. Authenticate to Google Cloud

```bash
gcloud auth login
gcloud config set project lauren-staging
```

### 3. Run the Fix

**Option A - Single Command** (Recommended):

Replace `mycompany` with your actual GitHub organization:

```bash
GITHUB_ORG="mycompany"

gcloud iam workload-identity-pools providers update-oidc github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github \
  --attribute-condition="assertion.repository == '$GITHUB_ORG/woori-front' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')"

gcloud iam service-accounts add-iam-policy-binding \
  github-workflow@lauren-staging.iam.gserviceaccount.com \
  --project=lauren-staging \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/458046725650/locations/global/workloadIdentityPools/github/attribute.repository/$GITHUB_ORG/woori-front"
```

**Option B - Use the Script**:

```bash
# 1. Edit the script
nano scripts/fix-workload-identity.sh
# Change line 14: GITHUB_REPO="YOUR_GITHUB_ORG/woori-front"

# 2. Make executable
chmod +x scripts/fix-workload-identity.sh

# 3. Run
./scripts/fix-workload-identity.sh
```

### 4. Test

Push to develop or main branch:

```bash
git push origin develop
# OR
git push origin main
```

Check GitHub Actions - it should work now! ✅

## ❓ Still Not Working?

### Check Your Repository Name

```bash
# This should show your repo info
gh repo view
```

### Verify the Fix

```bash
# Check provider configuration
gcloud iam workload-identity-pools providers describe github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github \
  --format="value(attributeCondition)"

# Should output something like:
# assertion.repository == 'mycompany/woori-front' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')
```

### Check Service Account Permissions

```bash
gcloud iam service-accounts get-iam-policy \
  github-workflow@lauren-staging.iam.gserviceaccount.com \
  --project=lauren-staging \
  --format=json | grep workloadIdentityUser
```

## 📚 Full Documentation

See `docs/fix-workload-identity-federation.md` for detailed explanation.

## 🆘 Need Help?

1. Check GitHub Actions logs for error details
2. Verify your GitHub organization name is correct
3. Make sure you have the required Google Cloud permissions:
   - `roles/iam.workloadIdentityPoolAdmin`
   - `roles/iam.serviceAccountAdmin`

## ✅ Success Indicators

After the fix:
- ✅ GitHub Actions workflow completes without auth errors
- ✅ Docker image pushes to Artifact Registry
- ✅ Cloud Run deployment succeeds
- ✅ You see "Service URL: https://..." in the logs
