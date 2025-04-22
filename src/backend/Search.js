function searchAPI({ topic, limit } = {}) {
  const baseUrl = `${API_BASE_URL}/api/search`;
  // Build the query parameters
  const params = new URLSearchParams({
    topic,
    limit: limit.toString(),
  });

  const url = `${baseUrl}?${params.toString()}`;
  console.log("Fetching from:", url);

  // Perform the GET request using fetch
  return fetch(url, { mode: "cors" }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}

export { searchAPI };

// run example
