import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, ActivityCategory, AppSettings } from '../types';
import { getTranslation } from '../locales';

interface StatsChartProps {
  activities: Activity[];
  settings: AppSettings;
}

const COLORS = {
  [ActivityCategory.WORK]: '#3b82f6', // blue-500
  [ActivityCategory.LEARNING]: '#8b5cf6', // violet-500
  [ActivityCategory.HEALTH]: '#10b981', // emerald-500
  [ActivityCategory.LEISURE]: '#f59e0b', // amber-500
  [ActivityCategory.CHORE]: '#64748b', // slate-500
  [ActivityCategory.SOCIAL]: '#ec4899', // pink-500
  [ActivityCategory.OTHER]: '#71717a', // zinc-500
};

export const StatsChart: React.FC<StatsChartProps> = ({ activities, settings }) => {
  const t = getTranslation(settings.language);

  const data = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    
    activities.forEach(act => {
      const current = categoryMap[act.category] || 0;
      categoryMap[act.category] = current + act.durationMinutes;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ 
        name, 
        value,
        displayName: t.categories[name as ActivityCategory] // Add display name for tooltip/legend
      }))
      .filter(item => item.value > 0);
  }, [activities, t]);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-dark-muted text-sm border-2 border-dashed border-dark-card rounded-xl">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-dark-card rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-dark-muted mb-2 uppercase tracking-wider">{t.timeDistribution}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="displayName" // Use displayName for Legend
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as ActivityCategory] || '#999'} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            formatter={(value: number) => [`${value} mins`]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};