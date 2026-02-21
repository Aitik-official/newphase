'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Filter, 
  Users, 
  Briefcase, 
  Target, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  MapPin, 
  DollarSign, 
  MoreVertical,
  Mail,
  MessageSquare,
  FileText,
  UserPlus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Check,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

// --- Types ---

type MatchStatus = 'New' | 'Reviewed' | 'Sent to Pipeline' | 'Sent to Client' | 'Accepted' | 'Rejected';

interface Candidate {
  id: string;
  name: string;
  photo: string;
  score: number;
  skills: string[];
  experience: number;
  location: string;
  salary: {
    expected: string;
    currency: string;
    fit: 'excellent' | 'good' | 'average' | 'poor';
  };
  noticePeriod: string;
  status: MatchStatus;
  explanation: {
    skills: boolean | 'partial';
    experience: boolean | 'partial';
    location: boolean | 'partial';
    salary: boolean | 'partial';
    text: string;
  };
}

interface Job {
  id: string;
  title: string;
  client: string;
  status: 'Open' | 'Urgent' | 'On Hold';
}

// --- Mock Data ---

const JOBS: Job[] = [
  { id: '1', title: 'Senior Product Designer', client: 'Acme Corp', status: 'Urgent' },
  { id: '2', title: 'Fullstack Engineer', client: 'GlobalTech', status: 'Open' },
  { id: '3', title: 'Marketing Manager', client: 'BrightSide', status: 'On Hold' },
];

const CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    photo: 'https://images.unsplash.com/photo-1659353220570-435990a3bd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzJTIwd29tYW4lMjByZWNydWl0bWVudHxlbnwxfHx8fDE3NzA1MzE0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    score: 94,
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    experience: 8,
    location: 'London, UK (Remote)',
    salary: { expected: '£85k', currency: 'GBP', fit: 'excellent' },
    noticePeriod: '30 days',
    status: 'New',
    explanation: {
      skills: true,
      experience: true,
      location: true,
      salary: true,
      text: 'Exceptional match with deep expertise in design systems and required 8+ years of experience in high-growth startups.'
    }
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    photo: 'https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzJTIwbWFuJTIwcmVjcnVpdG1lbnR8ZW58MXx8fHwxNzcwNTMxNDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    score: 82,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: 5,
    location: 'San Francisco, CA',
    salary: { expected: '$160k', currency: 'USD', fit: 'average' },
    noticePeriod: 'Immediate',
    status: 'Reviewed',
    explanation: {
      skills: true,
      experience: 'partial',
      location: true,
      salary: 'partial',
      text: 'Strong technical profile but salary expectations are slightly above budget. Willing to negotiate.'
    }
  },
  {
    id: 'c3',
    name: 'Elena Rodriguez',
    photo: 'https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGNhbmRpZGF0ZSUyMHBlcnNvbiUyMHJlY3J1aXRtZW50fGVufDF8fHx8MTc3MDUzMTQ2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    score: 75,
    skills: ['Project Management', 'Agile', 'Jira', 'Stakeholder Management'],
    experience: 6,
    location: 'Madrid, Spain',
    salary: { expected: '€55k', currency: 'EUR', fit: 'good' },
    noticePeriod: '15 days',
    status: 'Sent to Pipeline',
    explanation: {
      skills: 'partial',
      experience: true,
      location: false,
      salary: true,
      text: 'Good experience level but requires relocation. Skills align well with core requirements.'
    }
  },
  {
    id: 'c4',
    name: 'David Wilson',
    photo: 'https://images.unsplash.com/photo-1736939666660-d4c776e0532c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBlbXBsb3llZSUyMHBvcnRyYWl0JTIwcmVjcnVpdGVyJTIwY2FuZGlkYXRlfGVufDF8fHx8MTc3MDUzMTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    score: 68,
    skills: ['Python', 'SQL', 'Data Visualization', 'Tableau'],
    experience: 4,
    location: 'Austin, TX',
    salary: { expected: '$110k', currency: 'USD', fit: 'excellent' },
    noticePeriod: '30 days',
    status: 'Rejected',
    explanation: {
      skills: 'partial',
      experience: 'partial',
      location: true,
      salary: true,
      text: 'Missing some specialized skills requested by the hiring manager, but strong foundational knowledge.'
    }
  }
];

// --- Components ---

