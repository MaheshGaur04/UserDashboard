import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', department: '' });
  const [errors, setErrors] = useState({});

  // Populate form if we are editing an existing user
  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    } else {
      setFormData({ firstName: '', lastName: '', email: '', department: '' });
    }
    setErrors({});
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Client-side Validation Logic
  const validateForm = () => {
    let localErrors = {};
    if (!formData.firstName.trim()) localErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) localErrors.lastName = 'Last name is required';
    if (!formData.department.trim()) localErrors.department = 'Department is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      localErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      localErrors.email = 'Please enter a valid email address';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white text-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all scale-100">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-900">
          {currentUser ? '📝 Edit User Details' : '✨ Add New User'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
            <input 
              type="text"
              className={`w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
            <input 
              type="text"
              className={`w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
            <input 
              type="email"
              className={`w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Department</label>
            <input 
              type="text"
              className={`w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;