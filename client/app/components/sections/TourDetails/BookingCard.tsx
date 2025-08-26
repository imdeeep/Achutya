import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Calculator,
  Shield,
  X,
} from "lucide-react";
import { bookingApi } from "~/services/userApi";
import { useAuth } from "~/hooks/auth";

interface AvailableDate {
  startDate: string;
  endDate: string;
  availableSlots: number;
  bookedSlots: number;
  isAvailable: boolean;
  notes?: string;
  _id: string;
  id: string;
  slotsLeft?: number;
  totalSlots?: number;
  isRecurringInstance?: boolean;
}

interface TourData {
  id: string;
  title: string;
  price: number;
  maxGroupSize: number;
  description?: string;
  duration?: string;
  location?: string;
  availableDates: AvailableDate[];
}

interface CalendarDate {
  date: string;
  isAvailable: boolean;
  availableSlots: number;
  bookedSlots: number;
  tourDateId: string;
  slotsLeft?: number;
  totalSlots?: number;
  isRecurringInstance?: boolean;
}

interface UserDetails {
  _id: null | string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface BookingCardProps {
  tourData: TourData | null;
  onBookingSuccess?: (bookingId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingCard: React.FC<BookingCardProps> = ({
  tourData,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    _id: null,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<UserDetails & { date: string; general: string; terms: string }>
  >({});
  const [step, setStep] = useState<"booking" | "details" | "summary" | "payment">("booking");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<CalendarDate[]>([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const activeTourData = tourData;

  // Calculate pricing breakdown
  const baseAmount = (activeTourData?.price || 0) * guests;
  const gstAmount = Math.round(baseAmount * 0.05); // 5% GST
  const gatewayFee = Math.round(baseAmount * 0.02); // 2% Payment Gateway Fee
  const totalAmount = baseAmount + gstAmount + gatewayFee;

  useEffect(() => {
    if (tourData?.availableDates) {
      const calendarDates: CalendarDate[] = tourData.availableDates.map(
        (dateObj) => ({
          date: new Date(dateObj.startDate).toISOString().split("T")[0],
          isAvailable: dateObj.isAvailable && (dateObj.slotsLeft ?? (dateObj.availableSlots - dateObj.bookedSlots)) > 0,
          availableSlots: dateObj.availableSlots,
          bookedSlots: dateObj.bookedSlots,
          tourDateId: dateObj.id || dateObj._id,
          slotsLeft: dateObj.slotsLeft ?? (dateObj.availableSlots - dateObj.bookedSlots),
          totalSlots: dateObj.totalSlots ?? dateObj.availableSlots,
          isRecurringInstance: dateObj.isRecurringInstance || false,
        })
      );
      setAvailableDates(calendarDates);
    }
  }, [tourData]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserDetails(prev => ({
        ...prev,
        _id: user.id || null,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails & { date: string; general: string; terms: string }> = {};

    if (!selectedDate) {
      newErrors.date = "Please select a travel date";
    }

    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(userDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(userDetails.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!userDetails.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name: keyof UserDetails, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
    } else if (step === "summary") {
      setStep("payment");
    }
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("booking");
    } else if (step === "summary") {
      setStep("details");
    } else if (step === "payment") {
      setStep("summary");
    }
  };

  const handleBookNow = async () => {
    if (!selectedDate || !activeTourData) {
      alert("Please select a date for your tour");
      return;
    }

    if (!validateForm()) return;

    const selectedDateInfo = availableDates.find(
      (d) => d.date === selectedDate
    );

    if (!selectedDateInfo) {
      alert("Selected date is not available");
      return;
    }

    if (!razorpayLoaded) {
      setErrors({ general: "Payment service is loading. Please wait..." });
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        tourId: activeTourData.id,
        tourDateId: selectedDateInfo.tourDateId,
        numberOfGuests: guests,
        userDetails: {
          _id: userDetails._id || null,
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          address: userDetails.address,
        },
        amount: totalAmount,
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        gatewayFee: gatewayFee,
      };

      // Create payment order
      const orderData = await bookingApi.createBooking(bookingData);

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create booking order");
      }

      const options = {
        key: "rzp_test_pQLbxWbQ5iwwZe",
        amount: totalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Achyuta Travel",
        description: `Booking for ${activeTourData.title} - ${guests} guest(s)`,
        order_id: orderData.data.orderId,
        // Enable international cards
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "card",
                    issuers: ["HDFC", "SBI", "ICICI", "AXIS"]
                  },
                  {
                    method: "netbanking",
                    banks: ["HDFC", "SBI", "ICICI", "AXIS", "KOTAK", "YES"]
                  },
                  {
                    method: "wallet",
                    wallets: ["paytm", "phonepe", "amazonpay", "gpay"]
                  },
                  {
                    method: "upi"
                  }
                ]
              }
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          try {
            console.log('Payment successful, verifying with backend:', response);
            
            const data = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              tourId: activeTourData.id,
              tourDateId: selectedDateInfo.tourDateId,
              numberOfGuests: guests,
              userDetails: {
                _id: user?.id,
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
                address: userDetails.address,
              },
              amount: totalAmount,
              baseAmount: baseAmount,
              gstAmount: gstAmount,
              gatewayFee: gatewayFee,
            };

            console.log('Sending verification data to backend:', data);

            const verifyData = await bookingApi.completeBooking(data);

            if (verifyData.success) {
              const redirectUrl = `/booking?bId=${verifyData.data.booking.bookingId}`;

              if (onBookingSuccess) {
                onBookingSuccess(verifyData.data.booking._id);
              } else {
                window.location.href = redirectUrl;
              }

              alert("Booking confirmed! Redirecting to your booking details...");
            } else {
              throw new Error(verifyData.message || verifyData.error || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            let errorMessage = "An unknown error occurred";
            
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            } else if (error && typeof error === 'object' && 'message' in error) {
              errorMessage = (error as { message: string }).message;
            }
            
            alert(`Payment verification failed: ${errorMessage}. Please contact support with order ID: ${response.razorpay_order_id}`);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#277A55",
        },
        modal: {
          confirm_close: true,
          escape: false,
          backdrop_close: false,
          handle_back: true,
        },
        notes: {
          address: userDetails.address,
          tour: activeTourData.title,
          guests: guests.toString(),
        },
        // Enable international cards
        international: true,
        // Add retry options
        retry: {
          enabled: true,
          max_count: 3
        },
        // Better error handling
        callback_url: window.location.origin + "/payment-callback",
        cancel_url: window.location.origin + "/payment-cancelled"
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        let errorMessage = "Unknown payment error";
        
        if (response.error && response.error.description) {
          errorMessage = response.error.description;
        } else if (response.error && response.error.reason) {
          errorMessage = response.error.reason;
        } else if (response.error && response.error.message) {
          errorMessage = response.error.message;
        }
        
        // Provide specific guidance for common errors
        let userGuidance = "";
        if (errorMessage.toLowerCase().includes("international")) {
          userGuidance = "\n\n💡 Tip: Try using an Indian card or UPI payment method.";
        } else if (errorMessage.toLowerCase().includes("insufficient")) {
          userGuidance = "\n\n💡 Tip: Please check your account balance and try again.";
        } else if (errorMessage.toLowerCase().includes("expired")) {
          userGuidance = "\n\n💡 Tip: Please try the payment again with a fresh session.";
        }
        
        alert(`Payment failed: ${errorMessage}${userGuidance}`);
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

  const getDateInfo = (dateStr: string): CalendarDate | null => {
    return availableDates.find((d) => d.date === dateStr) || null;
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

    dayNames.forEach((day) => {
      days.push(
        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateForInput(year, month, day);
      const dateInfo = getDateInfo(dateStr);
      const isSelected = isDateSelected(dateStr);
      const isPast = new Date(dateStr) < today;

      let buttonClass = "";
      let buttonContent = day;
      let isClickable = false;

      if (isPast) {
        buttonClass = "text-gray-300 cursor-not-allowed bg-gray-50";
      } else if (dateInfo) {
        if (dateInfo.isAvailable && (dateInfo.slotsLeft ?? 0) > 0) {
          isClickable = true;
          buttonClass = isSelected
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200";
        } else {
          buttonClass = "bg-yellow-100 text-yellow-600 border border-yellow-300 cursor-not-allowed";
        }
      } else {
        buttonClass = "text-gray-300 cursor-not-allowed bg-gray-50";
      }

      days.push(
        <button
          key={day}
          onClick={() => {
            if (isClickable) {
              setSelectedDate(dateStr);
              setShowCalendar(false);
            }
          }}
          disabled={!isClickable}
          className={`p-2 text-sm rounded-lg transition-colors relative ${buttonClass}`}
        >
          {buttonContent}
          {dateInfo && dateInfo.isRecurringInstance && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </button>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const tabs = [
    { id: "booking", label: "Select Date & Guests", icon: Calendar },
    { id: "details", label: "Personal Details", icon: User },
    { id: "summary", label: "Booking Summary", icon: Check },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === step);

  return (
    <div className="min-w-sm mx-auto text-black">
      <div className="bg-white min-h-[100vh] rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">
              ₹{activeTourData?.price.toLocaleString()}
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              per person
            </span>
          </div>
          <p className="text-emerald-100 text-sm">
            {activeTourData?.description}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = step === tab.id;
              const isCompleted = index < currentTabIndex;
              
              return (
                <div key={tab.id} className={`flex items-center ${isActive ? "text-emerald-600" : isCompleted ? "text-emerald-500" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : isCompleted 
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className="ml-2 hidden sm:inline">{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Download Section */}
        {(activeTourData as any)?.pdf && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Tour PDF Available</span>
              </div>
              <a
                href={(activeTourData as any).pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Step 1: Date & Guests Selection */}
          {step === "booking" && (
            <div className="space-y-6">
              <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Select Date
                </label>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.date ? "border-red-500" : "border-gray-300"} ${selectedDate ? "text-gray-900" : "text-gray-500"}`}
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
                      <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="font-semibold">
                        {currentMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>
                      <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {renderCalendar()}
                    <div className="mt-4 text-xs text-gray-600">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-emerald-50 border border-emerald-200 rounded mr-2"></div>
                          Available
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-emerald-600 rounded mr-2"></div>
                          Selected
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                          Fully Booked
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-2"></div>
                          Past Date
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Guests
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                    {guests}
                  </span>
                  <button
                    onClick={() => setGuests(Math.min(activeTourData?.maxGroupSize || 20, guests + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Maximum {activeTourData?.maxGroupSize || 20} guests per booking
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === "details" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <textarea
                  value={userDetails.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-emerald-600 hover:text-emerald-700 underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                    {errors.terms && (
                      <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Continue to Summary
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Booking Summary */}
          {step === "summary" && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-800 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour:</span>
                    <span className="font-medium">{activeTourData?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "Not selected"}
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

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Pricing Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Amount ({guests} × ₹{activeTourData?.price.toLocaleString()})</span>
                    <span className="font-medium">₹{baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Gateway Fee (2%)</span>
                    <span className="font-medium">₹{gatewayFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Secure Payment</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Your payment is secured by Razorpay, a trusted payment gateway. All transactions are encrypted and secure.
                </p>
                
                <div className="bg-white border border-blue-300 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount to Pay:</span>
                    <span className="text-xl font-bold text-emerald-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{totalAmount.toLocaleString()} & Book Now
                    </div>
                  )}
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  You will be redirected to Razorpay for secure payment
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Summary
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Terms and Conditions</h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h3 className="font-semibold text-gray-800 mb-2">1. Booking and Payment</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
                  <li>All bookings are subject to availability and confirmation</li>
                  <li>Full payment is required at the time of booking</li>
                  <li>Prices include 5% GST and 2% payment gateway fees</li>
                  <li>Payment is processed securely through Razorpay</li>
                </ul>

                <h3 className="font-semibold text-gray-800 mb-2">2. Cancellation Policy</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
                  <li>Cancellation 30+ days before departure: 90% refund</li>
                  <li>Cancellation 15-29 days before departure: 70% refund</li>
                  <li>Cancellation 7-14 days before departure: 50% refund</li>
                  <li>Cancellation less than 7 days: No refund</li>
                </ul>

                <h3 className="font-semibold text-gray-800 mb-2">3. Travel Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
                  <li>Valid ID proof required for all travelers</li>
                  <li>Travel insurance is recommended</li>
                  <li>Follow all local guidelines and regulations</li>
                  <li>Company is not responsible for personal belongings</li>
                </ul>

                <h3 className="font-semibold text-gray-800 mb-2">4. Force Majeure</h3>
                <p className="text-gray-600 mb-4">
                  Achyuta Travel reserves the right to modify or cancel tours due to circumstances beyond our control including but not limited to natural disasters, political unrest, or government restrictions.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowTerms(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setAgreedToTerms(true);
                    setShowTerms(false);
                  }}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
