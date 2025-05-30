# Deployment Guide

## Pre-deployment Checklist

1. **Environment Variables Setup**
   Create these environment variables in your deployment platform:
   ```env
   JWT_SECRET=your-secure-random-string-here
   SESSION_SECRET=another-secure-random-string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
   NODE_ENV=production
   ```

2. **Generate Admin Password Hash**
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 10))"
   ```

## Vercel Deployment

### Step 1: Prepare Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial Astro migration"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Astro configuration
5. Add environment variables in the Environment Variables section
6. Click "Deploy"

### Step 3: Configure Domain (Optional)
1. In your Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain if you have one

## Alternative Deployment Options

### Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### Railway
1. Connect GitHub repo to Railway
2. Railway will auto-detect settings
3. Add environment variables
4. Deploy

### Render
1. Create new web service
2. Connect GitHub repo
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

## Post-Deployment

### Test These Features:
- [ ] Homepage loads correctly
- [ ] All pages (About, Resume, Projects, Contact) work
- [ ] Contact form submissions work
- [ ] Admin login works (`/admin/login`)
- [ ] Admin dashboard shows statistics
- [ ] Project and resume cards open modals
- [ ] Theme switcher works

### Admin Access:
1. Visit `yoursite.com/admin/login`
2. Login with your admin credentials
3. Test creating/editing projects
4. Test uploading files (if implemented)

## Troubleshooting

### Common Issues:
1. **Database not found**: Ensure the database file is included in your repo (should be in `.gitignore` exceptions)
2. **Environment variables**: Double-check all required env vars are set
3. **Build errors**: Check the Vercel/Netlify build logs for specific errors
4. **404 errors**: Ensure all routes are properly configured

### Performance Tips:
- Enable compression in your hosting platform
- Set up CDN for static assets
- Monitor your database size

## Success!
Your Astro portfolio is now live and ready for the world to see! 🚀