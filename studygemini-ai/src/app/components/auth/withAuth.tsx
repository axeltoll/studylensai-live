'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        // Redirect to login page (or landing page with modal open) if not authenticated
        // We'll redirect to the home page for now, assuming the Navbar handles the modal
        router.push('/'); 
      }
    }, [user, loading, router]);

    if (loading || !user) {
      // Optionally return a loading spinner or null
      return (
          <div className="flex justify-center items-center h-screen">
              <div>Loading...</div>
          </div>
      ); 
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth; 