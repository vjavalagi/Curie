function PDFDownload(pdfUrl) {
    const baseUrl = 'http://127.0.0.1:5001/api/download-pdf';
    
    return fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: pdfUrl })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`error: ${response.status}`);
      }
      return response.json();
    });
  }

  
  export default PDFDownload;
  