/**
 * Central API Client for FastAPI Backend Communication
 */

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';

export const getBaseUrl = () => {
  return (
    localStorage.getItem('taskflow_api_url') ||
    import.meta.env.VITE_API_BASE_URL ||
    DEFAULT_BASE_URL
  );
};

export const setBaseUrl = (url) => {
  const cleanUrl = url.replace(/\/+$/, '');
  localStorage.setItem('taskflow_api_url', cleanUrl);
  return cleanUrl;
};

export const getToken = () => {
  return localStorage.getItem('taskflow_token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('taskflow_token', token);
  } else {
    localStorage.removeItem('taskflow_token');
  }
};

/**
 * Universal Request Handler
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = getBaseUrl().trim();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;
  
  const headers = new Headers(options.headers || {});
  
  // Attach Bearer token if present
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type to application/json by default unless form-data or explicitly specified
  if (!headers.has('Content-Type') && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      if (typeof data === 'object' && data !== null) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(d => `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}`).join(', ');
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If it's a network error (e.g. backend stopped or CORS failure)
    if (!error.status && error.name === 'TypeError') {
      const netError = new Error(`Cannot connect to backend at ${baseUrl}. Please check if the FastAPI server is running.`);
      netError.status = 0;
      throw netError;
    }
    throw error;
  }
}
