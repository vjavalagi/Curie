function searchAPI({
  query = "generative ai",
  year = "2005-",
  onlyOpenAccess = true,
  fields = "title,url,citationCount,publicationTypes,publicationDate,openAccessPdf",
} = {}) {
  const baseUrl = "http://127.0.0.1:5001/api/search";
  console.log("Initial Fields", fields);
  // Build the query parameters
  const params = new URLSearchParams({
    query,
    year,
    fields,
    only_open_access: onlyOpenAccess.toString(),
  });

  const url = `${baseUrl}?${params.toString()}`;
  console.log("Fields", fields);
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
