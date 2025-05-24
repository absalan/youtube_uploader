
import { API_BASE_URL } from '../constants';
import { ApiError } from '../types';

interface RequestOptions extends RequestInit {
  isFormData?: boolean;
}

async function handleResponse<T,>(response: Response): Promise<T> {
  if (response.status === 204) { // No content
    return null as T;
  }

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text(); // Or handle other content types as needed
  }

  if (!response.ok) {
    const error: ApiError = {
        message: (data as ApiError).message || `HTTP error! status: ${response.status}`,
        errors: (data as ApiError).errors
    };
    if (response.status === 401 && !window.location.hash.includes('/login')) { // Unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/#/login'; // Redirect to login
    }
    throw error;
  }
  return data as T;
}

export async function apiRequest<T,>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = options.isFormData ? {} : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse<T>(response);
}
