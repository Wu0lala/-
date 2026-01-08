import React, { useState } from 'react';
import { AppSettings, Language } from '../types';
import { getTranslation } from '../locales';

interface SettingsModalProps {
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
  const [language, setLanguage] = useState<Language>(currentSettings.language);
  const [baseUrl, setBaseUrl] = useState<string>(currentSettings.baseUrl || '');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        
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