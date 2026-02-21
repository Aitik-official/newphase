import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCircle, 
  Settings, 
  Trophy, 
  Calendar, 
  Inbox, 
  Contact, 
  LineChart, 
  Activity,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Contact },
  { id: 'clients', label: 'Clients', icon: UserCircle },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'candidates', label: 'Candidates', icon: Users, active: true },
  { id: 'pipeline', label: 'Pipeline', icon: Activity },
  { id: 'matches', label: 'Matches', icon: Trophy },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'placements', label: 'Placements', icon: LineChart },
  { id: 'tasks', label: 'Tasks & Activities', icon: Activity },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'contacts', label: 'Contacts', icon: Contact },
];

const adminItems = [
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Administration', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  return (
    <aside className="w-[240px] h-screen bg-[#0F172A] text-slate-400 flex flex-col fixed left-0 top-0 z-50 overflow-y-auto border-r border-slate-800">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-white font-bold text-lg tracking-tight">SAASA</span>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Recruitment Hub
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
              item.active 
                ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600 rounded-l-none' 
                : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={18} className={item.active ? 'text-blue-500' : 'group-hover:text-slate-200'} />
            {item.label}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Management
        </div>
        {adminItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800 hover:text-slate-200 group"
          >
            <item.icon size={18} className="group-hover:text-slate-200" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-slate-500 truncate">Senior Recruiter</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
