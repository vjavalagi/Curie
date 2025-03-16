import { motion } from "framer-motion";

export default function InfoSection({ infoRef }) {
  return (
    <section
      ref={infoRef}
      className="h-screen flex flex-col justify-center items-center p-12 snap-start"
      style={{ backgroundColor: "#f4f8fc" }} // Fixed background color for InfoSection
    >
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
