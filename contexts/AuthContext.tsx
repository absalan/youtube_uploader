
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
  }, [token]);

  const fetchUser = useCallback(async () => {
    if (token && !user) { // Fetch user only if token exists and user is not yet set
      setLoading(true);
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Token might be invalid, clear it
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // No token or user already loaded
    }
  }, [token, user]);


  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-fetch user if token changes (e.g., on initial load from localStorage)


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
