
import { apiRequest } from './api';
import { User } from '../types';

interface AuthResponse {
  user: User;
  token: string; // Assuming backend sends token under 'token' for login/register
}

interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

interface RegisterData extends LoginCredentials {
  name?: string;
  // Fix: Add password_confirmation to RegisterData type
  password_confirmation?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Backend might expect 'username' or 'email', adjust payload as needed
  // For this example, let's assume it can handle either in a generic field if backend supports it,
  // or send both if separate fields. The prompt implies 'username/email' can be used.
  // A robust solution might require a specific field name like 'login_identifier'.
  // Here, we'll send 'email' if it looks like one, otherwise 'username'.
  const payload = credentials.email?.includes('@') ? 
    { email: credentials.email, password: credentials.password } : 
    { username: credentials.username, password: credentials.password };

  return apiRequest<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutUser = async (): Promise<void> => {
  return apiRequest<void>('/logout', {
    method: 'POST',
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>('/user', {
    method: 'GET',
  });
};