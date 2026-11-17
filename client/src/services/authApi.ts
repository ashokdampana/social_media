import api from './api';
import type { UserInputType } from '../types/schema';

export type AuthUser = {
  id: string;
  email: string;
  role: 'userrole' | 'adminrole';
};

type AuthResponse = {
  data: AuthUser;
};

export const loginUserApi = (json: UserInputType) =>
  api.post<AuthResponse>('/auth/login', json);

export const registerUserApi = (json: UserInputType) =>
  api.post<AuthResponse>('/auth/register', json);

export const checkMeApi = () => api.get<AuthResponse>('/auth/me');

export const logoutApi = () => api.post('/auth/logout');
