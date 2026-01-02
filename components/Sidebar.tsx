
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isHidden?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isHidden }) => {
  if (isHidden) return null;

  return (
    <aside className="w-20 lg:w-64 h-full flex flex-col bg-black border-r border-border-dark shrink-0 z-50">
      <div className="p-4 lg:p-6 pb-2">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-none bg-primary flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_white]">
            <span className="material-symbols-outlined text-black text-3xl font-bold -rotate-3">bolt</span>
          </div>
          <div className="hidden lg:flex flex-col">
            <h1 className="text-primary text-xl font-black italic uppercase tracking-tighter">SPLAT RSS</h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">AI Personalizer</p>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => onViewChange(ViewType.FEEDS)}
            className={`flex items-center gap-3 px-4 py-3 border-2 transition-all font-black uppercase text-xs ${
              currentView === ViewType.FEEDS 
                ? 'bg-primary border-primary text-black translate-x-1' 
                : 'bg-transparent border-white/10 text-white hover:border-primary/50'
            }`}
          >
            <span className="material-symbols-outlined">flash_on</span>
            <span className="hidden lg:inline">Hoy</span>
          </button>
          <button
            onClick={() => onViewChange(ViewType.SAVED)}
            className={`flex items-center gap-3 px-4 py-3 border-2 transition-all font-black uppercase text-xs ${
              currentView === ViewType.SAVED 
                ? 'bg-primary border-primary text-black translate-x-1' 
                : 'bg-transparent border-white/10 text-white hover:border-primary/50'
            }`}
          >
            <span className="material-symbols-outlined">folder_special</span>
            <span className="hidden lg:inline">Guardados</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
