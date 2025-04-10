import React from 'react';

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-6xl">
      {children}
    </div>
  );
} 