import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export const userService = {
  // Read
  getUsers: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data.map(user => {
        const nameParts = user.name.split(' ');
        return {
          id: user.id,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' ') || 'N/A',
          email: user.email,
          department: user.company?.name || 'General',
        };
      });
    } catch (error) {
      throw new Error('Failed to fetch users.');
    }
  },

  // Create (Mocked)
  createUser: async (user) => {
    try {
      // JSONPlaceholder expects the original structure, but handles mock posts fine
      const response = await axios.post(BASE_URL, user);
      return response.data; 
    } catch (error) {
      throw new Error('Failed to add user.');
    }
  },

  // Update (Mocked)
  updateUser: async (id, user) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user.');
    }
  },

  // Delete (Mocked)
  deleteUser: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete user.');
    }
  }
};