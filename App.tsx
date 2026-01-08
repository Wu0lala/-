import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Activity, AnalysisResponse, AppSettings } from './types';
import { saveActivities, loadActivities, clearActivities, loadSettings, saveSettings } from './services/storageService';
import { analyzeDailyLog } from './services/geminiService';
import { ActivityItem } from './components/ActivityItem';
import { ActivityForm } from './components/ActivityForm';
import { AnalysisView } from './components/AnalysisView';
import { StatsChart } from './components/StatsChart';
import { SettingsModal } from './components/SettingsModal';
import { getTranslation } from './locales';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ language: 'zh' });
  
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const loadedActs = loadActivities();
    const loadedSettings = loadSettings();
    
    setActivities(loadedActs.sort((a, b) => a.timestamp - b.timestamp));
    setSettings(loadedSettings);
  }, []);

  // Save whenever activities change
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleAddActivity = (newActivity: Omit<Activity, 'id' | 'timestamp'>) => {
    const activity: Activity = {
      ...newActivity,
      id: uuidv4(),
      timestamp: new Date().getTime()
    };
    
    setActivities(prev => {
      const updated = [...prev, activity];
      return updated.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t.clearConfirm)) {
      clearActivities();
      setActivities([]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (activities.length === 0) {
      setError(t.errorNoActivities);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeDailyLog(activities, settings);
      setAnalysis(result);
    } catch (err: any) {
      setError(t.errorGeneric);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper for translations based on current state
  const t = getTranslation(settings.language);

  return (
    <div className="min-h-screen pb-24 font-sans text-dark-text bg-dark-bg selection:bg-brand-500/30">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-bold text-lg tracking-tight">{t.appTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="text-dark-muted hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={handleClearAll}
            className="text-xs font-medium text-dark-muted hover:text-red-400 transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats Section */}
        {activities.length > 0 && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4">
            <StatsChart activities={activities} settings={settings} />
          </div>
        )}

        {/* Timeline Header */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-white">{t.timelineTitle}</h2>
          <span className="text-sm text-dark-muted">{activities.length} {t.entries}</span>
        </div>

        {/* Timeline List */}
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-dark-card bg-dark-card/30">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-medium text-white mb-1">{t.noActivities}</h3>
              <p className="text-dark-muted text-sm">{t.noActivitiesSub}</p>
            </div>
          ) : (
            activities.map(activity => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                onDelete={handleDeleteActivity}
                settings={settings}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button (Add) */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed right-6 bottom-24 z-30 w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-xl shadow-brand-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        aria-label="Add Activity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Bottom Sticky Action Bar (Analyze) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-bg/90 backdrop-blur-lg border-t border-white/5 z-30">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || activities.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isAnalyzing 
                ? 'bg-dark-card text-dark-muted cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-900/50'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.analyzing}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                {t.generate}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ActivityForm 
          onAdd={handleAddActivity} 
          onClose={() => setShowForm(false)} 
          settings={settings}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentSettings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {analysis && (
        <AnalysisView 
          analysis={analysis} 
          onClose={() => setAnalysis(null)} 
          settings={settings}
        />
      )}
    </div>
  );
}

export default App;