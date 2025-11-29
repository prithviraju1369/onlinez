'use client';

import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Prime Badge */}
      {product.isPrime && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          Prime
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${product.asin}`} className="relative h-64 bg-gray-100 overflow-hidden">
        <Image
          src={product.images?.primary.large || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <Link href={`/product/${product.asin}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating}
            </span>
            {product.reviewCount && (
              <span className="text-sm text-gray-400">
                ({product.reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          {product.price ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.displayAmount}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Price not available</span>
          )}
        </div>

        {/* Availability */}
        {product.availability && (
          <p className={`text-sm mt-2 ${
            product.availability.toLowerCase().includes('stock') 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {product.availability}
          </p>
        )}

        {/* View on Amazon Button */}
        <a
          href={product.detailPageURL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-200"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
}

