import React from "react";

export default function PdfViewer({ pdfUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full h-5/6 flex flex-col">
        {/* Close Button */}
        <button
          className="self-end bg-red-500 text-white px-3 py-1 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>

        {/* PDF Viewer in an iframe */}
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className="flex-1 w-full h-full border-none"
        />
      </div>
    </div>
  );
}
