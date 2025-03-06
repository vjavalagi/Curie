import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import curieLogo from "../assets/curie_no_background.png";
import SearchBar from "../components/SearchBar";
import ProfileIcon from "../components/ProfileIcon";
import { motion } from "framer-motion";

export default function LandingPage() {
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState('#f4f4f4'); // initial color

  // Intersection Observer callback
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target === infoRef.current) {
          setBackgroundColor('#f4f4f4'); // Color for info section
        } else if (entry.target === faqRef.current) {
          setBackgroundColor('#3A3A3A'); // Color for FAQ section
        }
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Trigger when 50% of the section is visible
    });

    observer.observe(infoRef.current);
    observer.observe(faqRef.current);

    // Clean up observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-y-scroll scroll-smooth"
      style={{
        transition: "background-color 3s ease", // Gradual background color transition
        backgroundColor: backgroundColor,
      }}
    >
      {/* Search Panel */}
      <section className="h-screen flex flex-col items-center justify-center snap-start bg-curieLightGray">
        <div className="absolute top-4 right-4">
          <ProfileIcon />
        </div>
        <img src={curieLogo} alt="Curie Logo" className="w-48 mb-8" />
        <SearchBar variant="lightgray" />
        <button
          onClick={() => infoRef.current.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 text-blue-500 underline"
        >
          Learn More
        </button>
      </section>

      {/* Info Section with Animations */}
      <section ref={infoRef} className="h-screen flex flex-col justify-center items-center p-12 snap-start">
        <div className="max-w-4xl text-center text-curieBlue">
          <motion.h2
            className="text-4xl font-bold mb-6 text-curieBlue"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Welcome to Curie
          </motion.h2>
          <motion.p
            className="text-lg text-curieBlue"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Curie is your AI-powered research companion, designed to streamline
            academic discovery, provide structured summaries, and enhance your
            research workflow.
          </motion.p>

          {/* Animated Features List */}
          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <FeatureCard title="AI-Powered Summaries" description="Get structured insights from complex research papers instantly." />
            <FeatureCard title="Smart Search" description="Find relevant papers with advanced filtering options." />
            <FeatureCard title="Visual Analysis" description="Explore data and trends through interactive visualizations." />
            <FeatureCard title="Personalized Organization" description="Manage and categorize papers efficiently." />
          </motion.div>
        </div>
      </section>

      {/* FAQs Panel */}
      <section ref={faqRef} className="h-screen flex flex-col items-center justify-center snap-start bg-curieDarkGray text-white">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="max-w-xl text-center">
          <p className="mb-2"><strong>Q: How does Curie summarize research papers?</strong></p>
          <p className="mb-4">A: Curie extracts key insights and presents them in an easy-to-digest format.</p>
          <p className="mb-2"><strong>Q: Can I save articles?</strong></p>
          <p>A: Yes, you can bookmark and manage articles efficiently.</p>
        </div>
        <Link to="/more-info" className="mt-8 text-blue-400 underline">More Questions?</Link>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-300 text-sm w-full text-center">
        <a href="#" className="hover:underline px-2">Privacy</a> |
        <a href="#" className="hover:underline px-2">Terms</a>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <motion.div
      className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg text-left"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-semibold text-curieBlue">{title}</h3>
      <p className="text-black mt-2">{description}</p>
    </motion.div>
  );
}
