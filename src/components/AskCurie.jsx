import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const AskCurie = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true); // collapse toggle

  const { activePaper } = useGlobal();

  useEffect(() => {
    if (activePaper) {
      setQuestion("");
      setAnswer("");
      setError("");
    }
  }, [activePaper]);

  const handleAskCurie = async () => {
    setLoading(true);
    setError("");
    try {
      const name = activePaper.title;
      const response = await axios.get("http://localhost:5001/api/ask-curie", {
        params: { name, question },
      });

      setAnswer(response.data.answer);
      setQuestion("");
    } catch (err) {
      setError("An error occurred while asking Curie.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswer("");
    setError("");
    setQuestion("");
  };

  return (

    <div className="ounded-lg borde">
        {/* Collapsible Header */}
        <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <h2 className="mr-2 text-xl font-semibold">Ask Curie</h2>
            <span className="text-sm">
            {isOpen ? "▼" : "▶"}
            </span>
    </div>


      {/* Collapsible Body */}
      {isOpen && (
        <div className="mt-4">
          {/* Input Field */}
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            placeholder="Ask Curie a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Ask Button */}
          <button
            className="px-4 py-2 text-white rounded-lg bg-curieBlue"
            onClick={handleAskCurie}
            disabled={loading}
          >
            {loading ? "Loading..." : "Ask"}
          </button>

          {/* Reset Button */}
          <button
            className="px-4 py-2 mt-4 ml-2 text-white bg-red-500 rounded-lg"
            onClick={handleReset}
          >
            Reset
          </button>

          {/* Answer Section */}
          {answer && !loading && (
            <div className="p-4 mt-4 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold">Answer:</h3>
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="mt-2 text-red-500">{error}</p>}

          {/* Loading Message */}
          {loading && (
            <div className="p-4 mt-4 border border-gray-300 rounded-lg">
              <p>Loading...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AskCurie;