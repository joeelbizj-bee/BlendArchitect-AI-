import React from 'react';
import { Box, Cuboid, Monitor, Grid } from 'lucide-react';

const SceneVisualizer: React.FC = () => {
  return (
    <div className="w-full h-64 md:h-full bg-blender-dark border border-gray-700 rounded-lg relative overflow-hidden group">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2) translateY(-20%)',
          transformOrigin: 'top center'
        }}
      />
      
      {/* Axis Lines */}
      <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-red-500/30 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-green-500/30 -translate-y-1/2" />

      {/* Central Message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-blender-panel/90 backdrop-blur-sm p-6 rounded-xl border border-gray-600 shadow-xl text-center max-w-sm">
          <div className="flex justify-center mb-4">
             <div className="relative">
                <Box size={48} className="text-blender-orange" />
                <Cuboid size={24} className="text-white absolute -bottom-2 -right-2" />
             </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Code-to-Scene Engine</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            I cannot generate a binary .blend file directly in the browser.
            <br/><br/>
            Instead, I generate a professional <span className="text-blender-orange font-mono">Python Script</span> that you can paste into Blender to instantly build your scene.
          </p>
        </div>
      </div>
      
      {/* HUD Elements */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
         <div className="flex items-center space-x-2 text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">
            <Monitor size={12} />
            <span>Perspective</span>
         </div>
         <div className="flex items-center space-x-2 text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">
            <Grid size={12} />
            <span>Orthographic</span>
         </div>
      </div>
    </div>
  );
};

export default SceneVisualizer;