import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Layout from '~/components/layout/Layout';
import { Search, Filter, Clock, User, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { getBlogs, type Blog } from '~/services/blogApi';



export function meta() {
  return [
    { title: "Travel Blogs - Achyuta" },
    {
      name: "description",
      content: "Discover amazing travel stories, tips, and guides from our travel experts",
    },
  ];
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const result = await getBlogs();
      setBlogs(result.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(result.data.map((blog: Blog) => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.seo?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        {/* Back to Home Button */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <BookOpen className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Travel Stories & Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Discover amazing destinations, travel tips, and inspiring stories from our travel experts and adventurers around the world.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Browse our complete collection of travel blogs, guides, and stories. Use the search and filters below to find exactly what you're looking for.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs, destinations, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      {blogs.filter(blog => blog.featured).length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {blogs
                .filter(blog => blog.featured)
                .slice(0, 2)
                .map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog.slug}`}
                    className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {blog.heroImage?.url && (
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={blog.heroImage.url}
                          alt={blog.heroImage.alt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
                          {blog.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {blog.readTime || 5} min read
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      {blog.seo?.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.seo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          {blog.author}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blogs Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {selectedCategory === 'all' ? 'All Stories' : `${selectedCategory} Stories`}
          </h2>
          
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or category filter
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {blog.heroImage?.url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.heroImage.url}
                        alt={blog.heroImage.alt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.readTime || 5} min
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    {blog.seo?.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {truncateText(blog.seo.description, 120)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{blog.author}</span>
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                    
                    <div className="mt-4 flex items-center text-teal-600 group-hover:text-teal-700 transition-colors">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Travel Stories</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest travel tips, destination guides, and adventure stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}