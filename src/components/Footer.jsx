// components/Footer.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaArrowRight,
  FaArrowUp,
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCopyright,
} from 'react-icons/fa';
import { FaProjectDiagram } from 'react-icons/fa';
import { HiOutlineBadgeCheck } from 'react-icons/hi';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | loading | success | error
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Handle Back to Top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    // Simulate API call – replace with your actual endpoint
    try {
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) throw new Error('Subscription failed');
      
      // Simulate success after 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNewsletterStatus('success');
      setNewsletterMessage('Thanks for subscribing! 🎉');
      setEmail('');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 5000);
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 4000);
    }
  };

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Back to top"
        >
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition" />
        </button>
      )}

      <footer className="relative bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 border-t border-gray-200/80">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNjY2NjY2MiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0di00aDR2NGgtNHptMCAwdjRoNHYtNGgtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Brand Column */}
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <FaProjectDiagram className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  Gemnixx
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-600 max-w-xs leading-relaxed">
                Smart project management for modern teams. 
                Plan, track, and deliver with confidence — all in one place.
              </p>

              {/* Contact Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaEnvelope className="w-4 h-4 text-indigo-500" />
                  <a href="mailto:support@gemnixx.com" className="hover:text-indigo-600 transition">
                    support@gemnixx.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaPhone className="w-4 h-4 text-indigo-500" />
                  <a href="tel:+1234567890" className="hover:text-indigo-600 transition">
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaMapMarkerAlt className="w-4 h-4 text-indigo-500" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-5 flex gap-2">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-600 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-sm hover:shadow-md"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-600 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-rotate-6 shadow-sm hover:shadow-md"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-600 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 shadow-sm hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-600 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-rotate-6 shadow-sm hover:shadow-md"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links - Product */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Product
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links - Company */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links - Resources */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Resources
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-indigo-600 transition hover:translate-x-1 inline-block">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter / CTA */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Stay Updated
              </h4>
              <p className="mt-2 text-sm text-gray-500">
                Subscribe to get product updates and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {newsletterStatus === 'loading' ? (
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      ) : (
                        <>
                          Subscribe
                          <FaArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                  {newsletterMessage && (
                    <p className={`text-xs mt-1 ${
                      newsletterStatus === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {newsletterMessage}
                    </p>
                  )}
                </div>
              </form>
              <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                <FaLock className="w-3 h-3" />
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-6 border-t border-gray-200/70">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaShieldAlt className="w-5 h-5 text-emerald-500" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineBadgeCheck className="w-5 h-5 text-blue-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaLock className="w-5 h-5 text-indigo-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaRegCopyright className="w-5 h-5 text-gray-400" />
                <span>100% Cloud-based</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <FaRegCopyright className="w-3 h-3" />
              {currentYear} Gemnixx. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link to="#" className="text-gray-400 hover:text-indigo-600 transition">
                Privacy Policy
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="#" className="text-gray-400 hover:text-indigo-600 transition">
                Terms of Service
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="#" className="text-gray-400 hover:text-indigo-600 transition">
                Cookie Policy
              </Link>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-xs">
                Made with ❤️ by Gemnixx Team
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}