const Header = ({ 
  selectedJob, 
  setSelectedJob, 
  matchType, 
  setMatchType, 
  isClientView, 
  setIsClientView 
}: any) => {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matches</h1>
          <p className="text-sm text-slate-500 mt-1">Smart candidate-job matching powered by Recruitly AI</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setIsClientView(false)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${!isClientView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Internal View
            </button>
            <button 
              onClick={() => setIsClientView(true)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${isClientView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Client Preview
            </button>
          </div>
          
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-all shadow-sm">
              <Briefcase size={18} className="text-slate-400" />
              <div className="text-left">
                <p className="text-xs text-slate-500 leading-none">Job Title & Client</p>
                <p className="text-sm font-semibold text-slate-900">{selectedJob.title} • {selectedJob.client}</p>
              </div>
              <ChevronDown size={16} className="text-slate-400 ml-2" />
            </button>
          </div>
          
          <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
            selectedJob.status === 'Urgent' ? 'bg-rose-100 text-rose-700' : 
            selectedJob.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {selectedJob.status}
          </span>
        </div>
        
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setMatchType('AI')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              matchType === 'AI' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Sparkles size={16} />
            AI Matches
          </button>
          <button 
            onClick={() => setMatchType('Manual')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              matchType === 'Manual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Users size={16} />
            Manual Matches
          </button>
        </div>
      </div>
    </div>
  );
};

const FiltersBar = () => {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-700">Filters:</span>
      </div>
      
      <div className="flex flex-1 flex-wrap gap-4">
        {/* Match Score Slider */}
        <div className="flex flex-col min-w-[120px]">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Skill Match</span>
            <span className="text-[10px] text-blue-600 font-bold">75%+</span>
          </div>
          <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" min="0" max="100" defaultValue="75" />
        </div>
        
        {/* Experience Dropdown */}
        <div className="relative">
          <button className="flex items-center justify-between gap-4 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 min-w-[140px]">
            <span>Exp: 5 - 10 yrs</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
        
        {/* Location Dropdown */}
        <div className="relative">
          <button className="flex items-center justify-between gap-4 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 min-w-[140px]">
            <span className="flex items-center gap-2"><MapPin size={14} /> Location</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
        
        {/* Salary Filter */}
        <div className="relative">
          <button className="flex items-center justify-between gap-4 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 min-w-[140px]">
            <span className="flex items-center gap-2"><DollarSign size={14} /> Salary</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
        
        {/* Notice Period */}
        <div className="flex gap-2">
          {['Immediate', '15', '30'].map(val => (
            <button key={val} className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              {val === 'Immediate' ? val : `${val}d`}
            </button>
          ))}
        </div>
      </div>
      
      <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Reset Filters</button>
    </div>
  );
};

const MatchExplanation = ({ explanation }: { explanation: Candidate['explanation'] }) => {
  return (
    <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
      <div className="flex items-start gap-3">
        <Sparkles size={16} className="text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-900 leading-relaxed italic">"{explanation.text}"</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-blue-100">
        <div className="flex items-center gap-2">
          {explanation.skills === true ? <CheckCircle2 size={14} className="text-emerald-500" /> : explanation.skills === 'partial' ? <AlertCircle size={14} className="text-amber-500" /> : <XCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-medium text-slate-600">Skills</span>
        </div>
        <div className="flex items-center gap-2">
          {explanation.experience === true ? <CheckCircle2 size={14} className="text-emerald-500" /> : explanation.experience === 'partial' ? <AlertCircle size={14} className="text-amber-500" /> : <XCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-medium text-slate-600">Exp.</span>
        </div>
        <div className="flex items-center gap-2">
          {explanation.location === true ? <CheckCircle2 size={14} className="text-emerald-500" /> : explanation.location === 'partial' ? <AlertCircle size={14} className="text-amber-500" /> : <XCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-medium text-slate-600">Loc.</span>
        </div>
        <div className="flex items-center gap-2">
          {explanation.salary === true ? <CheckCircle2 size={14} className="text-emerald-500" /> : explanation.salary === 'partial' ? <AlertCircle size={14} className="text-amber-500" /> : <XCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-medium text-slate-600">Salary</span>
        </div>
      </div>
    </div>
  );
};

const CandidateCard = ({ 
  candidate, 
  isClientView, 
  isSelected, 
  onToggleSelect 
}: { 
  candidate: Candidate; 
  isClientView: boolean; 
  isSelected: boolean; 
  onToggleSelect: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<MatchStatus, string> = {
    'New': 'bg-blue-50 text-blue-700 border-blue-200',
    'Reviewed': 'bg-slate-50 text-slate-700 border-slate-200',
    'Sent to Pipeline': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sent to Client': 'bg-purple-50 text-purple-700 border-purple-200',
    'Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className={`group bg-white border rounded-2xl p-6 transition-all duration-200 ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}>
      <div className="flex items-start gap-6">
        <div className="flex items-center gap-4">
          {!isClientView && (
             <div className="pt-2">
               <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
              />
             </div>
          )}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-200">
              <ImageWithFallback src={candidate.photo} alt={candidate.name} />
            </div>
            {!isClientView && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="AI Match Score">
                {candidate.score}%
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{candidate.name}</h3>
                {!isClientView && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded-md ${statusColors[candidate.status]}`}>
                    {candidate.status}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" /> {candidate.experience} years exp.</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {candidate.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {candidate.noticePeriod} notice</span>
                <span className={`flex items-center gap-1.5 ${
                  candidate.salary.fit === 'excellent' ? 'text-emerald-600' : 
                  candidate.salary.fit === 'good' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  <DollarSign size={14} className="opacity-70" /> {candidate.salary.expected}
                </span>
              </div>
            </div>
            
            {!isClientView && (
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Assign Recruiter">
                   <UserPlus size={18} />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Add Note">
                   <FileText size={18} />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="More Options">
                   <MoreVertical size={18} />
                 </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {candidate.skills.map(skill => (
              <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">
                {skill}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {!isClientView && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <MatchExplanation explanation={candidate.explanation} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
               {!isClientView && (
                 <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-wider transition-colors"
                >
                  {isExpanded ? 'Hide AI Analysis' : 'Show AI Analysis'}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
               )}
               {isClientView && (
                 <p className="text-xs text-slate-400 italic">Candidate ready for your review</p>
               )}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                View Profile
              </button>
              {!isClientView && (
                <>
                  <button className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">
                    Send to Pipeline
                  </button>
                  <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2">
                    Submit to Client
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {isClientView && (
                <div className="flex gap-2">
                   <button className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all flex items-center gap-2">
                     <XCircle size={16} />
                     Reject
                   </button>
                   <button className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all flex items-center gap-2">
                     <UserCheck size={16} />
                     Shortlist
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkActions = ({ selectedCount, onClear }: { selectedCount: number; onClear: () => void }) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <div className="bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold">
            {selectedCount}
          </div>
          <div>
            <p className="font-bold">Candidates Selected</p>
            <button onClick={onClear} className="text-xs text-slate-400 hover:text-white underline">Deselect all</button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title="Send Bulk Email">
            <Mail size={20} />
          </button>
          <button className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title="WhatsApp Message">
            <MessageSquare size={20} />
          </button>
          <div className="h-8 w-px bg-slate-700 mx-2"></div>
          <button className="px-5 py-2.5 text-sm font-bold bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all flex items-center gap-2">
            <Trash2 size={18} />
            Bulk Reject
          </button>
          <button className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg flex items-center gap-2">
            <UserPlus size={18} />
            Bulk Send to Pipeline
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [selectedJob, setSelectedJob] = useState(JOBS[0]);
  const [matchType, setMatchType] = useState<'AI' | 'Manual'>('AI');
  const [isClientView, setIsClientView] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const filteredCandidates = useMemo(() => {
    if (matchType === 'AI') {
      return CANDIDATES.sort((a, b) => b.score - a.score);
    }
    return CANDIDATES.filter(c => c.score < 80); // Mocking manual matches
  }, [matchType]);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          selectedJob={selectedJob} 
          setSelectedJob={setSelectedJob} 
          matchType={matchType} 
          setMatchType={setMatchType}
          isClientView={isClientView}
          setIsClientView={setIsClientView}
        />
        
        {isClientView && (
          <div className="bg-blue-600 text-white px-8 py-2 flex items-center justify-between sticky top-[137px] z-10 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info size={16} />
              <span>Client Preview Mode: Internal scores, notes, and statuses are hidden.</span>
            </div>
            <button onClick={() => setIsClientView(false)} className="text-xs font-bold uppercase tracking-widest hover:underline">
              Exit Preview
            </button>
          </div>
        )}
        
        {!isClientView && <FiltersBar />}
        
        <div className="flex-1 p-8 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {matchType === 'AI' ? 'Recommended Matches' : 'Manual Candidates'}
                  <span className="ml-3 px-2.5 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full font-bold">
                    {filteredCandidates.length}
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing {matchType === 'AI' ? 'AI-scored' : 'hand-picked'} candidates for this position.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                 <span className="text-sm text-slate-500 font-medium">Sort by:</span>
                 <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer">
                   <option>Highest Match</option>
                   <option>Recent Activity</option>
                   <option>Experience</option>
                 </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredCandidates.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  isClientView={isClientView}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={() => toggleCandidateSelection(candidate.id)}
                />
              ))}
            </div>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No candidates found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Try adjusting your filters or switching to manual matches to see more results.</p>
                <button className="mt-6 text-blue-600 font-bold hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {!isClientView && (
          <BulkActions 
            selectedCount={selectedCandidates.length} 
            onClear={() => setSelectedCandidates([])} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
