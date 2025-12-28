# Deployment Guide

This app is configured to deploy to both **GitHub Pages** and **Vercel**.

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access your app**:
   - Your app will be available at: `https://aniltv06.github.io/mathplay/`

### Manual Deployment

```bash
# Build for GitHub Pages
npm run build:github

# The dist folder contains your built app
# Push the dist folder to gh-pages branch manually if needed
```

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

## Configuration Files

- **vite.config.js**: Handles base path for GitHub Pages vs Vercel
- **vercel.json**: Vercel-specific configuration
- **package.json**: Build scripts for both platforms
- **.github/workflows/deploy.yml**: GitHub Actions workflow
- **public/.nojekyll**: Prevents Jekyll processing on GitHub Pages

## Environment Variables

Both platforms automatically handle the base path:
- GitHub Pages: `/mathplay/`
- Vercel: `/`

No additional environment variables are needed.

## Troubleshooting

### GitHub Pages shows 404
- Ensure GitHub Actions workflow has run successfully
- Check that "GitHub Actions" is selected as the source in Pages settings

### Vercel build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try running `npm run build` locally first

### Assets not loading
- Check browser console for path errors
- Verify base path configuration in `vite.config.js`
