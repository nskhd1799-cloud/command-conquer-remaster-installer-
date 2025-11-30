
import React, { useEffect, useState } from 'react';

interface LipSyncVisualizerProps {
  isTalking: boolean;
}

const LipSyncVisualizer: React.FC<LipSyncVisualizerProps> = ({ isTalking }) => {
  const [hexLinesLeft, setHexLinesLeft] = useState<string[]>([]);
  const [hexLinesRight, setHexLinesRight] = useState<string[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
        // Update Left Stream
        setHexLinesLeft(prev => {
            const next = [...prev, Math.random().toString(16).substring(2, 6).toUpperCase()];
            if (next.length > 20) next.shift();
            return next;
        });
        // Update Right Stream
        setHexLinesRight(prev => {
            const next = [...prev, `0x${Math.random().toString(16).substring(2, 4).toUpperCase()}`];
            if (next.length > 20) next.shift();
            return next;
        });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black border border-[#003300] overflow-hidden flex flex-col items-center justify-center">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 50, 0, .3) 25%, rgba(0, 50, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 50, 0, .3) 75%, rgba(0, 50, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 50, 0, .3) 25%, rgba(0, 50, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 50, 0, .3) 75%, rgba(0, 50, 0, .3) 76%, transparent 77%, transparent)',
                backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Scrolling Hex Data - Left Column */}
        <div className="absolute left-2 top-4 bottom-4 w-12 flex flex-col justify-end overflow-hidden opacity-60 z-10 border-r border-[#004400] pr-1">
            {hexLinesLeft.map((line, i) => (
                <div key={i} className="text-[10px] font-mono text-[#006600] leading-tight text-right">{line}</div>
            ))}
        </div>
        
        {/* Scrolling Hex Data - Right Column */}
        <div className="absolute right-2 top-4 bottom-4 w-12 flex flex-col justify-end overflow-hidden opacity-60 z-10 border-l border-[#004400] pl-1">
            {hexLinesRight.map((line, i) => (
                <div key={i} className="text-[10px] font-mono text-[#006600] leading-tight">{line}</div>
            ))}
        </div>

        {/* Main Graphic Area - Maximized */}
        <div className="relative z-20 w-full h-full flex items-center justify-center p-4">
             <svg viewBox="0 0 200 200" className="h-full w-auto max-w-full drop-shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <defs>
                    <filter id="glow-orange">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="scan-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="transparent"/>
                        <stop offset="50%" stopColor="#00ff00" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="transparent"/>
                    </linearGradient>
                </defs>
                
                {/* Targeting Circles */}
                <circle cx="100" cy="100" r="85" className="stroke-[#003300] stroke-1 fill-none" />
                <circle cx="100" cy="100" r="95" className="stroke-[#002200] stroke-[4] fill-none" strokeDasharray="20,10" />
                <circle cx="100" cy="100" r="75" className={`stroke-[#004400] stroke-[0.5] fill-none transition-all duration-300 ${isTalking ? 'stroke-[#ffaa00] opacity-30' : 'opacity-10'}`} />

                {/* Face Geometry - High Tech Wireframe */}
                <g transform="translate(0, 0)">
                    {/* Cranium */}
                    <path d="M60,50 Q100,20 140,50 L150,90 L130,150 L100,170 L70,150 L50,90 Z" 
                          className="stroke-[#00ff00] stroke-[1.5] fill-none" strokeLinejoin="round" />
                    
                    {/* Center Line */}
                    <path d="M100,35 L100,170" className="stroke-[#005500] stroke-[0.5] fill-none" />
                    {/* Eye Line */}
                    <path d="M50,90 L150,90" className="stroke-[#005500] stroke-[0.5] fill-none" />
                    {/* Cheek Line */}
                    <path d="M60,120 L140,120" className="stroke-[#005500] stroke-[0.5] fill-none" />
                    
                    {/* Eyes - Digital Plates */}
                    <rect x="65" y="80" width="25" height="8" className="fill-[#001100] stroke-[#00aa00] stroke-[0.5]" />
                    <rect x="110" y="80" width="25" height="8" className="fill-[#001100] stroke-[#00aa00] stroke-[0.5]" />
                    
                    {/* Nose Bridge */}
                    <path d="M95,90 L90,115 L110,115 L105,90" className="stroke-[#004400] stroke-[0.5] fill-none" />

                    {/* Mouth / Voice Box Area */}
                     {isTalking ? (
                        <g filter="url(#glow-orange)">
                           {/* Jaw outline */}
                           <path d="M75,135 L100,160 L125,135" className="stroke-[#ffaa00] stroke-[1] fill-none opacity-50" />
                           
                           {/* Dynamic Equalizer Bars (The Mouth) */}
                           <rect x="80" y="130" width="4" height="4" className="fill-[#ffaa00] animate-[pulse_0.1s_infinite]" />
                           <rect x="86" y="128" width="4" height="8" className="fill-[#ffaa00] animate-[pulse_0.15s_infinite]" />
                           <rect x="92" y="126" width="4" height="12" className="fill-[#ffaa00] animate-[pulse_0.1s_infinite]" />
                           <rect x="98" y="125" width="4" height="14" className="fill-[#ffaa00] animate-[pulse_0.2s_infinite]" />
                           <rect x="104" y="126" width="4" height="12" className="fill-[#ffaa00] animate-[pulse_0.12s_infinite]" />
                           <rect x="110" y="128" width="4" height="8" className="fill-[#ffaa00] animate-[pulse_0.18s_infinite]" />
                           <rect x="116" y="130" width="4" height="4" className="fill-[#ffaa00] animate-[pulse_0.1s_infinite]" />
                           
                           {/* Side indicators */}
                           <path d="M145,130 L160,130" className="stroke-[#ffaa00] stroke-[2] animate-pulse" />
                           <path d="M40,130 L55,130" className="stroke-[#ffaa00] stroke-[2] animate-pulse" />
                        </g>
                     ) : (
                        <g>
                           <line x1="80" y1="135" x2="120" y2="135" className="stroke-[#006600] stroke-1" />
                           <line x1="80" y1="135" x2="80" y2="130" className="stroke-[#006600] stroke-1" />
                           <line x1="120" y1="135" x2="120" y2="130" className="stroke-[#006600] stroke-1" />
                        </g>
                     )}
                </g>
             </svg>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-0 w-full bg-[#001100] border-t border-[#004400] flex justify-between items-center px-4 py-1 z-30">
             <span className="text-[9px] text-[#00aa00] tracking-widest font-mono">VOICE_MODULATION</span>
             <div className="flex gap-0.5 items-end h-3 w-32">
                 {[...Array(20)].map((_, i) => (
                    <div key={i} className={`flex-1 transition-all duration-75 ${isTalking ? 'bg-[#ffaa00]' : 'bg-[#004400]'}`} 
                         style={{height: isTalking ? `${Math.random() * 100}%` : '20%', opacity: isTalking ? 1 : 0.5}}></div>
                 ))}
             </div>
        </div>
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#ffaa00] opacity-80"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#ffaa00] opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#ffaa00] opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#ffaa00] opacity-80"></div>
    </div>
  );
};

export default LipSyncVisualizer;
