import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;
