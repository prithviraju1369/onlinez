import { getProductByASIN } from '@/lib/amazon-api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Check, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ asin: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductByASIN(resolvedParams.asin);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-blue-600 hover:underline">
            Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="relative h-96 lg:h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.primary.large || '/placeholder.png'}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {product.isPrime && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md font-semibold">
                  Prime
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {product.rating}
                  </span>
                  {product.reviewCount && (
                    <span className="text-gray-600">
                      ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Divider */}
              <hr className="my-6" />

              {/* Price */}
              <div className="mb-6">
                {product.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {product.price.displayAmount}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Price not available</span>
                )}
              </div>

              {/* Availability */}
              {product.availability && (
                <div className="mb-6">
                  <div className={`flex items-center gap-2 ${
                    product.availability.toLowerCase().includes('stock')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">{product.availability}</span>
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Divider */}
              <hr className="my-6" />

              {/* Buy Button */}
              <div className="mt-auto space-y-3">
                <a
                  href={product.detailPageURL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
                >
                  <ShoppingCart className="w-6 h-6" />
                  View on Amazon
                </a>
                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Amazon.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Amazon Associates Disclosure
          </h3>
          <p className="text-blue-800 text-sm">
            As an Amazon Associate, we earn from qualifying purchases. This means we may receive a small commission when you make a purchase through our links, at no additional cost to you.
          </p>
        </div>
      </div>
    </div>
  );
}

