import React, { createContext, useState, useEffect, ReactNode } from 'react';

// --- Interfaces ---
interface User {
  id: string;
  name?: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (name: string, email: string, profilePicture?: string) => Promise<void>;
}

// --- Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, check for a token in local storage
    try {
      const storedToken = localStorage.getItem('echosketch-token');
      const storedUser = localStorage.getItem('echosketch-user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth state from localStorage", e);
      // Clear potentially corrupted storage
      localStorage.removeItem('echosketch-token');
      localStorage.removeItem('echosketch-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Mock API Functions ---
  // In a real app, these would be fetch/axios calls to your backend.

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay

    try {
      const storedUsers = JSON.parse(localStorage.getItem('echosketch-users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password); // NOTE: NEVER store/compare plain text passwords in production!

      if (foundUser) {
        const fakeToken = `jwt-token-${Date.now()}`;
        const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name, profilePicture: foundUser.profilePicture };
        
        localStorage.setItem('echosketch-token', fakeToken);
        localStorage.setItem('echosketch-user', JSON.stringify(userData));
        
        setToken(fakeToken);
        setUser(userData);
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      throw err; // Re-throw to be caught in the form
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay

    try {
        const storedUsers = JSON.parse(localStorage.getItem('echosketch-users') || '[]');
        const userExists = storedUsers.some((u: any) => u.email === email);
  
        if (userExists) {
          throw new Error('An account with this email already exists.');
        }
  
        // In a real backend, password would be hashed here.
        const newUser = { id: crypto.randomUUID(), name, email, password };
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('echosketch-users', JSON.stringify(updatedUsers));

        // Automatically sign in the user after successful sign up
        await signIn(email, password);

    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, email: string, profilePicture?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay

    try {
      if (!user) {
        throw new Error('No user is currently signed in.');
      }

      // Validate username
      if (!name || name.trim() === '') {
        throw new Error('Username cannot be empty.');
      }

      const storedUsers = JSON.parse(localStorage.getItem('echosketch-users') || '[]');
      
      // Check if email is being changed and if it's already in use by another user
      if (email !== user.email) {
        const emailExists = storedUsers.some((u: any) => u.email === email && u.id !== user.id);
        if (emailExists) {
          throw new Error('Email already in use.');
        }
      }

      // Update user in users array
      const updatedUsers = storedUsers.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, name, email, profilePicture };
        }
        return u;
      });
      localStorage.setItem('echosketch-users', JSON.stringify(updatedUsers));

      // Update current user data
      const updatedUserData = { ...user, name, email, profilePicture };
      localStorage.setItem('echosketch-user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('echosketch-token');
    localStorage.removeItem('echosketch-user');
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};