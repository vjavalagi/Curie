import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function InfoSection({ infoRef }) {
  const title = "Welcome to Curie";
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true });

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } },
  };

  return (
    <section
      ref={infoRef}
      className="h-screen flex flex-col justify-center items-center p-12 snap-start"
      style={{ backgroundColor: "#f4f8fc" }}
    >
      <div className="max-w-4xl text-center text-curieBlue">
        {/* Rolling Letter Animation */}
        <motion.h2
          ref={titleRef}
          className="text-4xl font-bold mb-6 text-curieBlue flex justify-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {title.split("").map((letter, index) => (
            <motion.span key={index} variants={letterVariants}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h2>

        {/* Description */}
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

        {/* Feature Cards */}
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
