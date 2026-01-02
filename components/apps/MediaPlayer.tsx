
import React, { useState, useEffect, useRef } from 'react';
import { getInode } from '../../services/fs';

interface MediaPlayerProps {
  initialPath?: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ initialPath }) => {
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (initialPath) {
      loadFile(initialPath);
    }
  }, [initialPath]);

  const loadFile = async (path: string) => {
    setLoading(true);
    const inode = await getInode(path);
    if (inode && inode.content) {
      setCurrentFile(inode);
    }
    setLoading(false);
  };

  const isVideo = currentFile?.name.toLowerCase().match(/\.(mp4|webm|ogg)$/);

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono overflow-hidden">
      {loading ? (
        <div className="flex-grow flex items-center justify-center animate-pulse text-[10px] uppercase font-black tracking-widest text-indigo-500">
          Iniciando Decodificador Core...
        </div>
      ) : currentFile ? (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-grow flex items-center justify-center bg-black/80 relative overflow-hidden group">
            {isVideo ? (
              <video 
                ref={mediaRef}
                src={currentFile.content} 
                controls 
                autoPlay
                className="max-w-full max-h-full shadow-[0_0_100px_rgba(0,0,0,0.5)] z-10"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className="flex flex-col items-center gap-8 z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
                  <div className="w-40 h-40 bg-indigo-600/10 border-2 border-indigo-500/30 rounded-full flex items-center justify-center text-7xl shadow-2xl relative animate-float">
                    🎵
                  </div>
                </div>
                <div className="w-full max-w-sm">
                  <audio 
                    ref={mediaRef as any}
                    src={currentFile.content} 
                    controls 
                    autoPlay
                    className="w-full opacity-80"
                  />
                </div>
              </div>
            )}
            {/* Overlay de identidad de VertilOS */}
            <div className="absolute top-4 left-4 text-[8px] font-black text-white/10 uppercase tracking-[0.5em] pointer-events-none select-none">
              VertilOS Native Media Engine
            </div>
          </div>
          
          <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="flex flex-col gap-1 overflow-hidden pr-6">
              <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest truncate">
                {currentFile.name}
              </span>
              <div className="flex items-center gap-3">
                 <span className="text-[7px] bg-indigo-600 px-1.5 py-0.5 rounded text-white font-black uppercase">CoreStream</span>
                 <span className="text-[8px] uppercase text-white/30 font-bold">
                    {isVideo ? 'H.264/AVC' : 'MPEG-L3'} | {Math.round(currentFile.size / 1024)} KB
                 </span>
              </div>
            </div>
            
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-white/10 flex items-center justify-center text-xs transition-all active:scale-90">🔁</button>
               <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-white/10 flex items-center justify-center text-xs transition-all active:scale-90">🔀</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12 opacity-30">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full"></div>
            <div className="text-8xl relative drop-shadow-2xl">📽️</div>
          </div>
          <h2 className="text-lg font-black uppercase tracking-[0.4em] text-indigo-400">Media Engine v1.0</h2>
          <p className="text-[9px] uppercase mt-4 max-w-xs leading-loose font-bold tracking-widest">
            Reproducción nativa de archivos .mp3, .mp4, .webm y .ogg.
            Importa tus medios al Explorador para comenzar.
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
