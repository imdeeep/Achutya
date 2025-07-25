import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import { blogApi } from "~/services/adminApi";

type ContentBlock = {
  id: string;
  type: 'paragraph' | 'image' | 'list' | 'quote' | 'link' | 'section' | 'subsection';
  title?: string;
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
  style?: 'ordered' | 'unordered';
  items?: string[];
  content?: ContentBlock[];
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type HeroImage = {
  url: string;
  alt: string;
};

type SEOData = {
  title?: string;
  description?: string;
  keywords?: string[];
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  author: string;
  publishedAt: string | null;
  readTime: number;
  featured: boolean;
  heroImage: HeroImage | null;
  content: ContentBlock[];
  faq: FAQItem[];
  tags: string[];
  category: string;
  relatedPosts: string[];
  seo: SEOData;
  status: 'Draft' | 'Published';
};

export default function BlogPostView() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getBlogById(id!);
        
        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        setError("Failed to fetch blog post");
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {block.text}
          </p>
        );
      case 'image':
        return (
          <div className="mt-6">
            <img 
              src={block.url} 
              alt={block.alt || ''} 
              className="w-full h-auto rounded-lg shadow-md"
            />
            {block.caption && (
              <p className="mt-2 text-sm text-gray-500 italic text-center">
                {block.caption}
              </p>
            )}
          </div>
        );
      case 'list':
        return (
          <div className="mt-4">
            {block.style === 'ordered' ? (
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                {block.items?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {block.items?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'quote':
        return (
          <blockquote className="mt-6 border-l-4 border-emerald-500 pl-4 italic text-gray-600">
            {block.text}
          </blockquote>
        );
      case 'link':
        return (
          <div className="mt-4">
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-800 hover:underline"
            >
              {block.text || block.url}
            </a>
          </div>
        );
      case 'section':
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {block.title}
            </h2>
            <div className="space-y-6">
              {block.content?.map(subBlock => renderContentBlock(subBlock))}
            </div>
          </div>
        );
      case 'subsection':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {block.title}
            </h3>
            <div className="space-y-4">
              {block.content?.map(subBlock => renderContentBlock(subBlock))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
          <Link
            to="/admin/blog"
            className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not published';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/admin/blog"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog Posts
          </Link>
        </div>

        <article className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Hero Image */}
          {post.heroImage && (
            <div className="w-full h-64 sm:h-96 overflow-hidden">
              <img
                src={post.heroImage.url}
                alt={post.heroImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Post Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formattedDate}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime} min read
                </span>
                {post.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>

              {post.category && (
                <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {post.category}
                </span>
              )}

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div className="prose max-w-none">
              {post.content.map(block => renderContentBlock(block))}
            </div>

            {/* FAQ Section */}
            {post.faq.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faq.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Metadata (visible only in admin view) */}
            <div className="mt-12 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">SEO Metadata</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Title:</span> {post.seo.title || 'Not set'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Description:</span> {post.seo.description || 'Not set'}
                </p>
                {post.seo.keywords && post.seo.keywords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">Keywords:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.seo.keywords.map(keyword => (
                        <span 
                          key={keyword} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Admin Actions */}
        <div className="mt-6 flex justify-end">
          <Link
            to={`/admin/blog/edit/${post.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Edit Post
          </Link>
        </div>
      </div>
    </div>
  );
}