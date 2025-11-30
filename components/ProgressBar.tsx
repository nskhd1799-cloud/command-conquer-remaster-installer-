import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, color = "bg-[#00ff00]" }) => {
  const totalBlocks = 40; // Increased density for ultrawide
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  // Generate the visual representation
  const renderBlocks = () => {
    let blocks = [];
    for (let i = 0; i < totalBlocks; i++) {
      if (i < filledBlocks) {
        // Last block is orange (active head)
        const isHead = i === filledBlocks - 1;
        blocks.push(
            <span key={i} className={`inline-block w-2 h-4 md:w-3 md:h-5 ${isHead ? 'bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]' : color} mr-[2px]`}></span>
        );
      } else {
        blocks.push(<span key={i} className="inline-block w-2 h-4 md:w-3 md:h-5 bg-[#001100] border border-[#003300] mr-[2px]"></span>);
      }
    }
    return blocks;
  };

  return (
    <div className="w-full my-4 font-retro">
      {label && (
          <div className="flex justify-between items-end mb-1">
            <div className="text-xs uppercase tracking-widest text-[#00aa00]">{label}</div>
            <div className="text-xs text-[#ffaa00] font-bold">{Math.round(progress)}%</div>
          </div>
      )}
      <div className="flex flex-wrap">
        {renderBlocks()}
      </div>
    </div>
  );
};

export default ProgressBar;