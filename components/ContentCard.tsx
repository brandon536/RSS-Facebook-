
import React from 'react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onEdit?: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onEdit }) => {
  const getPlatformIcon = () => {
    switch (item.platform) {
      case 'youtube': return { icon: 'smart_display', color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'tiktok': return { icon: 'music_note', color: 'text-slate-900 dark:text-white', bg: 'bg-slate-500/10' };
      case 'facebook': return { icon: 'public', color: 'text-blue-600', bg: 'bg-blue-600/10' };
      case 'rss': return { icon: 'rss_feed', color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'news': return { icon: 'newspaper', color: 'text-blue-400', bg: 'bg-blue-400/10' };
      default: return { icon: 'article', color: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  const { icon, color, bg } = getPlatformIcon();

  return (
    <article className="flex flex-col bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden group hover:border-primary/50 transition-all shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-border-dark/50">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center ${color}`}>
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{item.author}</p>
            <p className="text-[10px] text-slate-500 uppercase">{item.platform} • {item.timestamp}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Media */}
      {item.imageUrl && (
        <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => onEdit?.(item)}>
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {item.duration}
            </div>
          )}
          {item.platform === 'tiktok' && (
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">play_circle</span>
             </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-primary cursor-pointer transition-colors" onClick={() => onEdit?.(item)}>
          {item.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
          {item.summary}
        </p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {(item.likes || item.comments) && (
          <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-slate-500">
            {item.likes && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">favorite</span> {item.likes}</span>}
            {item.comments && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">chat</span> {item.comments}</span>}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 px-4 pt-0 mt-auto flex gap-2">
        {item.status === 'pending' ? (
          <button className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">Aprobar</button>
        ) : (
          <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium py-2 rounded-lg transition-colors">Publicar</button>
        )}
        <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg transition-colors" onClick={() => onEdit?.(item)}>
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      </div>
    </article>
  );
};

export default ContentCard;
