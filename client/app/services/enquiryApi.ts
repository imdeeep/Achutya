import { API_URL } from "~/lib/baseurl";

const BASE_URL = `${API_URL}/enquiries`;

export interface EnquiryFormData {
  name: string;
  phoneNumber: string;
  email: string;
  message?: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved' | 'spam';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryStats {
  total: number;
  pending: number;
  contacted: number;
  resolved: number;
  spam: number;
  recent: number;
  monthlyTrend: Array<{ month: string; count: number }>;
}

export interface EnquiryResponse {
  success: boolean;
  message?: string;
  data: Enquiry;
}

export interface EnquiriesListResponse {
  success: boolean;
  data: Enquiry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EnquiryStatsResponse {
  success: boolean;
  data: EnquiryStats;
}

export interface UpdateEnquiryData {
  status?: 'pending' | 'contacted' | 'resolved' | 'spam';
  adminNotes?: string;
}

// Public API - Submit enquiry (no authentication required)
export const submitEnquiry = async (data: EnquiryFormData): Promise<EnquiryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit enquiry');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API - Get all enquiries
export const getAllEnquiries = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<EnquiriesListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && status !== 'all' && { status }),
      ...(search && { search })
    });

    const response = await fetch(`${BASE_URL}/admin/all?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch enquiries');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API - Get enquiry by ID
export const getEnquiryById = async (token: string, id: string): Promise<EnquiryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch enquiry');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API - Update enquiry
export const updateEnquiry = async (
  token: string,
  id: string,
  data: UpdateEnquiryData
): Promise<EnquiryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update enquiry');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API - Delete enquiry
export const deleteEnquiry = async (token: string, id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete enquiry');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Admin API - Get enquiry statistics
export const getEnquiryStats = async (token: string): Promise<EnquiryStatsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch enquiry statistics');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}; 