import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { destinationApi } from "~/services/adminApi";

interface FormData {
  name: string;
  country: "India" | "International";
  countryName: string;
  description: string;
  image: string;
  heroImage: string;
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  currency: string;
  language: string;
  timeZone: string;
  isActive: boolean;
  slug: string;
}

export default function EditDestination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    country: "India",
    countryName: "",
    description: "",
    image: "",
    heroImage: "",
    highlights: [],
    bestTimeToVisit: "",
    climate: "",
    currency: "",
    language: "",
    timeZone: "",
    isActive: true,
    slug: "",
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await destinationApi.getDestinationById(id);

        if (response.success && response.data) {
          setFormData(response.data);
        } else {
          throw new Error("Failed to load destination");
        }
      } catch (err) {
        console.error("Error fetching destination:", err);
        setError("Failed to load destination. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSubmitting(true);

    try {
      const response = await destinationApi.editDestination(id, formData);

      if (response.success) {
        navigate("/admin/destinations");
      } else {
        throw new Error(response.message || "Failed to update destination");
      }
    } catch (err: any) {
      console.error("Error updating destination:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update destination. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      ...(name === "country"
        ? { countryName: formData.countryName || value }
        : {}),
    }));
  };

  const addHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      highlightInput.trim() &&
      !formData.highlights.includes(highlightInput)
    ) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput],
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Error Loading Destination
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/destinations")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link
          to="/admin/destinations"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Destinations
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900">Edit Destination</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the details for this destination
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Basic Information */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                    placeholder="e.g., Paris, Bali, New York"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country Type *
                  </label>
                  <select
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="India">India</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="countryName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country Name *
                  </label>
                  <input
                    type="text"
                    name="countryName"
                    id="countryName"
                    value={formData.countryName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                    placeholder="e.g., France, Japan, USA"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                    placeholder="A brief description of the destination"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="https://example.com/thumbnail.jpg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="heroImage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    name="heroImage"
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="https://example.com/hero-image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Highlights
              </h2>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Add a highlight (e.g., Eiffel Tower, Beaches)"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                {formData.highlights.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                      >
                        {highlight}
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-emerald-600 hover:text-emerald-900 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="sm:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bestTimeToVisit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    id="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="e.g., June to August"
                  />
                </div>

                <div>
                  <label
                    htmlFor="climate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Climate
                  </label>
                  <input
                    type="text"
                    name="climate"
                    id="climate"
                    value={formData.climate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="e.g., Mediterranean, Tropical"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    id="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="e.g., EUR, USD, INR"
                  />
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    id="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="e.g., French, English, Hindi"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeZone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time Zone
                  </label>
                  <input
                    type="text"
                    name="timeZone"
                    id="timeZone"
                    value={formData.timeZone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="e.g., GMT+2, EST, IST"
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex items-center h-5">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Active Destination
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 mt-8">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/destinations")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                  submitting
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Destination
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
