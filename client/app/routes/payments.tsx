import Layout from '~/components/layout/Layout'

export default function Payments() {
  return (
    <Layout>
      <div className="bg-white text-gray-800 px-6 py-12 max-w-full mx-auto space-y-10">
        <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-8">
          {/* Page Heading */}
          <h1 className="text-2xl font-semibold">💳 Pay us at</h1>

          {/* Bank Transfer Section */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="font-semibold bg-black text-white inline-block px-3 py-1 rounded mb-2">Bank Transfer</h2>
            <p>🏦 HSBC</p>
            <p><strong>A/C No:</strong> 054833199001</p>
            <p><strong>A/C Name:</strong> Wanderon Experiences Private Limited</p>
            <p><strong>IFSC Code:</strong> HSBC0110005</p>
          </div>

          {/* UPI Payment Section */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="font-semibold bg-black text-white inline-block px-3 py-1 rounded mb-2">UPI Payment</h2>
            <p><strong>UPI us at (Google Pay/BHIM/PhonePe):</strong> WanderOn@HSBC</p>
            <p><strong>UPI Name:</strong> WanderOn/WanderOn Experiences Private Limited</p>
          </div>

          {/* Razorpay Link Section */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="font-semibold bg-black text-white inline-block px-3 py-1 rounded mb-2">Razorpay Link</h2>
            <p><strong>Payment via Razorpay:</strong><br />
              <a href="https://razorpay.me/@wanderon" className="text-blue-600 underline">https://razorpay.me/@wanderon</a>
            </p>
            <p className="text-red-600 mt-2"><strong>Note:</strong> A payment gateway charge 3% will be levied on using above given payment link.</p>
          </div>

          {/* Important Note Section */}
          <div className="bg-red-100 text-red-900 p-4 rounded">
            <p><strong>Note:</strong></p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
              <li>To ensure your payment is securely processed, please make payments only to the official bank details provided on our website.</li>
              <li>Do not make payments to any other account. We will not be responsible for any losses incurred if payments are made to unauthorized bank accounts.</li>
              <li>If you have any questions or concerns, please contact us on - 90900403075</li>
              <li>A payment gateway charge 3% will be levied on using above given payment link.</li>
            </ul>
          </div>

          {/* Payment Policy */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Payment Policy</h2>
            <p>For Short Haul Destination refer Short Haul payment and cancellation policy and for long haul destination refer Long Haul payment and cancellation policy.</p>
            <ul className="list-disc ml-5 mt-2">
              <li><strong>Short Haul Destinations:</strong> Domestic Trips, Bhutan, Nepal, Sri Lanka, Thailand, Singapore, Bali, Dubai, Kazakhstan, Azerbaijan, Vietnam, Malaysia, Maldives, Mauritius and Similar.</li>
              <li><strong>Long Haul Destinations:</strong> Europe, UK, Scotland, Ireland, USA, Canada, Japan, South Korea, Turkey, Egypt, Australia, New Zealand, South Africa, Kenya, South America, Jordan, Israel and Similar.</li>
            </ul>
          </div>

          {/* Short Haul Table */}
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="bg-black text-white px-3 py-1 inline-block rounded mb-3">SHORT HAUL PACKAGES</h2>
            <table className="w-full table-auto border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Number of Days Prior To Tour Date</th>
                  <th className="p-2 border">Amount need to be paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">At the time of booking</td>
                  <td className="p-2 border">25% of the full tour cost or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">Within 45 Days from Departure Date</td>
                  <td className="p-2 border">50% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">Within 30 Days from Date of Departure</td>
                  <td className="p-2 border">75% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">20 Days from Date of Departure</td>
                  <td className="p-2 border">100% of the Full Tour Cost</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 space-y-2 text-sm text-blue-900">
              <p><strong>Please Note:</strong> For Issuance of the Flight Tickets, we require Full Payment of Airfare</p>
              <p><strong>Please Note:</strong> Non-Refundable Services in the tour package have to be paid in full at the time of Booking</p>
              <p><strong>Please Note:</strong> Payment Policy is non-negotiable and have to be paid accordingly.</p>
              <p><strong>Please Note:</strong> Payment Schedule may vary based on the destination and travel date (such as during any event, peak season etc.). Kindly confirm the exact payment timeline with your sales agent.</p>
            </div>
          </div>

          {/* Long Haul Table */}
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="bg-black text-white px-3 py-1 inline-block rounded mb-3">LONG HAUL PACKAGES</h2>
            <table className="w-full table-auto border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Number of Days Prior To Tour Date</th>
                  <th className="p-2 border">Amount need to be paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">At the time of booking</td>
                  <td className="p-2 border">INR 40,000 Per Person or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">Within 60 Days from Departure Date</td>
                  <td className="p-2 border">50% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">Within 45 Days from Departure Date</td>
                  <td className="p-2 border">75% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)</td>
                </tr>
                <tr>
                  <td className="p-2 border">30 Days from Departure Date</td>
                  <td className="p-2 border">100% of the Full Tour Cost</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 space-y-2 text-sm text-blue-900">
              <p><strong>Please Note:</strong> For Issuance of the Flight Tickets, we require Full Payment of Airfare</p>
              <p><strong>Please Note:</strong> Non-Refundable Services in the tour package have to be paid in full at the time of Booking</p>
              <p><strong>Please Note:</strong> Payment Policy is non-negotiable and have to be paid accordingly.</p>
              <p><strong>Please Note:</strong> Payment Schedule may vary based on the destination and travel date (such as during any event, peak season etc.). Kindly confirm the exact payment timeline with your sales agent.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}