import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const loadUser = useAuthStore(state => state.loadUser);
  
  useEffect(() => {
    loadUser();
  }, []); // Remove loadUser from dependencies to avoid infinite re-renders
  
  return children;
};