export default function ActiveSummary({ activeSummary, activePaper}) {
    if (!activeSummary || Object.keys(activeSummary).length === 0) {
      return <p className="text-gray-500">No AI-generated summary available.</p>;
    }
  
    return (
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {activePaper.summary && (
            <Section title="Abstract/Summary" description={activePaper.summary} color="border-pink-500 text-pink-500" />
          )}
          {activeSummary.introduction && (
            <Section title="Introduction" description={activeSummary.introduction} color="border-blue-500 text-blue-500" />
          )}
          {activeSummary.methods && (
            <Section title="Methods" description={activeSummary.methods} color="border-green-500 text-green-500" />
          )}
          {activeSummary.results && (
            <Section title="Results" description={activeSummary.results} color="border-purple-500 text-purple-500" />
          )}
          {activeSummary.discussion && (
            <Section title="Discussion" description={activeSummary.discussion} color="border-orange-500 text-orange-500" />
          )}
          {activeSummary.conclusion && (
            <Section title="Conclusion" description={activeSummary.conclusion} color="border-red-500 text-red-500" />
          )}
        </div>
      </div>
    );
  }
  
  function Section({ title, description, color }) {
    return (
      <div className={`flex flex-col items-center justify-center border-2 ${color} p-6 rounded-2xl shadow-lg transition transform hover:scale-105`}>
        <h3 className={`text-2xl font-semibold ${color.split(" ")[1]}`}>{title}</h3>
        <p className="mt-2 text-sm text-center text-gray-700">{description}</p>
      </div>
    );
  }
  