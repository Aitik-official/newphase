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
  MoreVertical, 
  Eye, 
  Edit2, 
  UserPlus, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronRight,
  Phone,
  Building2,
  ExternalLink,
  Target
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

// --- Types ---
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
type LeadType = 'Company' | 'Individual' | 'Referral';
type LeadSource = 'Website' | 'LinkedIn' | 'Email' | 'Referral' | 'Campaign';
type Priority = 'High' | 'Medium' | 'Low';

interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting';
  date: string;
  description: string;
}

interface Lead {
  id: string;
  companyName: string;
  type: LeadType;
  source: LeadSource;
  contactPerson: string;
  email: string;
  phone: string;
  status: LeadStatus;
  assignedTo: {
    name: string;
    avatar: string;
  };
  lastFollowUp: string;
  nextFollowUp?: string;
  priority: Priority;
  interestedNeeds: string;
  notes: string;
  activities: Activity[];
}

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
      { id: 'a1', type: 'Call', date: '2026-02-01', description: 'Initial discovery call. Discussed hiring plans.' },
      { id: 'a2', type: 'Email', date: '2026-01-28', description: 'Sent agency brochure and case studies.' }
    ]
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

        {/* Side Panel Overlay */}
        <AnimatePresence>
          {selectedLeadId && selectedLead && (
            <>
              <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10"
                onClick={() => setSelectedLeadId(null)}
              />
              <Motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-20 flex flex-col border-l border-slate-200"
              >
                {/* Panel Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedLeadId(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                    >
                      <ChevronRight size={24} className="rotate-180" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">Lead Details</h2>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-slate-900">{selectedLead.companyName}</h3>
                          <StatusTag status={selectedLead.status} />
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{selectedLead.type} • {selectedLead.source}</p>
                        <PriorityTag priority={selectedLead.priority} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <button 
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                        onClick={() => handleConvert(selectedLead.id)}
                      >
                        <UserPlus size={16} />
                        Convert
                      </button>
                      <button 
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                        onClick={() => handleMarkLost(selectedLead.id)}
                      >
                        <XCircle size={16} />
                        Lost
                      </button>
                    </div>

                    <section className="mb-8">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact</h4>
                      <div className="space-y-4">
                        <ContactRow icon={<Users size={16} />} label="Contact Person" value={selectedLead.contactPerson} />
                        <ContactRow icon={<Mail size={16} />} label="Email Address" value={selectedLead.email} isLink />
                        <ContactRow icon={<Phone size={16} />} label="Phone Number" value={selectedLead.phone} />
                      </div>
                    </section>

                    <section className="mb-8 space-y-6">
                      <InfoBlock icon={<Briefcase size={14} />} label="Interested Needs" value={selectedLead.interestedNeeds} isItalic />
                      <InfoBlock icon={<FileText size={14} />} label="Internal Notes" value={selectedLead.notes} color="amber" />
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Activity Timeline</h4>
                        <button className="text-xs font-bold text-blue-600 flex items-center gap-1">
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {selectedLead.activities.map((activity) => (
                          <TimelineItem key={activity.id} activity={activity} />
                        ))}
                        {selectedLead.nextFollowUp && <TimelineItem nextDate={selectedLead.nextFollowUp} />}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button className="flex-1 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">Edit</button>
                    <button className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm">Log Activity</button>
                  </div>
                </div>
              </Motion.div>
            </>
          )}
        </AnimatePresence>
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

const ContactRow = ({ icon, label, value, isLink }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-medium ${isLink ? 'text-blue-600 hover:underline cursor-pointer' : 'text-slate-900'}`}>{value}</p>
    </div>
  </div>
);

const InfoBlock = ({ icon, label, value, isItalic, color }: any) => (
  <div>
    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
      {icon} {label}
    </h4>
    <div className={`p-4 rounded-xl border ${color === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
      <p className={`text-sm leading-relaxed ${isItalic ? 'italic' : ''}`}>{value}</p>
    </div>
  </div>
);

const TimelineItem = ({ activity, nextDate }: any) => (
  <div className="relative pl-10">
    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 ${
      nextDate ? 'bg-blue-600 text-white' : 
      activity.type === 'Call' ? 'bg-blue-100 text-blue-600' : 
      activity.type === 'Email' ? 'bg-yellow-100 text-yellow-600' : 
      'bg-purple-100 text-purple-600'
    }`}>
      {nextDate ? <Clock size={14} /> : activity.type === 'Call' ? <Phone size={14} /> : activity.type === 'Email' ? <Mail size={14} /> : <Users size={14} />}
    </div>
    {nextDate ? (
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <span className="text-[10px] font-bold text-blue-600 uppercase">Next Follow-up</span>
        <p className="text-sm font-bold text-slate-900 mt-0.5">{nextDate}</p>
      </div>
    ) : (
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 mb-1">{activity.date}</span>
        <p className="text-sm font-semibold text-slate-900">{activity.type}</p>
        <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
      </div>
    )}
  </div>
);
