const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-100 to-purple-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2 text-gray-800">
              <svg
                className="w-6 h-6 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              DevTinder
            </h3>
            <p className="text-gray-600 text-sm">
              Connect with developers worldwide
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-1">
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                About Us
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                How It Works
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Success Stories
              </a>
            </nav>
          </div>

          {/* Legal & Support */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-gray-800 mb-2">Support</h4>
            <nav className="flex flex-col gap-1">
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Contact Us
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
                Terms of Service
              </a>
            </nav>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-pink-200 pt-6 mb-4">
          <div className="flex justify-center gap-4">
            {/* Twitter */}
            <a
              href="#"
              className="bg-white text-pink-500 p-2 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a
              href="#"
              className="bg-white text-pink-500 p-2 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            
            {/* GitHub */}
            <a
              href="#"
              className="bg-white text-pink-500 p-2 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            
            {/* Instagram */}
            <a
              href="#"
              className="bg-white text-pink-500 p-2 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-xs">
          <p>© {new Date().getFullYear()} DevTinder. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;