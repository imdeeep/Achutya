import React from 'react'
import Layout from '~/components/layout/Layout'

export default function Cancellation() {
  return (
    <Layout>
      <div className="bg-white text-gray-800 px-6 py-12 max-w-full mx-auto space-y-10">
        <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
          <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Cancellation Policy</h1>

          <p className="mb-6">
            Our cancellation policy is based on the duration and destination of your trip. Please refer to the appropriate section below
            for our short haul and long haul cancellation terms. If you’re unsure, feel free to contact your travel advisor.
          </p>

          <ul className="list-disc ml-6 mb-8 space-y-1 text-sm text-gray-700">
            <li>
              <strong>Short Haul Destinations:</strong> India, Bhutan, Nepal, Sri Lanka, UAE, Thailand, Vietnam, Maldives and similar.
            </li>
            <li>
              <strong>Long Haul Destinations:</strong> Europe, USA, Australia, New Zealand, Japan, South Africa, Turkey, etc.
            </li>
          </ul>

          {/* Short Haul */}
          <div className="bg-green-50 border border-green-300 rounded-lg shadow-sm mb-10">
            <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg font-semibold">
              Short Haul Packages
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-green-100 text-green-900 font-semibold">
                  <tr>
                    <th className="p-3 border">Days Before Departure</th>
                    <th className="p-3 border">Cancellation Charges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border">31+ Days</td>
                    <td className="p-3 border">Booking amount is non-refundable. Remaining amount as credit note.</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="p-3 border">30 - 16 Days</td>
                    <td className="p-3 border">50% of total tour cost. Remaining amount as credit note.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border">15 or Less</td>
                    <td className="p-3 border">100% of total tour cost.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-xs text-gray-700 px-4 py-3 space-y-2">
              <p><strong>Note:</strong> Airfare cancellation is separate and non-refundable services are excluded from refund.</p>
              <p>5% GST is applicable on total cancellation charges.</p>
              <p>Cancellation terms may vary during events, peak season, or by location. Please confirm with your travel agent.</p>
            </div>
          </div>

          {/* Long Haul */}
          <div className="bg-green-50 border border-green-300 rounded-lg shadow-sm">
            <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg font-semibold">
              Long Haul Packages
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-green-100 text-green-900 font-semibold">
                  <tr>
                    <th className="p-3 border">Days Before Departure</th>
                    <th className="p-3 border">Cancellation Charges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border">46+ Days</td>
                    <td className="p-3 border">Booking amount is non-refundable. Remaining amount as credit note.</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="p-3 border">45 - 31 Days</td>
                    <td className="p-3 border">60% of total tour cost. Remaining amount as credit note.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border">30 - 21 Days</td>
                    <td className="p-3 border">80% of total tour cost. Remaining amount as credit note.</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="p-3 border">20 or Less</td>
                    <td className="p-3 border">100% of total tour cost.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-xs text-gray-700 px-4 py-3 space-y-2">
              <p><strong>Note:</strong> Airfare cancellation is separate and non-refundable services are excluded from refund.</p>
              <p>5% GST is applicable on total cancellation charges.</p>
              <p>Policy may vary depending on season, destination, or offer. Confirm with your booking advisor.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}