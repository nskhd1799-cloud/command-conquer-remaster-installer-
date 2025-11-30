import React, { ReactNode } from 'react';

interface CRTScreenProps {
  children: ReactNode;
}

const CRTScreen: React.FC<CRTScreenProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center font-retro">
      {/* Outer Bezel (Optional, kept minimal for full screen feel) */}
      <div className="absolute inset-0 bg-[#050505] z-0 pointer-events-none"></div>

      {/* Screen Container - Ultrawide Aspect Ratio */}
      <div className="relative z-10 w-full h-full md:max-w-[95%] md:h-[85vh] aspect-auto md:aspect-[21/9] bg-[#001100] border border-[#334433] rounded-sm shadow-[0_0_50px_rgba(0,255,0,0.1)] overflow-hidden">
        
        {/* Phosphor Glow Layer */}
        <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(0, 50, 0, 0.05) 0%, rgba(0, 20, 0, 0.4) 90%, rgba(0,0,0,0.8) 100%)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)'
        }}></div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-15" style={{
            background: 'linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 3px, 4px 100%'
        }}></div>

        {/* Rolling Bar Interference */}
        <div className="absolute inset-0 pointer-events-none z-20 animate-scanline opacity-5 bg-gradient-to-b from-transparent via-[rgba(0,255,0,0.1)] to-transparent h-[15%] w-full"></div>

        {/* Main Content Area with Green Tint */}
        <div className="relative w-full h-full p-6 md:p-8 text-[#00ff00] text-lg md:text-xl lg:text-2xl leading-relaxed flex flex-col shadow-[0_0_15px_rgba(0,255,0,0.4)] animate-flicker">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CRTScreen;