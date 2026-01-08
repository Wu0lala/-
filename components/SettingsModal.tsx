import React, { useState, useRef } from 'react';
import { AppSettings, Language, Activity } from '../types';
import { getTranslation } from '../locales';

interface SettingsModalProps {
  currentSettings: AppSettings;
  activities: Activity[];
  onSave: (settings: AppSettings) => void;
  onImport: (activities: Activity[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, activities, onSave, onImport, onClose }) => {
  const [language, setLanguage] = useState<Language>(currentSettings.language);
  const [baseUrl, setBaseUrl] = useState<string>(currentSettings.baseUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the language currently selected in the form to render the UI of the modal itself
  const t = getTranslation(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      language,
      baseUrl: baseUrl.trim()
    });
    onClose();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dailyflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const importedData = JSON.parse(result);
        
        // Basic validation: check if it's an array
        if (Array.isArray(importedData)) {
          onImport(importedData);
          alert(t.importSuccess);
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert(t.importError);
      } finally {
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t.settingsTitle}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-muted mb-2">{t.language}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-brand-600 border-brand-500 text-white' 
                    : 'bg-dark-bg border-white/10 text-dark-muted hover:border-white/30'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('zh')}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  language === 'zh' 
                    ? 'bg-brand-600 border-brand-500 text-white' 
                    : 'bg-dark-bg border-white/10 text-dark-muted hover:border-white/30'
                }`}
              >
                中文 (Chinese)
              </button>
            </div>
          </div>

          {/* Base URL Input */}
          <div>
            <label className="block text-sm font-medium text-dark-muted mb-2">{t.apiBaseUrl}</label>
            <input 
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://generativelanguage.googleapis.com"
              className="w-full bg-dark-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-500 font-mono text-sm placeholder:text-dark-muted/50"
            />
            <p className="mt-2 text-xs text-dark-muted/80 leading-relaxed">
              {t.apiBaseUrlHelp}
            </p>
          </div>

          <div className="border-t border-white/5 pt-6">
             <label className="block text-sm font-medium text-dark-muted mb-3">{t.dataManagement}</label>
             <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 p-3 bg-dark-bg border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {t.exportData}
                </button>
                <button
                  type="button"
                  onClick={handleImportClick}
                  className="flex items-center justify-center gap-2 p-3 bg-dark-bg border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" className="rotate-180 origin-center" />
                  </svg>
                  {t.importData}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />
             </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
          >
            {t.saveSettings}
          </button>
        </form>
      </div>
    </div>
  );
};