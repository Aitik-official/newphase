import React from 'react';
import { Users, Briefcase, UserCheck, Award, Banknote, TrendingUp, TrendingDown } from 'lucide-react';

const metrics = [
  { 
    label: 'Active Clients', 
    value: '124', 
    icon: Users, 
    trend: '+12%', 
    trendUp: true,
    color: 'blue'
  },
  { 
    label: 'Open Jobs', 
    value: '48', 
    icon: Briefcase, 
    trend: '+5%', 
    trendUp: true,
    color: 'teal'
  },
  { 
    label: 'Candidates in Progress', 
    value: '312', 
    icon: UserCheck, 
    trend: '-2%', 
    trendUp: false,
    color: 'indigo'
  },
  { 
    label: 'Placements (This Month)', 
    value: '18', 
    icon: Award, 
    trend: '+8%', 
    trendUp: true,
    color: 'purple'
  },
  { 
    label: 'Revenue Generated', 
    value: '$142.5k', 
    icon: Banknote, 
    trend: '+15%', 
    trendUp: true,
    color: 'emerald'
  },
];

export function ClientSummaryMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${metric.color}-50 text-${metric.color}-600`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${metric.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {metric.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.trend}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{metric.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
