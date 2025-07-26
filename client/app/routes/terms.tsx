import React from 'react'
import Layout from '~/components/layout/Layout';

export default function Terms() {
  return (
    <Layout>
    <div className='bg-white text-gray-800 px-6 py-12 max-w-full mx-auto space-y-10'>  
    <div className="bg-white max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-4xl font-bold text-green-700 mb-10 text-center">Terms & Conditions</h1>

      {/* Introduction */}
      <Section title="Introduction">
        <p>
          These Terms and Conditions ("Terms") form the agreement between you ("Client") and <strong>GoExplore Travels</strong> ("we", "us", or "the company").
          By accessing our website or confirming a booking, you agree to comply with these Terms. They ensure both parties are aligned during the journey planning and execution.
        </p>
      </Section>

      {/* Company Info */}
      <Section title="Company Information">
        <p>
          GoExplore Travels is an Indian registered travel company located in New Delhi. We specialize in organizing domestic and international travel experiences,
          including fixed departure tours, honeymoon packages, adventure expeditions, and customized luxury trips.
        </p>
      </Section>

      {/* Scope of Services */}
      <Section title="Scope of Services">
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Group Tours:</strong> For friends, families, students, and corporates.</li>
          <li><strong>Adventure Packages:</strong> Trekking, biking, rafting, skiing, and paragliding experiences.</li>
          <li><strong>International Holidays:</strong> Curated trips to Europe, Southeast Asia, UAE, and beyond.</li>
          <li><strong>Custom Travel:</strong> Tailor-made itineraries for individuals or private groups.</li>
        </ul>
      </Section>

      {/* Booking Terms */}
      <Section title="Booking & Payment Terms">
        <ul className="list-disc ml-5 space-y-1">
          <li>Initial deposit of 30% is required to confirm any booking.</li>
          <li>Full payment must be made at least 14 days before departure.</li>
          <li>Late payments may result in automatic cancellation with applicable penalties.</li>
          <li>All payments are to be made in INR (Indian Rupees).</li>
          <li>In case of international travel, forex rates will apply as per the day of transaction.</li>
        </ul>
      </Section>

      {/* Cancellation Policy */}
      <Section title="Cancellations & Refunds">
        <p>
          If you wish to cancel your booking, the following charges will apply depending on the time remaining before departure:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>More than 30 days:</strong> 20% cancellation fee</li>
          <li><strong>15 to 30 days:</strong> 50% cancellation fee</li>
          <li><strong>Less than 15 days:</strong> 100% cancellation fee</li>
        </ul>
        <p className="text-xs mt-2 text-red-600">
          Note: GST (5%) on the cancellation amount is non-refundable. Airfare cancellation is subject to airline policy.
        </p>
      </Section>

      {/* Rescheduling */}
      <Section title="Rescheduling Policy">
        <p>
          Requests to reschedule must be submitted at least 10 days prior to departure. We will try our best to accommodate changes, but they are subject to availability and may incur additional charges. No rescheduling is possible within 7 days of departure.
        </p>
      </Section>

      {/* Health & Safety */}
      <Section title="Health & Safety">
        <ul className="list-disc ml-5 space-y-1">
          <li>Travelers must disclose any health conditions that may affect participation.</li>
          <li>We are not liable for any loss arising from medical emergencies during the trip.</li>
          <li>Travelers must adhere to COVID or destination-specific regulations.</li>
        </ul>
      </Section>

      {/* Traveler Responsibility */}
      <Section title="Traveler Responsibilities">
        <ul className="list-disc ml-5 space-y-1">
          <li>Carry valid government ID and travel documents at all times.</li>
          <li>Respect local cultures, laws, and group members.</li>
          <li>Maintain decorum in accommodation, transport, and public spaces.</li>
        </ul>
      </Section>

      {/* Governing Law */}
      <Section title="Governing Law & Dispute Resolution">
        <p>
          All disputes arising from these Terms shall be governed by the laws of India and subject to the jurisdiction of courts located in New Delhi. Any attempt to settle the dispute amicably will be made before pursuing legal action.
        </p>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Us">
        <p>
          For questions, clarifications, or support, reach out to us at:<br />
          <strong>Email:</strong> help@goexplore.com<br />
          <strong>Phone:</strong> +91-9876543210
        </p>
      </Section>
    </div>
    </div>
  </Layout>
  );
};

// Reusable section component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold bg-green-100 text-green-800 px-3 py-1 rounded inline-block mb-2">{title}</h2>
    <div className="text-sm text-gray-700">{children}</div>
  </section>
  )