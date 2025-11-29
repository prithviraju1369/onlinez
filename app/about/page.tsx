import { Info, Target, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About Onlinez.ai
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to Onlinez.ai, your trusted destination for discovering amazing products from Amazon. We're dedicated to helping you find the best deals and top-rated products across various categories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To simplify online shopping by curating the best products and providing honest, helpful information.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Community</h3>
                <p className="text-gray-600">
                  Join thousands of smart shoppers who trust our product recommendations.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
                <p className="text-gray-600">
                  We carefully select products based on ratings, reviews, and customer satisfaction.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Amazon Associates Program
            </h2>
            <p className="text-gray-700 mb-4">
              Onlinez.ai is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
            </p>
            <p className="text-gray-700 mb-4">
              When you click on a product link and make a purchase on Amazon, we may earn a small commission at no additional cost to you. This helps us maintain and improve our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              Our Commitment
            </h2>
            <p className="text-gray-700 mb-4">
              We are committed to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Providing accurate and up-to-date product information</li>
              <li>Featuring genuine customer reviews and ratings</li>
              <li>Maintaining transparency about our affiliate relationships</li>
              <li>Offering a user-friendly shopping experience</li>
              <li>Respecting your privacy and data security</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
              <p className="text-blue-900">
                <strong>Note:</strong> All product prices, availability, and details are provided by Amazon and may change at any time. Please verify on Amazon.com before making a purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

