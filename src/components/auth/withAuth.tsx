'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

// Higher-order component for route protection
export default function withAuth<T>(Component: React.ComponentType<T>) {
  return function WithAuth(props: T) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      // If auth state is loaded and user is not authenticated, redirect to login
      if (!loading && !user) {
        router.push('/');
      } else if (!loading && user) {
        setIsAuthorized(true);
      }
    }, [user, loading, router]);

    // Show nothing while loading or checking auth
    if (loading || !isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // If authorized, render the wrapped component
    return <Component {...props} />;
  };
} 