/* eslint-disable react/react-in-jsx-scope */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import teamMembers from "../assets/landing/team-members.png";
import smartphones from "../assets/landing/smartphones.png";
import appStoreBadge from "../assets/landing/app-store-badge.png";
import googlePlayBadge from "../assets/landing/google-play-badge.png";
import landingHero from "../assets/landing-hero.png";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/");
      setIsLoading(false);
      return;
    }
    const decodedToken = jwtDecode(token || "");
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      navigate("/");
      setIsLoading(false);
    } else {
      navigate("/dashboard");
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation Bar */}

        <div
          className={`navbar flex md:px-10 px-5 md:pt-4 fixed z-40 text-darkgrey justify-between transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}
        >
          <div className="flex p-0 w-[20%] md:w-[20%]">
            <Link
              to="/"
              className="btn btn-ghost text-xl font-heading p-0 text-darkgrey"
            >
              LOGO
            </Link>
          </div>

          <div className="hidden lg:grid  lg:grid-flow-col lg:gap-8 lg:auto-rows-max lg:mr-[70px]">
            <div className={`text-[16px] font-body font-normal`}>
              <span className={"ml-[10px]"}>About</span>
            </div>
            <div className={`text-[16px] font-body font-normal`}>
              <span className={"ml-[10px]"}>Download</span>
            </div>
            <div
              className={`text-[16px] font-body  border border-darkgrey rounded px-4 py-2 cursor-pointer`}
            >
              <span>Get Started</span>
            </div>
          </div>
          <div className="dropdown dropdown-end lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content z-[1] mt-3 w-52 p-2 shadow rounded-box ${isMenuOpen ? "block" : "hidden"}`}
            >
              <li className="lg:hidden">
                <div className="">
                  <p className="text-[16px] font-body font-normal ml-8">
                    About
                  </p>
                </div>
              </li>
              <li className="lg:hidden">
                <div className="">
                  <p className="text-[16px] font-body font-normal ml-8">
                    Download
                  </p>
                </div>
              </li>
              <li className="lg:hidden">
                <div className="flex items-center border border-darkgrey rounded px-4 py-2 mt-2 ">
                  <Link to="/auth">
                    <p className="text-[16px] font-body font-normal  ml-8">
                      Get Started
                    </p>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center bg-yellow rounded px-4 py-2 mt-2 ">
                  <Link to="/auth/login">
                    <p className="text-[16px] font-body font-normal  ml-14">
                      Log In
                    </p>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <button
            className="px-12 py-3 bg-yellow font-body font-medium rounded-[5px] text-[14px] hidden lg:block"
            onClick={() => navigate(`/auth/login`)}
          >
            Log In
          </button>
        </div>

        {/* Hero Content */}
        <div className="min-h-screen flex justify-between flex-col md:flex-row items-center md:items-start">
          <div className="text-darkgrey md:ml-40 mt-60 md:mt-40 leading-[1.1] md:leading-[1.2] md:w-[30%] flex flex-col items-center md:items-start">
            <div>
              <p className="text-[50px] md:text-[80px] font-heading font-bold">
                BUILD.
              </p>
              <p className="text-[50px] md:text-[80px] font-heading font-bold">
                GET RATED.
              </p>
              <p className="text-[50px] md:text-[80px] font-heading font-bold">
                LEVEL UP.
              </p>
            </div>

            <p className="font-body mt-8 w-[70%] md:w-full text-center md:text-left">
              Where devs, designers, and cyber minds sharpen their craft -
              together.
            </p>
            <Link to="/auth">
              <button className="btn bg-yellow text-darkgrey border-none font-body font-medium px-12 text-[16px] rounded hover:bg-yellow/90 mt-12">
                Get Started
              </button>
            </Link>
          </div>
          {/* Background Image */}
          <div className="mt-40 w-[50%] hidden md:block">
            <img
              src={landingHero}
              alt="Dashboard preview"
              className="max-w-4xl w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center text-darkgrey mb-16">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow rounded-full flex items-center justify-center">
                  <span className="text-3xl font-heading text-darkgrey">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-heading text-darkgrey mb-2">
                    Sign Up
                  </h3>
                  <p className="text-lg font-body text-lightgrey">
                    Create your account and set up your profile.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-green rounded-full flex items-center justify-center">
                  <span className="text-3xl font-heading text-white">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-heading text-darkgrey mb-2">
                    Join a Hyve
                  </h3>
                  <p className="text-lg font-body text-lightgrey">
                    Browse and join hyves based on your interests.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow rounded-full flex items-center justify-center">
                  <span className="text-3xl font-heading text-darkgrey">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-heading text-darkgrey mb-2">
                    Start Collaborating
                  </h3>
                  <p className="text-lg font-body text-lightgrey">
                    Engage in projects, discussions, and events.
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img
                src={teamMembers}
                alt="Team collaboration"
                className="w-full max-w-lg rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Crafthyve Section */}
      <section id="why-crafthyve" className="py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center text-darkgrey mb-16">
            WHY CRAFTHYVE
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Connect */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-darkgrey"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-heading text-darkgrey mb-4">
                Connect
              </h3>
              <p className="text-lg font-body text-lightgrey">
                Find and connect with people who share your passions.
              </p>
            </div>

            {/* Collaborate */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-heading text-darkgrey mb-4">
                Collaborate
              </h3>
              <p className="text-lg font-body text-lightgrey">
                Work together on exciting projects and challenges.
              </p>
            </div>

            {/* Create */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-darkgrey"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-heading text-darkgrey mb-4">
                Create
              </h3>
              <p className="text-lg font-body text-lightgrey">
                Bring your ideas to life with the support of your hyve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section - Hyve on the Go */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading text-center text-darkgrey mb-8">
            HYVE ON THE GO
          </h2>
          <p className="text-xl font-body text-center text-lightgrey mb-12 max-w-2xl mx-auto">
            Stay connected with the Crafthyve mobile app. Available on iOS and
            Android.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* App Store Badges */}
            <div className="flex flex-col items-center md:items-end gap-6">
              <a
                href="#"
                className="hover:opacity-80 transition"
                aria-label="Download on App Store"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on App Store"
                  className="h-14"
                />
              </a>
              <a
                href="#"
                className="hover:opacity-80 transition"
                aria-label="Get it on Google Play"
              >
                <img
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  className="h-14"
                />
              </a>
            </div>

            {/* Smartphone Images */}
            <div className="flex justify-center md:justify-start">
              <img
                src={smartphones}
                alt="Mobile app preview"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-yellow to-yellow/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-heading text-darkgrey mb-6">
            READY TO JOIN THE MOVEMENT?
          </h2>
          <p className="text-xl font-body text-darkgrey mb-10">
            Sign up today and start your journey with Crafthyve.
          </p>
          <Link to="/auth">
            <button className="btn bg-darkgrey text-white border-none font-body font-semibold px-16 py-4 text-lg rounded hover:bg-darkgrey/90">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkgrey text-white py-8 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-sm">
            © 2025 Crafthyve. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
