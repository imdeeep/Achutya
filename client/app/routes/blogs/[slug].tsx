import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Layout from '~/components/layout/Layout';
import { Clock, User, Calendar, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { getBlogBySlug, getBlogs, type Blog, type ContentBlock } from '~/services/blogApi';



export function meta({ params }: { params: { slug: string } }) {
  return [
    { title: `Blog - ${params.slug}` },
    {
      name: "description",
      content: "Read our latest travel blogs and stories",
    },
  ];
}

export default function BlogSlug() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const result = await getBlogBySlug(slug!);
      setBlog(result.data);
      
      // Fetch related blogs if category exists
      if (result.data.category) {
        fetchRelatedBlogs(result.data.category, result.data._id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string, excludeId: string) => {
    try {
      const result = await getBlogs(category, 3);
      const filtered = result.data.filter((blog: Blog) => blog._id !== excludeId);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
            {block.text}
          </p>
        );
      
      case 'image':
        return (
          <div key={index} className="my-8">
            <img
              src={block.url}
              alt={block.alt || 'Blog image'}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {block.caption && (
              <p className="text-center text-gray-600 text-sm mt-2 italic">
                {block.caption}
              </p>
            )}
          </div>
        );
      
      case 'list':
        return (
          <div key={index} className="my-6">
            {block.title && (
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {block.title}
              </h3>
            )}
            {block.style === 'ordered' ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {block.items?.map((item, idx) => (
                  <li key={idx} className="text-lg">{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {block.items?.map((item, idx) => (
                  <li key={idx} className="text-lg">{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      
      case 'quote':
        return (
          <blockquote key={index} className="my-8 p-6 bg-gray-50 border-l-4 border-teal-500 rounded-r-lg">
            <p className="text-xl italic text-gray-800 mb-2">"{block.text}"</p>
            {block.title && (
              <cite className="text-gray-600">— {block.title}</cite>
            )}
          </blockquote>
        );
      
      case 'link':
        return (
          <div key={index} className="my-6">
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-800 underline text-lg"
            >
              {block.text || block.url}
            </a>
          </div>
        );
      
      case 'section':
        return (
          <div key={index} className="my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {block.title}
            </h2>
            {block.content && block.content.map((subBlock, idx) => 
              renderContentBlock(subBlock, `${index}-${idx}`)
            )}
          </div>
        );
      
      case 'subsection':
        return (
          <div key={index} className="my-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {block.title}
            </h3>
            {block.content && block.content.map((subBlock, idx) => 
              renderContentBlock(subBlock, `${index}-${idx}`)
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.seo?.description || blog.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

  if (error || !blog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error === 'Blog post not found' 
              ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
              : 'We encountered an error while loading this blog post.'
            }
          </p>
          <Link
            to="/our-blogs"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/our-blogs"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blogs
          </Link>
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
                {blog.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime || 5} min read
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.author}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            {blog.seo?.description && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {blog.seo.description}
              </p>
            )}
          </div>

          {blog.heroImage?.url && (
            <div className="relative">
              <img
                src={blog.heroImage.url}
                alt={blog.heroImage.alt || blog.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {blog.content.map((block, index) => renderContentBlock(block, index))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {blog.faq && blog.faq.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {blog.faq.map((faq, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share and Actions */}
        <div className="flex items-center justify-between py-6 border-t border-gray-200 mb-8">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(blog.updatedAt)}
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blogs/${relatedBlog.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedBlog.heroImage?.url && (
                      <img
                        src={relatedBlog.heroImage.url}
                        alt={relatedBlog.heroImage.alt || relatedBlog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <Clock className="w-4 h-4" />
                        {relatedBlog.readTime || 5} min read
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 