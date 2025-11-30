
import React, { useEffect, useRef, useState } from 'react';
import BoxFrame from './BoxFrame';

// --- 3D Engine Utilities ---

interface Point3D { x: number; y: number; z: number; }
interface Edge { s: number; e: number; }
interface Model { 
  id: string; 
  name: string; 
  type: string; 
  description: string;
  stats: { armor: string; weapon: string; speed: string };
  vertices: Point3D[]; 
  edges: Edge[]; 
}

// Helper to create a point
const p = (x: number, y: number, z: number): Point3D => ({ x, y, z });

// --- Model Definitions ---

// 1. MAMMOTH TANK
const MAMMOTH_VERTICES = [
    p(-60, 20, 60), p(-20, 20, 60), p(-20, 20, -60), p(-60, 20, -60), // L Tread Top
    p(-60, -10, 60), p(-20, -10, 60), p(-20, -10, -60), p(-60, -10, -60), // L Tread Bot
    p(20, 20, 60), p(60, 20, 60), p(60, 20, -60), p(20, 20, -60), // R Tread Top
    p(20, -10, 60), p(60, -10, 60), p(60, -10, -60), p(20, -10, -60), // R Tread Bot
    p(-30, 30, 50), p(30, 30, 50), p(30, 30, -50), p(-30, 30, -50), // Hull
    p(-30, 10, 50), p(30, 10, 50), p(30, 10, -50), p(-30, 10, -50),
    p(-20, 50, 10), p(20, 50, 10), p(20, 50, -30), p(-20, 50, -30), // Turret
    p(-25, 30, 20), p(25, 30, 20), p(25, 30, -40), p(-25, 30, -40),
    p(-15, 45, 10), p(-15, 45, 90), // Left Barrel Long
    p(15, 45, 10), p(15, 45, 90),   // Right Barrel Long
    p(-10, 45, 10), p(-10, 45, 90), // Barrel Thickness
    p(10, 45, 10), p(10, 45, 90),
];

const MAMMOTH_EDGES: Edge[] = [
    {s:0,e:1}, {s:1,e:2}, {s:2,e:3}, {s:3,e:0},
    {s:4,e:5}, {s:5,e:6}, {s:6,e:7}, {s:7,e:4},
    {s:0,e:4}, {s:1,e:5}, {s:2,e:6}, {s:3,e:7},
    {s:8,e:9}, {s:9,e:10}, {s:10,e:11}, {s:11,e:8},
    {s:12,e:13}, {s:13,e:14}, {s:14,e:15}, {s:15,e:12},
    {s:8,e:12}, {s:9,e:13}, {s:10,e:14}, {s:11,e:15},
    {s:16,e:17}, {s:17,e:18}, {s:18,e:19}, {s:19,e:16},
    {s:20,e:21}, {s:21,e:22}, {s:22,e:23}, {s:23,e:20},
    {s:16,e:20}, {s:17,e:21}, {s:18,e:22}, {s:19,e:23},
    {s:24,e:25}, {s:25,e:26}, {s:26,e:27}, {s:27,e:24},
    {s:28,e:29}, {s:29,e:30}, {s:30,e:31}, {s:31,e:28},
    {s:24,e:28}, {s:25,e:29}, {s:26,e:30}, {s:27,e:31},
    {s:32,e:33}, {s:34,e:35}, {s:36,e:37}, {s:38,e:39},
    {s:33,e:37}, {s:35,e:39} // Barrel tips
];

const MAMMOTH: Model = { 
  id: 'MAMMOTH_MK_I', 
  name: 'X-66 MAMMOTH', 
  type: 'HEAVY ASSAULT', 
  description: "GDI's heaviest main battle tank. Features dual 120mm cannons and Mammoth Tusk missile pods. Capable of self-repair during combat.",
  stats: { armor: 'HEAVY', weapon: 'DUAL 120MM', speed: 'SLOW' },
  vertices: MAMMOTH_VERTICES, 
  edges: MAMMOTH_EDGES 
};

