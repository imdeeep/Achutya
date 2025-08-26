import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { blogApi } from '~/services/adminApi';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: {
    url: string;
    alt: string;
  };
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  content: any[];
  category: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Blog[];
}

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true);
        const response: ApiResponse = await blogApi.getFeaturedBlogs();
        
        if (response.success && response.data) {
          setFeaturedBlogs(response.data);
        } else {
          setError('No featured blogs found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  const generateExcerpt = (content: any[]): string => {
    // Find the first paragraph block to use as excerpt
    const paragraph = content.find(block => block.type === 'paragraph');
    if (paragraph?.text) {
      return paragraph.text.substring(0, 100) + (paragraph.text.length > 100 ? '...' : '');
    }
    return 'Read more...';
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading featured blogs...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error: {error}
    </div>
  );

  if (!featuredBlogs.length) return (
    <div className="text-center py-8 text-gray-500">
      No featured blogs found.
    </div>
  );

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {featuredBlogs.slice(0, 4).map((blog) => (
          <article 
            key={blog.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {blog.heroImage && (
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.heroImage.url}
                  alt={blog.heroImage.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2">
                  {blog.category}
                </span>
                <span>{formatDate(blog.publishedAt)}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime} min read</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-emerald-600 transition-colors">
                                  <button 
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    className="text-left"
                  >
                    {blog.title}
                  </button>
              </h3>
              
              <p className="text-gray-600 mb-4">
                {blog.excerpt || generateExcerpt(blog.content)}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">By {blog.author}</span>
                <button
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                  className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {featuredBlogs.length > 4 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Showing 4 of {featuredBlogs.length} featured blogs
          </p>
        </div>
      )}
    </section>
  );
};

export default FeaturedBlogs;