import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onLimitChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-slate-800 border-t border-slate-700 text-sm text-slate-400">
      
      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-1.5 focus:border-blue-500 outline-none"
        >
          <option value={5}>5 (For quick test)</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-xs text-slate-500">Total: {totalItems} entries</span>
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
        >
          Previous
        </button>
        
        <span className="text-xs font-medium text-slate-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;