// 2. ORCA
const ORCA_VERTICES = [
    p(-20, 20, 40), p(20, 20, 40), p(30, 10, 0), p(20, 20, -50), p(-20, 20, -50), p(-30, 10, 0),
    p(-15, 0, 35), p(15, 0, 35), p(25, -10, 0), p(15, 0, -45), p(-15, 0, -45), p(-25, -10, 0),
    p(0, 25, -50), p(0, 25, -90), p(0, 0, -50),
    p(-50, 25, 10), p(50, 25, 10),
    p(-50, 30, 20), p(-50, 30, 0), p(-60, 30, 10), p(-40, 30, 10),
    p(50, 30, 20), p(50, 30, 0), p(60, 30, 10), p(40, 30, 10),
    p(-20, 10, 45), p(20, 10, 45) // Cockpit glass hint
];

const ORCA_EDGES: Edge[] = [
    {s:0,e:1}, {s:1,e:2}, {s:2,e:3}, {s:3,e:4}, {s:4,e:5}, {s:5,e:0},
    {s:6,e:7}, {s:7,e:8}, {s:8,e:9}, {s:9,e:10}, {s:10,e:11}, {s:11,e:6},
    {s:0,e:6}, {s:1,e:7}, {s:2,e:8}, {s:3,e:9}, {s:4,e:10}, {s:5,e:11},
    {s:3,e:12}, {s:4,e:12}, {s:12,e:13}, {s:9,e:14}, {s:10,e:14}, {s:13,e:14},
    {s:5,e:15}, {s:2,e:16},
    {s:17,e:18}, {s:19,e:20}, {s:17,e:19}, {s:18,e:20},
    {s:21,e:22}, {s:23,e:24}, {s:21,e:23}, {s:22,e:24},
    {s:0,e:25}, {s:1,e:26}, {s:25,e:26}
];

const ORCA: Model = { 
  id: 'ORCA_FIGHTER', 
  name: 'ORCA AIRCRAFT', 
  type: 'VTOL ATTACK', 
  description: "Advanced VTOL aircraft armed with Dragon TOW missiles. Provides rapid response and surgical strike capabilities for GDI forces.",
  stats: { armor: 'LIGHT', weapon: 'DRAGON TOW', speed: 'FAST' },
  vertices: ORCA_VERTICES, 
  edges: ORCA_EDGES 
};

// 3. OBELISK
const OBELISK_VERTICES = [
    p(-40, -40, 40), p(40, -40, 40), p(40, -40, -40), p(-40, -40, -40),
    p(-30, -20, 30), p(30, -20, 30), p(30, -20, -30), p(-30, -20, -30),
    p(0, 120, 0), p(0, 130, 0),
    p(-10, 100, 0), p(10, 100, 0) // Detail ring
];

const OBELISK_EDGES: Edge[] = [
    {s:0,e:1}, {s:1,e:2}, {s:2,e:3}, {s:3,e:0},
    {s:4,e:5}, {s:5,e:6}, {s:6,e:7}, {s:7,e:4},
    {s:0,e:4}, {s:1,e:5}, {s:2,e:6}, {s:3,e:7},
    {s:4,e:8}, {s:5,e:8}, {s:6,e:8}, {s:7,e:8},
    {s:8,e:9}, {s:10,e:11}
];

const OBELISK: Model = { 
  id: 'OBELISK_LIGHT', 
  name: 'OBELISK OF LIGHT', 
  type: 'ADV. DEFENSE', 
  description: "The Brotherhood's ultimate defense structure. Focuses a high-energy laser beam through a crystal capacitor to incinerate targets instantly.",
  stats: { armor: 'MEDIUM', weapon: 'LASER CAPACITOR', speed: 'STATIC' },
  vertices: OBELISK_VERTICES, 
  edges: OBELISK_EDGES 
};

