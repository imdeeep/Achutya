import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Save, X } from "lucide-react";

const mockBlogPosts = [
  {
    id: "1",
    title: "Exploring the Wonders of Goa",
    author: "Admin",
    content:
      "This is a detailed blog post about the beautiful beaches and vibrant culture of Goa...",
    status: "Published",
  },
  {
    id: "2",
    title: "Kerala Backwaters: A Serene Escape",
    author: "Admin",
    content: "Discover the tranquil backwaters and lush greenery of Kerala...",
    status: "Draft",
  },
  {
    id: "3",
    title: "Rajasthan: Land of Kings and Forts",
    author: "Admin",
    content:
      "Journey through the majestic forts and colorful cities of Rajasthan...",
    status: "Published",
  },
];

export default function BlogPostDetail() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const post = mockBlogPosts.find((p) => p.id === id);
    if (post) {
      setFormData({
        title: post.title,
        author: post.author,
        content: post.content,
        status: post.status,
      });
      setLoading(false);
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call to update blog post)
    console.log("Updated Blog Post Data:", formData);
    alert("Blog post updated!");
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

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="p-6 text-center text-red-500">Blog post not found!</div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          to="/admin/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Posts
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Blog Post: {formData.title}
          </h1>
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
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                value={formData.author}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                name="content"
                id="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to="/admin/blog"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
