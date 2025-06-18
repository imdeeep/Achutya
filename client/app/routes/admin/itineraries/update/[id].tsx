import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, X } from "lucide-react";
import { uploadImage } from "~/services/cloudinary";
import { itineraryApi } from "~/services/adminApi";

interface ItineraryFormData {
  title: string;
  country: string;
  city: string;
  duration: string;
  price: string;
  groupType: string;
  image: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  essentials: string[];
  notes: string[];
  features: { title: string; description: string }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    distance: string;
    duration: string;
    accommodation: string;
    meals: string;
  }[];
}

type ArrayField =
  | "highlights"
  | "inclusions"
  | "exclusions"
  | "essentials"
  | "notes";

export default function EditItinerary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ItineraryFormData>({
    title: "",
    country: "India",
    city: "",
    duration: "",
    price: "",
    groupType: "Group",
    image: "",
    description: "",
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
        distance: "",
        duration: "",
        accommodation: "",
        meals: "",
      },
    ],
  });

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const response = await itineraryApi.getItinerary(id!);
        if (response.success) {
          setFormData(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch itinerary");
        }
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError("Failed to fetch itinerary");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await itineraryApi.updateItinerary(id!, formData);

      if (response.success) {
        navigate("/admin/itineraries");
      } else {
        throw new Error(response.error || "Failed to update itinerary");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update itinerary"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddArrayItem = (field: ArrayField) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    field: ArrayField
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleRemoveArrayItem = (index: number, field: ArrayField) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Please upload a valid image file (JPEG, PNG, or GIF)");
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("Image size should be less than 5MB");
      }

      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          to="/admin/itineraries"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Itineraries
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Edit Itinerary</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g., 8 days, 7 nights"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="groupType"
                className="block text-sm font-medium text-gray-700"
              >
                Group Type
              </label>
              <select
                name="groupType"
                id="groupType"
                value={formData.groupType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              >
                <option value="Group">Group</option>
                <option value="Private">Private</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium mb-4">Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tour Image
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
                      Uploading...
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </label>
              </div>
              {formData.image && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Tour"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Supported formats: JPEG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Highlights</h2>
              <button
                type="button"
                onClick={() => handleAddArrayItem("highlights")}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                Add Highlight
              </button>
            </div>
            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      handleArrayInputChange(
                        index,
                        e.target.value,
                        "highlights"
                      )
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Enter highlight"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, "highlights")}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Itinerary</h2>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    itinerary: [
                      ...prev.itinerary,
                      {
                        day: prev.itinerary.length + 1,
                        title: "",
                        description: "",
                        activities: [""],
                        distance: "",
                        duration: "",
                        accommodation: "",
                        meals: "",
                      },
                    ],
                  }));
                }}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                Add Day
              </button>
            </div>
            <div className="space-y-6">
              {formData.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Day {day.day}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          itinerary: prev.itinerary.filter(
                            (_, i) => i !== dayIndex
                          ),
                        }));
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            itinerary: prev.itinerary.map((d, i) =>
                              i === dayIndex
                                ? { ...d, title: e.target.value }
                                : d
                            ),
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={day.description}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            itinerary: prev.itinerary.map((d, i) =>
                              i === dayIndex
                                ? { ...d, description: e.target.value }
                                : d
                            ),
                          }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Activities
                      </label>
                      <div className="space-y-2">
                        {day.activities.map((activity, activityIndex) => (
                          <div
                            key={activityIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={activity}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  itinerary: prev.itinerary.map((d, i) =>
                                    i === dayIndex
                                      ? {
                                          ...d,
                                          activities: d.activities.map(
                                            (a, j) =>
                                              j === activityIndex
                                                ? e.target.value
                                                : a
                                          ),
                                        }
                                      : d
                                  ),
                                }));
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                              placeholder="Enter activity"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  itinerary: prev.itinerary.map((d, i) =>
                                    i === dayIndex
                                      ? {
                                          ...d,
                                          activities: d.activities.filter(
                                            (_, j) => j !== activityIndex
                                          ),
                                        }
                                      : d
                                  ),
                                }));
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              itinerary: prev.itinerary.map((d, i) =>
                                i === dayIndex
                                  ? {
                                      ...d,
                                      activities: [...d.activities, ""],
                                    }
                                  : d
                              ),
                            }));
                          }}
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          + Add Activity
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Distance
                        </label>
                        <input
                          type="text"
                          value={day.distance}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              itinerary: prev.itinerary.map((d, i) =>
                                i === dayIndex
                                  ? { ...d, distance: e.target.value }
                                  : d
                              ),
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={day.duration}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              itinerary: prev.itinerary.map((d, i) =>
                                i === dayIndex
                                  ? { ...d, duration: e.target.value }
                                  : d
                              ),
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Accommodation
                        </label>
                        <input
                          type="text"
                          value={day.accommodation}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              itinerary: prev.itinerary.map((d, i) =>
                                i === dayIndex
                                  ? { ...d, accommodation: e.target.value }
                                  : d
                              ),
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Meals
                        </label>
                        <input
                          type="text"
                          value={day.meals}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              itinerary: prev.itinerary.map((d, i) =>
                                i === dayIndex
                                  ? { ...d, meals: e.target.value }
                                  : d
                              ),
                            }));
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            {/* Inclusions */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Inclusions</h2>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("inclusions")}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                >
                  Add Inclusion
                </button>
              </div>
              <div className="space-y-3">
                {formData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) =>
                        handleArrayInputChange(
                          index,
                          e.target.value,
                          "inclusions"
                        )
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter inclusion"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(index, "inclusions")}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Exclusions</h2>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("exclusions")}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                >
                  Add Exclusion
                </button>
              </div>
              <div className="space-y-3">
                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) =>
                        handleArrayInputChange(
                          index,
                          e.target.value,
                          "exclusions"
                        )
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter exclusion"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(index, "exclusions")}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Essentials & Notes */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            {/* Essentials */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Essentials</h2>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("essentials")}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                >
                  Add Essential
                </button>
              </div>
              <div className="space-y-3">
                {formData.essentials.map((essential, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={essential}
                      onChange={(e) =>
                        handleArrayInputChange(
                          index,
                          e.target.value,
                          "essentials"
                        )
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter essential item"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(index, "essentials")}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Notes</h2>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("notes")}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {formData.notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) =>
                        handleArrayInputChange(index, e.target.value, "notes")
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter note"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem(index, "notes")}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Features</h2>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    features: [
                      ...prev.features,
                      { title: "", description: "" },
                    ],
                  }));
                }}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                Add Feature
              </button>
            </div>
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Feature {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          features: prev.features.filter((_, i) => i !== index),
                        }));
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            features: prev.features.map((f, i) =>
                              i === index ? { ...f, title: e.target.value } : f
                            ),
                          }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            features: prev.features.map((f, i) =>
                              i === index
                                ? { ...f, description: e.target.value }
                                : f
                            ),
                          }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
