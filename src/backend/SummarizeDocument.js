async function SummarizeDocument(filepath) {
    const baseUrl = 'http://127.0.0.1:5001/api/summarize';
    try {
        // Build the complete URL with the file_path query parameter
        const url = `${baseUrl}?file_path=${encodeURIComponent(filepath)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response
        const data = await response.json();
        // Return the summary from the response
        return data.summary;
    } catch (error) {
        console.error("Error summarizing document:", error);
        throw error;
    }
}

export { SummarizeDocument };