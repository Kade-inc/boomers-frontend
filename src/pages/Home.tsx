import React from "react";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
// Import TestimonialSection component - assuming it's a default export
// If TestimonialSection is not available, this component would need to be created
// import TestimonialSection from "./TestimonialSection";
import MethodologyAnimation from "../components/MethodologyAnimation";

const Home = () => {
  return (
    <div className="min-h-screen text-white bg-[#44e2e8]">
      {/* Hero Section */}
      <HeroSection />
      {/* Feature Section */}
      <FeatureSection />
      {/* Testimonial Section */}
      {/* <TestimonialSection /> */}
      {/* Methodology Animation */}
      <MethodologyAnimation />
      {/* Mobile App Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 order-2 md:order-1">
            <h2 className="text-2xl md:text-4xl font-body font-bold mb-6">
              Take Ceembl With You
            </h2>
            <p className="text-lg text-gray-300 font-body mb-8">
              Track your coding challenges, connect with mentors, and continue
              your learning journey on the go with our mobile app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 border border-gray-700 rounded-lg transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
                  <path d="M16 19h6"></path>
                  <path d="M19 16v6"></path>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400 font-body">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold font-body">
                    App Store
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 border border-gray-700 rounded-lg transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polygon points="3 3 21 12 3 21 3 3"></polygon>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400 font-body">
                    GET IT ON
                  </div>
                  <div className="text-sm font-semibold font-body">
                    Google Play
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2 py-12">
            <div className="relative mx-auto max-w-xs">
              <div className="absolute inset-0 bg-yellow rounded-3xl blur-xl opacity-30 transform rotate-6"></div>
              <div className="relative bg-black border-4 border-darkgrey rounded-3xl overflow-hidden shadow-2xl">
                <div className="pt-8 px-2 bg-black rounded-t-3xl">
                  <div className="w-16 h-1 mx-auto bg-yellow rounded-full mb-2"></div>
                  <img
                    src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&q=80"
                    alt="Ceembl mobile app"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="p-4 bg-black">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-yellow rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <path d="m18 16 4-4-4-4"></path>
                        <path d="m6 8-4 4 4 4"></path>
                        <path d="m14.5 4-5 16"></path>
                      </svg>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-black border-y-2 border-darkgrey">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-body font-bold mb-6">
            Ready to Level Up Your Development Skills?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-body mb-10 max-w-3xl mx-auto">
            Join our community of developers and mentors to accelerate your
            growth through structured challenges and methodical problem-solving.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/auth"
              className="px-8 py-4 bg-yellow hover:bg-yellow/80 text-black font-bold font-body rounded-md text-lg transition-colors duration-300"
            >
              Find a Mentor
            </a>
            <a
              href="/auth"
              className="px-8 py-4 bg-transparent hover:bg-white hover:text-black border-2 border-yellow text-yellow font-bold font-body rounded-md text-lg transition-colors duration-300"
            >
              Join as a Mentor
            </a>
          </div>
        </div>
      </section>
      {/* Enhanced Footer */}
      <footer className="bg-black py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="font-heading text-[30px] mt-5text-3xl font-bold text-yellow mb-4">
                LOGO
              </h3>
              <p className="text-gray-400 font-body text-lg mb-6 max-w-md">
                Accelerate your development journey through structured
                challenges and expert mentorship. Join our community of learners
                and teachers.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-yellow font-body rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-yellow font-body rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-yellow font-body rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-yellow font-body rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold font-body text-lg mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Find a Mentor
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Join as Mentor
                  </a>
                </li>
                <li>
                  <a
                    href="/challenges"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Challenges
                  </a>
                </li>
                <li>
                  <a
                    href="/community"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold font-body text-lg mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow font-body transition-colors duration-300"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm font-body mb-4 md:mb-0">
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://teamkade.com"
                  className="text-blue-300 hover:text-blue-600"
                >
                  KADE
                </a>
                . All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-500 font-body">
                  Made with ❤️ for developers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
