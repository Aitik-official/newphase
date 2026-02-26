'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  Contact, 
  Search, 
  Plus, 
  ChevronRight,
  MoreVertical,
  Phone,
  Mail,
  Users2,
  FileText,
  Clock,
  Filter,
  X,
  ChevronLeft,
  Calendar as CalendarIcon,
  List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

// --- Types ---

type TaskType = 'Call' | 'Email' | 'Interview' | 'Follow-up' | 'Meeting' | 'Note';
type Priority = 'Low' | 'Medium' | 'High';
type Status = 'Pending' | 'Completed' | 'Overdue';

interface RelatedTo {
  id: string;
  name: string;
  type: 'Candidate' | 'Job' | 'Client';
}

interface Task {
  id: string;
  title: string;
  type: TaskType;
  relatedTo: RelatedTo;
  dueDate: string;
  time: string;
  priority: Priority;
  status: Status;
  owner: {
    name: string;
    avatar: string;
  };
}

interface Activity {
  id: string;
  type: TaskType;
  note: string;
  timestamp: string;
  recruiter: string;
}

// --- Mock Data ---

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Screening call with Sarah Jenkins',
    type: 'Call',
    relatedTo: { id: 'c1', name: 'Sarah Jenkins', type: 'Candidate' },
    dueDate: '2026-02-10',
    time: '10:00 AM',
    priority: 'High',
    status: 'Pending',
    owner: { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?q=80&w=150&h=150&auto=format&fit=crop' }
  },
  {
    id: '2',
    title: 'Send offer letter for Senior Frontend Dev',
    type: 'Email',
    relatedTo: { id: 'j1', name: 'Senior Frontend Developer', type: 'Job' },
    dueDate: '2026-02-09',
    time: '04:00 PM',
    priority: 'High',
    status: 'Overdue',
    owner: { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?q=80&w=150&h=150&auto=format&fit=crop' }
  },
  {
    id: '3',
    title: 'Technical interview: Marcus Chen',
    type: 'Interview',
    relatedTo: { id: 'c2', name: 'Marcus Chen', type: 'Candidate' },
    dueDate: '2026-02-10',
    time: '02:30 PM',
    priority: 'Medium',
    status: 'Pending',
    owner: { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1672675389084-5415d558dfd7?q=80&w=150&h=150&auto=format&fit=crop' }
  },
  {
    id: '4',
    title: 'Follow-up on Acme Corp contract',
    type: 'Follow-up',
    relatedTo: { id: 'cl1', name: 'Acme Corp', type: 'Client' },
    dueDate: '2026-02-11',
    time: '09:00 AM',
    priority: 'Medium',
    status: 'Pending',
    owner: { name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?q=80&w=150&h=150&auto=format&fit=crop' }
  },
  {
    id: '5',
    title: 'Review resumes for Marketing Manager',
    type: 'Note',
    relatedTo: { id: 'j2', name: 'Marketing Manager', type: 'Job' },
    dueDate: '2026-02-10',
    time: '11:30 AM',
    priority: 'Low',
    status: 'Completed',
    owner: { name: 'Marcus Wong', avatar: 'https://images.unsplash.com/photo-1617386124435-9eb3935b1e11?q=80&w=150&h=150&auto=format&fit=crop' }
  },
  {
    id: '6',
    title: 'Candidate feedback sync',
    type: 'Meeting',
    relatedTo: { id: 'cl2', name: 'TechFlow Inc', type: 'Client' },
    dueDate: '2026-02-12',
    time: '03:00 PM',
    priority: 'Medium',
    status: 'Pending',
    owner: { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1672675389084-5415d558dfd7?q=80&w=150&h=150&auto=format&fit=crop' }
  },
];

const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  '1': [
    { id: 'a1', type: 'Note', note: 'Sarah expressed interest in the remote-first policy.', timestamp: '2026-02-08 10:15 AM', recruiter: 'Alex Thompson' },
    { id: 'a2', type: 'Email', note: 'Sent preliminary interview invite.', timestamp: '2026-02-07 02:30 PM', recruiter: 'Alex Thompson' },
  ],
  '2': [
    { id: 'a3', type: 'Follow-up', note: 'Waiting on compensation details from hiring manager.', timestamp: '2026-02-09 11:00 AM', recruiter: 'Alex Thompson' },
  ]
};

// --- Components ---

const SummaryCard = ({ label, count, icon: Icon, color }: { label: string, count: number, icon: any, color: string }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-default">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
      <Icon size={20} />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{count}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Low: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
  const colors = {
    Pending: 'bg-gray-100 text-gray-600',
    Completed: 'bg-emerald-100 text-emerald-600',
    Overdue: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${colors[status]}`}>
      {status}
    </span>
  );
};

const TaskTypeIcon = ({ type }: { type: TaskType }) => {
  const icons = {
    Call: Phone,
    Email: Mail,
    Interview: Users2,
    'Follow-up': Clock,
    Meeting: CalendarIcon,
    Note: FileText,
  };
  const Icon = icons[type];
  return <Icon size={16} className="text-gray-400" />;
};

const FilterBar = ({ onAddTask }: { onAddTask: () => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 gap-4 flex-wrap">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
        <CalendarIcon size={16} />
        <span>Today</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
        <Filter size={16} />
        <span>Task Type</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
        <span>Priority</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
        <span>Owner</span>
      </div>
      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 ml-2">Clear Filters</button>
    </div>
    
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search Related..." 
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
      <button 
        onClick={onAddTask}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-sm active:scale-95 transition-all"
      >
        <Plus size={18} />
        Add Task
      </button>
    </div>
  </div>
);

const TaskDetailPanel = ({ task, isOpen, onClose }: { task: Task | null, isOpen: boolean, onClose: () => void }) => {
  if (!task) return null;
  const activities = MOCK_ACTIVITIES[task.id] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Task Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TaskTypeIcon type={task.type} />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{task.type}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{task.title}</h3>
                <div className="flex gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold mb-1">Due Date</div>
                  <div className="text-sm font-medium text-gray-900">{task.dueDate} • {task.time}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold mb-1">Owner</div>
                  <div className="flex items-center gap-2">
                    <ImageWithFallback src={task.owner.avatar} className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{task.owner.name}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 uppercase font-bold mb-1">Related To</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    {task.relatedTo.type === 'Candidate' && <Users2 size={14} className="text-blue-500" />}
                    {task.relatedTo.type === 'Job' && <Briefcase size={14} className="text-emerald-500" />}
                    {task.relatedTo.type === 'Client' && <Contact size={14} className="text-amber-500" />}
                    {task.relatedTo.name} ({task.relatedTo.type})
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-gray-900">Activity History</h4>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1 bg-blue-50 rounded-lg">Add Note</button>
                </div>
                
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  {activities.length > 0 ? activities.map((activity, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-white border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase">{activity.type}</span>
                          <span className="text-[10px] text-gray-400">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{activity.note}</p>
                        <div className="text-[11px] text-gray-500">Log by <span className="font-bold">{activity.recruiter}</span></div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400">No activity history recorded for this task.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 mt-auto sticky bottom-0 bg-white">
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                Mark as Completed
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AddTaskModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Task Title</label>
            <input 
              type="text" 
              placeholder="e.g., Follow up with Hiring Manager" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none bg-white">
                <option>Call</option>
                <option>Email</option>
                <option>Interview</option>
                <option>Follow-up</option>
                <option>Meeting</option>
                <option>Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none bg-white">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Link to Candidate / Job / Client</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Enable Reminders</span>
              <span className="text-xs text-gray-500">In-app and Email notifications</span>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer p-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CalendarView = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const dates = [9, 10, 11, 12, 13];
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
      <div className="grid grid-cols-5 border-b border-gray-100">
        {days.map((day, idx) => (
          <div key={idx} className="p-4 text-center border-r last:border-r-0 border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>
            <div className={`text-xl font-bold mt-1 ${dates[idx] === 10 ? 'text-blue-600' : 'text-gray-900'}`}>{dates[idx]}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 min-h-[500px]">
        {days.map((day, dIdx) => (
          <div key={dIdx} className="p-2 space-y-2 border-r last:border-r-0 border-gray-100 bg-gray-50/30">
            {MOCK_TASKS.filter(t => t.dueDate.endsWith(String(dates[dIdx]).padStart(2, '0'))).map((task) => (
              <div 
                key={task.id} 
                className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4"
                style={{ borderLeftColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#3b82f6' }}
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{task.time}</div>
                <div className="text-xs font-bold text-gray-900 truncate mb-1">{task.title}</div>
                <div className="flex items-center gap-1">
                  <TaskTypeIcon type={task.type} />
                  <span className="text-[10px] text-gray-500 font-medium">{task.type}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="p-8">
          {/* Top Bar with Title and View Toggle */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks & Activities</h1>
              <p className="text-sm text-gray-500">Manage your daily recruitment workflow and follow-ups.</p>
            </div>
            
            <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListIcon size={18} />
                List View
              </button>
              <button 
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'calendar' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <CalendarIcon size={18} />
                Calendar
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard label="Due Today" count={12} icon={CalendarIcon} color="bg-blue-100 text-blue-600" />
            <SummaryCard label="Overdue" count={4} icon={Clock} color="bg-red-100 text-red-600" />
            <SummaryCard label="Upcoming (7d)" count={28} icon={CalendarIcon} color="bg-emerald-100 text-emerald-600" />
            <SummaryCard label="Completed" count={156} icon={CheckSquare} color="bg-gray-100 text-gray-600" />
          </div>

          {/* Filters */}
          <FilterBar onAddTask={() => setIsAddModalOpen(true)} />

          {/* Main Content */}
          {view === 'list' ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Task Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Related To</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_TASKS.map((task) => (
                    <tr 
                      key={task.id} 
                      onClick={() => handleRowClick(task)}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.status === 'Completed' ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                            <TaskTypeIcon type={task.type} />
                          </div>
                          <span className={`text-sm font-bold text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-600">{task.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{task.relatedTo.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{task.relatedTo.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{task.dueDate}</span>
                          <span className="text-[11px] text-gray-400">{task.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback src={task.owner.avatar} className="w-6 h-6 rounded-full" />
                          <span className="text-[13px] font-medium text-gray-600">{task.owner.name.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-all cursor-pointer">
                            <CheckSquare size={16} />
                          </button>
                          <button className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-all cursor-pointer">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                <span className="text-xs text-gray-500 font-medium">Showing 6 of 124 tasks</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50" disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="p-2 hover:bg-white border border-gray-200 rounded-lg text-gray-400">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CalendarView />
          )}
      </main>

      <TaskDetailPanel 
        task={selectedTask} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />

      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
