import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Instructor API calls
export const instructorApi = {
  // Get all instructors (public)
  getAll: async () => {
    try {
      const response = await api.get('/instructors');
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  // Get featured instructors (public)
  getFeatured: async () => {
    try {
      const response = await api.get('/instructors/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured instructors:', error);
      throw error;
    }
  },

  // Get single instructor (public)
  getById: async (id) => {
    try {
      const response = await api.get(`/instructors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor:', error);
      throw error;
    }
  },

  // Create instructor (Admin only)
  create: async (instructorData) => {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(instructorData).forEach(key => {
        if (instructorData[key] !== null && instructorData[key] !== undefined && instructorData[key] !== '') {
          formData.append(key, instructorData[key]);
        }
      });

      const response = await api.post('/admin/instructors', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating instructor:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Update instructor (Admin only)
  update: async (id, instructorData) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel method spoofing
      
      Object.keys(instructorData).forEach(key => {
        if (instructorData[key] !== null && instructorData[key] !== undefined && instructorData[key] !== '') {
          formData.append(key, instructorData[key]);
        }
      });

      const response = await api.post(`/admin/instructors/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }
  },

  // Delete instructor (Admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/admin/instructors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }
  }
,
  // Request instructor profile (User submits request)
  request: async (instructorData) => {
    try {
      const formData = new FormData();
      Object.keys(instructorData).forEach(key => {
        if (instructorData[key] !== null && instructorData[key] !== undefined && instructorData[key] !== '') {
          formData.append(key, instructorData[key]);
        }
      });

      // Try a dedicated endpoint for user requests; fallback to /instructors if not available
      try {
        const response = await api.post('/instructors/requests', formData);
        return response.data;
      } catch (err) {
        const response = await api.post('/instructors', formData);
        return response.data;
      }
    } catch (error) {
      console.error('Error requesting instructor profile:', error);
      throw error;
    }
  }
};

export default instructorApi;
