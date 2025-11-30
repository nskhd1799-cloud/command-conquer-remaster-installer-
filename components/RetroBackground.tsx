
import React from 'react';

const RetroBackground = () => {
  // Generate static random data for streams to prevent hydration mismatches
  const leftStream = Array.from({length: 40}).map(() => Math.random().toString(16).substring(2,10).toUpperCase());
  const rightStream = Array.from({length: 40}).map(() => Math.random().toString(16).substring(2,10).toUpperCase());

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#020502]">
      {/* 1. Base Gradient - Brighter center for better visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a331a_0%,_#000000_80%)] opacity-100"></div>

      {/* 2. Data Streams (Left & Right) */}
      <div className="absolute top-0 bottom-0 left-4 w-16 opacity-20 overflow-hidden flex flex-col justify-center mix-blend-screen">
          <div className="text-[10px] text-[#00ff00] font-mono leading-tight animate-scroll-up">
              {leftStream.map((txt, i) => <div key={i}>{txt}</div>)}
              {leftStream.map((txt, i) => <div key={`rep-${i}`}>{txt}</div>)}
          </div>
      </div>
      <div className="absolute top-0 bottom-0 right-4 w-16 opacity-20 overflow-hidden flex flex-col justify-center mix-blend-screen">
          <div className="text-[10px] text-[#ffaa00] font-mono leading-tight animate-scroll-down text-right">
              {rightStream.map((txt, i) => <div key={i}>{txt}</div>)}
              {rightStream.map((txt, i) => <div key={`rep-${i}`}>{txt}</div>)}
          </div>
      </div>

      {/* 3. Rotating Container for Targets (Grid Removed) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[90vmin] opacity-40 animate-spin-very-slow pointer-events-none filter drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]">
         <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#00ff00] fill-none stroke-[0.2]">
            
            {/* --- TARGETS --- */}
            
            {/* Hostile (Red) - Fading in and out */}
            <g className="animate-fade-pulse">
                <circle cx="20" cy="30" r="1" className="fill-red-600 stroke-none" />
                <circle cx="20" cy="30" r="2" className="stroke-red-500 stroke-[0.1] animate-ping-slow" />
                <text x="22" y="30" className="fill-red-500 text-[2px] font-mono select-none">HOSTILE</text>
            </g>

            <g className="animate-fade-pulse animation-delay-2000">
                <circle cx="80" cy="70" r="1" className="fill-red-600 stroke-none" />
                <circle cx="80" cy="70" r="3" className="stroke-red-500 stroke-[0.1] animate-ping-slow" />
            </g>

            {/* Unknown (Orange) */}
            <g>
                <circle cx="65" cy="35" r="1.2" className="fill-[#ffaa00] stroke-none animate-pulse" />
                <circle cx="65" cy="35" r="4" className="stroke-[#ffaa00] stroke-[0.1] opacity-30" />
            </g>

            {/* Friendly (Cyan) */}
            <g className="animate-blink">
                <circle cx="35" cy="60" r="1" className="fill-cyan-400 stroke-none" />
                <path d="M35,60 L45,55" className="stroke-cyan-500 stroke-[0.1]" />
                <circle cx="45" cy="55" r="0.5" className="fill-cyan-500 stroke-none" />
            </g>

            {/* Data Links connecting targets */}
            <path d="M65,35 L20,30" className="stroke-[#ffaa00] stroke-[0.1] opacity-40 animate-dash" strokeDasharray="1,1" />
            <path d="M50,50 L80,70" className="stroke-red-500 stroke-[0.1] opacity-30 animate-dash animation-delay-1000" strokeDasharray="1,1" />

         </svg>
      </div>
      
      {/* 4. Moving Grid Floor - Brighter */}
      <div 
        className="absolute w-[200%] h-[200%] -left-[50%] top-0 origin-top opacity-50 mix-blend-screen"
        style={{
            background: 'linear-gradient(transparent 0%, rgba(0, 50, 0, 0.5) 100%), linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px',
            transform: 'perspective(600px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
            animation: 'gridMove 15s linear infinite'
        }}
      ></div>

      {/* 5. Radar Sweep Effect - Stronger glow */}
      <div className="absolute inset-0 overflow-hidden opacity-30 mix-blend-screen pointer-events-none">
         <div className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_transparent_300deg,_#00ff00_360deg)] animate-radar-spin rounded-full"></div>
      </div>

      {/* 6. Floating Tactical Overlay Elements */}
      <div className="absolute inset-0 opacity-60 text-[10px] text-[#00aa00] font-mono p-4 pointer-events-none">
        {/* Top Left Status */}
        <div className="absolute top-12 left-16 border-l-2 border-[#00ff00] pl-2 animate-pulse bg-black bg-opacity-50 p-1">
            <div className="text-[#00ff00] font-bold">GLOBAL_SAT_FEED: ACTIVE</div>
            <div className="text-[#ffaa00]">ION_CANNON: ONLINE</div>
            <div className="text-[8px] mt-1 text-cyan-400">TRACKING: 4 TARGETS</div>
        </div>

        {/* Bottom Right Coordinates */}
        <div className="absolute bottom-12 right-16 text-right">
             <div className="border border-[#00ff00] p-1 inline-block bg-[#001100] mb-1 shadow-[0_0_5px_rgba(0,255,0,0.3)]">
                TGT_LOC: 44.12N 12.44E
             </div>
             <div className="flex justify-end gap-1">
                 <div className="w-2 h-2 bg-[#004400]"></div>
                 <div className="w-2 h-2 bg-[#008800]"></div>
                 <div className="w-2 h-2 bg-[#00ff00] animate-pulse"></div>
             </div>
        </div>
      </div>
      
      {/* Scanline Noise Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

       <style>{`
        @keyframes gridMove {
          0% { transform: perspective(600px) rotateX(60deg) translateY(0) translateZ(-200px); }
          100% { transform: perspective(600px) rotateX(60deg) translateY(100px) translateZ(-200px); }
        }
        @keyframes spin-very-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes radar-spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes scroll-up {
            from { transform: translateY(0); }
            to { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
            from { transform: translateY(-50%); }
            to { transform: translateY(0); }
        }
        @keyframes ping-slow {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3); opacity: 0; }
        }
        @keyframes dash {
            to { stroke-dashoffset: -10; }
        }
        @keyframes fade-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
        }
        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }
        .animate-spin-very-slow {
            animation: spin-very-slow 120s linear infinite;
        }
        .animate-radar-spin {
            animation: radar-spin 8s linear infinite;
        }
        .animate-scroll-up {
            animation: scroll-up 20s linear infinite;
        }
        .animate-scroll-down {
            animation: scroll-down 20s linear infinite;
        }
        .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-dash {
            animation: dash 3s linear infinite;
        }
        .animate-fade-pulse {
            animation: fade-pulse 4s ease-in-out infinite;
        }
        .animate-blink {
            animation: blink 1s steps(1) infinite;
        }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
};

export default RetroBackground;
