import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How does Curie summarize research papers?",
    answer: "Curie extracts key insights and presents them in an easy-to-digest format using AI-powered algorithms.",
  },
  {
    question: "Can I save articles?",
    answer: "Yes, you can bookmark and manage articles efficiently using your personalized research dashboard.",
  },
  {
    question: "Does Curie support citation exports?",
    answer: "Absolutely! Curie allows exporting citations in multiple formats like BibTeX, APA, and MLA.",
  },
  {
    question: "Is there a mobile app for Curie?",
    answer: "Curie is optimized for web use, but a mobile app is currently in development.",
  },
];

export default function FAQSection({ faqRef }) {
  const [bgColor, setBgColor] = useState("rgba(255, 255, 255, 1)"); // Initial background color
  const [openIndex, setOpenIndex] = useState(null); // Track which FAQ is open

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setBgColor(entry.isIntersecting ? "rgba(25, 85, 175, 1)" : "rgba(255, 255, 255, 1)");
      },
      { threshold: 0.5 }
    );

    if (faqRef?.current) {
      observer.observe(faqRef.current);
    }

    return () => observer.disconnect();
  }, [faqRef]);

  // Function to toggle FAQ answers
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={faqRef}
      className="h-screen flex flex-col items-center justify-center snap-start text-white transition-all duration-500 px-6"
      style={{ backgroundColor: bgColor }}
    >
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="max-w-2xl w-full space-y-4">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 rounded-lg p-4 cursor-pointer shadow-lg transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-yellow-300">{item.question}</h3>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-yellow-300 text-xl"
              >
                ▼
              </motion.span>
            </div>

            <AnimatePresence>
              {openIndex === index && (
                <motion.p
                  className="mt-2 text-white"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
