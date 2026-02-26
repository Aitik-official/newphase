import React from 'react';
import { 
  LayoutDashboard, Users, Briefcase, UserCheck, 
  GitPullRequest, Target, Calendar, Inbox, 
  Contact, BarChart2, Settings, ChevronRight
} from 'lucide-react';
import imgSaasaLogo from "figma:asset/a42f3741485e54168aee55317c72798cc1bbe8a4.png";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'Leads', path: '/leads' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: UserCheck, label: 'Candidates', path: '/candidates' },
  { icon: GitPullRequest, label: 'Pipeline', path: '/pipeline' },
  { icon: Calendar, label: 'Interviews', path: '/interviews' },
  { icon: Inbox, label: 'Inbox', path: '/inbox' },
  { icon: Contact, label: 'Contacts', path: '/contacts' },
  { icon: BarChart2, label: 'Reports', path: '/reports' },
];

export function Sidebar() {
  return (
    <div className="w-[260px] bg-[#020d1f] flex flex-col h-full overflow-y-auto shrink-0 border-r border-slate-800">
      <div className="p-6">
        <img src={imgSaasaLogo} alt="SAASA" className="h-8 w-auto" />
      </div>

      <div className="px-4 py-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Recruitment Hub</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button 
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-[#2b7fff]" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-6 space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3 mt-6">Administration</p>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white bg-white/10 border-l-4 border-[#2b7fff] rounded-r-lg transition-all">
          <Settings className="w-5 h-5 text-[#2b7fff]" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <div className="w-8 h-8 rounded-full bg-[#2b7fff] flex items-center justify-center text-[10px] font-bold text-white shrink-0">JD</div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold truncate leading-none mb-1">John Doe</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Admin</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
