import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FAQSection({ faqRef }) {
  const [bgColor, setBgColor] = useState("rgba(255, 255, 255, 1)"); // Start with white

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBgColor("rgba(25, 85, 175, 1)"); // Darken when FAQ is in view
        } else {
          // Lighten faster when FAQ is out of view (scrolling up)
          setBgColor("rgba(255, 255, 255, 1)"); // Reset to white
        }
      },
      { threshold: 0.5 } // Adjust threshold for quicker lightening when scrolling up
    );

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => observer.disconnect();
  }, [faqRef]);

  return (
    <section
      ref={faqRef}
      className="h-screen flex flex-col items-center justify-center snap-start text-white transition-all duration-500" // Shortened duration for faster lightening
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      
      <div className="max-w-xl text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="mb-2 text-yellow-300"><strong>Q: How does Curie summarize research papers?</strong></p>
          <p>A: Curie extracts key insights and presents them in an easy-to-digest format.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="mb-2 text-yellow-300"><strong>Q: Can I save articles?</strong></p>
          <p>A: Yes, you can bookmark and manage articles efficiently.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <Link to="/more-info" className="mt-8 text-yellow-300 underline hover:text-yellow-400 transition-colors">
          More Questions?
        </Link>
      </motion.div>
    </section>
  );
}
