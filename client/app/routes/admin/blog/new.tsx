import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Save, X, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { blogApi } from "~/services/adminApi";
import { v4 as uuidv4 } from 'uuid';

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

type FormData = {
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

const defaultContentBlock: ContentBlock = {
  id: uuidv4(),
  type: 'paragraph',
  text: ''
};

const defaultFAQItem: FAQItem = {
  id: uuidv4(),
  question: '',
  answer: ''
};

export default function NewBlogPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    author: "Admin",
    publishedAt: null,
    readTime: 5,
    featured: false,
    heroImage: null,
    content: [{
      id: uuidv4(),
      type: 'paragraph',
      text: ''
    }],
    faq: [],
    tags: [],
    category: "",
    relatedPosts: [],
    seo: {
      title: "",
      description: "",
      keywords: []
    },
    status: "Draft"
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        publishedAt: formData.status === 'Published' ? new Date().toISOString() : null
      };
      await blogApi.createBlog(dataToSend);
      navigate("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
        seo: {
          ...prev.seo,
          title: prev.seo.title || value
        }
      }));
    } else if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleContentBlockChange = (id: string, field: string, value: any) => {
    setFormData(prev => {
      const updatedContent = prev.content.map(block => {
        if (block.id === id) {
          return { ...block, [field]: value };
        }
        return block;
      });
      return { ...prev, content: updatedContent };
    });
  };

  const handleFAQChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const updatedFAQ = prev.faq.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, faq: updatedFAQ };
    });
  };

  const addContentBlock = (type: ContentBlock['type']) => {
    setFormData(prev => ({
      ...prev,
      content: [
        ...prev.content,
        {
          ...defaultContentBlock,
          id: uuidv4(),
          type
        }
      ]
    }));
  };

  const removeContentBlock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== id)
    }));
  };

  const addFAQItem = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { ...defaultFAQItem, id: uuidv4() }]
    }));
  };

  const removeFAQItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter(item => item.id !== id)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo.keywords?.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...(prev.seo.keywords || []), newKeyword.trim()]
        }
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords?.filter(keyword => keyword !== keywordToRemove) || []
      }
    }));
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file to your server here
      const file = e.target.files[0];
      // Mock upload - replace with actual API call
      const mockUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        heroImage: {
          url: mockUrl,
          alt: `Hero image for ${prev.title}`
        }
      }));
    }
  };

  const handleContentImageUpload = async (blockId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Mock upload - replace with actual API call
      const mockUrl = URL.createObjectURL(file);
      
      setFormData(prev => {
        const updatedContent = prev.content.map(block => {
          if (block.id === blockId) {
            return { 
              ...block, 
              url: mockUrl,
              alt: `Image in ${prev.title}`
            };
          }
          return block;
        });
        return { ...prev, content: updatedContent };
      });
    }
  };

  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div className="mt-4">
            <textarea
              value={block.text || ''}
              onChange={(e) => handleContentBlockChange(block.id, 'text', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={4}
              placeholder="Write your paragraph here..."
            />
          </div>
        );
      case 'image':
        return (
          <div className="mt-4">
            {block.url ? (
              <div className="relative group">
                <img src={block.url} alt={block.alt || ''} className="max-w-full h-auto rounded-md" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeContentBlock(block.id)}
                    className="bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={(e) => handleContentBlockChange(block.id, 'caption', e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-md p-2"
                  placeholder="Image caption"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleContentImageUpload(block.id, e)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <ImageIcon size={24} className="text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload an image</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        );
      case 'list':
        return (
          <div className="mt-4">
            <select
              value={block.style || 'unordered'}
              onChange={(e) => handleContentBlockChange(block.id, 'style', e.target.value)}
              className="mb-2 border border-gray-300 rounded-md p-2"
            >
              <option value="unordered">Unordered List</option>
              <option value="ordered">Ordered List</option>
            </select>
            <div className="space-y-2">
              {(block.items || []).map((item, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(block.items || [])];
                      newItems[index] = e.target.value;
                      handleContentBlockChange(block.id, 'items', newItems);
                    }}
                    className="flex-1 border border-gray-300 rounded-md p-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(block.items || [])];
                      newItems.splice(index, 1);
                      handleContentBlockChange(block.id, 'items', newItems);
                    }}
                    className="ml-2 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const newItems = [...(block.items || []), ''];
                handleContentBlockChange(block.id, 'items', newItems);
              }}
              className="mt-2 flex items-center text-sm text-blue-500"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </button>
          </div>
        );
      case 'quote':
        return (
          <div className="mt-4">
            <textarea
              value={block.text || ''}
              onChange={(e) => handleContentBlockChange(block.id, 'text', e.target.value)}
              className="w-full border-l-4 border-gray-400 pl-4 italic text-gray-600 p-2"
              rows={3}
              placeholder="Add a quote..."
            />
          </div>
        );
      case 'link':
        return (
          <div className="mt-4">
            <input
              type="text"
              value={block.text || ''}
              onChange={(e) => handleContentBlockChange(block.id, 'text', e.target.value)}
              className="w-full mb-2 border border-gray-300 rounded-md p-2"
              placeholder="Link text"
            />
            <input
              type="url"
              value={block.url || ''}
              onChange={(e) => handleContentBlockChange(block.id, 'url', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="URL"
            />
          </div>
        );
      case 'section':
      case 'subsection':
        return (
          <div className="mt-4 border-l-2 pl-4 border-gray-200">
            <input
              type="text"
              value={block.title || ''}
              onChange={(e) => handleContentBlockChange(block.id, 'title', e.target.value)}
              className="w-full font-bold text-lg mb-2 border border-gray-300 rounded-md p-2"
              placeholder={`${block.type === 'section' ? 'Section' : 'Subsection'} title`}
            />
            <div className="space-y-4">
              {(block.content || []).map(subBlock => renderContentBlock(subBlock))}
            </div>
            <button
              type="button"
              onClick={() => {
                const updatedContent = [...(block.content || []), {
                  ...defaultContentBlock,
                  id: uuidv4(),
                  type: 'paragraph'
                }];
                handleContentBlockChange(block.id, 'content', updatedContent);
              }}
              className="mt-2 flex items-center text-sm text-blue-500"
            >
              <Plus size={16} className="mr-1" /> Add Content
            </button>
          </div>
        );
      default:
        return null;
    }
  };

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
            Add New Blog Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Hero Image
              </label>
              {formData.heroImage ? (
                <div className="mt-1 relative group">
                  <img 
                    src={formData.heroImage.url} 
                    alt={formData.heroImage.alt} 
                    className="max-w-full h-64 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, heroImage: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon size={24} className="text-gray-400 mb-2" />
                      <span className="text-gray-600">Upload a hero image</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
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

            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="readTime"
                id="readTime"
                min="1"
                value={formData.readTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
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

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Post
              </label>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
            <div className="space-y-6">
              {formData.content.map((block) => (
                <div key={block.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <select
                      value={block.type}
                      onChange={(e) => handleContentBlockChange(block.id, 'type', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="image">Image</option>
                      <option value="list">List</option>
                      <option value="quote">Quote</option>
                      <option value="link">Link</option>
                      <option value="section">Section</option>
                      <option value="subsection">Subsection</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(block.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {renderContentBlock(block)}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addContentBlock('paragraph')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> Paragraph
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('image')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> Image
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('list')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> List
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('quote')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> Quote
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('link')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> Link
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('section')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> Section
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ Section</h3>
            {formData.faq.length > 0 && (
              <div className="space-y-4 mb-4">
                {formData.faq.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">FAQ Item</h4>
                      <button
                        type="button"
                        onClick={() => removeFAQItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => handleFAQChange(item.id, 'question', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Question"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => handleFAQChange(item.id, 'answer', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                        placeholder="Answer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addFAQItem}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus size={16} className="mr-1" /> Add FAQ Item
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 min-w-0 block border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="seo.title" className="block text-sm font-medium text-gray-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seo.title"
                  id="seo.title"
                  value={formData.seo.title || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="seo.description" className="block text-sm font-medium text-gray-700">
                  SEO Description
                </label>
                <textarea
                  name="seo.description"
                  id="seo.description"
                  value={formData.seo.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.seo.keywords?.map((keyword) => (
                    <span key={keyword} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="flex-1 min-w-0 block border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Add a keyword"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
              </div>
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
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}