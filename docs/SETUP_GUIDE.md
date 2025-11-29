# Complete Setup Guide for Onlinez.ai

This guide will walk you through setting up your Amazon Associates e-commerce platform from scratch.

## Quick Start (5 Minutes)

```bash
# 1. Navigate to project directory
cd /Users/prithvirajuuppalapati/Documents/onlinez.ai

# 2. Install dependencies (already done)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

## Detailed Setup

### 1. Amazon Associates Account Setup

#### Step 1: Create Amazon Associates Account
1. Visit https://affiliate-program.amazon.com/
2. Click "Sign Up" and complete the application
3. Provide website information (you can use your localhost URL initially)
4. Complete tax information
5. Wait for approval (usually 24-48 hours)

#### Step 2: Get API Credentials
1. Log into Amazon Associates Central
2. Navigate to "Tools" → "Product Advertising API"
3. Click "Request API Access" or "Manage Credentials"
4. Generate your Access Key and Secret Key
5. Note your Associate Tag (your unique tracking ID)

### 2. Environment Configuration

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_AMAZON_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
NEXT_PUBLIC_AMAZON_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
NEXT_PUBLIC_AMAZON_PARTNER_TAG=yourtag-20
NEXT_PUBLIC_AMAZON_REGION=us-east-1
```

### 3. Implementing Real Amazon API

Currently, the app uses mock data. To connect to real Amazon API:

#### Install AWS Signature Library
```bash
npm install aws4
```

#### Update `lib/amazon-api.ts`

```typescript
import aws4 from 'aws4';
import axios from 'axios';

const AWS_CONFIG = {
  accessKey: process.env.NEXT_PUBLIC_AMAZON_ACCESS_KEY!,
  secretKey: process.env.NEXT_PUBLIC_AMAZON_SECRET_KEY!,
  partnerTag: process.env.NEXT_PUBLIC_AMAZON_PARTNER_TAG!,
  region: process.env.NEXT_PUBLIC_AMAZON_REGION!,
};

const API_ENDPOINT = 'webservices.amazon.com';
const API_PATH = '/paapi5/searchitems';

async function makeAmazonAPIRequest(payload: any) {
  const request = {
    host: API_ENDPOINT,
    method: 'POST',
    url: `https://${API_ENDPOINT}${API_PATH}`,
    path: API_PATH,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'Content-Encoding': 'amz-1.0',
    },
    body: JSON.stringify(payload),
    region: AWS_CONFIG.region,
  };

  // Sign the request
  aws4.sign(request, {
    accessKeyId: AWS_CONFIG.accessKey,
    secretAccessKey: AWS_CONFIG.secretKey,
  });

  // Make the request
  const response = await axios(request);
  return response.data;
}
```

### 4. Testing Your Setup

#### Run Development Server
```bash
npm run dev
```

#### Test Pages
- Home: http://localhost:3000
- Products: http://localhost:3000/products
- Search: http://localhost:3000/products?q=headphones
- About: http://localhost:3000/about

#### Build for Production
```bash
npm run build
npm start
```

### 5. Deployment to Vercel

#### Via Vercel Dashboard
1. Push code to GitHub
2. Visit https://vercel.com
3. Click "New Project"
4. Import your repository
5. Configure environment variables
6. Click "Deploy"

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_AMAZON_ACCESS_KEY
vercel env add NEXT_PUBLIC_AMAZON_SECRET_KEY
vercel env add NEXT_PUBLIC_AMAZON_PARTNER_TAG
vercel env add NEXT_PUBLIC_AMAZON_REGION

# Deploy to production
vercel --prod
```

### 6. Amazon Associates Compliance

#### Required Elements (Already Implemented)
- ✅ Affiliate disclosure on product pages
- ✅ Proper affiliate links with tracking tags
- ✅ Price and availability disclaimers
- ✅ Links open in new tab with nofollow

#### Additional Recommendations
- Add "Last updated" timestamps for prices
- Include Amazon branding where appropriate
- Review and comply with all Associates Program policies
- Update product information regularly

### 7. SEO Optimization

#### Add Metadata to Pages
```typescript
// In your page.tsx files
export const metadata: Metadata = {
  title: 'Your Page Title - Onlinez.ai',
  description: 'Your page description for SEO',
  openGraph: {
    title: 'Your Page Title',
    description: 'Your page description',
    images: ['/og-image.jpg'],
  },
};
```

#### Create Sitemap
```bash
# Create app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
    },
    // Add more URLs
  ];
}
```

### 8. Analytics Setup

#### Google Analytics
```bash
npm install @next/third-parties
```

Add to `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### 9. Performance Optimization

#### Enable Image Optimization
Already configured in `next.config.ts`

#### Add Caching
```typescript
// In your API functions
export const revalidate = 3600; // Revalidate every hour
```

#### Enable Compression
Automatic in production build

### 10. Troubleshooting

#### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

#### API Issues
- Verify API credentials
- Check API request limits
- Review Amazon API documentation
- Enable debug logging

#### Styling Issues
```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

## Next Steps

1. ✅ Complete Amazon Associates approval
2. ✅ Implement real API integration
3. ✅ Deploy to production
4. ✅ Set up analytics
5. ✅ Submit sitemap to Google
6. ✅ Start marketing your site

## Support Resources

- **Amazon PA API Docs**: https://webservices.amazon.com/paapi5/documentation/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vercel Support**: https://vercel.com/support

## Questions?

Open an issue on GitHub or refer to the main README.md for more information.

Happy selling! 🚀

