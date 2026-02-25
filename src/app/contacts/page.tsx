'use client';

import React, { useState } from 'react';
import { ContactHeader } from '../../components/ContactHeader';
import { ContactFilterBar } from '../../components/ContactFilterBar';
import { ContactsTable } from '../../components/ContactsTable';
import { ContactDetailPanel } from '../../components/ContactDetailPanel';
import { AddContactDrawer } from '../../components/AddContactDrawer';
import { Contact } from '../../components/ContactMockData';
import { Toaster } from 'sonner';

export default function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleClosePanel = () => {
    setSelectedContact(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Toaster position="top-right" expand={false} richColors />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ContactHeader onAddContact={() => setIsAddDrawerOpen(true)} />
        
        {/* Scrollable area starts here */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ContactFilterBar />
          
          <div className="flex-1 overflow-auto bg-white">
            <ContactsTable onRowClick={handleRowClick} />
          </div>
          
          {/* Footer Pagination / Stats */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">1</span> to <span className="font-semibold text-slate-900">5</span> of <span className="font-semibold text-slate-900">148</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-sm font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-sm font-medium">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-sm font-medium">12</button>
              </div>
              <button className="px-3 py-1 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>

        {/* Slide-over Detail Panel */}
        <ContactDetailPanel 
          contact={selectedContact} 
          onClose={handleClosePanel} 
        />

        {/* Add Contact Drawer */}
        <AddContactDrawer 
          isOpen={isAddDrawerOpen} 
          onClose={() => setIsAddDrawerOpen(false)} 
        />
        
        {/* Overlay when panel is open */}
        {selectedContact && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-40 transition-opacity" 
            onClick={handleClosePanel}
          />
        )}
      </main>
    </div>
  );
}
