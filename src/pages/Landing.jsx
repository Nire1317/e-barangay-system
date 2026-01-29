import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page bg-white text-slate-900">
      {" "}
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/200 backdrop-blur-sm border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                {" "}
                {/* Solid background for logo */}
                <span className="text-white font-extrabold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-slate-900">BOSS</span>{" "}
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-3 py-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="btn-primary px-5 py-2 text-white rounded-md font-semibold" /* Rounded-md, reduced padding */
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 float-animation"></div>{" "}
          <div
            className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 float-animation"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-indigo-500 rounded-full pulse-dot"></span>
                Now Live in Your Barangay
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-5">
                Your Barangay Services,
                <span className="gradient-text"> Simplified</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Access barangay documents and services anytime, anywhere. No
                more long queues. No more hassle. Just fast, efficient, and
                convenient online processing.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/signin"
                  className="btn-primary px-6 py-3 text-white rounded-md font-semibold text-base" /* Rounded-md, minimal padding */
                >
                  Request Document
                </Link>
                <button className="px-6 py-3 bg-white border border-slate-300 text-slate-900 rounded-md font-semibold text-base hover:bg-slate-50 hover:border-indigo-500 transition-all">
                  Learn More
                </button>
              </div>
              <div className="flex items-center gap-10 mt-12">
                <div>
                  <p className="text-3xl font-bold text-slate-900 stat-number">
                    1,250+
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    Active Users
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 stat-number">
                    3,450+
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    Documents Processed
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 stat-number">
                    98%
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    Satisfaction Rate
                  </p>
                </div>
              </div>
            </div>
            <div className="slide-in-right relative">
              <div className="relative z-10">
                <img
                  src="/BOSS.jpg"
                  alt="BOSS Dashboard Preview"
                  className="rounded-xl shadow-lg hover-lift border border-slate-300 h-180 w-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <svg
            className="w-6 h-6 text-slate-400 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div> */}
      </section>
      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need in{" "}
              <span className="gradient-text">One Place</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Streamlined services designed to make your life easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="feature-card bg-white rounded-lg p-6 hover-lift border border-slate-200 hover:border-indigo-400">
              <div className="feature-icon w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Fast Processing
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Get your documents processed in record time. Most requests are
                completed within 24 hours.
              </p>
            </div>
            {/* Feature 2 (Use solid color backgrounds for feature icons) */}
            <div className="feature-card bg-white rounded-lg p-6 hover-lift border border-slate-200 hover:border-indigo-400">
              <div className="feature-icon w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Your data is encrypted and protected. We prioritize your privacy
                and security at every step.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card bg-white rounded-lg p-6 hover-lift border border-slate-200 hover:border-indigo-400">
              <div className="feature-icon w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Easy Tracking
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Track your requests in real-time. Get instant updates on your
                document status.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section
        id="services"
        className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Available <span className="gradient-text">Services</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Request any barangay document online with just a few clicks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-semibold text-base text-slate-900 mb-1">
                Barangay Clearance
              </h3>
              <p className="text-sm text-slate-500">
                For employment, business, and other purposes
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <h3 className="font-semibold text-base text-slate-900 mb-1">
                Certificate of Residency
              </h3>
              <p className="text-sm text-slate-500">
                Proof of residence in the barangay
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-semibold text-base text-slate-900 mb-1">
                Business Permit
              </h3>
              <p className="text-sm text-slate-500">
                Start your business legally
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
              <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
              </div>
              <h3 className="font-semibold text-base text-slate-900 mb-1">
                Indigency Certificate
              </h3>
              <p className="text-sm text-slate-500">
                For medical and financial assistance
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Our Community
          </h2>
          <p className="text-lg text-slate-400 mb-16">
            Making a real difference in people's lives
          </p>

          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-white">
              <p className="text-5xl font-extrabold mb-2 stat-number">5,000+</p>
              <p className="text-lg text-slate-400 font-medium">
                Happy Residents
              </p>
            </div>
            <div className="text-white">
              <p className="text-5xl font-extrabold mb-2 stat-number">
                15,000+
              </p>
              <p className="text-lg text-slate-400 font-medium">
                Documents Issued
              </p>
            </div>
            <div className="text-white">
              <p className="text-5xl font-extrabold mb-2 stat-number">24/7</p>
              <p className="text-lg text-slate-400 font-medium">
                Online Access
              </p>
            </div>
            <div className="text-white">
              <p className="text-5xl font-extrabold mb-2 stat-number">99.9%</p>
              <p className="text-lg text-slate-400 font-medium">Uptime</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of residents who are already enjoying hassle-free
            barangay services
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signin"
              className="btn-primary px-8 py-3 text-white rounded-md font-semibold text-base"
            >
              Create Account
            </Link>
            <button className="px-8 py-3 bg-white border border-slate-300 text-slate-900 rounded-md font-semibold text-base hover:bg-slate-50 hover:border-indigo-500 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-extrabold text-xl">B</span>
                </div>
                <span className="text-xl font-bold">BOSS</span>
              </div>
              <p className="text-slate-400">
                Making barangay services accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Barangay Clearance
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Certificates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Permits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Connect</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>
              &copy; 2025 BOSS - Barangay Online Services System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
