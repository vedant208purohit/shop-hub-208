import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string, address?: any, birthDate?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, _id, name, role } = response.data;
      localStorage.setItem('token', token);
      const userData = { _id, email, name, role };
      setUser(userData);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${name}!`,
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    phone?: string, 
    address?: any, 
    birthDate?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ 
        name, 
        email, 
        password,
        phone,
        address,
        birthDate
      });
      const { token, _id, role } = response.data;
      localStorage.setItem('token', token);
      const userData = { _id, email, name, role };
      setUser(userData);
      toast({
        title: 'Registration Successful',
        description: `Welcome ${name}!`,
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Could not create account',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Note: We keep the cart in localStorage so it can be restored when user logs back in
    // The cart will be cleared from state but saved in localStorage with user ID
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};