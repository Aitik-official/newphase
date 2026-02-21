'use client'; 

import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  RefreshCcw, 
  MoreVertical, 
  Search, 
  Filter, 
  Grid2X2, 
  List,
  ChevronDown,
  Building2,
  AlertCircle
} from 'lucide-react';
import { ClientSummaryMetrics } from '../../components/ClientSummaryMetrics';
import { ClientTable } from '../../components/ClientTable';
import { ClientFilterDrawer } from '../../components/ClientFilterDrawer';
import { ClientBulkActionsBar } from '../../components/ClientBulkActionsBar';

// Tab Component
const StatusTabs = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'all', label: 'All', count: 124 },
    { id: 'active', label: 'Active Clients', count: 42 },
    { id: 'prospects', label: 'Prospects', count: 56 },
    { id: 'on-hold', label: 'On Hold', count: 18 },
    { id: 'inactive', label: 'Inactive', count: 8 },
    { id: 'hot', label: 'Hot Clients 🔥', count: 12 },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
            activeTab === tab.id 
              ? 'text-blue-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 flex flex-col items-center justify-center text-center shadow-sm">
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
      <Building2 className="w-10 h-10 text-blue-500" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">No clients added yet</h3>
    <p className="text-slate-500 max-w-sm mb-8">
      Start building your agency pipeline by adding your first client or importing them from a CSV file.
    </p>
    <div className="flex items-center gap-3">
      <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
        <Plus className="w-4 h-4" /> Create Client
      </button>
      <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
        <Upload className="w-4 h-4" /> Import Clients
      </button>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [isEmpty, setIsEmpty] = useState(false); // Toggle to show empty state

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Recruitment Hub / CRM
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm">
                <RefreshCcw className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-all shadow-sm">
                <Upload className="w-4 h-4" /> Import Clients
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                <Plus className="w-5 h-5" /> Add Client
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by client name, industry, location or owner..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Filter className="w-5 h-5" /> Filters
              </button>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <List className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                  <Grid2X2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <StatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <ClientSummaryMetrics />

          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Showing <strong>5 Active Clients</strong> requiring immediate attention.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Sort by:</span>
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600">
                    Last Activity <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <ClientTable 
                selectedIds={selectedClients}
                onSelectionChange={setSelectedClients} 
              />
            </>
          )}
        </div>

      <ClientFilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      
      <ClientBulkActionsBar 
        selectedCount={selectedClients.length} 
        onClear={() => setSelectedClients([])} 
      />
    </div>
  );
}
