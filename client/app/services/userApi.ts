import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});
  
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log(token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });

// Destination APIs
export const destinationApi = {
  getAllDestination : async( ) => {
    const response = await axios.get(`${API_URL}/destinations`);
    return response.data;
  },
  getDestinationById : async(id : string) => {
    const response = await axios.get(`${API_URL}/destinations/${id}`);
    return response.data;
  },
  getDestinationByName : async(name:string) => {
    const response = await axios.get(`${API_URL}/destinations/name/${name}`);
    return response.data;
  },
  searchDestination : async(query:string) => {
    const response = await axios.get(`${API_URL}/destinations/search?query=${query}`);
    return response.data;
  }
}

// Tour APIs
export const tourApi = {
  getAllTours : async() => {
    const response = await axios.get(`${API_URL}/tour/admin/all`);
    return response.data;
  },
  getTourById : async(id : string) => {
    const response = await axios.get(`${API_URL}/tour/${id}`);
    return response.data;
  },
  getTourByDestination : async(id : string) => {
    const response = await axios.get(`${API_URL}/tour/destination/${id}`);
    return response.data;
  },
  searchTour : async(query : string) => {
    const response = await axios.get(`${API_URL}/tour/search?q=${query}`);
    return response.data;
  },
  getAvailableDates : async(id : string) => {
    const response = await axios.get(`${API_URL}/tour/${id}/available-dates`);
    return response.data;
  },
}

// Booking APIs
export const bookingApi = {
  getUserBooking: async(id:string) => {
    const response = await api.get(`${API_URL}/book/user/${id}`);
    return response.data;
  },
  getSingleBooking : async(bookingId : string) => {
    const response = await api.get(`${API_URL}/book/${bookingId}`);
    return response.data;
  },
  createBooking : async(booking : any) => {
    const response = await api.post(`${API_URL}/book/create-payment-order`, booking);
    return response.data;
  },
  completeBooking : async(data : any) => {
    const response = await api.post(`${API_URL}/book/complete-booking`, data);
    return response.data;
  },
  cancelBooking : async(bookingId : string,reason:any) => {
    const response = await api.put(`${API_URL}/book/${bookingId}/cancel`,reason);
    return response.data;
  },
}