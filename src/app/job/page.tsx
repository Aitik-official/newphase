'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Filter, 
  RefreshCcw, 
  ChevronDown, 
  Eye, 
  UserPlus, 
  FileText, 
  BrainCircuit, 
  MapPin, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type JobStatus = 'Active' | 'On Hold' | 'Closed';

interface Job {
  id: string;
  title: string;
  client: string;
  location: string;
  status: JobStatus;
  applied: number;
  interviewed: number;
  offered: number;
  joined: number;
  openings: number;
  owner: string;
  createdDate: string;
  hot: boolean;
  aiMatch: boolean;
  noCandidates: boolean;
  slaRisk: boolean;
}

interface JobStatusPillProps {
  status: JobStatus;
}

interface PipelineSnapshotProps {
  applied: number;
  interviewed: number;
  offered: number;
  joined: number;
}

interface JobsListViewProps {
  jobs: Job[];
}

interface JobsBoardViewProps {
  jobs: Job[];
}

// Mock Data
const JOBS_DATA: Job[] = [
  {
    id: 'JOB-2024-001',
    title: 'Senior Frontend Engineer',
    client: 'TechCorp Solutions',
    location: 'Remote, US',
    status: 'Active' as JobStatus,
    applied: 45,
    interviewed: 12,
    offered: 2,
    joined: 1,
    openings: 3,
    owner: 'Alex Rivers',
    createdDate: '2024-05-10',
    hot: true,
    aiMatch: true,
    noCandidates: false,
    slaRisk: false,
  },
  {
    id: 'JOB-2024-002',
    title: 'Product Designer (UI/UX)',
    client: 'Creative Pulse',
    location: 'New York, NY',
    status: 'Active' as JobStatus,
    applied: 28,
    interviewed: 8,
    offered: 1,
    joined: 0,
    openings: 1,
    owner: 'Sarah Chen',
    createdDate: '2024-05-12',
    hot: false,
    aiMatch: true,
    noCandidates: false,
    slaRisk: true,
  },
  {
    id: 'JOB-2024-003',
    title: 'Backend Lead (Go/Node)',
    client: 'FinFlow Systems',
    location: 'London, UK',
    status: 'On Hold' as JobStatus,
    applied: 15,
    interviewed: 4,
    offered: 0,
    joined: 0,
    openings: 2,
    owner: 'Alex Rivers',
    createdDate: '2024-05-15',
    hot: false,
    aiMatch: false,
    noCandidates: true,
    slaRisk: false,
  },
  {
    id: 'JOB-2024-004',
    title: 'Marketing Manager',
    client: 'Global Reach',
    location: 'Austin, TX',
    status: 'Active' as JobStatus,
    applied: 62,
    interviewed: 18,
    offered: 3,
    joined: 2,
    openings: 2,
    owner: 'Marcus Wright',
    createdDate: '2024-05-18',
    hot: true,
    aiMatch: false,
    noCandidates: false,
    slaRisk: false,
  },
  {
    id: 'JOB-2024-005',
    title: 'Sales Executive',
    client: 'SaaS Force',
    location: 'San Francisco, CA',
    status: 'Closed' as JobStatus,
    applied: 89,
    interviewed: 24,
    offered: 5,
    joined: 5,
    openings: 5,
    owner: 'Sarah Chen',
    createdDate: '2024-04-20',
    hot: false,
    aiMatch: false,
    noCandidates: false,
    slaRisk: false,
  },
  {
    id: 'JOB-2024-006',
    title: 'DevOps Engineer',
    client: 'Cloud Scale',
    location: 'Berlin, DE',
    status: 'Active' as JobStatus,
    applied: 12,
    interviewed: 3,
    offered: 0,
    joined: 0,
    openings: 1,
    owner: 'Alex Rivers',
    createdDate: '2024-05-20',
    hot: false,
    aiMatch: true,
    noCandidates: false,
    slaRisk: true,
  },
];

