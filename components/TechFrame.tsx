import React, { ReactNode } from 'react';

interface TechFrameProps {
  children: ReactNode;
  title?: string;
  className?: string;
  borderColor?: string;
  theme?: 'green' | 'orange';
}

const TechFrame: React.FC<TechFrameProps> = ({ children, title, className = "", borderColor, theme = 'green' }) => {
  // Determine colors based on theme or overrides
  const mainColor = borderColor ? borderColor : (theme === 'orange' ? '#ffaa00' : '#00ff00');
  const secondaryColor = theme === 'orange' ? '#884400' : '#004400';
  const glowShadow = theme === 'orange' ? 'shadow-[0_0_10px_#ffaa00]' : 'shadow-[0_0_10px_#00ff00]';
  const scanlineColor = theme === 'orange' ? 'bg-[#ffaa00]' : 'bg-[#00ff00]';

  // Simplify complex template literal to avoid TypeScript union complexity error
  const c22 = `${secondaryColor}22`;
  const c33 = `${secondaryColor}33`;
  const backgroundImage = [
    `linear-gradient(30deg, ${c22} 12%, transparent 12.5%, transparent 87%, ${c22} 87.5%, ${c22})`,
    `linear-gradient(150deg, ${c22} 12%, transparent 12.5%, transparent 87%, ${c22} 87.5%, ${c22})`,
    `linear-gradient(30deg, ${c22} 12%, transparent 12.5%, transparent 87%, ${c22} 87.5%, ${c22})`,
    `linear-gradient(150deg, ${c22} 12%, transparent 12.5%, transparent 87%, ${c22} 87.5%, ${c22})`,
    `linear-gradient(60deg, ${c33} 25%, transparent 25.5%, transparent 75%, ${c33} 75%, ${c33})`,
    `linear-gradient(60deg, ${c33} 25%, transparent 25.5%, transparent 75%, ${c33} 75%, ${c33})`
  ].join(', ');

  return (
    <div className={`relative p-1 ${className}`}>
      
      {/* LAYER 1: Background Mesh/Hex Pattern */}
      <div className="absolute inset-0 bg-[#000800] opacity-90 z-0 border border-opacity-30"
           style={{
               borderColor: secondaryColor,
               backgroundImage: backgroundImage,
               backgroundSize: '20px 35px',
               backgroundPosition: '0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px'
           }}
      ></div>

      {/* LAYER 2: Structural Main Border (SVG) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
              <path d="M0,20 L20,0 L100,0 L120,0 L100%,0 L100%,20 L100%,100% L100%,100% L20,100% L0,100% - 20 Z" 
                    fill="none" 
                    stroke={mainColor} 
                    strokeWidth="1.5" 
                    vectorEffect="non-scaling-stroke"
                    className="opacity-70"
              />
               {/* Cut Corners Fill */}
              <path d="M0,20 L20,0 L0,0 Z" fill={mainColor} />
              <path d="M100%,20 L100%,0 L100% - 20,0 Z" transform="scale(-1, 1) translate(-100%, 0)" fill={mainColor} />
          </svg>
      </div>

      {/* LAYER 3: Decorative HUD Elements (Brackets & Rails) */}
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-1/3 w-0.5 z-20 hidden md:block" style={{backgroundColor: secondaryColor}}></div>
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 h-1/3 w-0.5 z-20 hidden md:block" style={{backgroundColor: secondaryColor}}></div>
      
      <div className="absolute top-0 right-10 w-24 h-0.5 z-20 opacity-50" style={{backgroundColor: mainColor}}></div>
      <div className="absolute bottom-0 left-10 w-24 h-0.5 z-20 opacity-50" style={{backgroundColor: mainColor}}></div>

      {/* LAYER 4: Content Container */}
      <div className="relative z-30 p-4 md:p-6 h-full flex flex-col">
        {title && (
            <div className="flex items-center mb-3 border-b border-opacity-30 pb-2" style={{borderColor: secondaryColor}}>
                <div className="w-1.5 h-1.5 animate-pulse mr-2" style={{backgroundColor: mainColor}}></div>
                <h2 className="text-base md:text-lg font-bold tracking-[0.2em] px-2 text-black" style={{backgroundColor: mainColor}}>
                  {title}
                </h2>
                <div className="flex-grow ml-4 h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-50 relative">
                   <div className="absolute inset-0 bg-current opacity-20" style={{color: mainColor}}></div>
                </div>
                <div className="text-[10px] ml-2 opacity-70" style={{color: mainColor}}>SYS_ID: 8086</div>
            </div>
        )}
        <div className="flex-grow overflow-auto scrollbar-none">
          {children}
        </div>
      </div>

      {/* LAYER 5: Animated Overlay Scanning Line */}
      <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden opacity-10">
          <div className={`w-full h-0.5 ${scanlineColor} ${glowShadow} animate-scanline`}></div>
      </div>
      
      {/* Status Bits */}
      <div className="absolute bottom-1 right-2 z-50 text-[8px] font-mono leading-none tracking-widest opacity-60" style={{color: secondaryColor}}>
          SECURE_CONNECTION<br/>ENCRYPTION_ENABLED
      </div>

    </div>
  );
};

export default TechFrame;