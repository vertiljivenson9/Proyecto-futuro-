
import React from 'react';

const About: React.FC = () => {
  const downloadReadme = () => {
    const blob = new Blob(["VertilOS - Second Chance for the World\n© 2025 Vertil Jivenson\nLicense: MIT"], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VertilOS-README.md';
    a.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-3xl flex items-center justify-center text-5xl shadow-2xl">
        V
      </div>
      
      <div>
        <h1 className="text-2xl font-black tracking-widest text-white uppercase italic">VertilOS</h1>
        <p className="text-white/40 text-xs mt-1 uppercase tracking-tighter">Production Build v2.5.0-Release</p>
      </div>

      <div className="max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl">
        <p className="text-sm leading-relaxed text-white/80 italic">
          "© Vertil Jivenson 2025 – Segunda oportunidad para el mundo. 
          A secure-by-default environment for a new era of distributed computation."
        </p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadReadme}
          className="px-6 py-2 glass hover:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Download README
        </button>
        <button 
          onClick={() => alert('License: MIT')}
          className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/40"
        >
          MIT License
        </button>
      </div>

      <div className="text-[8px] text-white/20 uppercase tracking-[0.5em] mt-8">
        Designed with zero-failure persistence logic.
      </div>
    </div>
  );
};

export default About;
