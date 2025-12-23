# Deploying to Render

## Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment config"
   git push origin main
   ```

2. **Go to Render.com**
   - Sign up/login at https://render.com
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

3. **Deploy Backend Service**
   - Name: `collab-board-backend`
   - Root Directory: leave blank
   - Build Command: `npm install`
   - Start Command: `npm run prod`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `REACT_APP_URL`: (Set after frontend is deployed)
   - Click "Create Web Service"

4. **Deploy Frontend Service**
   - Click "New +" and select "Static Site"
   - Connect same GitHub repo
   - Name: `collab-board-frontend`
   - Build Command: `npm install && npm run build`
   - Publish directory: `build`
   - Environment Variables:
     - `REACT_APP_BACKEND_URL`: Use the backend URL from step 3
   - Click "Create Static Site"

5. **Update Backend Environment Variable**
   - Go back to backend service settings
   - Update `REACT_APP_URL` with your frontend URL
   - Redeploy backend

---

## Option 2: Manual Deployment (Separate Services)

### Deploy Backend:
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set these values:
   - **Name**: collab-board-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run prod`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     REACT_APP_URL=https://your-frontend-url.onrender.com
     ```
4. Deploy

### Deploy Frontend:
1. Create new Static Site on Render
2. Connect GitHub repo
3. Set these values:
   - **Name**: collab-board-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     ```
     REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
     ```
4. Deploy

---

## After Deployment

Your app will be live at:
- **Frontend**: https://collab-board-frontend.onrender.com
- **Backend**: https://collab-board-backend.onrender.com

Note: Free tier services on Render spin down after 15 minutes of inactivity, so the first request may take a few seconds.

---

## Troubleshooting

### Frontend can't connect to backend:
- Check that `REACT_APP_BACKEND_URL` environment variable is set correctly
- Make sure backend `REACT_APP_URL` matches frontend URL

### WebSocket connection errors:
- Check browser console for errors
- Verify CORS origin settings match
- Ensure backend is running

### Build fails:
- Check Render logs for build errors
- Make sure all dependencies are in package.json
- Verify node version is compatible
