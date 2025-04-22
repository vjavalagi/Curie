const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

function PDFDownload(user, paper) {
  const baseUrl = `${API_BASE_URL}/api/download-pdf`;
  console.log("Downloading PDF", paper);
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, paper})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }
    return response.json();
  });
}

export { PDFDownload };

// Example usage:
// PDFDownload({ entry_id: "1234.56789", title: "example.pdf" })
//   .then(data => {
//     console.log("PDF downloaded successfully:", data);
//   })
//   .catch(error => {
//     console.error("An error occurred:", error);
//   });