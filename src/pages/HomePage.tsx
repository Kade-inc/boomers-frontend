import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import smartphones from "../assets/landing/smartphones.png";
import appStoreBadge from "../assets/landing/app-store-badge.png";
import googlePlayBadge from "../assets/landing/google-play-badge.png";
import landingHero from "../assets/landing-hero.png";
import howItWorks1 from "../assets/how-it-works-1.png";
import howItWorks2 from "../assets/how-it-works-2.png";
import howItWorks3 from "../assets/how-it-works-3.png";
import hyveDotted from "../assets/hyve-dotted.svg";
import crafthyveLogo from "../assets/craftyhyve-logo-full.svg";
import heroMobile from "../assets/hero-mobile-cropped.png";

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
          className={`navbar flex md:px-10 px-5 md:pt-4 fixed z-40 text-black justify-between transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}
        >
          <div className="flex p-0 w-[20%] md:w-[20%]">
            <Link
              to="/"
              className="btn btn-ghost text-xl font-heading p-0"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={crafthyveLogo}
                alt="CraftHyve Logo"
                className="w-[200px]"
              />
            </Link>
          </div>

          <div className="hidden lg:grid  lg:grid-flow-col lg:gap-8 lg:auto-rows-max lg:mr-[70px]">
            <div
              className={`text-[16px] font-body font-normal cursor-pointer`}
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className={"ml-[10px]"}>About</span>
            </div>
            <div
              className={`text-[16px] font-body font-normal cursor-pointer`}
              onClick={() =>
                document
                  .getElementById("why-crafthyve")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className={"ml-[10px]"}>Why CraftHyve</span>
            </div>
            <div
              className={`text-[16px] font-body font-normal cursor-pointer`}
              onClick={() =>
                document
                  .getElementById("hyve-on-the-go")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span className={"ml-[10px]"}>Download</span>
            </div>
            <Link
              to="/auth"
              className={`text-[16px] font-body border border-black rounded px-4 py-2 cursor-pointer`}
            >
              <span>Get Started</span>
            </Link>
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
              className={`menu menu-sm dropdown-content z-[1] mt-3 w-52 p-2 shadow rounded-md bg-white ${isMenuOpen ? "block" : "hidden"}`}
            >
              <li
                className="lg:hidden cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="">
                  <p className="text-[16px] font-body font-normal ml-8">
                    About
                  </p>
                </div>
              </li>
              <li
                className="lg:hidden cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("why-crafthyve")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="">
                  <p className="text-[16px] font-body font-normal ml-8">
                    Why CraftHyve
                  </p>
                </div>
              </li>
              <li
                className="lg:hidden cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("hyve-on-the-go")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="">
                  <p className="text-[16px] font-body font-normal ml-8">
                    Download
                  </p>
                </div>
              </li>
              <li className="lg:hidden">
                <div className="flex items-center border border-black rounded px-4 py-2 mt-2 ">
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
            className="px-12 py-3 bg-yellow font-body font-medium rounded-[5px] text-[16px] hidden lg:block"
            onClick={() => navigate(`/auth/login`)}
          >
            Log In
          </button>
        </div>

        {/* Hero Content */}
        <div className="min-h-screen flex justify-between flex-col md:flex-row items-center md:items-start">
          <div className="text-black md:ml-40 mt-40 leading-[1.0] md:w-[30%] flex flex-col items-center md:items-start">
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

            <p className="font-body mt-8 w-[70%] md:w-full text-center md:text-left font-medium text-lg">
              Where devs, designers, and cyber minds sharpen their craft -
              together.
            </p>
            <Link to="/auth">
              <button className="btn bg-yellow text-black border-none font-body font-medium px-12 text-lg rounded hover:bg-yellow/90 mt-12">
                Get Started
              </button>
            </Link>
          </div>
          {/* Background Image */}
          <div className="mt-40 hidden md:block md:w-[40%]">
            <img
              src={landingHero}
              alt="Dashboard preview"
              className="w-full h-auto object-contain shadow-lg"
            />
          </div>
          <div className="mt-10 block md:hidden md:w-[40%] flex justify-center">
            <img
              src={heroMobile}
              alt="Dashboard preview"
              className="w-[60%] h-auto object-contain shadow-lg"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() =>
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer hover:scale-110 transition-transform"
          aria-label="Scroll to content"
        >
          <div className="w-6 h-10 border-2 border-darkgrey rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-darkgrey rounded-full"></div>
          </div>
        </button>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-8 bg-yellow relative overflow-hidden"
      >
        {/* Decorative dotted pattern overlay */}
        <img
          src={hyveDotted}
          alt=""
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-auto opacity-60 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-heading text-black">
              HOW IT WORKS
            </h2>
            <div className="flex flex-col items-center mt-2 gap-2">
              <div className="w-36 h-[4px] bg-black ml-16 md:ml-24"></div>
              <div className="w-36 h-[4px] bg-black"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-y-40">
            {/* Steps */}
            <div className="space-y-8 hidden md:block">
              <img
                src={howItWorks1}
                alt="How it works"
                className="w-[80%] h-auto object-contain rounded-md shadow-md"
              />
            </div>

            {/* Image */}
            <div className="flex flex-col items-start">
              <p className="text-3xl font-heading text-black mb-4">
                1. JOIN A HYVE
              </p>
              <p className="text-lg font-body text-black font-medium">
                Your Hyve is your family. Connect with other like minded
                craftsmen within it. If you wish to be an owner and help others
                hone their craft, create your own Hyve and mentor others.
              </p>
            </div>

            <div className="space-y-8 md:hidden">
              <img
                src={howItWorks1}
                alt="How it works"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Steps */}

            {/* Image */}
            <div className="flex flex-col items-start">
              <p className="text-3xl font-heading text-black mb-4">
                2. CHALLENGES
              </p>
              <p className="text-lg font-body text-black font-medium">
                Challenges are best for honing your craft. Choose a challenge in
                your Hyve and give the steps you would take to accomplish the
                challenge.
              </p>
            </div>

            <div className="space-y-8">
              <img
                src={howItWorks2}
                alt="How it works"
                className="w-full md:w-[80%] h-auto object-contain rounded-md shadow-md"
              />
            </div>

            {/* Steps */}

            <div className="space-y-8 hidden md:block">
              <img
                src={howItWorks3}
                alt="How it works"
                className="w-[80%] h-auto object-contain rounded-md shadow-md"
              />
            </div>

            {/* Image */}
            <div className="flex flex-col items-start">
              <p className="text-3xl font-heading text-black mb-4">
                3. FEEDBACK
              </p>
              <p className="text-lg font-body text-black font-medium">
                Rate your hyve mates, give feedback and have fun as you hone
                your craft!
              </p>
            </div>

            <div className="space-y-8 block md:hidden">
              <img
                src={howItWorks3}
                alt="How it works"
                className="w-full h-auto object-contain rounded-md shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Crafthyve Section */}
      <section id="why-crafthyve" className="py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-heading text-black">
              WHY CRAFTHYVE
            </h2>
            <div className="flex flex-col items-center mt-2 gap-2">
              <div className="w-36 h-[4px] bg-black ml-16 md:ml-24"></div>
              <div className="w-36 h-[4px] bg-black"></div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="border-2 border-green rounded-2xl p-8 md:p-12 max-w-2xl w-full">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-lg font-body text-black">
                    Guaranteed problem solving improvement.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-lg font-body text-black">
                    Share completed challenges with others online (Linkedin, X,
                    etc)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-lg font-body text-black">
                    Connect with experienced professionals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-lg font-body text-black">
                    Build portfolio of projects.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section - Hyve on the Go */}
      <section id="hyve-on-the-go" className="pt-20 px-8 bg-yellow">
        <div className="max-w-7xl mx-auto">
          {/* Title with underlines */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-heading text-black">
              HYVE ON THE GO
            </h2>
            <div className="flex flex-col items-center mt-2 gap-2">
              <div className="w-36 h-[4px] bg-black ml-16 md:ml-24"></div>
              <div className="w-36 h-[4px] bg-black"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and App Store Badges */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-lg font-body text-black text-center md:text-left font-medium">
                Take the Hyve with you and get your notifications, give feedback
                & submit solutions on the go through the mobile app!
              </p>
              <div className="flex flex-row items-center gap-4">
                <a
                  href="#"
                  className="hover:opacity-80 transition"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src={googlePlayBadge}
                    alt="Get it on Google Play"
                    className="w-[200px]"
                  />
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition"
                  aria-label="Download on App Store"
                >
                  <img
                    src={appStoreBadge}
                    alt="Download on App Store"
                    className="w-[200px]"
                  />
                </a>
              </div>
            </div>

            {/* Right side - Smartphone Images */}
            <div className="flex justify-center md:justify-end">
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
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-heading text-black mb-6">
            READY TO JOIN THE MOVEMENT?
          </h2>
          <p className="text-lg font-body font-medium text-black">
            Sign up today and start your journey with Crafthyve.
          </p>
          <Link to="/auth">
            <button className="btn bg-yellow text-black border-none font-body font-semibold px-12 text-lg rounded hover:bg-yellow/90 mt-12">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-sm">
            © 2025 Crafthyve. All rights reserved.
          </p>
          <p className="font-body text-sm mt-4">
            Made with ❤️ from{" "}
            <a
              href="https://www.teamkade.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              KADE
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
