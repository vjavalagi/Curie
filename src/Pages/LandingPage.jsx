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
  const [showContent, setShowContent] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2500);
    return () => clearTimeout(timer);
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

        <motion.img
          src={curieLogo}
          alt="Curie Logo"
          className="w-48 mb-8"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0 }}
        />

        {showContent && (
          <>
            <SearchBar variant="lightgray" />
            <button
              onClick={() => infoRef.current.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 text-blue-500 underline"
            >
              Learn More
            </button>
          </>
        )}
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
