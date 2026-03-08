'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  Mail,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  UserPlus,
  CheckCircle,
  XCircle,
  Phone,
  Building2,
  ExternalLink,
  Target,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { LeadDetailsDrawer } from '../../components/LeadDetailsDrawer';
import type { Lead, LeadStatus, Priority } from './types';

// --- Mock Data ---
const RECRUITERS = [
  { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=150' },
  { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1712168567859-e24cbc155219?q=80&w=150' },
  { name: 'Michael Ross', avatar: 'https://images.unsplash.com/photo-1719835491911-99dd30f3f2dc?q=80&w=150' },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    companyName: 'TechNova Solutions',
    type: 'Company',
    source: 'LinkedIn',
    contactPerson: 'David Miller',
    email: 'd.miller@technova.com',
    phone: '+1 (555) 123-4567',
    status: 'Qualified',
    assignedTo: RECRUITERS[0],
    lastFollowUp: '2026-02-01',
    nextFollowUp: '2026-02-10',
    priority: 'High',
    interestedNeeds: 'Full-stack developers, Product Managers',
    notes: 'Looking to hire a team of 5 in the next quarter.',
    activities: [
      {
        id: 'a1',
        type: 'Call',
        date: '2026-02-01',
        description: 'Initial discovery call. Discussed hiring plans.',
        title: 'Call Logged',
        outcome: 'Interested',
        duration: '5 minutes',
        notes: 'Client requested proposal',
      },
      { id: 'a2', type: 'Email', date: '2026-01-28', description: 'Sent agency brochure and case studies.', title: 'Email Sent' },
    ],
    industry: 'Technology',
    companySize: '51-200',
    website: 'https://technova.com',
    linkedIn: 'https://linkedin.com/company/technova',
    location: 'San Francisco, CA',
    designation: 'Head of Talent',
    country: 'United States',
    city: 'San Francisco',
    campaignName: 'Q1 2026 Outreach',
    createdDate: '2026-01-15',
    notesList: [
      { id: 'ln1', title: 'Discovery call summary', content: 'Looking to hire a team of 5 in the next quarter. Full-stack and PM roles.', tags: ['HR'], createdBy: { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?q=80&w=150' }, createdAt: 'Jan 15, 2026, 10:00 AM', isPinned: true },
      { id: 'ln2', title: 'Budget and timeline', content: 'Budget approved for 5 roles. Target start April 2026.', tags: ['Finance', 'Contract'], createdBy: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1712168567859-e24cbc155219?q=80&w=150' }, createdAt: 'Jan 20, 2026, 2:30 PM', isPinned: false },
      { id: 'ln3', title: 'Feedback on proposal', content: 'David liked the SLA and fee structure. Wants to proceed with MSA.', tags: ['Feedback', 'Contract'], createdBy: { name: 'David Miller' }, createdAt: 'Feb 1, 2026, 5:00 PM', isPinned: true },
    ],
  },
  {
    id: '2',
    companyName: 'GreenHorizon Energy',
    type: 'Referral',
    source: 'Referral',
    contactPerson: 'Emma Watson',
    email: 'emma.w@greenhorizon.io',
    phone: '+1 (555) 987-6543',
    status: 'New',
    assignedTo: RECRUITERS[1],
    lastFollowUp: '2026-02-04',
    nextFollowUp: '2026-02-06',
    priority: 'Medium',
    interestedNeeds: 'Environmental Engineers',
    notes: 'Referred by John from SolarTech.',
    activities: []
  },
  {
    id: '3',
    companyName: 'BlueSky Logistics',
    type: 'Company',
    source: 'Website',
    contactPerson: 'Robert Brown',
    email: 'r.brown@bluesky.com',
    phone: '+1 (555) 456-7890',
    status: 'Contacted',
    assignedTo: RECRUITERS[2],
    lastFollowUp: '2026-02-03',
    nextFollowUp: '2026-02-07',
    priority: 'Low',
    interestedNeeds: 'Operations Managers',
    notes: 'Follow up after their board meeting next week.',
    activities: [
      { id: 'a3', type: 'Email', date: '2026-02-03', description: 'Follow-up email sent. No response yet.' }
    ]
  },
  {
    id: '4',
    companyName: 'Infinite AI',
    type: 'Company',
    source: 'Campaign',
    contactPerson: 'Sophia Garcia',
    email: 'sophia@infiniteai.tech',
    phone: '+1 (555) 222-3333',
    status: 'Converted',
    assignedTo: RECRUITERS[0],
    lastFollowUp: '2026-01-20',
    priority: 'High',
    interestedNeeds: 'Machine Learning Engineers',
    notes: 'Contract signed on Jan 20.',
    activities: [
      { id: 'a4', type: 'Meeting', date: '2026-01-15', description: 'Contract negotiation meeting.' }
    ]
  },
  {
    id: '5',
    companyName: 'Peak Performance',
    type: 'Individual',
    source: 'LinkedIn',
    contactPerson: 'James Wilson',
    email: 'james@peak.com',
    phone: '+1 (555) 888-9999',
    status: 'Lost',
    assignedTo: RECRUITERS[1],
    lastFollowUp: '2026-01-30',
    priority: 'Low',
    interestedNeeds: 'Sales Executives',
    notes: 'Went with a different agency due to pricing.',
    activities: [
      { id: 'a5', type: 'Call', date: '2026-01-30', description: 'Final rejection call.' }
    ]
  }
];

// --- Components ---

const StatusTag = ({ status }: { status: LeadStatus }) => {
  const styles = {
    New: 'bg-blue-50 text-blue-700 border-blue-100',
    Contacted: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    Qualified: 'bg-purple-50 text-purple-700 border-purple-100',
    Converted: 'bg-green-50 text-green-700 border-green-100',
    Lost: 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const PriorityTag = ({ priority }: { priority: Priority }) => {
  const styles = {
    High: 'text-red-600',
    Medium: 'text-orange-500',
    Low: 'text-blue-500',
  };
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${styles[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${priority === 'High' ? 'bg-red-600' : priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
      {priority}
    </span>
  );
};

export default function RecruitmentAgencyDashboard() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  
  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const stats = {
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    Qualified: leads.filter(l => l.status === 'Qualified').length,
    Converted: leads.filter(l => l.status === 'Converted').length,
    Lost: leads.filter(l => l.status === 'Lost').length,
  };

  const handleConvert = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'Converted' as LeadStatus } : l));
  };

  const handleMarkLost = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'Lost' as LeadStatus } : l));
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Main Content */}
      <main className="flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Leads</h1>
            <p className="text-sm text-slate-500">Track, manage, and convert potential clients into active hiring partners</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Plus size={18} />
            <span>Add Lead</span>
          </button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <SummaryCard label="New Leads" count={stats.New} color="blue" icon={<Plus size={16} />} />
            <SummaryCard label="Contacted" count={stats.Contacted} color="yellow" icon={<Phone size={16} />} />
            <SummaryCard label="Qualified" count={stats.Qualified} color="purple" icon={<Target size={16} />} />
            <SummaryCard label="Converted" count={stats.Converted} color="green" icon={<CheckCircle size={16} />} />
            <SummaryCard label="Lost" count={stats.Lost} color="gray" icon={<XCircle size={16} />} />
          </div>

          {/* Table Controls */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search company, email, or contact..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase">Filters:</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select 
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:border-blue-300 transition-colors"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:border-blue-300 transition-colors">
                    <option>All Sources</option>
                    <option>Website</option>
                    <option>LinkedIn</option>
                    <option>Email</option>
                    <option>Referral</option>
                    <option>Campaign</option>
                  </select>

                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:border-blue-300 transition-colors">
                    <option>All Recruiters</option>
                    {RECRUITERS.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>

                  <button 
                    className="text-sm text-slate-500 hover:text-red-600 font-medium px-2 py-1 flex items-center gap-1 transition-colors"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                  >
                    <XCircle size={14} />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                    <th className="px-6 py-4">Lead / Company</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4">Last Follow-up</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      className={`group hover:bg-slate-50 transition-colors cursor-pointer ${selectedLeadId === lead.id ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">{lead.companyName}</span>
                          <span className="text-xs text-slate-500">{lead.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 w-fit px-2 py-1 rounded-md">
                          <ExternalLink size={12} />
                          {lead.source}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700">{lead.contactPerson}</span>
                          <span className="text-xs text-slate-500">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusTag status={lead.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback 
                            src={lead.assignedTo.avatar} 
                            alt={lead.assignedTo.name} 
                            className="w-7 h-7 rounded-full" 
                          />
                          <span className="text-sm text-slate-700">{lead.assignedTo.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700">{lead.lastFollowUp}</span>
                          {lead.nextFollowUp && (
                            <span className="text-[10px] text-blue-600 font-medium mt-0.5">Next: {lead.nextFollowUp}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="View Details" onClick={() => setSelectedLeadId(lead.id)}>
                            <Eye size={18} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Lead">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md" 
                            title="Convert to Client"
                            onClick={() => handleConvert(lead.id)}
                          >
                            <UserPlus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <LeadDetailsDrawer
          lead={selectedLead ?? null}
          onClose={() => setSelectedLeadId(null)}
          onConvert={handleConvert}
          onMarkLost={handleMarkLost}
        />
      </main>
    </div>
  );
}

// --- Helper Components ---

const SummaryCard = ({ label, count, color, icon }: { label: string, count: number, color: string, icon: React.ReactNode }) => {
  const styles: any = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', border: 'border-blue-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100', border: 'border-yellow-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100', border: 'border-purple-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100', border: 'border-green-100' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', iconBg: 'bg-gray-100', border: 'border-gray-100' },
  };
  const s = styles[color] || styles.gray;
  return (
    <div className={`p-4 rounded-xl border shadow-sm transition-all hover:shadow-md cursor-pointer ${s.bg} ${s.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${s.iconBg} ${s.text}`}>{icon}</div>
        <span className={`text-2xl font-bold ${s.text}`}>{count}</span>
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider opacity-70 ${s.text}`}>{label}</p>
    </div>
  );
};

