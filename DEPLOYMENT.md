# Deployment Instructions for Vercel

## Step-by-Step Guide

### 1. Import the Project in Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import the GitHub repository: `teltploek/b2b-crm-api-docs`
4. In the configuration screen:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: Leave empty (the entire repo is the Next.js project)
   - **Build Settings**: Leave defaults (already configured in vercel.json)
   - **Environment Variables**: None needed

5. Click "Deploy"

### 2. Configure Custom Domain/Subdomain

After deployment:

1. Go to your project dashboard in Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain:
   - For subdomain: `docs.yourdomain.com`
   - For subdirectory: `yourdomain.com/docs`
4. Follow Vercel's DNS configuration instructions:
   - **For subdomain**: Add CNAME record pointing to `cname.vercel-dns.com`
   - **For root domain**: Add A records to Vercel's IP addresses

### 3. Verify Deployment

Once DNS propagates (usually within minutes):
- Visit your configured domain
- The documentation should be live and accessible

### Notes

- The site will automatically redeploy when you push changes to the main branch
- No environment variables or special configuration needed
- The project is configured with `vercel.json` for optimal Next.js deployment