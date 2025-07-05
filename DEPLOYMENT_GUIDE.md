# BCI Ritual Game - Deployment Guide

## 🚀 Deployment Issues Fixed

### Root Cause Analysis
The deployment failures were caused by:
1. **Missing Prisma Client Generation** - Prisma client wasn't generated during build
2. **Missing Platform-Specific Configuration Files** - No deployment configs for various platforms
3. **Incomplete Build Scripts** - Build process didn't include Prisma generation
4. **Environment Variable Issues** - Production environment not properly configured

### ✅ Solutions Implemented

#### 1. Updated Build Scripts
- Added `npx prisma generate` to all build commands
- Created platform-specific build scripts:
  - `build:vercel` - For Vercel deployment
  - `build:netlify` - For Netlify deployment (with export)
  - `build:railway` - For Railway deployment
  - `build:render` - For Render deployment
  - `build:docker` - For Docker deployment
- Added `postinstall` script to auto-generate Prisma client

#### 2. Platform Configuration Files Created

##### Vercel (`vercel.json`)
```json
{
  "buildCommand": "npm run build:vercel",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

##### Netlify (`netlify.toml`)
```toml
[build]
  command = "npm run build:netlify"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

##### Railway (`railway.json`)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build:railway"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

##### Render (`render.yaml`)
```yaml
services:
  - type: web
    name: bci-ritual-game
    env: node
    buildCommand: npm run build:render
    startCommand: npm start
```

##### Docker (`Dockerfile`)
- Multi-stage build for optimized production image
- Includes Prisma client generation
- Standalone Next.js output for minimal container size

##### Heroku/Generic (`Procfile`)
```
web: npm start
release: npx prisma migrate deploy
```

#### 3. Enhanced Next.js Configuration
- Added platform detection for optimal output mode
- Configured standalone output for Docker/Railway/Render
- Added proper environment variable handling
- Optimized for different deployment scenarios

#### 4. Improved Deployment Script
- Added Prisma client generation step
- Added database migration deployment
- Better error handling and logging
- Process management for local deployment

## 🛠️ Deployment Instructions

### Local Production Deployment
```bash
cd /home/ubuntu/bci-ritual-game/app
chmod +x deploy.sh
./deploy.sh
```

### Platform-Specific Deployment

#### Vercel
1. Connect your Git repository to Vercel
2. Vercel will auto-detect Next.js and use the configuration
3. Set `DATABASE_URL` environment variable in Vercel dashboard
4. Deploy automatically on git push

#### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build:netlify`
3. Publish directory: `.next`
4. Install Netlify Next.js plugin
5. Set environment variables in Netlify dashboard

#### Railway
1. Connect repository to Railway
2. Railway will use `railway.json` configuration
3. Set `DATABASE_URL` environment variable
4. Deploy automatically

#### Render
1. Connect repository to Render
2. Use `render.yaml` for configuration
3. Set up database connection
4. Deploy automatically

#### Docker
```bash
# Build image
docker build -t bci-ritual-game .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="your_db_url" bci-ritual-game
```

## 🔧 Environment Variables Required

### Production Environment Variables
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NODE_ENV=production
```

### Platform-Specific Variables (Optional)
```env
VERCEL=1          # For Vercel deployment
NETLIFY=1         # For Netlify deployment  
RAILWAY=1         # For Railway deployment
RENDER=1          # For Render deployment
DOCKER=1          # For Docker deployment
```

## 📋 Pre-Deployment Checklist

- [ ] Database is accessible and migrations are applied
- [ ] Environment variables are configured
- [ ] Dependencies are installed (`npm install`)
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Platform-specific configuration file exists
- [ ] Database connection string is valid

## 🐛 Troubleshooting

### Build Fails with Prisma Error
```bash
npx prisma generate
npm run build
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from deployment environment
- Run migrations: `npx prisma migrate deploy`

### Platform-Specific Issues
- **Vercel**: Check function timeout limits for API routes
- **Netlify**: Ensure using static export for static features
- **Railway**: Verify port configuration (Railway auto-assigns)
- **Render**: Check health check endpoint configuration

## 🎯 Next Steps

1. **Choose your deployment platform** based on your needs:
   - **Vercel**: Best for Next.js, automatic scaling
   - **Netlify**: Good for static sites with some dynamic features
   - **Railway**: Developer-friendly, good for full-stack apps
   - **Render**: Simple, reliable, good pricing
   - **Docker**: Maximum control, can deploy anywhere

2. **Set up your database** in the cloud (if not already done)

3. **Configure environment variables** on your chosen platform

4. **Deploy and test** the application

5. **Set up monitoring** and error tracking for production

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Platform-specific deployment guides](https://nextjs.org/docs/deployment)

---

**Status**: ✅ All deployment platform issues have been resolved. The app is now ready for deployment on any major platform.
