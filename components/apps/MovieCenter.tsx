import React, { useState, useEffect, useRef } from 'react';

/**
 * MovieCenter: Native Shell Edition
 * Cumple estrictamente con las reglas de navegación directa y sensación de OS Nativo.
 */
export default function MovieCenter() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const TARGET_URL = "https://vertiflix-v-1.pages.dev";

  useEffect(() => {
    // Regla 1 y 7: Cargamos el contenido usando navegación directa al nombre del frame.
    // Este método es interpretado por el navegador como una navegación estándar
    // evitando detecciones de "proxying" o "botting".
    if (iframeRef.current) {
      window.open(TARGET_URL, "vertiflix_native_frame");
    }

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      
      // Regla 4: Ocultar barra de tareas del OS al entrar en modo cine real.
      const taskbar = document.querySelector('.h-20.glass');
      if (taskbar) {
        (taskbar as HTMLElement).style.display = isFull ? 'none' : 'flex';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Limpieza de recursos al cerrar la app (Regla 6 y 7)
      if (iframeRef.current) {
        iframeRef.current.src = "about:blank";
      }
      const taskbar = document.querySelector('.h-20.glass');
      if (taskbar) (taskbar as HTMLElement).style.display = 'flex';
    };
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error al intentar modo cine: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* Shell UI: Control nativo de pantalla completa */}
      {!isFullscreen && (
        <div className="absolute top-2 right-4 z-50 flex gap-2">
          <button 
            onClick={toggleNativeFullscreen}
            className="px-3 py-1 bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/30 rounded text-[8px] font-black text-white uppercase tracking-widest transition-all shadow-lg"
          >
            Modo Cine (Fullscreen)
          </button>
        </div>
      )}

      {/* Frame de Contenido: Sin capas intermedias ni proxies (Regla 2) */}
      <iframe
        ref={iframeRef}
        name="vertiflix_native_frame"
        title="Vertiflix Cinema Engine"
        className="flex-grow w-full border-none bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        // Regla 5: Persistence - Al minimizar el componente en el estado de React, el iframe sobrevive.
      />

      {/* ESC Hint (Regla 4) */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10 pointer-events-none animate-fade-out opacity-0 transition-opacity z-[100]">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Presiona ESC para volver al escritorio de VertilOS</span>
        </div>
      )}
      
      <style>{`
        @keyframes fade-out {
          0% { opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 5s forwards;
        }
      `}</style>
    </div>
  );
}
