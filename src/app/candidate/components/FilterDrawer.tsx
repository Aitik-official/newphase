import React from 'react';
import { 
  X, 
  Search, 
  ChevronDown, 
  Filter, 
  History, 
  Save,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Filter size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-none">Advanced Filters</h2>
                  <p className="text-xs text-slate-500 mt-1">Refine your candidate search</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <FilterSection label="Job & Pipeline">
                <FilterField label="Target Job" placeholder="Select job..." />
                <FilterField label="Current Stage" placeholder="Select stage..." />
                <FilterField label="Recruiter / Owner" placeholder="Select owner..." />
              </FilterSection>

              <FilterSection label="Candidate Details">
                <FilterField label="Skills" placeholder="e.g. React, Node.js, Python" />
                <div className="grid grid-cols-2 gap-4">
                  <FilterField label="Min Experience" placeholder="Years" />
                  <FilterField label="Max Experience" placeholder="Years" />
                </div>
                <FilterField label="Location" placeholder="Country, City" />
              </FilterSection>

              <FilterSection label="Financials">
                <div className="grid grid-cols-2 gap-4">
                  <FilterField label="Salary Range (Min)" placeholder="Annual" />
                  <FilterField label="Salary Range (Max)" placeholder="Annual" />
                </div>
                <FilterField label="Notice Period" placeholder="e.g. Immediate, 30 days" />
              </FilterSection>

              <FilterSection label="Metadata">
                <FilterField label="Source" placeholder="LinkedIn, Referral, etc." />
                <FilterField label="Tags" placeholder="Search tags..." />
                <FilterField label="Work Authorization" placeholder="Visa Status" />
              </FilterSection>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              <button className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <History size={16} />
                Reset
              </button>
              <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                Apply Filters
              </button>
              <button className="p-2.5 border border-slate-300 hover:bg-white rounded-lg transition-colors" title="Save as view">
                <Save size={20} className="text-slate-600" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FilterSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const FilterField = ({ label, placeholder }: { label: string, placeholder: string }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </div>
  </div>
);
