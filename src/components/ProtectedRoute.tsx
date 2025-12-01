import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If user is admin, redirect to admin panel
    if (user && user.role === 'admin') {
      toast({
        title: "Admin Access",
        description: "Admins can only access the admin panel",
        variant: "destructive",
      });
      navigate('/admin');
      return;
    }

    // If auth is required and user is not logged in
    if (requireAuth && !isLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [user, isLoading, navigate, requireAuth, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is admin, don't render children (will redirect)
  if (user && user.role === 'admin') {
    return null;
  }

  // If auth required and no user, don't render children (will redirect)
  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

