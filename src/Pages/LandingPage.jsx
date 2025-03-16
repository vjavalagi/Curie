import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import curieLogo from "../assets/curie_no_background.png";
import SearchBar from "../components/SearchBar";
import ProfileIcon from "../components/ProfileIcon";
import InfoSection from "../components/InfoSection";
import FAQSection from "../components/FAQSection";
import { motion } from "framer-motion";

export default function LandingPage() {
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("#f4f4f4");

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === infoRef.current) {
            setBackgroundColor("#f4f4f4");
          } else if (entry.target === faqRef.current) {
            setBackgroundColor("#3A3A3A");
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
    observer.observe(infoRef.current);
    observer.observe(faqRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-y-scroll scroll-smooth"
      style={{
        transition: "background-color 3s ease",
        backgroundColor: backgroundColor,
      }}
    >
      <section className="h-screen flex flex-col items-center justify-center snap-start bg-curieLightGray">
        <div className="absolute top-4 right-4">
          <ProfileIcon />
        </div>

        {/* Curie Logo Slide in from Left */}
        <motion.img
          src={curieLogo}
          alt="Curie Logo"
          className="w-48 mb-8"
          initial={{ x: -200, opacity: 0 }} // Start offscreen to the left
          animate={{ x: 0, opacity: 1 }} // Slide to center and fade in
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Search Bar Slide in from Right and expand to full width */}
        <motion.div
          initial={{ x: "100%", opacity: 0, width: "50%" }} // Start offscreen to the right with smaller width
          animate={{ x: 0, opacity: 1, width: "100%" }} // Slide to center and expand to full width
          transition={{ duration: 1.5, ease: "easeOut" }} // Same duration and ease for both
          className="flex justify-center"
        >
          <SearchBar variant="lightgray" />
        </motion.div>

        <button
          onClick={() => infoRef.current.scrollIntoView({ behavior: "smooth" })}
          className="mt-8 text-blue-500 underline"
        >
          Learn More
        </button>
      </section>

      <InfoSection infoRef={infoRef} />
      <FAQSection faqRef={faqRef} />

      <footer className="absolute bottom-4 text-gray-300 text-sm w-full text-center">
        <a href="#" className="hover:underline px-2">Privacy</a> |
        <a href="#" className="hover:underline px-2">Terms</a>
      </footer>
    </div>
  );
}
