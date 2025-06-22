// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router";
// import { ArrowLeft } from "lucide-react";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface UserDetails {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
// }

// export default function Payment() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [userDetails, setUserDetails] = useState<UserDetails>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const itineraryId = searchParams.get("itineraryId");
//   const amount = searchParams.get("amount");
//   const date = searchParams.get("date");
//   const guests = searchParams.get("guests");

//   useEffect(() => {
//     // Load Razorpay script
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setUserDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const initializePayment = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/create-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: amount,
//           currency: "INR",
//           receipt: `receipt_${Date.now()}`,
//           userDetails,
//           itineraryId,
//           date,
//           guests,
//         }),
//       });

//       const data = await response.json();

//       const options = {
//         key: "rzp_test_pQLbxWbQ5iwwZe",
//         amount: data.amount,
//         currency: data.currency,
//         name: "Achyuta Travel",
//         description: "Tour Booking Payment",
//         order_id: data.id,
//         handler: async function (response: any) {
//           try {
//             const verifyResponse = await fetch("/api/verify-payment", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 userDetails,
//                 itineraryId,
//                 date,
//                 guests,
//               }),
//             });

//             const verifyData = await verifyResponse.json();
//             if (verifyData.success) {
//               // Redirect to the booking details page with the booking ID
//               navigate(`/booking?bookingId=${verifyData.bookingId}`);
//             }
//           } catch (error) {
//             console.error("Payment verification failed:", error);
//             alert("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: {
//           name: userDetails.name,
//           email: userDetails.email,
//           contact: userDetails.phone,
//         },
//         theme: {
//           color: "#277A55",
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Payment initialization failed:", error);
//       alert("Failed to initialize payment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h1 className="text-2xl font-bold text-gray-900">
//               Complete Your Booking
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Please provide your details to proceed with the payment
//             </p>
//           </div>

//           <div className="p-6">
//             <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//               <h3 className="font-medium text-gray-900 mb-2">
//                 Booking Summary
//               </h3>
//               <div className="space-y-2 text-sm text-gray-600">
//                 <p>Date: {date}</p>
//                 <p>Number of Guests: {guests}</p>
//                 <p>Total Amount: ₹{amount}</p>
//               </div>
//             </div>

//             <form className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   id="name"
//                   value={userDetails.name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   id="email"
//                   value={userDetails.email}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   id="phone"
//                   value={userDetails.phone}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="address"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Address
//                 </label>
//                 <textarea
//                   name="address"
//                   id="address"
//                   value={userDetails.address}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div className="border-t border-gray-200 pt-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-medium text-gray-900">
//                     Total Amount
//                   </span>
//                   <span className="text-2xl font-bold text-emerald-600">
//                     ₹{amount}
//                   </span>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={initializePayment}
//                   disabled={loading}
//                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
//                 >
//                   {loading ? "Processing..." : "Proceed to Payment"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
