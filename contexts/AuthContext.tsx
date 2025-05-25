
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser as fetchCurrentUser, logoutUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => Promise<void>;
  fetchUser: (forceRefresh?: boolean) => Promise<void>;
  isYoutubeConnected: boolean;
  youtubeChannelName: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Initialize token directly from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  // Start with loading true, as we might need to fetch user based on token
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setUser(userData);
    // After login, authentication process is complete for this action, so not loading.
    setLoading(false);
  };

  const logout = useCallback(async () => {
    if (token) { // Use state token for the check
      try {
        await logoutUser();
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with client-side logout regardless
      }
    }
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setLoading(false); // Not loading after logout
  }, [token]); // Depends on the current token state

  const fetchUser = useCallback(async (forceRefresh: boolean = false) => {
    // If there's no token, clear user and stop loading.
    if (!token) {
      setUser(null);
      // setToken(null); // Token is already null or being set to null if called after setToken(null)
      setLoading(false);
      return;
    }

    // Token exists. Fetch if user isn't loaded or if refresh is forced.
    if (!user || forceRefresh) {
      setLoading(true); // We are about to make an API call
      try {
        const userData = await fetchCurrentUser();
        if (userData && typeof userData === 'object' && 'id' in userData) {
          setUser(userData as User);
        } else {
          // API call succeeded but returned no valid user data (e.g., 200 OK with null/empty body).
          // This implies the token might be invalid or session ended on backend. Clear session.
          console.warn('fetchCurrentUser returned non-user data for a token. Clearing session.');
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Failed to fetch user in AuthContext:', error);
        // apiRequest service handles 401 by removing token from localStorage & redirecting.
        // For other errors, or as a robust fallback, clear session state here.
        // The token in localStorage might have already been cleared by apiRequest for 401s.
        setUser(null);
        setToken(null); // Clear token from state too
        localStorage.removeItem('authToken'); // Ensure removal on any fetch error
      } finally {
        setLoading(false); // Ensure loading is false after any fetch attempt
      }
    } else {
      // Token exists, user is already loaded, and not forcing refresh.
      // We are not actively fetching, so ensure loading is false.
      setLoading(false);
    }
  }, [token, user]); // `loading` is NOT a dependency here. `setUser`, `setToken`, `setLoading` are stable.

  useEffect(() => {
    // This effect manages initial user loading based on token presence,
    // and reacts to token/user changes.
    if (token) {
      if (!user) {
        // Token exists, but user not yet loaded in state (e.g., initial app load with stored token).
        fetchUser(); // fetchUser will handle loading states internally.
      } else {
        // Token exists and user is already populated (e.g., after login, or after successful initial fetchUser).
        // Ensure loading is false, as no immediate fetch operation is pending from this effect.
        setLoading(false);
      }
    } else {
      // No token (e.g., initial load with no token, or after logout).
      setUser(null); // Ensure user is cleared.
      setLoading(false); // Not loading.
    }
  }, [token, user, fetchUser]); // `fetchUser` depends on `token` and `user`.

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
