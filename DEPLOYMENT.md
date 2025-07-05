# BCI Ritual Game - Production Deployment Guide

## 🚀 Quick Deployment

The app is now configured for proper production deployment. Use the automated deployment script:

```bash
cd /home/ubuntu/bci-ritual-game/app
./deploy.sh
```

## 📋 Manual Deployment Steps

If you prefer manual deployment:

### 1. Environment Setup
```bash
# Clean problematic environment variables
unset NEXT_DIST_DIR
unset __NEXT_TEST_MODE
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start:prod
```

## 🔧 Issues Fixed

### Problem: "Could not find a production build" Error
**Root Cause:** Environment variable `NEXT_DIST_DIR=.build` was causing Next.js to build to `.build` directory but look for builds in `.next` directory during start.

**Solution:** 
- Unset problematic environment variables before build/start
- Ensured consistent build directory usage
- Added proper production scripts

### Problem: Missing BUILD_ID File
**Root Cause:** Inconsistent build directory configuration
**Solution:** Fixed environment variable conflicts

## 🌐 Production Configuration

- **Port:** 3000 (default)
- **Build Directory:** `.next` (standard Next.js)
- **Environment:** Production mode with optimizations
- **Database:** PostgreSQL (configured in .env files)

## 📁 Key Files

- `deploy.sh` - Automated deployment script
- `.env.production` - Production environment variables
- `next.config.js` - Next.js configuration
- `package.json` - Updated with production scripts

## 🔍 Verification

After deployment, verify the app is working:

1. **Server Status:** Check if server responds
   ```bash
   curl -I http://localhost:3000
   ```

2. **Browser Test:** Open http://localhost:3000
   - Dashboard should load
   - 3D Model Viewer should display
   - All navigation tabs should work
   - Brain metrics should show

## 🚨 Troubleshooting

If deployment fails:

1. **Check Environment Variables:**
   ```bash
   env | grep NEXT
   ```
   Should not show `NEXT_DIST_DIR` or `__NEXT_TEST_MODE`

2. **Verify Build Output:**
   ```bash
   ls -la .next/
   cat .next/BUILD_ID
   ```

3. **Check Server Logs:**
   ```bash
   npm run start:prod
   ```

## 🎮 App Features Verified Working

✅ BCI Dashboard with real-time visualization  
✅ 3D Model Viewer (sphere model)  
✅ Session Control (start/stop functionality)  
✅ Brain Metrics (Focus Score, Calm Score)  
✅ Navigation (Dashboard, History, Library, Settings)  
✅ Responsive UI with dark theme  
✅ Production optimizations enabled  

The BCI Ritual Game is now successfully deployed and ready for production use!
