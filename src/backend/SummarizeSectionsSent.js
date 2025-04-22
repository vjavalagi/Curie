const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

async function SummarizeSectionsSent(name, sentenceCount) {
    const baseUrl = `${API_BASE_URL}/api/summarize-sections-sent`;
    try {
        console.log(name, "name in SummarizeSectionsSent");
        // Build the complete URL with the file_path query parameter
        const url = `${baseUrl}?file_path=${encodeURIComponent(name)}&sentence_count=${sentenceCount}`;
        console.log("URL endpoint for summarize sections senr", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response
        const data = await response.json();
        // Return the summary from the response
        return data.summary;
    } catch (error) {
        console.error("Error summarizing sections:", error);
        throw error;
    }
}

export { SummarizeSectionsSent };

