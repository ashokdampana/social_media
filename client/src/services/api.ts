import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message;
    return responseMessage ?? error.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? undefined : '/api');

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL must be set for production builds');
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default api;
