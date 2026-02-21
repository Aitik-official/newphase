import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserPlus, 
  GitBranch, 
  Target, 
  Calendar, 
  Award, 
  CheckSquare, 
  Inbox, 
  Contact, 
  BarChart3, 
  CreditCard,
  Settings,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { label: 'Recruitment Hub', type: 'label' },
  { icon: Target, label: 'Leads', path: '/leads' },
  { icon: Users, label: 'Clients', path: '/clients', active: true },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: UserPlus, label: 'Candidates', path: '/candidates' },
  { icon: GitBranch, label: 'Pipeline', path: '/pipeline' },
  { icon: Target, label: 'Matches', path: '/matches' },
  { icon: Calendar, label: 'Interviews', path: '/interviews' },
  { icon: Award, label: 'Placements', path: '/placements' },
  { icon: CheckSquare, label: 'Tasks & Activities', path: '/tasks' },
  { icon: Inbox, label: 'Inbox', path: '/inbox', badge: 3 },
  { icon: Contact, label: 'Contacts', path: '/contacts' },
  { label: 'Insights', type: 'label' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { label: 'System', type: 'label' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: ShieldCheck, label: 'Administration', path: '/admin' },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0f172a] text-slate-400 flex flex-col fixed left-0 top-0 z-50 overflow-y-auto border-r border-slate-800">
      <div className="p-4 flex items-center justify-between border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SAASA</span>
        </div>
        <button className="p-1 hover:bg-slate-800 rounded-md transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item, index) => {
          if (item.type === 'label') {
            return (
              <div key={index} className="px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </div>
            );
          }

          const Icon = item.icon!;
          return (
            <a
              key={index}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
                item.active 
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-600' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-[#1e293b]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-slate-500 truncate">Senior Recruiter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
