const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export async function fetchTimeline({ subject = 'generative ai' } = {}) {
    const baseUrl = `${API_BASE_URL}/api/timeline`
    const params = new URLSearchParams({ subject });
    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching timeline from:", url);
  
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        // Return the papers array directly
        return data.papers || [];
      } catch (error) {
        console.error('Error fetching timeline:', error);
        throw error;
      }
  }
  