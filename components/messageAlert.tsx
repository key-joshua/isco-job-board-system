'use client';

import { useEffect, useState } from 'react';

interface MessageAlertProps { status: 'success' | 'error' | ''; message: string; id: any; }

export default function MessageAlert({ status, message, id }: MessageAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (status && message) {
      setVisible(false);
      const show = setTimeout(() => setVisible(true), 10);
      const hide = setTimeout(() => setVisible(false), 3000);
      return () => {
        clearTimeout(show);
        clearTimeout(hide);
      };
    }
  }, [status, message, id]);

  if (!status || !message) return null;
  
  const baseClasses = 'flex items-center p-4 mb-5 rounded-lg border shadow-md transition-opacity duration-1000';
  const typeClasses = status === 'success' ? 'border-green-500 bg-green-100 text-green-800' : 'border-red-500 bg-red-100 text-red-800';


  return (
    <div className={`${baseClasses} ${typeClasses} ${visible ? 'opacity-90' : 'opacity-0'}`}>
      <div className="w-5 h-5 mr-3 flex-shrink-0 text-xl font-bold"> {status === 'success' ? '✓' : '!'} </div>
      <span className="text-xs font-medium leading-snug">{message}</span>
    </div>
  );
}
