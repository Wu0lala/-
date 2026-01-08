import React, { useState } from 'react';
import { Activity, ActivityCategory, EnergyLevel, AppSettings } from '../types';
import { getTranslation } from '../locales';

interface ActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  onClose: () => void;
  settings: AppSettings;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onAdd, onClose, settings }) => {
  const t = getTranslation(settings.language);
  
  // Default start time to now formatted as HH:mm
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(defaultTime);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [category, setCategory] = useState<ActivityCategory>(ActivityCategory.WORK);
  const [energy, setEnergy] = useState<EnergyLevel>(EnergyLevel.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime) return;

    onAdd({
      title,
      description,
      startTime,
      durationMinutes,
      category,
      energy,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in slide-in-from-bottom-10 duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t.logActivity}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.activityName}</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.activityNamePlaceholder}
              className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.startTime}</label>
              <input 
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.duration}</label>
              <input 
                type="number"
                min="1"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.category}</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 appearance-none"
              >
                {Object.values(ActivityCategory).map(c => (
                  <option key={c} value={c}>{t.categories[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.energyLabel}</label>
              <select 
                value={energy}
                onChange={(e) => setEnergy(e.target.value as EnergyLevel)}
                className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 appearance-none"
              >
                {Object.values(EnergyLevel).map(e => (
                  <option key={e} value={e}>{t.energyLevels[e]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1 uppercase">{t.notes}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 resize-none"
              placeholder={t.notesPlaceholder}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/20 mt-2"
          >
            {t.save}
          </button>
        </form>
      </div>
    </div>
  );
};