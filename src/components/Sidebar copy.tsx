import React from 'react';
import { 
  Users, 
  Briefcase, 
  UserCircle, 
  LayoutGrid, 
  Inbox, 
  Calendar, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  PlusCircle, 
  Building2,
  ChevronLeft,
  Search,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

// Using the logo from figma asset if available, otherwise a placeholder
const LOGO_SRC = "figma:asset/a42f3741485e54168aee55317c72798cc1bbe8a4.png";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, count }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
    active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
    <span className="text-sm font-medium flex-1">{label}</span>
    {count !== undefined && (
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
        active ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
      }`}>
        {count}
      </span>
    )}
  </div>
);

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-[#0f172a] h-screen flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
             <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SAASA</span>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recruitment Hub</p>
          <div className="space-y-1">
            <NavItem icon={LayoutGrid} label="Dashboard" />
            <NavItem icon={Building2} label="Clients" />
            <NavItem icon={Briefcase} label="Jobs" count={12} />
            <NavItem icon={UserCircle} label="Candidates" />
            <NavItem icon={Layers} label="Pipeline" />
            <NavItem icon={Sparkles} label="Matches" />
            <NavItem icon={Calendar} label="Interviews" count={4} />
            <NavItem icon={BarChart3} label="Placements" />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Collaboration</p>
          <div className="space-y-1">
            <NavItem icon={CheckCircle2} label="Tasks & Activities" />
            <NavItem icon={Inbox} label="Inbox" count={2} />
            <NavItem icon={Users} label="Contacts" active />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
          <div className="space-y-1">
            <NavItem icon={Users} label="Team" />
            <NavItem icon={Settings} label="Settings" />
            <NavItem icon={ShieldCheck} label="Administration" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Alex Rivera</p>
            <p className="text-xs text-slate-500 truncate">Senior Recruiter</p>
          </div>
        </div>
      </div>
    </div>
  );
};
