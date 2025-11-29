import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductGrid from '@/components/ProductGrid';
import { searchProducts } from '@/lib/amazon-api';
import { SearchParams } from '@/types/product';

interface ProductsPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function ProductResults({ query }: { query?: string }) {
  const params: SearchParams = {
    keywords: query,
  };
  
  const products = await searchProducts(params);

  return (
    <div>
      {query && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">{query}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
      <ProductGrid products={products} />
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {query ? 'Search Results' : 'All Products'}
          </h1>
          <SearchBar />
        </div>

        {/* Products */}
        <Suspense fallback={<ProductsLoading />}>
          <ProductResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}

