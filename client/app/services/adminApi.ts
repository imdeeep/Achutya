import axios from "axios";

const API_URL = "http://localhost:3000/api";

// User API calls
export const userApi = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  },
};

// Destination API calls
export const destinationApi = {
  getAllDestinations: async () => {
    const response = await axios.get(`${API_URL}/destinations/`);
    return response.data;
  },
  getDestinationById: async (id: string) => {
    const response = await axios.get(`${API_URL}/destinations/${id}`);
    return response.data;
  },
  createDestination: async (destinationData: any) => {
    const response = await axios.post(
      `${API_URL}/destinations/`,
      destinationData
    );
    return response.data;
  },
  editDestination: async (id: string, destinationData: any) => {
    const response = await axios.put(
      `${API_URL}/destinations/${id}`,
      destinationData
    );
    return response.data;
  },
  deleteDestination: async (id: string) => {
    const response = await axios.delete(`${API_URL}/destinations/${id}`);
    return response.data;
  },
  getDestinationsBySearch: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/destinations/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching destinations:", error);
      throw error;
    }
  },
};

// Tours and Itinerary API calls
export const tourApi = {
  getAllTours: async () => {
    const response = await axios.get(`${API_URL}/tour/admin/all`);
    return response.data;
  },

  getTour: async (id: string) => {
    const response = await axios.get(`${API_URL}/tour/${id}`);
    return response.data;
  },

  getTourByDestination: async (id: string) => {
    const response = await axios.get(`${API_URL}/tour/destination/${id}`);
    return response.data;
  },

  createTour: async (tourData: any) => {
    const response = await axios.post(`${API_URL}/tour/`, tourData);
    return response.data;
  },

  updateTour: async (id: string, tourData: any) => {
    const response = await axios.put(`${API_URL}/tour/${id}`, tourData);
    return response.data;
  },

  searchTour: async (query: string) => {
    const response = await axios.get(`${API_URL}/tour/search?q=${query}`);
    return response.data;
  },

  deleteTour: async (id: string) => {
    const response = await axios.delete(`${API_URL}/tour/${id}/permanent`);
    return response.data;
  },

  softDeleteTour: async (id: string) => {
    const response = await axios.delete(`${API_URL}/tour/${id}`);
    return response.data;
  },

  getAvailableDates: async (id: string) => {
    const response = await axios.get(`${API_URL}/tour/${id}/available-dates`);
    return response.data;
  },

  addAvailableDates: async (id: string, dates: string[]) => {
    const response = await axios.post(
      `${API_URL}/tour/${id}/available-dates`,
      dates
    );
    return response.data;
  },
  updateAvailableDates: async (id: string, dateId: string, dates: string[]) => {
    const response = await axios.put(
      `${API_URL}/tour/${id}/available-dates/${dateId}`,
      dates
    );
    return response.data;
  },
};
