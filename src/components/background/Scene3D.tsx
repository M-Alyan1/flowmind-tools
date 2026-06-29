import React from 'react';

export const Scene3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Background glow layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/30 dark:bg-accent-blue/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/30 dark:bg-accent-purple/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-green-500/20 dark:bg-green-500/10 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
};

