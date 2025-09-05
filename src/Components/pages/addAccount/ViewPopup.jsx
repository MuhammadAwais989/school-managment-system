import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewPopup = ({ data, onClose, title = "Details", imageKey = "profilePic", fields = [] }) => {
  if (!data) return null;

  const downloadPDF = () => {
    // Create a temporary container for PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '600px';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';

    // Build the PDF content
    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #e11d48; font-size: 24px; margin-bottom: 15px;">${title}</h2>
        ${data[imageKey] ? `<img src="${data[imageKey]}" style="width: 100px; height: 100px; margin-left: 40%; border-radius: 50%; object-fit: cover; border: 2px solid #f43f5e;" />` : ''}
       
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${fields.map(field => `
          <div style="padding: 8px; border-bottom: 1px solid #eee;">
            <strong style="color: #374151;">${field.label}:</strong> 
            <span style="margin-left: 8px;">${data[field.key] || 'N/A'}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Add to document
    document.body.appendChild(pdfContainer);

    // Generate PDF
    html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.name || 'student'}_details.pdf`);

      // Clean up
      document.body.removeChild(pdfContainer);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(pdfContainer);
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

        {/* Header with title and buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-rose-600">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 hover:bg-rose-100 hover:text-rose-700 rounded-full transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Profile Image */}
        {data[imageKey] && (
          <div className="flex justify-center mb-6">
            <img
              src={data[imageKey]}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-rose-400"
            />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          {fields.map((field, index) => (
            <div
              key={index}
              className={field.fullWidth ? "sm:col-span-2 border-b pb-2" : "border-b pb-2"}
            >
              <span className="font-medium text-gray-900">{field.label}:</span>
              <span className="ml-2">{data[field.key] || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;