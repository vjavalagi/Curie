import { useState } from "react";

export default function ActiveSummary({ activeSummary, activePaper }) {
  if (!activeSummary || !activeSummary.content || activeSummary.content.length === 0) {
    return <p className="text-gray-500">No AI-generated summary available.</p>;
  }

  const colors = [
    "border-red-500 text-red-500",
    "border-blue-500 text-blue-500",
    "border-pink-500 text-pink-500",
    "border-yellow-500 text-yellow-500",
    "border-purple-500 text-purple-500",
    "border-indigo-500 text-indigo-500",
    "border-teal-500 text-teal-500",
    "border-orange-500 text-orange-500",
    "border-cyan-500 text-cyan-500",
    "border-lime-500 text-lime-500",
    "border-emerald-500 text-emerald-500",
    "border-rose-500 text-rose-500",
    "border-fuchsia-500 text-fuchsia-500",
    "border-violet-500 text-violet-500"
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const openDrawer = (sectionTitle) => {
    setActiveSection(sectionTitle);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveSection(null);
  };

  const [selectedSection, setSelectedSection] = useState(null);
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };
  

  return (
    <div className="flex transition-all duration-300 ease-in-out">
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          drawerOpen ? "w-[calc(100%-18rem)]" : "w-full"
        }`}
      >
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {activeSummary.content.map((section, index) => {
              const sectionTitle = section.section;
              const sectionDescription = section.summary;
              const color = colors[index % colors.length]; // rotate if more than 15 sections


              return (
                <Section
                  key={index}
                  title={sectionTitle}
                  description={sectionDescription}
                  color={colors[index % colors.length]}
                  onClick={() => {
                    openDrawer(sectionTitle);
                    handleSectionClick(section);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
  {/* Drawer (not fixed) */}
  {drawerOpen && selectedSection && (
          <div className="p-4 bg-white border-l shadow-lg w-72 shrink-0">
            <button
              onClick={closeDrawer}
              className="mb-2 text-sm text-gray-600 hover:text-black"
            >
              Close
            </button>
            <h3 className="mb-2 text-lg font-semibold">{activeSection}</h3>

            <ul className="pl-5 text-gray-700 list-disc">
              {selectedSection.actual_document_text
                .split(/(?<=\w[.?!])\s+/) // Split by punctuation followed by space (handles sentence endings)
                .map((sentence, index) => (
                  <li key={index} className="mb-1">
                    {sentence.trim()}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  
  function Section({ title, description, onClick, color }) {
    return (
      <div
      className={`flex flex-col items-center justify-center p-6 transition ${color} transform shadow-lg cursor-pointer border rounded-2xl hover:scale-105`}
      onClick={onClick}
    >
        <h3 className={`text-2xl font-semibold hover:underline ${color.split(" ")[1]}`}>{title}</h3>
        <p className="mt-2 text-sm text-center text-gray-700">{description}</p>
      </div>
    );
  }
  