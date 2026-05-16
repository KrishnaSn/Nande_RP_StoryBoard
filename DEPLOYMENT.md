# 🚀 Nande RP StoryBoard: Deployment Guide (Free Tier)

This guide outlines how to deploy the Nande RP StoryBoard for up to 10 users using free-tier services.

## 1. Version Control (Git)
Before deploying, you should commit your changes. Using a feature branch is best practice.

```bash
# Create and switch to a new branch
git checkout -b feature/cloud-deployment

# Stage all changes
git add .

# Commit changes
git commit -m "feat: add cloud deployment support and postgres migration"

# Push to your GitHub repository
git push origin feature/cloud-deployment
```
*After verifying the build, you can merge this into `main` on GitHub via a Pull Request.*

## 2. Infrastructure Setup (Free Services)

### A. Database: Neon (PostgreSQL)
Since we can't use SQLite in the cloud for multiple users, we'll use **Neon.tech**.
1. Create a free account at [Neon.tech](https://neon.tech).
2. Create a new project named `nande-storyboard`.
3. Copy the **Connection String** (it looks like `postgresql://user:password@ep-host.region.aws.neon.tech/neondb`).
4. **Save this string; you'll need it for the backend.**

### B. Backend: Render
Render will host your FastAPI server.
1. Create a free account at [Render.com](https://render.com).
2. Click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following:
   - **Name:** `nande-backend`
   - **Environment:** `Python`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. **Environment Variables (Crucial):**
   - `DATABASE_URL`: (The connection string from Neon)
6. Copy your Render URL (e.g., `https://nande-backend.onrender.com`).

### C. Frontend: Netlify
Netlify will host your Next.js frontend.
1. Create a free account at [Netlify.com](https://netlify.com).
2. Click **Add new site > Import from existing project**.
3. Connect your GitHub repository.
4. Set the following:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `frontend/.next` (Netlify usually auto-detects this for Next.js)
5. **Environment Variables (Crucial):**
   - `NEXT_PUBLIC_API_URL`: `https://your-render-url.onrender.com/api`
   - `NEXT_PUBLIC_BASE_URL`: `https://your-render-url.onrender.com`

## 3. Handling Image Uploads (Cloud)
In the cloud, Render's disk is "ephemeral" (it wipes on every restart). For 10 users, you have two choices:
1. **Quick Fix:** Keep using the current logic, but images will disappear when the backend restarts.
2. **Proper Fix (Recommended):** Use [Cloudinary](https://cloudinary.com) or [UploadThing](https://uploadthing.com) for permanent image storage. (I can help you implement this next).

## 4. Multi-User Note
Currently, the app stores data per "Episode ID". If 10 users log in, they will all see the same episodes. In Phase 5, we should add **Google Auth** so each user has their own private workspace.
