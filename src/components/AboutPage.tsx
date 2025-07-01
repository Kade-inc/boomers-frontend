import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* navigation */}
      <header className="py-6 px-4 md:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading text-[30px] mt-5 text-2xl font-bold text-yellow"
        >
          LOGO
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <Button
              variant="ghost"
              className="text-yellow font-body hover:bg-yellow/90 hover:text-black"
            >
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-yellow hover:bg-yellow/90 font-body text-black font-medium">
              Join the Community
            </Button>
          </Link>
        </div>
      </header>

      {/* main content */}
      <main className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            <span className="relative inline-block font-body">
              About Ceembl
              <span className="absolute -bottom-2 left-0 w-24 h-2 bg-yellow"></span>
            </span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-body mb-6 text-yellow">
                Our Mission
              </h2>
              <p className="text-lg font-body text-gray-300 mb-6">
                Ceembl was founded with a simple yet powerful idea: everyone has
                something to teach, and everyone has something to learn.
              </p>
              <p className="text-lg text-gray-300 font-body mb-6">
                We believe that the best way to master software development is
                through structured problem-solving approaches and real-world
                challenges, guided by those who have overcome similar obstacles.
              </p>
              <p className="text-lg text-gray-300 font-body">
                Our platform connects aspiring developers with experienced
                mentors in a community where roles are fluid-today&#39;s learner
                might be tomorrow&#39;s teacher on a different topic.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow to-yellow rounded-lg blur opacity-30"></div>
              <div className="relative bg-darkgrey p-2 rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                  alt="Developers collaborating"
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold font-body mb-8 text-center">
              Our Methodology
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-darkgrey p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-yellow/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-yellow text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-body">
                  Structured Challenges
                </h3>
                <p className="text-gray-300 font-body">
                  Learn through carefully designed coding challenges that build
                  real-world skills progressively.
                </p>
              </div>
              <div className="bg-darkgrey p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-yellow/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-yellow text-lg font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-body">
                  Guided Mentorship
                </h3>
                <p className="text-gray-300 font-body">
                  Receive Personalized feedback and guidance from developers who
                  have mastered the skills you&apos;re learning.
                </p>
              </div>
              <div className="bg-darkgrey p-6 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-yellow/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-yellow text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-body">
                  Community Growth
                </h3>
                <p className="text-gray-300 font-body">
                  Share your own expertise as you progress, reinforcing your
                  knowledge while helping others.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-body mb-8">
              Ready to join our community?
            </h2>
            <Link to="/auth">
              <Button className="btn bg-yellow hover:bg-yellow/70 text-black font-medium font-body px-8 h-auto text-lg">
                Join the community
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 mt-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="">
              <Link
                to="/"
                className="font-heading text-[30px] mt-5 text-2xl font-bold text-yellow"
              >
                LOGO
              </Link>
            </div>
            <div className="flex gap-8">
              <Link
                to="/"
                className="text-gray-300 font-body hover:text-yellow"
              >
                Home
              </Link>
              <Link
                to="/auth"
                className="text-gray-300 font-body hover:text-yellow"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="text-gray-300 font-body hover:text-yellow"
              >
                Login
              </Link>
              <Link
                to="/challenges"
                className="text-gray-300 font-body hover:text-yellow"
              >
                Challenges
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()}{" "}
              <a
                href="http://teamkade.com"
                className="text-bold text-blue-300 hover:text-blue-500"
              >
                KADE
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