const STATS = [
  { label: 'Active Jobs', value: 42, color: 'text-blue-600', bg: 'bg-blue-50', icon: Briefcase },
  { label: 'New Jobs (This Week)', value: 8, color: 'text-green-600', bg: 'bg-green-50', icon: Plus },
  { label: 'No Candidates', value: 5, color: 'text-amber-600', bg: 'bg-amber-50', icon: Users },
  { label: 'Near SLA', value: 3, color: 'text-red-600', bg: 'bg-red-50', icon: Clock },
  { label: 'Closed This Month', value: 12, color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle2 },
];

const JobStatusPill = ({ status }: JobStatusPillProps) => {
  const styles: Record<JobStatus, string> = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
    Closed: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const PipelineSnapshot = ({ applied, interviewed, offered, joined }: PipelineSnapshotProps) => (
  <div className="flex items-center gap-0 bg-gray-50 rounded-lg border border-gray-100 p-1">
    <div className="px-2 py-1 flex flex-col items-center border-r border-gray-200 last:border-0 min-w-[40px]">
      <span className="text-[10px] text-gray-400 font-medium">APP</span>
      <span className="text-xs font-bold text-gray-700">{applied}</span>
    </div>
    <div className="px-2 py-1 flex flex-col items-center border-r border-gray-200 last:border-0 min-w-[40px]">
      <span className="text-[10px] text-gray-400 font-medium">INT</span>
      <span className="text-xs font-bold text-gray-700">{interviewed}</span>
    </div>
    <div className="px-2 py-1 flex flex-col items-center border-r border-gray-200 last:border-0 min-w-[40px]">
      <span className="text-[10px] text-gray-400 font-medium">OFF</span>
      <span className="text-xs font-bold text-gray-700">{offered}</span>
    </div>
    <div className="px-2 py-1 flex flex-col items-center last:border-0 min-w-[40px]">
      <span className="text-[10px] text-gray-400 font-medium">JOI</span>
      <span className="text-xs font-bold text-gray-700">{joined}</span>
    </div>
  </div>
);

const JobsListView = ({ jobs }: JobsListViewProps) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="p-4 w-10">
            <input type="checkbox" className="rounded border-gray-300" />
          </th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Job Title & ID</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Client & Location</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Indicators</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Pipeline</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase">Details</th>
          <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {jobs.map((job) => (
          <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
            <td className="p-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </td>
            <td className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{job.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText size={14} className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                    <BrainCircuit size={14} className="text-purple-400 hover:text-purple-600 cursor-pointer" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-mono">{job.id}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{job.client}</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span>{job.location}</span>
                </div>
              </div>
            </td>
            <td className="p-4">
              <JobStatusPill status={job.status} />
            </td>
            <td className="p-4">
              <div className="flex items-center justify-center gap-2">
                {job.hot && (
                  <div className="relative group/tip">
                    <Flame size={16} className="text-orange-500" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Hot Job</span>
                  </div>
                )}
                {job.slaRisk && (
                  <div className="relative group/tip">
                    <Clock size={16} className="text-red-500" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">SLA Risk</span>
                  </div>
                )}
                {job.noCandidates && (
                  <div className="relative group/tip">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">No Candidates</span>
                  </div>
                )}
                {job.aiMatch && (
                  <div className="relative group/tip">
                    <div className="bg-purple-100 p-1 rounded">
                      <BrainCircuit size={12} className="text-purple-600" />
                    </div>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">AI Match Ready</span>
                  </div>
                )}
              </div>
            </td>
            <td className="p-4">
              <PipelineSnapshot 
                applied={job.applied} 
                interviewed={job.interviewed} 
                offered={job.offered} 
                joined={job.joined} 
              />
            </td>
            <td className="p-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Owner</span>
                <span className="text-xs text-gray-700">{job.owner}</span>
                <span className="text-[11px] text-gray-400 mt-1">{job.createdDate}</span>
              </div>
            </td>
            <td className="p-4 text-right">
              <div className="flex items-center justify-end gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                  <UserPlus size={16} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
      <span>Showing 6 of 42 jobs</span>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, '...', 7].map((p, i) => (
            <button key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${p === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
        </div>
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
      </div>
    </div>
  </div>
);

const JobsBoardView = ({ jobs }: JobsBoardViewProps) => {
  const columns = [
    { id: 'new', label: 'New Candidates', count: 12 },
    { id: 'shortlist', label: 'Shortlisted', count: 8 },
    { id: 'interview', label: 'Interviewing', count: 15 },
    { id: 'offered', label: 'Offered', count: 4 },
    { id: 'joined', label: 'Joined', count: 22 },
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
      {columns.map((col) => (
        <div key={col.id} className="min-w-[300px] flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">{col.label}</h3>
              <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{col.count}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-gray-400 mb-1">{job.id}</span>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{job.title}</h4>
                  </div>
                  {job.hot && <Flame size={14} className="text-orange-500" />}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{job.client}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                    <Users size={10} />
                    <span>{job.applied}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gray-500">JD</span>
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold ${job.slaRisk ? 'text-red-500' : 'text-gray-400'}`}>
                    {job.slaRisk ? 'SLA Risk' : 'On Track'}
                  </span>
                </div>
              </div>
            ))}
            <button className="py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
              + Assign Job
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function JobsPage() {
  const [view, setView] = useState<'list' | 'board'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1440px] mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jobs</h1>
                <p className="text-gray-500">Manage your recruitment pipeline and active openings.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center shadow-sm">
                  <button 
                    onClick={() => setView('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <List size={18} />
                    List View
                  </button>
                  <button 
                    onClick={() => setView('board')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'board' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid size={18} />
                    Board View
                  </button>
                </div>
                <button className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  <RefreshCcw size={20} />
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  <Plus size={20} />
                  Create Job
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-5 gap-4">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                      <stat.icon size={22} />
                    </div>
                    <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      +12% <ChevronDown size={12} className="inline rotate-180" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Filter size={18} />
                      Filters
                      {isFilterOpen ? <ChevronDown size={16} className="rotate-180" /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500">
                    <span className="font-bold text-blue-600">Active</span>
                    <button className="hover:text-red-500">×</button>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500">
                    <span className="font-bold">Last 30 Days</span>
                    <button className="hover:text-red-500">×</button>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Clear All</button>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Sort by: <span className="text-gray-900 font-bold cursor-pointer hover:underline">Recently Created <ChevronDown size={14} className="inline" /></span>
                </div>
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-4 gap-6 shadow-sm">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Job Status</label>
                        <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                          <option>All Statuses</option>
                          <option>Active</option>
                          <option>On Hold</option>
                          <option>Closed</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Client</label>
                        <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                          <option>All Clients</option>
                          <option>TechCorp Solutions</option>
                          <option>FinFlow Systems</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                        <input type="text" placeholder="City or Country" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Job Type</label>
                        <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Full-time</option>
                          <option>Contract</option>
                          <option>Freelance</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Salary Range</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Min" className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="text" placeholder="Max" className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Recruiter</label>
                        <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                          <option>All Recruiters</option>
                          <option>Alex Rivers</option>
                          <option>Sarah Chen</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-6 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                          <span className="text-sm font-medium">Hot Jobs Only</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                          <span className="text-sm font-medium">AI Match Ready</span>
                        </label>
                      </div>
                      <div className="flex items-end justify-end pt-6">
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2">Reset</button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">Apply Filters</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Switcher Content */}
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'list' ? (
                <JobsListView jobs={JOBS_DATA} />
              ) : (
                <JobsBoardView jobs={JOBS_DATA} />
              )}
            </motion.div>

          </div>
        </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
