import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Briefcase, 
  UserPlus, 
  GitMerge, 
  CalendarCheck, 
  UserCheck, 
  ChevronLeft,
  Settings,
  ShieldCheck,
  MessageSquare,
  Users2,
  CheckCircle2
} from 'lucide-react';
import imgSaasaLogo from "figma:asset/a42f3741485e54168aee55317c72798cc1bbe8a4.png";

interface SidebarProps {
  activeSection: string;
}

export function Sidebar({ activeSection }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Leads', icon: Target },
    { name: 'Clients', icon: Users },
    { name: 'Jobs', icon: Briefcase },
    { name: 'Candidates', icon: UserPlus },
    { name: 'Pipeline', icon: GitMerge },
    { name: 'Matches', icon: CheckCircle2 },
    { name: 'Interviews', icon: CalendarCheck },
    { name: 'Placements', icon: UserCheck },
  ];

  const adminItems = [
    { name: 'Inbox', icon: MessageSquare },
    { name: 'Team', icon: Users2 },
    { name: 'Administration', icon: ShieldCheck },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0e1726] text-slate-400 flex flex-col shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <div className="h-8">
          <img src={imgSaasaLogo} alt="SAASA" className="h-full object-contain" />
        </div>
        <button className="p-1 hover:bg-white/5 rounded transition-colors">
          <ChevronLeft className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-hide">
        {/* Recruitment Hub */}
        <div>
          <p className="px-6 mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Recruitment Hub</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all relative ${
                  activeSection === item.name 
                    ? 'text-white bg-blue-600/10' 
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {activeSection === item.name && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                )}
                <item.icon className={`size-5 ${activeSection === item.name ? 'text-blue-500' : ''}`} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Administration */}
        <div>
          <p className="px-6 mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Administration</p>
          <nav className="space-y-1">
            {adminItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all hover:text-white hover:bg-white/5 ${
                  activeSection === item.name ? 'text-white bg-blue-600/10' : ''
                }`}
              >
                <item.icon className="size-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-white/2">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-500 truncate">Manager Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
