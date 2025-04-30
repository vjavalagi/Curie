import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AskCurie = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);

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
      const response = await axios.get(`${API_BASE_URL}/api/ask-curie`, {
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-gray-800">Ask Curie</h2>
        <span className="text-sm text-gray-600">
          {isOpen ? "▼" : "▶"}
        </span>
      </div>

      {isOpen && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Ask Curie a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="flex justify-end items-center gap-3">
            <button
              className="inline-flex items-center rounded-lg bg-curieBlue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              onClick={handleAskCurie}
              disabled={loading}
            >
              {loading ? "Loading..." : "Ask"}
            </button>
            <button
              className="inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {loading && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <p>Loading...</p>
            </div>
          )}

          {answer && !loading && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900">Answer:</h3>
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AskCurie;
