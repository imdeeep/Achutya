import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// User API calls
export const userApi = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  }
};

// Tour API calls
export const tourApi = {
  getAllTours: async () => {
    const response = await axios.get(`${API_URL}/tours`);
    return response.data;
  },

  getTour: async (id: string) => {
    const response = await axios.get(`${API_URL}/tours/${id}`);
    return response.data;
  },

  createTour: async (tourData: any) => {
    const response = await axios.post(`${API_URL}/tours`, tourData);
    return response.data;
  },

  updateTour: async (id: string, tourData: any) => {
    const response = await axios.put(`${API_URL}/tours/${id}`, tourData);
    return response.data;
  },

  deleteTour: async (id: string) => {
    const response = await axios.delete(`${API_URL}/tours/${id}`);
    return response.data;
  }
};

// Itinerary API calls
export const itineraryApi = {
  getAllItineraries: async () => {
    const response = await axios.get(`${API_URL}/itineraries`);
    return response.data;
  },

  getItinerary: async (id: string) => {
    const response = await axios.get(`${API_URL}/itineraries/${id}`);
    return response.data;
  },

  createItinerary: async (itineraryData: any) => {
    const response = await axios.post(`${API_URL}/itineraries`, itineraryData);
    return response.data;
  },

  updateItinerary: async (id: string, itineraryData: any) => {
    const response = await axios.put(`${API_URL}/itineraries/${id}`, itineraryData);
    return response.data;
  },

  deleteItinerary: async (id: string) => {
    const response = await axios.delete(`${API_URL}/itineraries/${id}`);
    return response.data;
  }
};