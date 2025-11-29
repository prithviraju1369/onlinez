export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Onlinez.ai - Amazon Associates Affiliate Program
          </p>
          <p className="text-xs text-gray-500 mt-2">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}

