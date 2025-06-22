export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  startDate: string;
  endDate: string;
  // Add more fields as needed
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  // Add more fields as needed
}

export interface Booking {
  id: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  date: string;
  totalAmount: number;
  itinerary: Itinerary;
  // Add more fields as needed
}

export interface BookingDetails extends Booking {
  paymentId: string;
  userDetails: UserDetails;
  guests: number;
  // Add more fields as needed
}
