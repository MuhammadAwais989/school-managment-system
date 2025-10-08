import React from 'react';
import { FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { showSuccess } from '../utils/Toast';
import { showError } from '../utils/Toast';

const ExcelExport = ({ 
  data, 
  fileName = "Exported_Data", 
  sheetName = "Data",
  buttonText = "Export Excel",
  className = "",
  disabled = false 
}) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      showError("No data available to export");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      showSuccess("Data exported to Excel successfully");
    } catch (error) {
      console.error("Export error:", error);
      showError("Failed to export data to Excel");
    }
  };

  return (
    <button
      onClick={exportToExcel}
    //   disabled={disabled || !data || data.length === 0}
      className={`flex items-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <FaFileExport className="mr-2" />
      <span className="hidden sm:inline">{buttonText}</span>
    </button>
  );
};

export default ExcelExport;