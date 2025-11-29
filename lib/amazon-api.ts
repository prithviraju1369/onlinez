import { Product, SearchParams } from '@/types/product';

// This is a mock implementation since Amazon Product Advertising API requires
// authentication and complex signing. In production, you would implement
// the actual API calls with proper HMAC-SHA256 signing.

const MOCK_PRODUCTS: Product[] = [
  {
    asin: 'B08N5WRWNW',
    title: 'Apple AirPods Pro (2nd Generation)',
    price: {
      value: 249.99,
      currency: 'USD',
      displayAmount: '$249.99',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop',
      },
    },
    rating: 4.7,
    reviewCount: 15420,
    isPrime: true,
    detailPageURL: 'https://amazon.com/dp/B08N5WRWNW',
    availability: 'In Stock',
    brand: 'Apple',
    features: [
      'Active Noise Cancellation',
      'Adaptive Transparency',
      'Personalized Spatial Audio',
      'Up to 6 hours listening time',
    ],
  },
  {
    asin: 'B0CX23V2ZK',
    title: 'Kindle Paperwhite (16 GB) – Now with a larger display',
    price: {
      value: 159.99,
      currency: 'USD',
      displayAmount: '$159.99',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1592422546632-48d39e7d8c73?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1592422546632-48d39e7d8c73?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1592422546632-48d39e7d8c73?w=800&h=800&fit=crop',
      },
    },
    rating: 4.6,
    reviewCount: 8934,
    isPrime: true,
    detailPageURL: 'https://amazon.com/dp/B0CX23V2ZK',
    availability: 'In Stock',
    brand: 'Amazon',
    features: [
      '6.8" display',
      'Waterproof (IPX8)',
      'Weeks of battery life',
      '16 GB storage',
    ],
  },
  {
    asin: 'B0D1XD1ZV3',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: {
      value: 398.00,
      currency: 'USD',
      displayAmount: '$398.00',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
      },
    },
    rating: 4.8,
    reviewCount: 5623,
    isPrime: false,
    detailPageURL: 'https://amazon.com/dp/B0D1XD1ZV3',
    availability: 'In Stock',
    brand: 'Sony',
    features: [
      'Industry-leading noise cancellation',
      'Up to 30-hour battery life',
      'Crystal clear hands-free calling',
      'Multipoint connection',
    ],
  },
  {
    asin: 'B09G9FPHY6',
    title: 'Samsung Galaxy Tab S9 11" 128GB WiFi Tablet',
    price: {
      value: 679.99,
      currency: 'USD',
      displayAmount: '$679.99',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
      },
    },
    rating: 4.5,
    reviewCount: 3201,
    isPrime: true,
    detailPageURL: 'https://amazon.com/dp/B09G9FPHY6',
    availability: 'In Stock',
    brand: 'Samsung',
    features: [
      '11" Dynamic AMOLED 2X Display',
      'IP68 Water & Dust Resistant',
      'S Pen included',
      'Qualcomm Snapdragon processor',
    ],
  },
  {
    asin: 'B0BSHF7WHW',
    title: 'Anker PowerCore 20000mAh Portable Charger',
    price: {
      value: 49.99,
      currency: 'USD',
      displayAmount: '$49.99',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
      },
    },
    rating: 4.7,
    reviewCount: 12450,
    isPrime: true,
    detailPageURL: 'https://amazon.com/dp/B0BSHF7WHW',
    availability: 'In Stock',
    brand: 'Anker',
    features: [
      '20000mAh capacity',
      'Fast charging technology',
      'Dual USB ports',
      'Premium build quality',
    ],
  },
  {
    asin: 'B08XYKHSJQ',
    title: 'Logitech MX Master 3S Wireless Mouse',
    price: {
      value: 99.99,
      currency: 'USD',
      displayAmount: '$99.99',
    },
    images: {
      primary: {
        small: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
        large: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
      },
    },
    rating: 4.8,
    reviewCount: 9876,
    isPrime: true,
    detailPageURL: 'https://amazon.com/dp/B08XYKHSJQ',
    availability: 'In Stock',
    brand: 'Logitech',
    features: [
      'Quiet clicks',
      '8K DPI sensor',
      'Ergonomic design',
      'USB-C rechargeable',
    ],
  },
];

export async function searchProducts(params: SearchParams): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let results = [...MOCK_PRODUCTS];
  
  // Filter by keywords
  if (params.keywords) {
    const keywords = params.keywords.toLowerCase();
    results = results.filter(product => 
      product.title.toLowerCase().includes(keywords) ||
      product.brand?.toLowerCase().includes(keywords)
    );
  }
  
  // Filter by price range
  if (params.minPrice !== undefined) {
    results = results.filter(product => 
      product.price && product.price.value >= params.minPrice!
    );
  }
  
  if (params.maxPrice !== undefined) {
    results = results.filter(product => 
      product.price && product.price.value <= params.maxPrice!
    );
  }
  
  return results;
}

export async function getProductByASIN(asin: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = MOCK_PRODUCTS.find(p => p.asin === asin);
  return product || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return first 4 products as featured
  return MOCK_PRODUCTS.slice(0, 4);
}

// Note: To integrate with real Amazon Product Advertising API:
// 1. Sign up for Amazon Associates Program
// 2. Get API credentials (Access Key, Secret Key, Partner Tag)
// 3. Install aws4 or similar package for request signing
// 4. Implement proper HMAC-SHA256 signing for API requests
// 5. Replace mock functions with actual API calls

