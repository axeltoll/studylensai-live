import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@/app/context/UserContext';

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
};

export default Providers; 