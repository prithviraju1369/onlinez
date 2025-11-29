# 🚀 Quick Start Guide

Get your Onlinez.ai e-commerce platform running in under 5 minutes!

## Prerequisites Checklist
- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Code editor (VS Code recommended)

## Start Development Server

```bash
# Navigate to project
cd /Users/prithvirajuuppalapati/Documents/onlinez.ai

# Start dev server (dependencies already installed)
npm run dev
```

## Access Your App

Open your browser and visit:
- **Home Page**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **About**: http://localhost:3000/about

## What You'll See

### 🏠 Home Page
- Beautiful hero section with search
- Featured products grid
- Call-to-action sections

### 🛍️ Products Page
- Browse all products
- Search functionality
- Responsive product grid

### 📱 Product Details
- Click any product to see details
- View ratings, reviews, features
- Direct Amazon affiliate links

## Making Changes

### Update Mock Products
Edit: `lib/amazon-api.ts`
- Change the `MOCK_PRODUCTS` array
- Add/remove products
- Update product details

### Customize Styling
- Colors: `tailwind.config.ts`
- Components: `components/*.tsx`
- Global styles: `app/globals.css`

### Add New Pages
```bash
# Create a new page
mkdir -p app/your-page
touch app/your-page/page.tsx
```

## Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## Next Steps

1. **Set up Amazon Associates**
   - Sign up at https://affiliate-program.amazon.com/
   - Get API credentials
   - Add to `.env.local` file

2. **Deploy to Vercel**
   - Push code to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

3. **Customize Content**
   - Update branding in `components/Header.tsx`
   - Add your own product categories
   - Customize the About page

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
```

## Need Help?

- 📖 **Full Documentation**: See `README.md`
- 🔧 **Detailed Setup**: See `docs/SETUP_GUIDE.md`
- 🤝 **Contributing**: See `CONTRIBUTING.md`
- 🐛 **Issues**: Open a GitHub issue

## Tips

- The app currently uses **mock data** for demonstration
- To use **real Amazon products**, follow the setup guide
- All pages are **fully responsive** and work on mobile
- **Tailwind CSS** is used for all styling
- **TypeScript** provides type safety

---

**You're all set!** Start exploring and customizing your e-commerce platform. 🎉

