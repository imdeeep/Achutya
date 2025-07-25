import axios from "axios";
import { API_URL } from "~/lib/baseurl";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API calls
export const userApi = {
  getAllUsers: async () => {
    const response = await api.get("/users/");
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post("/users/", userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Destination API calls
export const destinationApi = {
  getAllDestinations: async () => {
    const response = await api.get("/destinations/");
    return response.data;
  },
  getDestinationById: async (id: string) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },
  createDestination: async (destinationData: any) => {
    const response = await api.post("/destinations/", destinationData);
    return response.data;
  },
  editDestination: async (id: string, destinationData: any) => {
    const response = await api.put(`/destinations/${id}`, destinationData);
    return response.data;
  },
  deleteDestination: async (id: string) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },
  getDestinationsBySearch: async (query: string) => {
    try {
      const response = await api.get(`/destinations/search?query=${query}`);
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
    const response = await api.get("/tour/admin/all");
    return response.data;
  },

  getTour: async (id: string) => {
    const response = await api.get(`/tour/${id}`);
    return response.data;
  },

  getTourByDestination: async (id: string) => {
    const response = await api.get(`/tour/destination/${id}`);
    return response.data;
  },

  createTour: async (tourData: any) => {
    const response = await api.post("/tour/", tourData);
    return response.data;
  },

  updateTour: async (id: string, tourData: any) => {
    const response = await api.put(`/tour/${id}`, tourData);
    return response.data;
  },

  searchTour: async (query: string) => {
    const response = await api.get(`/tour/search?q=${query}`);
    return response.data;
  },

  deleteTour: async (id: string) => {
    const response = await api.delete(`/tour/${id}/permanent`);
    return response.data;
  },

  softDeleteTour: async (id: string) => {
    const response = await api.delete(`/tour/${id}`);
    return response.data;
  },

  getAvailableDates: async (id: string) => {
    const response = await api.get(`/tour/${id}/available-dates`);
    return response.data;
  },

  addAvailableDates: async (id: string, dates: string[]) => {
    const response = await api.post(`/tour/${id}/available-dates`, dates);
    return response.data;
  },
  updateAvailableDates: async (id: string, dateId: string, dates: string[]) => {
    const response = await api.put(
      `/tour/${id}/available-dates/${dateId}`,
      dates
    );
    return response.data;
  },
   getTopFeaturedTours: async () => {
    const response = await api.get('/tour/featured/top');
    return response.data;
  },

  getAllFeaturedTours: async (limit = 10) => {
    const response = await api.get(`/tour/featured/latest?limit=${limit}`);
    return response.data;
  },
};

// Booking API calls
export const BookingApi = {
  getAllBookings: async () => {
    const response = await api.get("/book/admin/all");
    return response.data;
  },
  getBookingById: async (bookingId: string) => {
    const response = await api.get(`/book/${bookingId}`);
    return response.data;
  },
  cancelBooking: async (bookingId: string) => {
    const response = await api.put(`/book/${bookingId}/cancel`);
    return response.data;
  },
  updateBooking: async (id: string, status: string) => {
    const response = await api.patch(`/book/${id}/status`, { status });
    return response.data;
  },
};

// Stats
export const statsApi = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};


// Blog API calls
export const blogApi = {
  getAllBlogs: async () => {
    const response = await api.get("/blogs");
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blogData: any) => {
    const response = await api.post("/blogs/", blogData);
    return response.data;
  },

  updateBlog: async (id: string, blogData: any) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
  getFeaturedBlogs: async () => {
  const response = await api.get("/blogs/featured");
  return response.data;
},
};
