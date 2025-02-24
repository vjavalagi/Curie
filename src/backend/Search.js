function searchAPI({
  query = "generative ai",
  year = "2020-",
  onlyOpenAccess = true,
  fields = "title,url,publicationTypes,publicationDate,openAccessPdf",
} = {}) {
  const baseUrl = "http://127.0.0.1:5001/api/search";

  // Build the query parameters
  const params = new URLSearchParams({
    query,
    year,
    fields,
    only_open_access: onlyOpenAccess.toString(),
  });

  const url = `${baseUrl}?${params.toString()}`;
  console.log("Fetching from:", url);

  // Perform the GET request using fetch
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}

export {searchAPI}