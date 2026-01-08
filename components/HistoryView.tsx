import React, { useState, useMemo } from 'react';
import { Activity, AppSettings } from '../types';
import { getTranslation } from '../locales';
import { StatsChart } from './StatsChart';
import { ActivityItem } from './ActivityItem';

interface HistoryViewProps {
  activities: Activity[];
  settings: AppSettings;
  onClose: () => void;
}

type ViewMode = 'day' | 'week' | 'month';

export const HistoryView: React.FC<HistoryViewProps> = ({ activities, settings, onClose }) => {
  const t = getTranslation(settings.language);
  const [mode, setMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation Logic
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (mode === 'day') newDate.setDate(newDate.getDate() - 1);
    if (mode === 'week') newDate.setDate(newDate.getDate() - 7);
    if (mode === 'month') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (mode === 'day') newDate.setDate(newDate.getDate() + 1);
    if (mode === 'week') newDate.setDate(newDate.getDate() + 7);
    if (mode === 'month') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Formatting Date Range Label
  const getRangeLabel = () => {
    const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US';
    
    if (mode === 'day') {
      return currentDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    }
    
    if (mode === 'week') {
      const start = new Date(currentDate);
      const day = start.getDay() || 7; // Get current day number, make Sunday (0) -> 7
      if (day !== 1) start.setHours(-24 * (day - 1)); // Set to Monday
      
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const opts: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };
      return `${start.toLocaleDateString(locale, opts)} - ${end.toLocaleDateString(locale, opts)}`;
    }

    if (mode === 'month') {
      return currentDate.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
    }
    
    return '';
  };

  // Filter Data
  const filteredActivities = useMemo(() => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);

    if (mode === 'day') {
      end.setHours(23, 59, 59, 999);
    } else if (mode === 'week') {
       const day = start.getDay() || 7;
       if (day !== 1) start.setDate(start.getDate() - (day - 1)); // Back to Monday
       end.setTime(start.getTime());
       end.setDate(end.getDate() + 6);
       end.setHours(23, 59, 59, 999);
    } else if (mode === 'month') {
      start.setDate(1); // 1st of month
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of month
      end.setHours(23, 59, 59, 999);
    }

    return activities.filter(a => {
      // Need to handle timestamp properly
      return a.timestamp >= start.getTime() && a.timestamp <= end.getTime();
    }).sort((a, b) => b.timestamp - a.timestamp); // Newest first for history view
  }, [activities, currentDate, mode]);

  // Calculations
  const totalMinutes = filteredActivities.reduce((acc, cur) => acc + cur.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  return (
    <div className="fixed inset-0 z-40 bg-dark-bg overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
       <div className="max-w-3xl mx-auto p-4 pb-24">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-dark-bg/95 backdrop-blur-md py-4 border-b border-white/5 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📅 {t.history}
            </h2>
            <button 
              onClick={onClose}
              className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-dark-card p-2 rounded-xl border border-white/5">
             {/* Tabs */}
             <div className="flex bg-dark-bg rounded-lg p-1 w-full sm:w-auto">
                {(['day', 'week', 'month'] as ViewMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setCurrentDate(new Date()); }} // Reset date when switching modes
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      mode === m ? 'bg-brand-600 text-white shadow-lg' : 'text-dark-muted hover:text-white'
                    }`}
                  >
                    {m === 'day' ? t.viewDay : m === 'week' ? t.viewWeek : t.viewMonth}
                  </button>
                ))}
             </div>

             {/* Date Nav */}
             <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <button onClick={handlePrev} className="p-1 hover:text-brand-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span className="font-mono font-bold text-sm min-w-[140px] text-center">{getRangeLabel()}</span>
                <button onClick={handleNext} className="p-1 hover:text-brand-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-dark-card p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <span className="text-dark-muted text-xs uppercase tracking-wider mb-1">{t.entries}</span>
                <span className="text-2xl font-bold text-white">{filteredActivities.length}</span>
             </div>
             <div className="bg-dark-card p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                <span className="text-dark-muted text-xs uppercase tracking-wider mb-1">{t.totalDuration}</span>
                <span className="text-2xl font-bold text-brand-400">
                  {totalHours}<span className="text-sm text-dark-muted mx-1">{t.hours}</span>
                  {remainingMins}<span className="text-sm text-dark-muted mx-1">{t.mins}</span>
                </span>
             </div>
          </div>

          {/* Chart */}
          {filteredActivities.length > 0 && (
             <div className="bg-dark-card p-2 rounded-xl border border-white/5">
                <StatsChart activities={filteredActivities} settings={settings} />
             </div>
          )}

          {/* List */}
          <div>
            <h3 className="text-sm font-semibold text-dark-muted mb-3 uppercase tracking-wider">{t.timelineTitle}</h3>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-dark-card rounded-xl text-dark-muted">
                {t.noData}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredActivities.map(act => (
                  <ActivityItem 
                    key={act.id} 
                    activity={act} 
                    settings={settings}
                    // Only show date if we are in Week or Month view to distinguish days
                    showDate={mode !== 'day'} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
       </div>
    </div>
  );
};