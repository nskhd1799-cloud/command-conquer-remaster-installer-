import React, { ReactNode } from 'react';

interface BoxFrameProps {
  title?: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

const BoxFrame: React.FC<BoxFrameProps> = ({ title, children, className = "", active = true }) => {
  return (
    <div className={`border-2 ${active ? 'border-[#00ff00]' : 'border-[#004400] text-[#004400]'} relative p-4 ${className}`}>
      {title && (
        <div className={`absolute -top-4 left-4 ${active ? 'bg-[#00ff00] text-black' : 'bg-[#004400] text-black'} px-2 uppercase font-bold`}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default BoxFrame;