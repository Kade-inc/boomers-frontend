import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const HeroSection = ({
  // title = "Level Up Your Skills Through Guided Mentorship",
  subtitle = "Connect in a community where anyone can be both a learner and a teacher. Share knowledge and grow together through methodical problem solving approaches.",
  // ctaPrimaryText = "Join the Community",
  // ctaSecondaryText = "Learn More",
  onPrimaryClick = () => {
    window.location.href = "/auth";
  },
  onSecondaryClick = () => {
    window.location.href = "/about";
  },
}: HeroSectionProps) => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      alt: "Problem-Solving methodology",
      theme: "Problem-Solving methodology",
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      alt: "Challenge driven learning",
      theme: "Challenge driven",
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      alt: "Methodical approach",
      theme: "Methodical approach",
    },
  ];

  const animatedWords = ["Dev", "Design", "Security"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); //change image every 4 secs

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % animatedWords.length,
      );
    }, 3000); //change word every 3 secs

    return () => clearInterval(interval);
  }, [animatedWords.length]);

  return (
    <div className="relative w-full min-h-screen bg-black text-white py-20 md:py-32 px-4 overflow-hidden">
      {/* login link */}
      <div className="absolute flex items-center justify-end w-full px-7 top-0 right-0 left-0 z-20">
        {/* <p className="font-heading text-[30px] font-extrabold text-white mt-5">
          LOGO
        </p> */}
        <Link to="/auth/login">
          <Button
            variant="ghost"
            className="btn bg-yellow  text-darkgrey border-none text-[16px] font-body font-medium px-4 rounded py-0 hover:bg-yellow/70  mt-5"
          >
            Login
          </Button>
        </Link>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-5 w-[450px] h-64 bg-gradient-to-br from-yellow to-yellow/80 opacity-50 rounded-e-full rounded-t-xl blur-3xl z-0"></div>
        <div className="absolute -right-20 -bottom-10 w-[360px] h-60 bg-gradient-to-tl from-yellow to-yellow/80 opacity-30 rounded-e-full blur-3xl z-0"></div>
        {/* <div className="absolute right-1/4 top-1/3 w-40 h-40 bg-yellow opacity-50 rounded-full blur-xl"></div> */}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* this div holds the image and text */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-x-16">
          {/* Text content */}
          <motion.div
            className="md:w-[60%] text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold font-body text-left mb-6 leading-md tracking-tight">
              <span className="relative inline-block md:text-7xl">
                <span className="whitespace-nowrap">
                  Level Up Your{" "}
                  <span className="relative font-body inline-block overflow-clip text-left">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="text-yellow font-body inline-block"
                    >
                      {animatedWords[currentWordIndex]}
                    </motion.span>
                  </span>
                </span>{" "}
                Skills Through Guided Mentorship
                <span className="absolute -bottom-2 left-0 w-24 h-2 bg-yellow"></span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 font-body mb-8">{subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                onClick={onPrimaryClick}
                className="btn bg-yellow hover:bg-yellow/70 text-darkgrey font-medium font-body border-none px-8 py-6 h-auto text-lg"
              >
                Join The Community
              </Button>

              <Button
                onClick={onSecondaryClick}
                variant={"outline"}
                className="border-yellow text-yellow bg-white hover:bg-white/90 font-body font-medium px-8 py-6 h-auto text-lg flex items-center gap-2"
              >
                <span>Learn More</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="md:w-[40%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-t from-yellow to-yellow/70 rounded-lg blur-sm opacity-30"></div>
              <div className="relative bg-black p-6 rounded-lg shadow-xl">
                <div className="aspect-video rounded-md overflow-hidden bg-darkgrey flex items-center justify-center relative">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-yellow"
                            : "bg-gray-400/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-black rounded-md border border-darkgrey">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-yellow"></div>
                    <div className="text-sm font-body text-yellow">
                      {images[currentImageIndex].theme}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-darkgrey rounded-full w-full"></div>
                    <div className="h-2 bg-darkgrey rounded-full w-3/4"></div>
                    <div className="h-2 bg-yellow/60 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
