'use client';

import React, { useState, useMemo } from 'react';
import { StageTabs } from './components/StageTabs';
import { CandidateTable, Candidate } from './components/CandidateTable';
import { CandidateGrid } from './components/CandidateGrid';
import { FilterDrawer } from './components/FilterDrawer';
import { BulkActions } from './components/BulkActions';
import { 
  Filter, 
  LayoutGrid, 
  List, 
  Plus,
} from 'lucide-react';
// import { Toaster } from 'sonner'; // Uncomment if sonner is installed

// Mock data
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MDM2MTY2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    designation: 'Senior Product Designer',
    company: 'Adobe Systems',
    experience: 8,
    location: 'San Francisco, USA',
    assignedJobs: ['Lead UX Designer'],
    stage: 'Interviewing',
    owner: 'John Doe',
    lastActivity: '2 hours ago',
    hotlist: true,
    phone: '+1 555-0101',
    email: 'sarah.j@example.com',
    skills: ['Figma', 'React'],
    noticePeriod: '30 days',
    salary: { current: '$160k', expected: '$180k' },
    source: 'LinkedIn',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBtYW58ZW58MXx8fHwxNzcwMzgxMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    designation: 'Full Stack Engineer',
    company: 'Stripe',
    experience: 5,
    location: 'Toronto, Canada',
    assignedJobs: ['Senior React Developer'],
    stage: 'Screening',
    owner: 'Jane Smith',
    lastActivity: 'Yesterday',
    hotlist: false,
    phone: '+1 555-0102',
    email: 'm.chen@example.com',
    skills: ['TypeScript', 'Node.js'],
    noticePeriod: 'Immediate',
    salary: { current: '$145k', expected: '$165k' },
    source: 'Referral',
    rating: 4
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1769636929266-8057f2c5ed52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc3MDQ2MTc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    designation: 'Marketing Director',
    company: 'HubSpot',
    experience: 12,
    location: 'Austin, TX',
    assignedJobs: ['VP of Marketing'],
    stage: 'Applied',
    owner: 'John Doe',
    lastActivity: '3 days ago',
    hotlist: true,
    phone: '+1 555-0103',
    email: 'emily.r@example.com',
    skills: ['Growth', 'SEO'],
    noticePeriod: '60 days',
    salary: { current: '$190k', expected: '$210k' },
    source: 'Job Board',
    rating: 5
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCclMjBwZXJzb24lMjBvZmZpY2V8ZW58MXx8fHwxNzcwNDYxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    designation: 'DevOps Architect',
    company: 'AWS',
    experience: 10,
    location: 'Seattle, WA',
    assignedJobs: ['Cloud Lead'],
    stage: 'Shortlist',
    owner: 'Jane Smith',
    lastActivity: 'Just now',
    hotlist: false,
    phone: '+1 555-0104',
    email: 'david.w@example.com',
    skills: ['AWS', 'K8s'],
    noticePeriod: '2 weeks',
    salary: { current: '$175k', expected: '$195k' },
    source: 'LinkedIn Sourcing',
    rating: 4
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1588443418198-b03405cc586f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwcGVvcGxlJTIwaGVhZHNob3RzfGVufDF8fHx8MTc3MDQ2MTc5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    designation: 'HR Specialist',
    company: 'Peloton',
    experience: 4,
    location: 'New York, NY',
    assignedJobs: ['Talent Partner'],
    stage: 'Offered',
    owner: 'John Doe',
    lastActivity: '4 hours ago',
    hotlist: false,
    phone: '+1 555-0105',
    email: 'j.taylor@example.com',
    skills: ['Benefits'],
    noticePeriod: '30 days',
    salary: { current: '$110k', expected: '$130k' },
    source: 'Referral',
    rating: 5
  }
];

export default function CandidatesPage() {
  const [activeStage, setActiveStage] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredCandidates = useMemo(() => {
    if (activeStage === 'all') return MOCK_CANDIDATES;
    return MOCK_CANDIDATES.filter(c => c.stage.toLowerCase() === activeStage.toLowerCase());
  }, [activeStage]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map(c => c.id));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">
      {/* Pipeline Tabs */}
      <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />

        {/* Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Candidates
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {filteredCandidates.length} total
                </span>
              </h1>
              
              <div className="h-6 w-px bg-slate-200" />
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={20} strokeWidth={viewMode === 'list' ? 2.5 : 2} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={20} strokeWidth={viewMode === 'grid' ? 2.5 : 2} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-100">
                <Plus size={16} />
                Add Candidate
              </button>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                  isFilterOpen 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Filter size={16} />
                Filters
                {isFilterOpen && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            {viewMode === 'list' ? (
              <CandidateTable 
                candidates={filteredCandidates} 
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
              />
            ) : (
              <CandidateGrid 
                candidates={filteredCandidates} 
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            )}
          </div>
        </div>

        <BulkActions 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />

      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      {/* <Toaster position="top-right" richColors /> */}
    </div>
  );
}
