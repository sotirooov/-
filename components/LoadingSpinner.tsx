
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  small?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Зареждане...", small = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${small ? 'my-4' : 'my-8'}`}>
      <div className={`animate-spin rounded-full border-t-4 border-b-4 border-cyan-400 ${small ? 'h-10 w-10' : 'h-16 w-16'}`}></div>
      {text && <p className={`mt-4 text-slate-300 ${small ? 'text-sm' : 'text-lg'}`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
