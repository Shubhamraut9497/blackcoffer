const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    SIGNUP: `${API_URL}/auth/signup`,
    PROFILE: `${API_URL}/auth/profile`,
    LOGOUT: `${API_URL}/auth/logout`,
  },
  DATA: {
    META: `${API_URL}/data/meta`,
    FILTER: `${API_URL}/data/filter`,
  },
};

export const getApiHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const API_CONFIG = {
  credentials: 'include' as RequestCredentials,
};