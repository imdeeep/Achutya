import { useState } from "react";
import { Save, X, Lock, Bell, Mail, Globe } from "lucide-react";

export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Travel Management Platform",
    contactEmail: "admin@example.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    newBookingEmail: true,
    userSignupEmail: false,
    reviewNotification: true,
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90 days",
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, checked, type } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving General Settings:", generalSettings);
    console.log("Saving Notification Settings:", notificationSettings);
    console.log("Saving Security Settings:", securitySettings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage platform configurations and preferences</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2" /> General Settings
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                value={generalSettings.contactEmail}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                name="timezone"
                id="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                <option value="UTC">UTC</option>
                {/* Add more timezones as needed */}
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                name="currency"
                id="currency"
                value={generalSettings.currency}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                {/* Add more currencies as needed */}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2" /> Notification Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <input
                id="newBookingEmail"
                name="newBookingEmail"
                type="checkbox"
                checked={notificationSettings.newBookingEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="newBookingEmail" className="ml-3 block text-sm text-gray-900">
                Email me on new bookings
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="userSignupEmail"
                name="userSignupEmail"
                type="checkbox"
                checked={notificationSettings.userSignupEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="userSignupEmail" className="ml-3 block text-sm text-gray-900">
                Email me when a new user signs up
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="reviewNotification"
                name="reviewNotification"
                type="checkbox"
                checked={notificationSettings.reviewNotification}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="reviewNotification" className="ml-3 block text-sm text-gray-900">
                Notify me of new customer reviews
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2" /> Security Settings
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <input
                id="twoFactorAuth"
                name="twoFactorAuth"
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-3 block text-sm text-gray-900">
                Enable Two-Factor Authentication
              </label>
            </div>
            <div>
              <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700">
                Password Expiry
              </label>
              <select
                name="passwordExpiry"
                id="passwordExpiry"
                value={securitySettings.passwordExpiry}
                onChange={handleSecurityChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="Never">Never</option>
                <option value="90 days">90 days</option>
                <option value="60 days">60 days</option>
                <option value="30 days">30 days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => console.log("Cancel settings changes")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
} 