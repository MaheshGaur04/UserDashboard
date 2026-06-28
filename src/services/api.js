import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userService = {
  // Get users (keeps your original logic)
  getUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.map(user => {
      const nameParts = user.name ? user.name.split(' ') : ['System', 'User'];
      return {
        id: user.id,
        firstName: nameParts[0] || 'System',
        lastName: nameParts.slice(1).join(' ') || 'User',
        email: user.email || 'N/A',
        department: user.company?.bs || 'Engineering',
      };
    });
  },

  // Create user (keeps your original logic)
  createUser: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  },

  // 🛠️ FIXED: Update User with safety fallback guard
  updateUser: async (id, userData) => {
    try {
      // If the ID is a number (1-10), hit the mock API successfully
      if (typeof id === 'number') {
        const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
        return response.data;
      }
      // If it's a custom local string ID, skip the mock API call entirely 
      // since the remote server doesn't know about it anyway!
      return userData;
    } catch (error) {
      console.warn(`API PUT failed for ID ${id} (Falling back to local state updates):`, error.message);
      return userData; // Fallback so front-end still edits seamlessly!
    }
  },

  // 🛠️ FIXED: Delete User with safety fallback guard
  deleteUser: async (id) => {
    try {
      if (typeof id === 'number') {
        const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
        return response.data;
      }
      return { success: true };
    } catch (error) {
      console.warn(`API DELETE failed for ID ${id} (Falling back to local state updates):`, error.message);
      return { success: true }; // Fallback so front-end still deletes seamlessly!
    }
  }
};