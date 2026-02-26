'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Target, 
  DollarSign, 
  Plus, 
  Download,
  Trophy,
  MessageSquare,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard, TeamMember } from '../../components/TeamComponents';
import { TeamTable } from '../../components/TeamTable';
import { MemberDrawer } from '../../components/MemberDrawer';
import { RolesPermissionsView } from '../../components/RolesPermissions';
import { TargetsKPIView } from '../../components/TargetsKPI';
import { CommissionView } from '../../components/CommissionManagement';
import { AddMemberDrawer } from '../../components/AddMemberDrawer';

type MainTab = 'members' | 'roles' | 'targets' | 'commissions';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('members');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const subTabs: { id: MainTab; label: string; icon: any }[] = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'targets', label: 'Targets & KPI', icon: Target },
    { id: 'commissions', label: 'Commission', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Content Area */}
      <div className="p-8 space-y-8">
          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <span>Agency</span>
                <span className="text-slate-300">/</span>
                <span className="text-blue-600 font-medium">Team Management</span>
              </nav>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team</h1>
              <p className="text-slate-500 mt-1">Manage recruiters, roles, permissions and performance benchmarks.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm group">
                <Download className="size-5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => setIsAddMemberOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all group"
              >
                <Plus className="size-5 group-rotate-90 transition-transform" />
                Add Team Member
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard title="Total Team" value={24} icon={Users} color="bg-blue-500" trend="+2" />
              <StatCard title="Active" value={18} icon={ShieldCheck} color="bg-emerald-500" />
              <StatCard title="Admins" value={4} icon={Target} color="bg-indigo-500" />
              <StatCard title="Avg. Placements" value={12.5} icon={Trophy} color="bg-amber-500" trend="+15%" />
              <StatCard title="Commission" value="$42k" icon={DollarSign} color="bg-rose-500" trend="+8%" />
              <StatCard title="Pending" value={3} icon={MessageSquare} color="bg-slate-500" />
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Container */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'members' && <TeamTable onSelectMember={handleSelectMember} />}
            {activeTab === 'roles' && <RolesPermissionsView />}
            {activeTab === 'targets' && <TargetsKPIView />}
            {activeTab === 'commissions' && <CommissionView />}
          </motion.div>
      </div>

      {/* Side Drawer */}
      <MemberDrawer 
        member={selectedMember} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      <AddMemberDrawer
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </div>
  );
}
