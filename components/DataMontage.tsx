
import React, { useEffect, useState } from 'react';
import { Globe, Crosshair, Wifi, Shield, Zap } from 'lucide-react';

const DataMontage = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    // Slower frame switching for "convergence" effect
    const interval = setInterval(() => {
      setFrame(f => f + 1);
    }, 250); // 250ms per frame = 4fps
    return () => clearInterval(interval);
  }, []);

  // Collection of "Schematics" and "Data" views
  const renderFrame = () => {
    const type = frame % 5;
    
    switch(type) {
        case 0: // Satellite Map
            return (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <Globe size={200} className="text-[#00ff00] animate-spin-slow opacity-50" />
                    <div className="absolute inset-0 grid grid-cols-4 gap-4 p-4 opacity-30">
                        {Array.from({length: 16}).map((_, i) => (
                            <div key={i} className="border border-[#00ff00] bg-[#002200]"></div>
                        ))}
                    </div>
                    <div className="absolute top-10 left-10 text-2xl font-bold bg-black px-2">UPLINKING...</div>
                </div>
            );
        case 1: // Target Lock
            return (
                <div className="w-full h-full flex items-center justify-center relative">
                     <Crosshair size={300} className="text-[#00ff00] animate-pulse" />
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold tracking-[1em]">LOCKED</div>
                </div>
            );
        case 2: // Waveform Analysis
            return (
                <div className="w-full h-full flex items-center justify-center bg-[#001100]">
                    <div className="flex items-end space-x-2 h-64">
                        {Array.from({length: 20}).map((_, i) => (
                            <div key={i} className="w-8 bg-[#00ff00]" style={{height: `${Math.random() * 100}%`}}></div>
                        ))}
                    </div>
                     <div className="absolute bottom-10 right-10 text-2xl font-bold">DECRYPTING VOICE DATA</div>
                </div>
            );
        case 3: // Security Clearance
            return (
                <div className="w-full h-full flex items-center justify-center border-4 border-[#00ff00]">
                    <Shield size={150} className="mb-4" />
                    <div className="text-4xl">SECURITY CLEARANCE: TOP SECRET</div>
                    <div className="absolute top-4 right-4 text-xl">NOD//GDI//EVA</div>
                </div>
            );
        case 4: // System Core
             return (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    <Zap size={400} className="text-[#00ff00] opacity-20 absolute" />
                    <div className="relative z-10 text-center">
                        <div className="text-6xl font-bold mb-4">INITIALIZING EVA</div>
                        <div className="text-2xl animate-bounce">PLEASE STAND BY</div>
                    </div>
                </div>
             );
        default:
            return null;
    }
  }

  return (
    <div className="w-full h-full bg-black text-[#00ff00] font-retro relative overflow-hidden">
        {/* CRT Scanline overlay specifically for this intense sequence */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] z-50 pointer-events-none"></div>
        
        {renderFrame()}
        
        {/* Random Overlay Text */}
        <div className="absolute bottom-4 left-4 font-mono text-xs">
            DATA_STREAM: {Math.random().toString(16).substring(2, 10).toUpperCase()}
        </div>
    </div>
  );
};

export default DataMontage;
