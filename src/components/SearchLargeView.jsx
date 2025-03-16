import React, { useEffect } from "react";
import Timeline from "./Timeline";
import { useGlobal } from "./GlobalContext";

export default function SearchLargeView() {
  const { search, activePaper, setActivePaper, activeSummary } = useGlobal();

  useEffect(() => {
    console.log("activeSummary changed (within SearchLargeView):", activeSummary);
    console.log("activeSummary.introduction", activeSummary?.introduction);
    console.log("activeSummary.methods", activeSummary?.methods);
    console.log("activeSummary.results", activeSummary?.results);
    console.log("activeSummary.discussion", activeSummary?.discussion);
    console.log("activeSummary.conclusion", activeSummary?.conclusion);
  }, [activeSummary]);

  const handleDeepDiveClick = () => {
    setActivePaper("");
    console.log("Emptying paper", activePaper);
  };

  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Beginner Buttons on Left */}
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-300 text-white rounded-lg shadow-md">
            Beginner
          </button>
          <button className="px-4 py-2 bg-blue-400 text-white rounded-lg shadow-md">
            Intermediate
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
            Expert
          </button>
        </div>

        {/* Deep Dive Button on Right */}
        <button
          className="px-4 py-2 bg-curieBlue text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={handleDeepDiveClick}
        >
          Deep Dive ✨
        </button>
      </div>

      {/* Main content: render active paper details if available, otherwise a search summary */}
      {!activePaper ? (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{search}</h1>
          <h2 className="text-lg font-semibold mt-2">Summary</h2>
          <p className="text-gray-700">
            Shows an AI-generated summary of the field itself along with a timeline.
          </p>
          <Timeline search={search} />
        </section>
      ) : (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            Publication Date: {activePaper.published}
          </p>
          <p className="text-sm text-gray-500">
            Authors: {activePaper.authors?.join(", ")}
          </p>
          <p className="text-sm text-gray-500">
            Summary: {activePaper.summary}
          </p>
         
          <a
            href={activePaper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-curieBlue underline"
          >
            View Paper
          </a>
        </section>
      )}

      {/* Always render active summary if available */}
      {activeSummary &&  (
        <section className="bg-white p-6 mt-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Active Summary</h3>
          {activeSummary.introduction && (
            <div className="mt-2">
              <h4 className="font-bold">Introduction</h4>
              <p>{activeSummary.introduction}</p>
            </div>
          )}
          {activeSummary.methods && (
            <div className="mt-2">
              <h4 className="font-bold">Methods</h4>
              <p>{activeSummary.methods}</p>
            </div>
          )}
          {activeSummary.results && (
            <div className="mt-2">
              <h4 className="font-bold">Results</h4>
              <p>{activeSummary.results}</p>
            </div>
          )}
          {activeSummary.discussion && (
            <div className="mt-2">
              <h4 className="font-bold">Discussion</h4>
              <p>{activeSummary.discussion}</p>
            </div>
          )}
          {activeSummary.conclusion && (
            <div className="mt-2">
              <h4 className="font-bold">Conclusion</h4>
              <p>{activeSummary.conclusion}</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
