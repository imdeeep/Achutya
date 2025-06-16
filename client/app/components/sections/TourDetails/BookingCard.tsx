import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Types from your original code
interface TourData {
  id: string;
  title: string;
  price: number;
  maxGroupSize: number;
  description?: string;
  duration?: string;
  location?: string;
}

interface UserDetails {
  _id: null;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface BookingCardProps {
  tourData: TourData | null;
  onBookingSuccess?: (bookingId: string) => void;
}

// Declare Razorpay global
declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingCard: React.FC<BookingCardProps> = ({
  tourData,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    _id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<UserDetails & { date: string; general: string }>
  >({});
  const [step, setStep] = useState<"booking" | "details" | "summary">(
    "booking"
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Mock tour data for demo
  const defaultTourData: TourData = {
    id: "spiti-circuit",
    title: "7 Days Spiti Full Circuit Roadtrip",
    price: 23499,
    maxGroupSize: 16,
    description:
      "High Altitude Desert Adventure - Experience the pristine beauty of the Himalayas",
    duration: "7 Days",
    location: "Spiti Valley",
  };

  const activeTourData = tourData || defaultTourData;

  // Generate mock available dates (you can replace this with actual API call)
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();

      // Generate available dates for next 3 months
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Make some dates available (skip some randomly for demo)
        if (Math.random() > 0.3) {
          dates.push(date.toISOString().split("T")[0]);
        }
      }
      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails & { date: string; general: string }> =
      {};

    if (!selectedDate) {
      newErrors.date = "Please select a travel date";
    }

    if (!userDetails.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (userDetails.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(userDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(userDetails.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number";
    }

    if (!userDetails.address.trim()) {
      newErrors.address = "Address is required";
    } else if (userDetails.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = () => {
    if (step === "booking") {
      if (!selectedDate) {
        setErrors({ date: "Please select a travel date" });
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (validateForm()) {
        setStep("summary");
      }
    }
  };

  // booking function
  const handleBookNow = async () => {
    if (!selectedDate || !activeTourData) {
      alert("Please select a date for your tour");
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const totalAmount = activeTourData.price * guests;

      // Create payment order
      const response = await fetch("http://localhost:3000/api/booking/create-payment-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: activeTourData.id,
          tourDateId: selectedDate,
          numberOfGuests: guests,
          userDetails: {
            _id: userDetails._id || null,
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create payment");
      }

      const orderData = await response.json();

      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_pQLbxWbQ5iwwZe",
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "Achyuta Travel",
        description: `Booking for ${activeTourData.title}`,
        order_id: orderData.data.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(
              "http://localhost:3000/api/booking/complete-booking",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  tourId: activeTourData.id,
                  tourDateId: selectedDate,
                  numberOfGuests: guests,
                  userDetails: {
                    _id: userDetails._id || null,
                    name: userDetails.name,
                    email: userDetails.email,
                    phone: userDetails.phone
                  }
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            if (verifyData.success) {
              // Use the provided redirect URL or fallback to default
              const redirectUrl = `/booking?bookingId=${verifyData.data.booking._id}`;

              // If onBookingSuccess callback is provided, use it
              if (onBookingSuccess) {
                onBookingSuccess(verifyData.data.booking._id);
              } else {
                // Otherwise redirect to the confirmation page
                window.location.href = redirectUrl;
              }

              // Show success message
              alert("Booking confirmed! Redirecting to your booking details...");
            } else {
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            alert(`Payment verification failed: ${errorMessage}. Please contact support with order ID: ${response.razorpay_order_id}`);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: "#277A55"
        },
        modal: {
          confirm_close: true,
          escape: false,
          backdrop_close: false,
          handle_back: true
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || "Unknown error"}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Payment failed: ${errorMessage}`);
      setErrors({ general: errorMessage });
      setLoading(false);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (dateStr: string) => {
    return availableDates.includes(dateStr);
  };

  const isDateSelected = (dateStr: string) => {
    return selectedDate === dateStr;
  };

  const formatDateForInput = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();

    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add day headers
    dayNames.forEach((day) => {
      days.push(
        <div
          key={day}
          className="text-center text-xs font-medium text-gray-500 py-2"
        >
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateForInput(year, month, day);
      const isAvailable = isDateAvailable(dateStr);
      const isSelected = isDateSelected(dateStr);
      const isPast = new Date(dateStr) < today;

      days.push(
        <button
          key={day}
          onClick={() => {
            if (isAvailable && !isPast) {
              setSelectedDate(dateStr);
              setShowCalendar(false);
              if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
            }
          }}
          disabled={!isAvailable || isPast}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200 relative
            ${
              isSelected
                ? "bg-emerald-600 text-white shadow-lg"
                : isAvailable && !isPast
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {day}
          {isAvailable && !isPast && !isSelected && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
          )}
        </button>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    const today = new Date();
    const prevMonthDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(prevMonthDate);
    }
  };

  const totalAmount = activeTourData.price * guests;

  return (
    <div className="min-w-sm mx-auto text-black">
      <div className="bg-white min-h-[100vh] rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">
              ₹{activeTourData.price.toLocaleString()}
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              per person
            </span>
          </div>
          <p className="text-emerald-100 text-sm">
            {activeTourData.description}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div
              className={`flex items-center ${step === "booking" ? "text-emerald-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "booking"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="ml-2">Date & Guests</span>
            </div>
            <div
              className={`flex items-center ${step === "details" ? "text-emerald-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "details"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="ml-2">Details</span>
            </div>
            <div
              className={`flex items-center ${step === "summary" ? "text-emerald-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "summary"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="ml-2">Confirm</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Booking Details */}
          {step === "booking" && (
            <div className="space-y-6">
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Select Date
                </label>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  } ${selectedDate ? "text-gray-900" : "text-gray-500"}`}
                >
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Choose your travel date"}
                </button>

                {/* Custom Calendar */}
                {showCalendar && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="font-semibold">
                        {currentMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>
                      <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {renderCalendar()}
                    <div className="mt-4 text-xs text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-emerald-50 border border-emerald-200 rounded mr-2"></div>
                          Available
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-emerald-600 rounded mr-2"></div>
                          Selected
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {[...Array(activeTourData.maxGroupSize)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Price per person</span>
                  <span className="font-medium">
                    ₹{activeTourData.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Number of guests</span>
                  <span className="font-medium">{guests}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: User Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === "summary" && (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-3">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour:</span>
                    <span className="font-medium">{activeTourData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{userDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{userDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{userDetails.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-lg font-bold text-emerald-600">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3">
            {step !== "booking" && (
              <button
                onClick={() =>
                  setStep(step === "summary" ? "details" : "booking")
                }
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}

            {step !== "summary" ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBookNow}
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with Razorpay
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
