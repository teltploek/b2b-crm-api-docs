# B2B CRM API Documentation

This is a documentation site for the B2B CRM Dashboard API endpoints. It serves as a communication tool between frontend and backend developers to align on API structure and payloads.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Setting up Subdomain Deployment

To deploy this documentation on a subdomain (e.g., `docs.yourdomain.com`):

1. **Deploy to Vercel:**
   - Push this `api-docs` directory to your repository
   - In Vercel, create a new project and import this repository
   - Set the root directory to `api-docs` during import

2. **Configure the Subdomain:**
   - Go to your project settings in Vercel
   - Navigate to "Domains" section
   - Add your subdomain (e.g., `docs.yourdomain.com`)
   - Follow Vercel's instructions to configure DNS

3. **Environment Variables (if needed):**
   - No environment variables are required for this static documentation

The documentation will automatically rebuild and deploy when you push changes to the repository.
