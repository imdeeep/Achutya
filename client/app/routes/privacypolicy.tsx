import React from 'react'
import Layout from '~/components/layout/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="bg-white text-gray-800 px-6 py-12 max-w-full mx-auto space-y-10">
        <div className="bg-white text-gray-800 px-6 py-12 max-w-4xl mx-auto space-y-10">
          <h1 className="text-4xl font-bold text-center uppercase">Privacy Policy</h1>

          <section className="space-y-4">
            <p>
              This Privacy Policy explains how we at <strong>WanderWave Travel Pvt. Ltd.</strong> collect, use, disclose, and safeguard your personal information when you visit our website or use our travel booking services. Your privacy is important to us, and we are committed to protecting it.
            </p>
            <p>
              By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">User Information</h2>
            <p>
              When you register or make a booking through our platform, we may collect personal data such as your name, contact number, email address, travel preferences, billing information, and government-issued ID (if required for international travel). This information helps us:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Confirm and manage your bookings</li>
              <li>Send you travel updates and confirmations</li>
              <li>Personalize your travel recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Location Data</h2>
            <p>
              With your permission, we may access your device's location to provide location-specific travel suggestions, nearby experiences, or map-based directions for your trips. This data is used only for real-time enhancements and is never stored or shared without consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Cookies</h2>
            <p>
              We use cookies to improve your experience on our site. These help us remember your past searches, save login sessions, and recommend destinations based on your interests. You can modify your cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Information Sharing</h2>
            <p>
              We may share your information with trusted partners such as hotels, airlines, or local travel vendors — only to the extent necessary to fulfill your travel arrangements. We ensure that all third-party partners follow similar privacy and security standards.
            </p>
            <p>
              We do not sell your personal data to marketers or advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Payment Information</h2>
            <p>
              All payments are securely processed through our payment gateway partners. We do not store your card or UPI details on our servers. Transactions are encrypted and follow strict PCI DSS compliance standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Information Security</h2>
            <p>
              We implement industry-standard security practices such as firewalls, SSL encryption, and secure servers to protect your data. Access to your personal data is limited to authorized personnel only.
            </p>
            <p>
              While we take every precaution, no system is completely immune. In the unlikely event of a data breach, we will inform you as per applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The most recent version will always be posted on this page with the last updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Contact Information</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact:
            </p>
            <div className="mt-4 text-sm leading-6">
              <p><strong>WanderWave Travel Pvt. Ltd.</strong></p>
              <p>17, S-2, Okhla Phase II, New Delhi – 110020</p>
              <p><strong>Email:</strong> privacy@wanderwave.in</p>
              <p><strong>Phone:</strong> +91-9729365321</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}