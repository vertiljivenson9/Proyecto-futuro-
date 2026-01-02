import React, { useState, useEffect, useRef } from 'react';
import { WindowState } from '../types';
import AppLauncher from './AppLauncher';

interface WindowProps {
  win: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  updatePosition: (id: string, x: number, y: number) => void;
  refreshRegistry: () => void;
  isAdmin: boolean;
  onOpenWindow: (id: string, title: string, icon: string, initialPath?: string) => void;
  onPower: (action: 'shutdown' | 'suspend' | 'reboot') => void;
}

const Window: React.FC<WindowProps> = ({ win, onClose, onMinimize, onMaximize, onFocus, updatePosition, refreshRegistry, isAdmin, onOpenWindow, onPower }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(globalThis.window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(globalThis.window.innerWidth < 768);
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    onFocus();
    setIsDragging(true);
    setDragStart({ x: e.clientX - win.x, y: e.clientY - win.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const safeX = Math.max(0, Math.min(newX, globalThis.window.innerWidth - 100));
      const safeY = Math.max(0, Math.min(newY, globalThis.window.innerHeight - 150));
      
      updatePosition(win.id, safeX, safeY);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, win.id, updatePosition]);

  const visibilityClass = win.isMinimized ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100';
  
  const style: React.CSSProperties = (win.isMaximized || isMobile)
    ? { 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: 'calc(100vh - 3.5rem)', 
        zIndex: win.zIndex,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    : { 
        top: win.y, 
        left: win.x, 
        width: win.width, 
        height: win.height, 
        zIndex: win.zIndex,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      };

  return (
    <div
      className={`absolute flex flex-col glass rounded-t-xl md:rounded-xl overflow-hidden shadow-2xl border border-white/10 ${visibilityClass}`}
      style={style}
      onClick={onFocus}
    >
      <div 
        className="h-12 md:h-10 glass flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b border-white/5 select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <img src={win.icon} className="w-4 h-4 invert opacity-80" alt="" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 truncate max-w-[120px] md:max-w-none">
            {win.title}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-8 h-8 md:w-3 md:h-3 flex items-center justify-center rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors"
          >
            <span className="md:hidden text-black font-bold">-</span>
          </button>
          {!isMobile && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors"
            />
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 md:w-3 md:h-3 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"
          >
            <span className="md:hidden text-black font-bold">×</span>
          </button>
        </div>
      </div>

      <div className="flex-grow bg-black/80 overflow-auto relative custom-scroll">
        <AppLauncher 
          appId={win.appId} 
          isAdmin={isAdmin} 
          refreshRegistry={refreshRegistry} 
          initialPath={win.initialPath}
          onOpenWindow={onOpenWindow}
          onPower={onPower}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default Window;