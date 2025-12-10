# Fix Workload Identity Federation Error

## Error Message
```
Error: google-github-actions/auth failed with:
failed to generate Google Cloud federated token for
//iam.googleapis.com/projects/458046725650/locations/global/workloadIdentityPools/github/providers/github-oidc-provider:
{"error":"unauthorized_client","error_description":"The given credential is rejected by the attribute condition."}
```

## Root Cause

The error occurs because the **Workload Identity Pool attribute condition** is rejecting the GitHub Actions OIDC token. This can happen due to:

1. **Repository mismatch**: The condition only allows specific repositories
2. **Branch mismatch**: The condition only allows specific branches
3. **Missing IAM bindings**: Service account doesn't have `workloadIdentityUser` role
4. **Incorrect attribute mapping**: OIDC claims are not mapped correctly

## Solution

### Option 1: Using the Fix Script (Recommended)

1. **Edit the script** `scripts/fix-workload-identity.sh`:
   ```bash
   # Line 14: Replace with your actual GitHub repository
   GITHUB_REPO="YOUR_GITHUB_ORG/woori-front"

   # Example:
   # GITHUB_REPO="mycompany/woori-front"
   ```

2. **Make the script executable**:
   ```bash
   chmod +x scripts/fix-workload-identity.sh
   ```

3. **Authenticate to Google Cloud**:
   ```bash
   gcloud auth login
   gcloud config set project lauren-staging
   ```

4. **Run the script**:
   ```bash
   ./scripts/fix-workload-identity.sh
   ```

### Option 2: Manual Fix

#### Step 1: Update Workload Identity Provider Attribute Condition

```bash
gcloud iam workload-identity-pools providers update-oidc github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github \
  --attribute-condition="assertion.repository == 'YOUR_ORG/woori-front' && (assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')"
```

**⚠️ Important**: Replace `YOUR_ORG/woori-front` with your actual GitHub organization and repository name.

#### Step 2: Grant IAM Permissions

```bash
gcloud iam service-accounts add-iam-policy-binding \
  github-workflow@lauren-staging.iam.gserviceaccount.com \
  --project=lauren-staging \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/458046725650/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_ORG/woori-front"
```

#### Step 3: Verify Configuration

```bash
# Check provider configuration
gcloud iam workload-identity-pools providers describe github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github

# Check service account IAM policy
gcloud iam service-accounts get-iam-policy \
  github-workflow@lauren-staging.iam.gserviceaccount.com \
  --project=lauren-staging
```

## How to Find Your GitHub Repository Name

1. Go to your GitHub repository
2. The repository name is in the format: `https://github.com/ORGANIZATION/REPOSITORY`
   - Example: `https://github.com/mycompany/woori-front`
   - Repository name: `mycompany/woori-front`

## Verification

After applying the fix:

1. **Push to develop branch**:
   ```bash
   git push origin develop
   ```
   - Check GitHub Actions workflow: Should deploy to `woori-dev-front`

2. **Push to main branch**:
   ```bash
   git push origin main
   ```
   - Check GitHub Actions workflow: Should deploy to production

## Understanding the Configuration

### Current Setup

**Workload Identity Pool**: `github`
- **Project**: `lauren-staging` (458046725650)
- **Location**: `global`

**OIDC Provider**: `github-oidc-provider`
- **Issuer**: `https://token.actions.githubusercontent.com`
- **Audience**: Auto-configured by Google

**Service Account**: `github-workflow@lauren-staging.iam.gserviceaccount.com`
- Used by GitHub Actions to deploy to Cloud Run

### Attribute Condition

The attribute condition controls which GitHub repositories and branches can authenticate:

```
assertion.repository == 'YOUR_ORG/woori-front' &&
(assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/develop')
```

This means:
- ✅ **Allowed**: Pushes from `YOUR_ORG/woori-front` repository
- ✅ **Allowed**: Only `main` and `develop` branches
- ❌ **Rejected**: Any other repository
- ❌ **Rejected**: Any other branch

### Attribute Mapping

OIDC token claims are mapped to Google Cloud attributes:

| GitHub OIDC Claim | Google Cloud Attribute |
|-------------------|------------------------|
| `sub` | `google.subject` |
| `actor` | `attribute.actor` |
| `repository` | `attribute.repository` |
| `repository_owner` | `attribute.repository_owner` |

## Troubleshooting

### Error: "Pool not found"

**Solution**: Create the Workload Identity Pool first:
```bash
gcloud iam workload-identity-pools create github \
  --project=lauren-staging \
  --location=global \
  --display-name="GitHub Actions Pool"
```

### Error: "Provider not found"

**Solution**: Create the OIDC provider:
```bash
gcloud iam workload-identity-pools providers create-oidc github-oidc-provider \
  --project=lauren-staging \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub OIDC Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### Error: "Permission denied"

**Solution**: Make sure you have the required permissions:
```bash
# Check your current permissions
gcloud projects get-iam-policy lauren-staging \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:YOUR_EMAIL"

# Required roles:
# - roles/iam.workloadIdentityPoolAdmin
# - roles/iam.serviceAccountAdmin
```

### Still getting errors?

1. **Check GitHub Actions logs** for detailed error messages
2. **Verify repository name** is correct (case-sensitive!)
3. **Check branch name** matches exactly (`main` vs `master`)
4. **Wait 1-2 minutes** after applying changes for propagation

## References

- [Google Cloud Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [google-github-actions/auth](https://github.com/google-github-actions/auth)

## Related Files

- `.github/workflows/dev.yml` - Development deployment workflow
- `.github/workflows/prod.yml` - Production deployment workflow
- `scripts/fix-workload-identity.sh` - Automated fix script
