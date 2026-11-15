import api from './api';
import type { UserInput } from '../types/schema';

export type AuthUser = { id: string; email: string };
export type AuthApiResponse = {
  success: boolean;
  message: string;
  data: { user: AuthUser };
};

export const loginUserApi = async (formdata: UserInput) => {
  const res = await api.post<AuthApiResponse>('/auth/login', formdata);
  return res.data;
};

export const registerUserApi = async (formdata: UserInput) => {
  const res = await api.post<AuthApiResponse>('/auth/register', formdata);
  return res.data;
};

export const checkMeApi = async () => {
  const res = await api.get<AuthApiResponse>('/auth/me');
  return res.data;
}

export const logoutApi = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
}