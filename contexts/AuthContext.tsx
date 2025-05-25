
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser as fetchCurrentUser, logoutUser } from '../services/authService';
import { API_BASE_URL } from '../constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  isYoutubeConnected: boolean;
  youtubeChannelName: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setUser(userData);
    setLoading(false); // Explicitly set loading to false after successful login
  };

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutUser();
      } catch (error) {
        console.error('Logout failed:', error);
        // Still proceed with local logout
      }
    }
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setLoading(false); // Explicitly set loading to false after logout
  }, [token]);

  const fetchUser = useCallback(async () => {
    if (token && !user) { // Fetch user only if token exists and user is not yet set
      setLoading(true);
      try {
        const userData = await fetchCurrentUser();
        setUser(userData || null); // Ensure user is null if userData is falsy (e.g. undefined from API)
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Token might be invalid, clear it. Set React state first.
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    } else if (!token && user) { // If somehow user exists but token doesn't, clear user
        setUser(null);
        setLoading(false);
    }
    else { // No token (and no user), or token and user already loaded
      setLoading(false);
    }
  }, [token, user]);


  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        loading, 
        login, 
        logout,
        fetchUser,
        isYoutubeConnected: user?.is_youtube_connected || false,
        youtubeChannelName: user?.youtube_channel_name || null
    }}>
      {children}
    </AuthContext.Provider>
  );
};
