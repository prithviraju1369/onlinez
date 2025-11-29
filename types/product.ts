export interface Product {
  asin: string;
  title: string;
  price?: {
    value: number;
    currency: string;
    displayAmount: string;
  };
  images?: {
    primary: {
      small: string;
      medium: string;
      large: string;
    };
  };
  rating?: number;
  reviewCount?: number;
  isPrime?: boolean;
  detailPageURL: string;
  availability?: string;
  brand?: string;
  features?: string[];
}

export interface SearchParams {
  keywords?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}

export interface AmazonAPIConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  region: string;
}

