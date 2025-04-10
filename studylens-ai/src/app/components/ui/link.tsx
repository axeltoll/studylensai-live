'use client';

import React from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

// Define the props for the LinkComponent
interface LinkComponentProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  prefetch?: boolean;
  onClick?: () => void;
}

// Create a wrapper around Next.js Link with suppressHydrationWarning
const LinkComponent = ({
  href,
  className,
  children,
  prefetch = false,
  onClick,
  ...props
}: LinkComponentProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
  return (
    <NextLink 
      href={href} 
      className={cn('inline-flex flex-row items-center', className)} 
      prefetch={prefetch} 
      onClick={onClick}
      {...props}
    >
      <span suppressHydrationWarning className="inline-flex flex-row items-center">{children}</span>
    </NextLink>
  );
};

export default LinkComponent; 