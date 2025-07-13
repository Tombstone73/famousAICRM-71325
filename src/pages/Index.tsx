import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import AuthContainer from '@/components/auth/AuthContainer';

const Index: React.FC = () => {
  const { user, isAuthenticated, logout } = useAppContext();

  if (!isAuthenticated || !user) {
    return <AuthContainer />;
  }

  return <AppLayout user={user} onLogout={logout} />;
};

export default Index;