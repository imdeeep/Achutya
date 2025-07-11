import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { blogApi } from "~/services/adminApi";

type BlogPost = {
  _id: string;
  title: string;
  author?: string;
  publishedAt?: string;
  featured?: boolean;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAllBlogs();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete blog post
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await blogApi.deleteBlog(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && post.publishedAt) ||
      (filterStatus === "Draft" && !post.publishedAt);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blog content</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Post
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No blog posts found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {post.author || "Admin"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.publishedAt
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {post.publishedAt ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/blog/${post._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-5 h-5 inline" />
                        </Link>
                        <Link
                          to={`/admin/blog/edit/${post._id}`}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
