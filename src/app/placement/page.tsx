'use client';

import React, { useState } from 'react';
import { PlacementSummaryCards } from '../../components/PlacementSummaryCards';
import { PlacementFiltersBar } from '../../components/PlacementFiltersBar';
import { PlacementsTable } from '../../components/PlacementsTable';
import { PlacementDetailsDrawer } from '../../components/PlacementDetailsDrawer';


export default function PlacementsPage() {
  const [selectedPlacement, setSelectedPlacement] = useState<any | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Placements</h1>
                <p className="text-slate-500 mt-1">Manage and track candidates who have accepted offers.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-md font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
                  Add Manual Placement
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <PlacementSummaryCards />
            
            <div className="mt-8">
              <PlacementFiltersBar />
              <PlacementsTable onSelect={setSelectedPlacement} />
            </div>
          </div>
        </main>

      <PlacementDetailsDrawer 
        placement={selectedPlacement} 
        onClose={() => setSelectedPlacement(null)} 
      />
    </div>
  );
}
