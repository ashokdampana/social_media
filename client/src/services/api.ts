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

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;
