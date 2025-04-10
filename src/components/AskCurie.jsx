import { useState , useEffect} from 'react';
import { useGlobal } from '../context/GlobalContext';
import axios from 'axios';

const AskCurie = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
            console.log("ASK CURIE NAME", name);
            console.log("ASK CURIE QUESTION", question);
            console.log("ASK CURIE ACTIVE PAPER", activePaper);

            const response = await axios.get("http://localhost:5001/api/ask-curie", {
                params: {
                    name: name,
                    question: question,
                },
            });

            console.log(response.data);
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
        <div>
            {/* Header */}
            <h2 className="text-lg font-semibold mb-4">Ask Curie</h2>

            {/* Input Field */}
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Ask Curie a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            {/* Ask Button */}
            <button
                className="bg-curieBlue text-white px-4 py-2 rounded-lg"
                onClick={handleAskCurie}
                disabled={loading}
            >
                {loading ? "Loading..." : "Ask"}
            </button>

            {/* Reset Button */}
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                onClick={handleReset}
            >
                Reset
            </button>

            {/* Answer Section */}
            {answer && !loading && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold">Answer:</h3>
                    <p>{answer}</p>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Loading Message */}
            {loading && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default AskCurie;