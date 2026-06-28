import React from 'react';

const FilterPopup = ({ isOpen, onClose, filters, onFilterChange, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-40 text-slate-200 animate-fadeIn">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
        <span className="font-bold text-sm text-slate-400">Advanced Filters</span>
        <button onClick={onReset} className="text-xs text-blue-400 hover:underline">Reset All</button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">First Name</label>
          <input
            type="text"
            className="w-full p-2 text-xs bg-slate-900 border border-slate-700 rounded-md focus:border-blue-500 outline-none text-slate-100"
            placeholder="Filter by first name..."
            value={filters.firstName}
            onChange={(e) => onFilterChange('firstName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Last Name</label>
          <input
            type="text"
            className="w-full p-2 text-xs bg-slate-900 border border-slate-700 rounded-md focus:border-blue-500 outline-none text-slate-100"
            placeholder="Filter by last name..."
            value={filters.lastName}
            onChange={(e) => onFilterChange('lastName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
          <input
            type="text"
            className="w-full p-2 text-xs bg-slate-900 border border-slate-700 rounded-md focus:border-blue-500 outline-none text-slate-100"
            placeholder="Filter by email..."
            value={filters.email}
            onChange={(e) => onFilterChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Department</label>
          <input
            type="text"
            className="w-full p-2 text-xs bg-slate-900 border border-slate-700 rounded-md focus:border-blue-500 outline-none text-slate-100"
            placeholder="Filter by department..."
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs py-2 rounded-md transition"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPopup;