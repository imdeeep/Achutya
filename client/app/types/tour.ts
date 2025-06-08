export interface TourFeature {
  title: string;
  description: string;
}

export interface TourOverview {
  description: string;
  features: TourFeature[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string;
  distance?: string;
  duration?: string;
}

export interface TourData {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  rating: number;
  reviewCount: number;
  duration: string;
  maxGroupSize: number;
  heroImage: string;
  difficulty: string;
  price: number;
  originalPrice: number;
  discount: number;
  overview: TourOverview;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  essentials: string[];
  notes: string[];
  imageUrl?: string;
}

export type TabType =
  | "overview"
  | "itinerary"
  | "inclusions"
  | "essentials"
  | "notes";

export interface TabConfig {
  id: TabType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
