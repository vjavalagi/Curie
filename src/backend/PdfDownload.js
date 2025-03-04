function PDFDownload(pdfUrl, pdfTitle) {
    const baseUrl = 'http://127.0.0.1:5001/api/download-pdf';
    
    console.log("Sending PDF download request with title:", pdfTitle);
    return fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: pdfUrl, title: pdfTitle })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      return response.json();
    });
  }

  
export { PDFDownload };
  
//] function with your PDF URL Here is an exmpale
// PDFDownload("https://www.mdpi.com/2079-8954/12/3/103/pdf?version=1710867327")
//   .then(data => {
//     console.log("PDF downloaded successfully:", data);
//   })
//   .catch(error => {
//     console.error("An error occurred:", error);
//   });