// 4. GUARD TOWER
const GUARD_VERTICES = [
  p(-20, 0, 20), p(20, 0, 20), p(20, 0, -20), p(-20, 0, -20), // Base
  p(-10, 60, 10), p(10, 60, 10), p(10, 60, -10), p(-10, 60, -10), // Top Platform
  p(-15, 60, 15), p(15, 60, 15), p(15, 60, -15), p(-15, 60, -15), // Railing
  p(-15, 75, 15), p(15, 75, 15), p(15, 75, -15), p(-15, 75, -15), // Roof
];
const GUARD_EDGES: Edge[] = [
  {s:0,e:1}, {s:1,e:2}, {s:2,e:3}, {s:3,e:0},
  {s:4,e:5}, {s:5,e:6}, {s:6,e:7}, {s:7,e:4},
  {s:0,e:4}, {s:1,e:5}, {s:2,e:6}, {s:3,e:7},
  {s:8,e:9}, {s:9,e:10}, {s:10,e:11}, {s:11,e:8},
  {s:12,e:13}, {s:13,e:14}, {s:14,e:15}, {s:15,e:12},
  {s:8,e:12}, {s:9,e:13}, {s:10,e:14}, {s:11,e:15},
];
const GUARD_TOWER: Model = {
  id: 'GUARD_TOWER',
  name: 'GUARD TOWER',
  type: 'BASE DEFENSE',
  description: "Standard perimeter defense fortification. Equipped with a high-velocity vulcan machine gun effective against infantry and light vehicles.",
  stats: { armor: 'MEDIUM', weapon: 'VULCAN MG', speed: 'STATIC' },
  vertices: GUARD_VERTICES,
  edges: GUARD_EDGES
};

// 5. HAND OF NOD
const HAND_VERTICES = [
  p(-40, 0, 40), p(40, 0, 40), p(40, 0, -40), p(-40, 0, -40), // Base
  p(-30, 20, 30), p(30, 20, 30), p(30, 20, -30), p(-30, 20, -30), // Mid
  p(-10, 20, 10), p(10, 20, 10), p(10, 100, 10), p(-10, 100, 10), // Finger 1
  p(20, 20, 0), p(30, 20, 0), p(30, 90, 0), p(20, 90, 0), // Finger 2
  p(-30, 20, 0), p(-20, 20, 0), p(-20, 90, 0), p(-30, 90, 0), // Finger 3
];
const HAND_EDGES: Edge[] = [
  {s:0,e:1}, {s:1,e:2}, {s:2,e:3}, {s:3,e:0},
  {s:4,e:5}, {s:5,e:6}, {s:6,e:7}, {s:7,e:4},
  {s:0,e:4}, {s:1,e:5}, {s:2,e:6}, {s:3,e:7},
  {s:8,e:9}, {s:9,e:10}, {s:10,e:11}, {s:11,e:8},
  {s:12,e:13}, {s:13,e:14}, {s:14,e:15}, {s:15,e:12},
  {s:16,e:17}, {s:17,e:18}, {s:18,e:19}, {s:19,e:16},
];
const HAND_OF_NOD: Model = {
  id: 'HAND_OF_NOD',
  name: 'HAND OF NOD',
  type: 'INFANTRY PROD',
  description: "The primary infantry recruitment center for the Brotherhood. Its distinct shape symbolizes the hand of Kane guiding his followers.",
  stats: { armor: 'HEAVY', weapon: 'NONE', speed: 'STATIC' },
  vertices: HAND_VERTICES, 
  edges: HAND_EDGES 
};


const MODELS = [MAMMOTH, ORCA, OBELISK, GUARD_TOWER, HAND_OF_NOD];


interface SchematicViewProps {
  progress: number;
}

