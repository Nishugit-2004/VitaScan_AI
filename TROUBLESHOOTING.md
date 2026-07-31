# Troubleshooting Guide

Here are common issues and steps to resolve them:

## 1. TensorFlow Import Failures
- **Symptom**: `ImportError: No module named 'tensorflow'` or crash on application startup.
- **Cause**: TensorFlow wheels may not exist for your specific Python version (e.g. Python 3.14 on Windows).
- **Resolution**: Our pipeline includes a built-in fallback mock architecture that simulates matrix outputs safely. Ensure you are running Python 3.10-3.13 if you wish to build tensorflow from standard precompiled wheels.

## 2. 401 Unauthorized / Token Expiry
- **Symptom**: API calls return `401 Unauthorized`.
- **Cause**: The `access_token` in local storage has expired (default: 30 minutes) or JWT keys do not match.
- **Resolution**: Re-authenticate via the login portal or implement automatic silent refresh token requests.

## 3. Database Migration Blockers
- **Symptom**: `alembic` commands throw database locks or missing table exceptions.
- **Cause**: Schema changes that haven't been successfully registered.
- **Resolution**: Reset the sqlite db by deleting the local file `vitascan.db` (in dev), or run `alembic stamp head` followed by `alembic upgrade head`.

## 4. CORS Errors on Frontend
- **Symptom**: Next.js console reports `Blocked by CORS policy`.
- **Cause**: The server's `CORS_ORIGINS` setting does not include the frontend URL.
- **Resolution**: Update the backend environment config (or `.env` file) to match the host URL:
  ```env
  CORS_ORIGINS=http://localhost:3000
  ```
