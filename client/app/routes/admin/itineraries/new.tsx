import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  Users,
  MapPin,
  Tag,
  Info,
  ImageIcon,
  Globe,
  Clock,
  DollarSign,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as LucideImage
} from "lucide-react";
import { tourApi, destinationApi } from "~/services/adminApi";
import { API_URL } from "~/lib/baseurl";
import imageCompression from 'browser-image-compression';

interface ModernDatePickerProps {
  value: string | null;
  onChange: (date: string) => void;
  label: string;
  placeholder?: string;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date: string | null): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date | null): void => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !value) return false;
    const selectedDate = new Date(value);
    return date.toDateString() === selectedDate.toDateString();
  };

  const days: (Date | null)[] = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-gray-900">{monthYear}</h3>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date: Date | null, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDateSelect(date)}
                disabled={!date}
                className={`
                  p-2 text-sm rounded-lg transition-colors relative
                  ${!date ? "invisible" : ""}
                  ${
                    isSelected(date)
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : isToday(date)
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                {date?.getDate()}
                {isToday(date) && !isSelected(date) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Today button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="w-full px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

interface AvailableDate {
  startDate: string;
  endDate: string;
  price: number;
  availableSlots: number;
  bookedSlots: number;
  isAvailable: boolean;
  notes?: string;
}

interface Feature {
  title: string;
  description: string;
}

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  distance?: string;
  duration?: string;
  accommodation: string;
  meals: string;
}

interface TourFormData {
  title: string;
  isFeatured?: boolean; 
  subtitle: string;
  description: string;
  image: string;
  heroImage: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  groupType: string;
  maxGroupSize: number;
  difficulty: string;
  destination: string;
  country: string;
  city: string;
  location: string;
  additionalDestinations: string[];
  availableDates: AvailableDate[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  essentials: string[];
  notes: string[];
  features: Feature[];
  itinerary: DayItinerary[];
  isActive: boolean;
  slug: string;
}

interface Destination {
  _id: string;
  name: string;
  city: string;
  country: string;
}

type ArrayField =
  | "highlights"
  | "inclusions"
  | "exclusions"
  | "essentials"
  | "notes"
  | "additionalDestinations";

const initialFormData: TourFormData = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  heroImage: "",
  duration: "",
  price: 0,
  originalPrice: 0,
  discount: 0,
  groupType: "Group",
  maxGroupSize: 16,
  difficulty: "Easy",
  destination: "",
  country: "",
  city: "",
  location: "",
  additionalDestinations: [],
  availableDates: [
    {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: 0,
      availableSlots: 20,
      bookedSlots: 0,
      isAvailable: true,
      notes: "",
    },
  ],
  highlights: [""],
  inclusions: [""],
  exclusions: [""],
  essentials: [""],
  notes: [""],
  features: [{ title: "", description: "" }],
  itinerary: [
    {
      day: 1,
      title: "",
      description: "",
      activities: [""],
      accommodation: "",
      meals: "",
    },
  ],
  isActive: true,
  slug: "",
};

export default function NewItinerary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const searchDestinations = async (name: string) => {
    if (!name.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await destinationApi.getDestinationsBySearch(name); // updated method
      if (response.success) {
        setSearchResults(response.data || []);
      }
    } catch (err) {
      console.error("Error searching destinations:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDestinations(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleInputChange = (field: keyof TourFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (
    field: ArrayField,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: ArrayField) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field: ArrayField, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          activities: [""],
          accommodation: "",
          meals: "",
        },
      ],
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({
          ...day,
          day: i + 1,
        })),
    }));
  };

  const updateItinerary = (
    index: number,
    field: keyof DayItinerary,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      ),
    }));
  };

  const addAvailableDate = () => {
    setFormData((prev) => ({
      ...prev,
      availableDates: [
        ...prev.availableDates,
        {
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          price: 0,
          availableSlots: 20,
          bookedSlots: 0,
          isAvailable: true,
          notes: "",
        },
      ],
    }));
  };

  const removeAvailableDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index),
    }));
  };

  const updateAvailableDate = (
    index: number,
    field: keyof AvailableDate,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.duration ||
        !formData.price
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Generate slug from title if not provided
      const tourData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        // Convert availableDates to proper format
        availableDates: formData.availableDates.map((date) => ({
          ...date,
          startDate: new Date(date.startDate).toISOString(),
          endDate: new Date(date.endDate).toISOString(),
        })),
      };

      // Create the tour using the API
      const response = await tourApi.createTour(tourData);

      if (response.success) {
        navigate("/admin/itineraries");
      } else {
        throw new Error(response.error || "Failed to create tour");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tour");
      console.error("Error creating tour:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    try {
      type === 'image' ? setUploadingImage(true) : setUploadingHeroImage(true);
      // Lossless compression (or as close as possible)
      const compressedFile = await imageCompression(file, {
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        initialQuality: 1.0,
        fileType: file.type,
        alwaysKeepResolution: true,
      });
      const formDataUpload = new FormData();
      formDataUpload.append('image', compressedFile);
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, [type]: data.url }));
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      type === 'image' ? setUploadingImage(false) : setUploadingHeroImage(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "details", label: "Details", icon: Tag },
    { id: "dates", label: "Dates & Pricing", icon: Calendar },
    { id: "content", label: "Content", icon: Star },
    { id: "itinerary", label: "Itinerary", icon: MapPin },
  ];

  const renderArrayField = (
    field: ArrayField,
    label: string,
    placeholder: string,
    icon: React.ElementType
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-emerald-600" />
          <label className="text-sm font-semibold text-gray-900">{label}</label>
        </div>
        {formData[field].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayFieldChange(field, index, e.target.value)
              }
              placeholder={placeholder}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {formData[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField(field, index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField(field)}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {label.slice(0, -1)}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/itineraries"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Tours
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-gray-600 hover:text-gray-900 italic">
                Create New Tour
              </h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Basic Information
                    </h2>
                    <p className="text-gray-600">
                      Essential details about your tour package
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured || false}
                          onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                          className="sr-only peer"  // Hide default checkbox
                        />
                        {/* Toggle Switch */}
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {formData.isFeatured ? "Featured" : "Not Featured"}
                        </span>
                      </label>
                    </div>
                    <span className="text-sm text-gray-500">Note: The featured tour will be highlighted on home page</span>
                    <div className="lg:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        Tour Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter tour title"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Star className="w-4 h-4 text-emerald-600" />
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          handleInputChange("subtitle", e.target.value)
                        }
                        placeholder="Enter subtitle"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Info className="w-4 h-4 text-emerald-600" />
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your tour package"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        Tour Image
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label
                            htmlFor="image-upload"
                            className={`relative cursor-pointer flex justify-center items-center w-full border border-gray-300 border-dashed rounded-lg p-6 group hover:border-emerald-500 transition-colors ${uploadingImage ? 'bg-gray-50' : ''}`}
                          >
                            <div className="text-center">
                              {uploadingImage ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                              ) : formData.image ? (
                                <div className="relative">
                                  <img
                                    src={formData.image}
                                    alt="Thumbnail preview"
                                    className="max-h-32 mx-auto rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <LucideImage className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="mt-2">
                                    <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                                      Upload image
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'image')}
                              className="sr-only"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        Hero Image
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label
                            htmlFor="hero-image-upload"
                            className={`relative cursor-pointer flex justify-center items-center w-full border border-gray-300 border-dashed rounded-lg p-6 group hover:border-emerald-500 transition-colors ${uploadingHeroImage ? 'bg-gray-50' : ''}`}
                          >
                            <div className="text-center">
                              {uploadingHeroImage ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                              ) : formData.heroImage ? (
                                <div className="relative">
                                  <img
                                    src={formData.heroImage}
                                    alt="Hero image preview"
                                    className="max-h-32 mx-auto rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                                    className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <LucideImage className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="mt-2">
                                    <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                                      Upload hero image
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="hero-image-upload"
                              name="hero-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'heroImage')}
                              className="sr-only"
                              disabled={uploadingHeroImage}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Tour Details
                    </h2>
                    <p className="text-gray-600">
                      Configure tour specifications and location
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        placeholder="e.g., 7N - 8D"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Users className="w-4 h-4 text-emerald-600" />
                        Group Type
                      </label>
                      <select
                        value={formData.groupType}
                        onChange={(e) =>
                          handleInputChange("groupType", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="Group">Group</option>
                        <option value="Private">Private</option>
                        <option value="Individual">Individual</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Users className="w-4 h-4 text-emerald-600" />
                        Max Group Size
                      </label>
                      <input
                        type="number"
                        value={formData.maxGroupSize}
                        onChange={(e) =>
                          handleInputChange(
                            "maxGroupSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Star className="w-4 h-4 text-emerald-600" />
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) =>
                          handleInputChange("difficulty", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Challenging">Challenging</option>
                        <option value="Difficult">Difficult</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        Destination Name
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search destination..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />

                      {/* Search Results Dropdown */}
                      {searchTerm &&
                        (isSearching || searchResults.length > 0) && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {isSearching ? (
                              <div className="px-4 py-3 text-gray-500">
                                Searching...
                              </div>
                            ) : (
                              <>
                                {searchResults.map((dest) => (
                                  <button
                                    key={dest._id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedDestination(dest);
                                      handleInputChange(
                                        "destination",
                                        dest._id
                                      );
                                      setSearchTerm(
                                        `${dest.name} - ${dest.city}, ${dest.country}`
                                      );
                                      setSearchResults([]);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-medium">
                                      {dest.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {dest.city}, {dest.country}
                                    </div>
                                  </button>
                                ))}
                                {searchResults.length === 0 && (
                                  <div className="px-4 py-3 text-gray-500">
                                    No destinations found
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Selected Destination Display */}
                    {selectedDestination && (
                      <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="text-sm font-medium text-emerald-800">
                          Selected:
                        </div>
                        <div className="text-sm text-emerald-700">
                          {selectedDestination.name} -{" "}
                          {selectedDestination.city},{" "}
                          {selectedDestination.country}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="International">International</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="e.g., Kochi"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="e.g., Kerala, India"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dates & Pricing Tab */}
              {activeTab === "dates" && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Dates & Pricing
                    </h2>
                    <p className="text-gray-600">
                      Set tour prices and available dates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Price *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", parseInt(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Original Price
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "originalPrice",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        Discount %
                      </label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) =>
                          handleInputChange(
                            "discount",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Available Dates
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={addAvailableDate}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Date
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.availableDates.map((date, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-xl">
                          <ModernDatePicker
                            value={date.startDate}
                            onChange={(value) =>
                              updateAvailableDate(index, "startDate", value)
                            }
                            label="Start Date"
                            placeholder="Select start date"
                          />
                          <ModernDatePicker
                            value={date.endDate}
                            onChange={(value) =>
                              updateAvailableDate(index, "endDate", value)
                            }
                            label="End Date"
                            placeholder="Select end date"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Booked Slots
                              </label>
                              <input
                                type="number"
                                value={date.bookedSlots}
                                onChange={(e) =>
                                  updateAvailableDate(
                                    index,
                                    "bookedSlots",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={date.isAvailable}
                                  onChange={(e) =>
                                    updateAvailableDate(
                                      index,
                                      "isAvailable",
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                Available for booking
                              </label>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Notes
                            </label>
                            <input
                              type="text"
                              value={date.notes || ""}
                              onChange={(e) =>
                                updateAvailableDate(
                                  index,
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Additional notes for this date"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          {formData.availableDates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAvailableDate(index)}
                              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove Date
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === "content" && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Tour Content
                    </h2>
                    <p className="text-gray-600">
                      Highlights, inclusions, and other tour details
                    </p>
                  </div>

                  <div className="space-y-8">
                    {renderArrayField(
                      "highlights",
                      "Highlights",
                      "Enter tour highlight",
                      Star
                    )}
                    {renderArrayField(
                      "inclusions",
                      "Inclusions",
                      "What's included in the tour",
                      Check
                    )}
                    {renderArrayField(
                      "exclusions",
                      "Exclusions",
                      "What's not included",
                      X
                    )}
                    {renderArrayField(
                      "essentials",
                      "Essentials",
                      "What to bring/know",
                      Info
                    )}
                    {renderArrayField(
                      "notes",
                      "Notes",
                      "Additional information",
                      Info
                    )}

                    {/* Features Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-emerald-600" />
                          <label className="text-sm font-semibold text-gray-900">
                            Features
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={addFeature}
                          className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Feature
                        </button>
                      </div>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) =>
                                updateFeature(index, "title", e.target.value)
                              }
                              placeholder="Feature title"
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={feature.description}
                              onChange={(e) =>
                                updateFeature(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Feature description"
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          {formData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove Feature
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === "itinerary" && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          Tour Itinerary
                        </h2>
                        <p className="text-gray-600">
                          Day-by-day schedule of your tour
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addItineraryDay}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Day
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {formData.itinerary.map((day, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Day {day.day}
                          </h3>
                          {formData.itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Title
                            </label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) =>
                                updateItinerary(index, "title", e.target.value)
                              }
                              placeholder="Day title"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Accommodation
                            </label>
                            <input
                              type="text"
                              value={day.accommodation}
                              onChange={(e) =>
                                updateItinerary(
                                  index,
                                  "accommodation",
                                  e.target.value
                                )
                              }
                              placeholder="Hotel/accommodation type"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Distance
                            </label>
                            <input
                              type="text"
                              value={day.distance || ""}
                              onChange={(e) =>
                                updateItinerary(
                                  index,
                                  "distance",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 130 km"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={day.duration || ""}
                              onChange={(e) =>
                                updateItinerary(
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 5 hours"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Meals
                            </label>
                            <input
                              type="text"
                              value={day.meals}
                              onChange={(e) =>
                                updateItinerary(index, "meals", e.target.value)
                              }
                              placeholder="e.g., Breakfast, Dinner"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Description
                          </label>
                          <textarea
                            value={day.description}
                            onChange={(e) =>
                              updateItinerary(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Describe the day's activities"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Activities
                          </label>
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => {
                                  const newActivities = [...day.activities];
                                  newActivities[actIndex] = e.target.value;
                                  updateItinerary(
                                    index,
                                    "activities",
                                    newActivities
                                  );
                                }}
                                placeholder="Activity description"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                              {day.activities.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newActivities = day.activities.filter(
                                      (_, i) => i !== actIndex
                                    );
                                    updateItinerary(
                                      index,
                                      "activities",
                                      newActivities
                                    );
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newActivities = [...day.activities, ""];
                              updateItinerary(
                                index,
                                "activities",
                                newActivities
                              );
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