const SchematicView: React.FC<SchematicViewProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  // Switch models based on progress
  useEffect(() => {
    // Cycle through models more frequently
    const cycleSpeed = 20; // Change every 20%
    const newIndex = Math.floor((progress % 100) / cycleSpeed) % MODELS.length;
    if (newIndex !== modelIndex) {
      setModelIndex(newIndex);
    }
  }, [progress, modelIndex]);

  // 3D Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentModel = MODELS[modelIndex];

    const render = () => {
       // Clear
       ctx.fillStyle = 'rgba(0, 10, 0, 0.8)';
       ctx.fillRect(0, 0, canvas.width, canvas.height);

       // Grid Background
       ctx.strokeStyle = '#003300';
       ctx.lineWidth = 1;
       ctx.beginPath();
       for(let i=0; i<canvas.width; i+=20) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
       for(let i=0; i<canvas.height; i+=20) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
       ctx.stroke();

       const width = canvas.width;
       const height = canvas.height;
       const cx = width / 2;
       const cy = height / 2 + 20; // Slightly lower center
       const scale = 1.2; // Zoom

       rotationRef.current += 0.015; // Rotation speed
       
       const angle = rotationRef.current;
       const cos = Math.cos(angle);
       const sin = Math.sin(angle);

       // Project vertices
       const projectedPoints = currentModel.vertices.map(v => {
           // Rotate Y
           const rx = v.x * cos - v.z * sin;
           const rz = v.x * sin + v.z * cos;
           // Rotate X (Tilt slightly)
           const tilt = 0.3; 
           const ry = v.y * Math.cos(tilt) - rz * Math.sin(tilt);
           
           // Simple perspective projection
           const fov = 350;
           const dist = fov / (fov + rz + 200); // 200 is z-offset
           
           return {
               x: cx + rx * dist * scale,
               y: cy - ry * dist * scale // Flip Y for screen coords
           };
       });

       // Draw Edges
       ctx.strokeStyle = '#00ff00';
       ctx.lineWidth = 1.5;
       ctx.beginPath();
       currentModel.edges.forEach(edge => {
           const p1 = projectedPoints[edge.s];
           const p2 = projectedPoints[edge.e];
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p2.x, p2.y);
       });
       ctx.stroke();

       // Draw Vertices (Dots)
       ctx.fillStyle = '#ccffcc';
       projectedPoints.forEach(p => {
           ctx.beginPath();
           ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
           ctx.fill();
       });

       animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [modelIndex]);


  const current = MODELS[modelIndex];

  return (
    <BoxFrame className="h-full flex flex-col items-center justify-center bg-[#001100] bg-opacity-80 p-0 overflow-hidden">
      <div className="w-full text-xs flex justify-between border-b border-[#004400] bg-[#002200] p-2 mb-0">
        <span className="text-[#00ff00]">CAD_VIEWER_V2.1</span>
        <span className="animate-pulse text-[#ffaa00]">ROTATION_ACTIVE</span>
      </div>
      
      <div className="flex-grow w-full relative min-h-0">
         <canvas 
            ref={canvasRef} 
            width={300} 
            height={200} 
            className="w-full h-full object-contain"
         />
         
         {/* Overlay Stats */}
         <div className="absolute top-2 left-2 text-[10px] text-[#00aa00] font-mono leading-tight">
             VERTICES: {current.vertices.length}<br/>
             POLYGONS: {current.edges.length}<br/>
             Z-BUFFER: <span className="text-[#00ff00]">ON</span>
         </div>
      </div>

      <div className="w-full p-3 border-t border-[#004400] bg-[#001500] relative flex flex-col gap-1">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent opacity-30"></div>
        <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-[#00ff00]">{current.name}</h3>
            <div className="text-xs text-[#00aa00] tracking-widest">{current.type}</div>
        </div>
        
        {/* Unit Stats Grid */}
        <div className="grid grid-cols-3 gap-1 mt-2 text-[9px] font-mono">
            <div className="bg-[#002200] p-1 border border-[#003300]">
                <div className="text-[#008800]">ARMOR</div>
                <div className="text-[#ffaa00]">{current.stats.armor}</div>
            </div>
            <div className="bg-[#002200] p-1 border border-[#003300]">
                <div className="text-[#008800]">WEAPON</div>
                <div className="text-[#ffaa00]">{current.stats.weapon}</div>
            </div>
            <div className="bg-[#002200] p-1 border border-[#003300]">
                <div className="text-[#008800]">SPEED</div>
                <div className="text-[#ffaa00]">{current.stats.speed}</div>
            </div>
        </div>
        
        {/* Info Panel / Description */}
        <div className="mt-2 border-t border-[#003300] pt-2">
            <div className="text-[8px] text-[#006600] uppercase mb-1">TACTICAL_ANALYSIS:</div>
            <div className="text-[10px] text-[#00cc00] leading-tight opacity-90">
                {current.description}
            </div>
        </div>

      </div>
    </BoxFrame>
  );
};

export default SchematicView;
