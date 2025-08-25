import { API_URL } from "~/lib/baseurl";

const BASE_URL = `${API_URL}/blogs`;

export interface ContentBlock {
  type: 'paragraph' | 'image' | 'list' | 'quote' | 'link' | 'section' | 'subsection';
  title?: string;
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
  style?: 'ordered' | 'unordered';
  items?: string[];
  content?: ContentBlock[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  heroImage: {
    url: string;
    alt: string;
  };
  content: ContentBlock[];
  faq: FAQ[];
  tags: string[];
  category: string;
  relatedPosts: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
}

export interface BlogsListResponse {
  success: boolean;
  count: number;
  data: Blog[];
}

export interface FeaturedBlogsResponse {
  success: boolean;
  count: number;
  data: Blog[];
}

// Get all blogs with optional filtering
export const getBlogs = async (
  category?: string,
  limit?: number
): Promise<BlogsListResponse> => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${BASE_URL}?${params}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch blogs');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<BlogResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/slug/${slug}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch blog');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<BlogResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch blog');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get featured blogs
export const getFeaturedBlogs = async (): Promise<FeaturedBlogsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/featured`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch featured blogs');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Search blogs
export const searchBlogs = async (query: string): Promise<BlogsListResponse> => {
  try {
    const response = await fetch(`${BASE_URL}?search=${encodeURIComponent(query)}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to search blogs');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}; 