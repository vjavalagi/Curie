function PDFDownload(pdfUrl, pdfTitle) {
  const baseUrl = 'http://127.0.0.1:5001/api/download-pdf';
  
  console.log("Sending PDF download request with:", { pdf_url: pdfUrl, title: pdfTitle });

  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pdf_url: pdfUrl, title: pdfTitle })
  })
  .then(response => response.json())
  .then(data => {
      console.log("PDF Download Response:", data);
      return data;
  })
  .catch(error => {
      console.error("Download failed:", error);
  });
}

export { PDFDownload };

async function checkPdfExists(pdfUrl) {
  try {
      console.log("Checking PDF existence for:", pdfUrl);

      // Send a HEAD request to check the HTTP status
      const response = await fetch(pdfUrl, { method: 'HEAD' });

      if (response.status === 200) {
          console.log("✅ PDF exists:", pdfUrl);
          return true; // PDF is available
      } 
      
      if (response.status === 404) {
          console.log("❌ PDF not found (404):", pdfUrl);
          return false; // PDF is missing
      }

      console.log("⚠️ Unexpected response status:", response.status);
      return false; // Treat any other status as missing
  } catch (error) {
      console.error("Error checking PDF existence:", error);
      return false;
  }
}

export { checkPdfExists };




//] function with your PDF URL Here is an exmpale
// PDFDownload("https://www.mdpi.com/2079-8954/12/3/103/pdf?version=1710867327")
//   .then(data => {
//     console.log("PDF downloaded successfully:", data);
//   })
//   .catch(error => {
//     console.error("An error occurred:", error);
//   });