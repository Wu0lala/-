import React from 'react';
import { AnalysisResponse, AppSettings } from '../types';
import { getTranslation } from '../locales';

interface AnalysisViewProps {
  analysis: AnalysisResponse;
  onClose: () => void;
  settings: AppSettings;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onClose, settings }) => {
  const t = getTranslation(settings.language);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 z-40 bg-dark-bg overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 pb-24">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-dark-bg/80 backdrop-blur-md py-4 flex justify-between items-center border-b border-white/5 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
            {t.analysisTitle}
          </h2>
          <button 
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>

        {/* Score Section */}
        <div className="bg-dark-card rounded-2xl p-6 mb-6 text-center border border-white/5">
          <div className="text-dark-muted text-sm uppercase tracking-widest mb-2">{t.efficiencyScore}</div>
          <div className={`text-6xl font-black ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </div>
          <p className="text-dark-muted mt-4 text-sm max-w-md mx-auto">{analysis.summary}</p>
        </div>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-card rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🔍</span> {t.keyInsights}
            </h3>
            <ul className="space-y-3">
              {analysis.insights.map((insight, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-brand-500 mt-1">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-dark-card rounded-xl p-5 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span> {t.suggestions}
            </h3>
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Revised Schedule */}
        <div className="bg-dark-card rounded-xl p-6 border border-white/5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🗓️</span> {t.optimizedSchedule}
          </h3>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
            {analysis.revisedSchedule}
          </div>
        </div>

      </div>
    </div>
  );
};