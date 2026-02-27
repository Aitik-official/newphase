'use client';

import React, { useState } from 'react';
import { InterviewSummaryCards } from '../../components/InterviewSummaryCards';
import { InterviewTable } from '../../components/InterviewTable';
import { InterviewCalendarView } from '../../components/InterviewCalendarView';
import { InterviewHorizontalFilterBar } from '../../components/InterviewHorizontalFilterBar';
import { ScheduleInterviewModal } from '../../components/interviewscheduleinterviewmodal';
import { InterviewFeedbackModal } from '../../components/InterviewFeedbackModal';
import { RescheduleDrawer } from '../../components/interviewRescheduleDrawer';
import { Plus, Calendar, List, Filter, RefreshCw, Search, Bell, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InterviewsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showRescheduleDrawer, setShowRescheduleDrawer] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddFeedback = (interview: any) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  const handleScheduleInterview = () => {
    setShowScheduleModal(true);
  };

  const handleReschedule = (interview: any) => {
    setSelectedInterview(interview);
    setShowRescheduleDrawer(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input 
                type="text" 
                placeholder="Search candidates, jobs, or clients..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Settings className="size-5" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 leading-tight">Alex Morgan</p>
                <p className="text-xs text-slate-500">Recruitment Manager</p>
              </div>
              <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="w-full space-y-8">
            {/* Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-[24px] font-bold text-[#0f172b] leading-[32px]">Interviews</h1>
                <p className="text-[#62748e] text-[14px]">Schedule, manage, and track candidate interviews</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-white border border-[#e2e8f0] rounded-[10px] p-1.5 shadow-sm">
                  <button 
                    onClick={() => setView('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all cursor-pointer ${view === 'list' ? 'bg-[#f1f5f9] text-[#0f172b] shadow-sm' : 'text-[#62748e] hover:text-[#0f172b]'}`}
                  >
                    <List className="size-4" />
                    List
                  </button>
                  <button 
                    onClick={() => setView('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all cursor-pointer ${view === 'calendar' ? 'bg-[#f1f5f9] text-[#0f172b] shadow-sm' : 'text-[#62748e] hover:text-[#0f172b]'}`}
                  >
                    <Calendar className="size-4" />
                    Calendar
                  </button>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-[10px] text-[14px] font-medium text-[#314158] hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                  <RefreshCw className="size-4" />
                  Refresh
                </button>
                
                <button 
                  onClick={handleScheduleInterview}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#155dfc] text-white rounded-[10px] text-[14px] font-bold hover:bg-blue-700 shadow-[0px_1px_3px_0px_#bedbff,0px_1px_2px_0px_#bedbff] transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="size-4" />
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <InterviewSummaryCards />

            {/* Horizontal Filter Bar - Now between cards and table */}
            {view === 'list' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10"
              >
                <InterviewHorizontalFilterBar />
              </motion.div>
            )}

            {/* Content Area */}
            <div className="w-full">
              {/* Main List/Calendar */}
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {view === 'list' ? (
                    <motion.div
                      key="list-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InterviewTable 
                        onAddFeedback={handleAddFeedback} 
                        onReschedule={handleReschedule}
                        searchQuery={searchQuery} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calendar-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InterviewCalendarView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ScheduleInterviewModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
      <InterviewFeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
        interview={selectedInterview} 
      />
      <RescheduleDrawer 
        isOpen={showRescheduleDrawer} 
        onClose={() => setShowRescheduleDrawer(false)} 
      />
    </div>
  );
}
