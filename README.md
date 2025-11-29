# Onlinez.ai - Amazon Associates E-commerce Platform

A modern, responsive e-commerce web application built with Next.js 16 that integrates with Amazon Associates to showcase and recommend products. This application provides a beautiful user interface for browsing, searching, and discovering Amazon products.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🛍️ **Product Discovery**: Browse and search through a curated selection of Amazon products
- 🔍 **Advanced Search**: Search products by keywords with real-time filtering
- 📱 **Responsive Design**: Fully responsive UI that works seamlessly on all devices
- ⚡ **Fast Performance**: Built with Next.js 16 for optimal performance and SEO
- 🎨 **Modern UI**: Beautiful, clean interface using Tailwind CSS
- ⭐ **Product Ratings**: Display Amazon product ratings and review counts
- 🚚 **Prime Badge**: Highlight Amazon Prime eligible products
- 🔗 **Affiliate Links**: Integrated with Amazon Associates for monetization

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Image Optimization**: Next.js Image Component

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn package manager
- Git

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd onlinez.ai
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Amazon Associates credentials:

```env
NEXT_PUBLIC_AMAZON_ACCESS_KEY=your_access_key_here
NEXT_PUBLIC_AMAZON_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_AMAZON_PARTNER_TAG=your_partner_tag_here
NEXT_PUBLIC_AMAZON_REGION=us-east-1
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔐 Amazon Associates Setup

To integrate with the Amazon Product Advertising API:

1. **Sign up for Amazon Associates**
   - Visit [Amazon Associates](https://affiliate-program.amazon.com/)
   - Create an account and complete the application

2. **Get API Credentials**
   - Navigate to Product Advertising API
   - Generate your Access Key and Secret Key
   - Note your Partner Tag (Associate ID)

3. **Implement Real API Integration**

Currently, the app uses mock data for demonstration. To integrate with the real Amazon Product Advertising API:

- Install the required package for API signing:
  ```bash
  npm install aws4
  ```

- Update `lib/amazon-api.ts` to implement actual API calls with proper HMAC-SHA256 signing
- Follow [Amazon's PA API 5.0 documentation](https://webservices.amazon.com/paapi5/documentation/)

## 📁 Project Structure

```
onlinez.ai/
├── app/                      # Next.js app directory
│   ├── about/               # About page
│   ├── product/[asin]/      # Individual product pages
│   ├── products/            # Products listing page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── not-found.tsx        # 404 page
├── components/              # React components
│   ├── Footer.tsx           # Footer component
│   ├── Header.tsx           # Header component
│   ├── ProductCard.tsx      # Product card component
│   ├── ProductGrid.tsx      # Product grid layout
│   └── SearchBar.tsx        # Search component
├── lib/                     # Utility libraries
│   └── amazon-api.ts        # Amazon API integration
├── types/                   # TypeScript type definitions
│   └── product.ts           # Product-related types
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:

- **Colors**: Edit `tailwind.config.ts` to change the color scheme
- **Components**: Modify component files in the `components/` directory
- **Layout**: Update `app/layout.tsx` for global layout changes

### Product Categories

To add product categories:

1. Update the `SearchParams` interface in `types/product.ts`
2. Implement category filtering in `lib/amazon-api.ts`
3. Add category navigation in the UI

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Netlify CLI or GitHub integration
- **AWS Amplify**: Connect your repository and deploy
- **Docker**: Build a Docker container using the provided Dockerfile

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚖️ License & Compliance

### Amazon Associates Compliance

This project is built to comply with Amazon Associates Program policies:

- All product links include proper affiliate tags
- Disclosure statements are displayed on product pages
- Product information is fetched from Amazon's API
- Pricing and availability disclaimers are included

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For questions or support, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- [Amazon Associates](https://affiliate-program.amazon.com/) - Affiliate program
- [Unsplash](https://unsplash.com/) - Product placeholder images

## 🔮 Future Enhancements

- [ ] User authentication and wishlists
- [ ] Product comparison feature
- [ ] Advanced filtering (price range, ratings, etc.)
- [ ] Product recommendations based on browsing history
- [ ] Newsletter subscription
- [ ] Blog/Content section for SEO
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Analytics dashboard

---

**Disclaimer**: This application is a participant in the Amazon Associates Program. Prices and availability of products are subject to change. Please verify on Amazon.com before making a purchase.

Made with ❤️ using Next.js and Amazon Associates
