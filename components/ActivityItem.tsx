import React from 'react';
import { Activity, ActivityCategory, EnergyLevel, AppSettings } from '../types';
import { getTranslation } from '../locales';

interface ActivityItemProps {
  activity: Activity;
  onDelete?: (id: string) => void;
  settings: AppSettings;
  showDate?: boolean; // New prop to control date display
}

const CategoryColors: Record<ActivityCategory, string> = {
  [ActivityCategory.WORK]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [ActivityCategory.LEARNING]: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  [ActivityCategory.HEALTH]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  [ActivityCategory.LEISURE]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [ActivityCategory.CHORE]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  [ActivityCategory.SOCIAL]: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  [ActivityCategory.OTHER]: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const EnergyIcon: Record<EnergyLevel, string> = {
  [EnergyLevel.HIGH]: '⚡',
  [EnergyLevel.MEDIUM]: '🔋',
  [EnergyLevel.LOW]: '🪫',
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onDelete, settings, showDate = false }) => {
  const t = getTranslation(settings.language);

  // Format date if needed (YYYY/MM/DD)
  const dateStr = new Date(activity.timestamp).toLocaleDateString(
    settings.language === 'zh' ? 'zh-CN' : 'en-US',
    { month: 'numeric', day: 'numeric', year: showDate ? 'numeric' : undefined }
  );

  return (
    <div className="relative group flex gap-4 p-4 mb-3 bg-dark-card rounded-xl border border-white/5 hover:border-white/10 transition-all">
      {/* Time Column */}
      <div className="flex flex-col items-center min-w-[3.5rem] border-r border-white/5 pr-4 justify-center">
        {showDate && (
           <span className="text-[10px] text-brand-400 font-mono mb-1 bg-brand-900/20 px-1 rounded">{dateStr}</span>
        )}
        <span className="text-sm font-bold text-white">{activity.startTime}</span>
        <span className="text-xs text-dark-muted mt-1">{activity.durationMinutes}m</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="text-base font-medium text-white truncate pr-2">{activity.title}</h4>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${CategoryColors[activity.category]}`}>
            {t.categories[activity.category]}
          </span>
        </div>
        
        {activity.description && (
          <p className="text-sm text-dark-muted mt-1 line-clamp-2">{activity.description}</p>
        )}
        
        <div className="flex items-center gap-3 mt-3 text-xs text-dark-muted">
          <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md" title="Energy Level">
            {EnergyIcon[activity.energy]} {t.energyLevels[activity.energy]}
          </span>
        </div>
      </div>

      {/* Delete Button (Visible on hover/focus), only if handler provided */}
      {onDelete && (
        <button 
          onClick={() => onDelete(activity.id)}
          className="absolute top-2 right-2 p-1.5 text-dark-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete activity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};