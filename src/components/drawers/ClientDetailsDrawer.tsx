'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MoreVertical,
  Building2,
  Briefcase,
  MessageCircle,
  LayoutGrid,
  Users,
  GitBranch,
  Award,
  CreditCard,
  Activity,
  StickyNote,
  Paperclip,
  Edit2,
  UserPlus,
  FileText,
  Upload,
  Archive,
  Trash2,
  Globe,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  CalendarPlus,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  X,
  Eye,
  Pause,
  Copy,
  BarChart3,
  AlertCircle,
  Sparkles,
  User,
  ArrowRight,
  UserCheck,
  Shield,
  Download,
  Send,
  DollarSign,
  FilePlus,
  Pin,
  Pencil,
  Receipt,
} from 'lucide-react';
import type { Client, ClientStage, ClientHealthStatus, ClientContact, ClientJob, JobStatus, ClientPipelineCandidate, PipelineStageName, ClientPlacement, PlacementStatus, ClientInvoice, InvoiceStatus, ClientActivityItem, ActivityFilterType, ClientNote, NoteTag, ClientFile, ClientFileType } from '@/app/client/types';
import { ImageWithFallback } from '../ImageWithFallback';

const HEALTH_STYLES: Record<ClientHealthStatus, { bg: string; text: string; label: string }> = {
  Good: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Good' },
  'Needs attention': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Needs attention' },
  'At risk': { bg: 'bg-red-50', text: 'text-red-700', label: 'At risk' },
};

const FieldRow = ({ label, value, href }: { label: string; value: string; href?: boolean }) => (
  <div className="flex flex-col gap-0.5 py-2 border-b border-slate-100 last:border-0">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-medium text-slate-900 ${href ? 'text-blue-600 hover:underline cursor-pointer truncate' : ''}`}>
      {value || '—'}
    </p>
  </div>
);

const STAGE_STYLES: Record<ClientStage, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Prospect: 'bg-blue-100 text-blue-700 border-blue-200',
  'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  Open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Paused: 'bg-amber-100 text-amber-700 border-amber-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const PIPELINE_STAGES: PipelineStageName[] = ['Applied', 'Screened', 'Interview', 'Offer', 'Joined'];
const PIPELINE_STAGE_STYLES: Record<PipelineStageName, { header: string; border: string }> = {
  Applied: { header: 'bg-slate-100 text-slate-700 border-slate-200', border: 'border-slate-200' },
  Screened: { header: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200' },
  Interview: { header: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200' },
  Offer: { header: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200' },
  Joined: { header: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200' },
};

const PLACEMENT_STATUS_STYLES: Record<PlacementStatus, string> = {
  'Pending Invoice': 'bg-amber-100 text-amber-700 border-amber-200',
  Invoiced: 'bg-blue-100 text-blue-700 border-blue-200',
  Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const INVOICE_STATUS_STYLES: Record<InvoiceStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  Sent: 'bg-blue-100 text-blue-700 border-blue-200',
  Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Overdue: 'bg-red-100 text-red-700 border-red-200',
};

const ACTIVITY_CATEGORY_BG: Record<Exclude<ActivityFilterType, 'All'>, string> = {
  Jobs: 'bg-blue-50',
  Candidates: 'bg-emerald-50',
  Interviews: 'bg-amber-50',
  Billing: 'bg-violet-50',
  Notes: 'bg-slate-100',
  Files: 'bg-slate-100',
};

const NOTE_TAG_STYLES: Record<NoteTag, string> = {
  HR: 'bg-blue-100 text-blue-700 border-blue-200',
  Finance: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Contract: 'bg-amber-100 text-amber-700 border-amber-200',
  Feedback: 'bg-violet-100 text-violet-700 border-violet-200',
};

const FILE_TYPE_BADGE_STYLES: Record<ClientFileType, string> = {
  NDA: 'bg-slate-100 text-slate-700 border-slate-200',
  Contract: 'bg-blue-100 text-blue-700 border-blue-200',
  SLA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Policy: 'bg-amber-100 text-amber-700 border-amber-200',
  Invoice: 'bg-violet-100 text-violet-700 border-violet-200',
  'Job Brief': 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

interface ClientDetailsDrawerProps {
  client: Client | null;
  onClose: () => void;
  onAddJob?: (clientId: number) => void;
  onMessage?: (clientId: number) => void;
  onDelete?: (clientId: number) => void;
}

export function ClientDetailsDrawer({
  client,
  onClose,
  onAddJob,
  onMessage,
  onDelete,
}: ClientDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contacts' | 'jobs' | 'pipeline' | 'placements' | 'billing' | 'activity' | 'notes' | 'files'
  >('overview');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState<Record<string, boolean>>({
    companySnapshot: false,
    relationship: false,
    performance: false,
    health: false,
  });
  const [selectedContact, setSelectedContact] = useState<ClientContact | null>(null);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [addContactDeptOpen, setAddContactDeptOpen] = useState(false);
  const [addContactForm, setAddContactForm] = useState({
    fullName: '',
    designation: '',
    department: '' as string,
    email: '',
    phone: '',
    whatsAppSameAsPhone: true,
    isPrimary: false,
    notes: '',
  });

  const ADD_CONTACT_DEPARTMENTS = ['HR', 'Hiring Manager', 'Finance', 'Other'];

  const openAddContactForm = () => {
    setAddContactForm({
      fullName: '',
      designation: '',
      department: '',
      email: '',
      phone: '',
      whatsAppSameAsPhone: true,
      isPrimary: false,
      notes: '',
    });
    setShowAddContactForm(true);
    setAddContactDeptOpen(false);
  };

  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [addJobPriorityOpen, setAddJobPriorityOpen] = useState(false);
  const [addJobHiringManagerOpen, setAddJobHiringManagerOpen] = useState(false);
  const [addJobForm, setAddJobForm] = useState({
    jobTitle: '',
    department: '',
    location: '',
    numberOfPositions: '',
    priority: '' as string,
    hiringManagerId: '' as string,
    expectedClosureDate: '',
    jobDescription: '',
    jdFileName: '',
  });

  const ADD_JOB_PRIORITIES = ['Low', 'Medium', 'High'];

  const openAddJobForm = () => {
    setAddJobForm({
      jobTitle: '',
      department: '',
      location: '',
      numberOfPositions: '',
      priority: '',
      hiringManagerId: '',
      expectedClosureDate: '',
      jobDescription: '',
      jdFileName: '',
    });
    setShowAddJobForm(true);
    setAddJobPriorityOpen(false);
    setAddJobHiringManagerOpen(false);
  };

  const [pipelineFilters, setPipelineFilters] = useState({
    jobId: '',
    recruiter: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const [activityFilter, setActivityFilter] = useState<ActivityFilterType>('All');

  const ACTIVITY_TIMELINE_FILTERS: ActivityFilterType[] = ['All', 'Jobs', 'Candidates', 'Interviews', 'Billing', 'Notes', 'Files'];

  const [notesTagFilter, setNotesTagFilter] = useState<NoteTag | 'All'>('All');
  const NOTE_TAG_OPTIONS: (NoteTag | 'All')[] = ['All', 'HR', 'Finance', 'Contract', 'Feedback'];
  const [pinnedNoteIds, setPinnedNoteIds] = useState<Set<string>>(new Set());

  const [filesTypeFilter, setFilesTypeFilter] = useState<ClientFileType | 'All'>('All');
  const FILE_TYPE_OPTIONS: (ClientFileType | 'All')[] = ['All', 'NDA', 'Contract', 'SLA', 'Policy', 'Invoice', 'Job Brief'];

  const [showChangeStageForm, setShowChangeStageForm] = useState(false);
  const [changeStageDropdownOpen, setChangeStageDropdownOpen] = useState(false);
  const [changeStageReasonDropdownOpen, setChangeStageReasonDropdownOpen] = useState(false);
  const [changeStageForm, setChangeStageForm] = useState<{ stage: ClientStage; reason: string }>({ stage: 'Active', reason: '' });

  const CLIENT_STAGES: ClientStage[] = ['Prospect', 'Active', 'On Hold', 'Inactive'];
  const STAGE_REASONS = ['Hiring paused', 'No response', 'Contract ended', 'Payment issue', 'Other'];
  const needsReason = changeStageForm.stage === 'On Hold' || changeStageForm.stage === 'Inactive';

  const openChangeStageForm = () => {
    setMoreMenuOpen(false);
    setChangeStageForm({ stage: client?.stage ?? 'Active', reason: '' });
    setChangeStageDropdownOpen(false);
    setChangeStageReasonDropdownOpen(false);
    setShowChangeStageForm(true);
  };

  const closeChangeStageForm = () => {
    setShowChangeStageForm(false);
    setChangeStageDropdownOpen(false);
    setChangeStageReasonDropdownOpen(false);
  };

  const [showArchiveClientForm, setShowArchiveClientForm] = useState(false);

  const openArchiveClientForm = () => {
    setMoreMenuOpen(false);
    setShowArchiveClientForm(true);
  };

  const closeArchiveClientForm = () => setShowArchiveClientForm(false);

  const [showDeleteClientForm, setShowDeleteClientForm] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const openDeleteClientForm = () => {
    setMoreMenuOpen(false);
    setDeleteConfirmName('');
    setShowDeleteClientForm(true);
  };

  const closeDeleteClientForm = () => {
    setShowDeleteClientForm(false);
    setDeleteConfirmName('');
  };

  const deleteConfirmMatches = deleteConfirmName.trim() === (client?.name ?? '');

  const [showSendMessageForm, setShowSendMessageForm] = useState(false);
  const [sendMessageChannel, setSendMessageChannel] = useState<'Email' | 'WhatsApp'>('Email');
  const [sendMessageTemplateOpen, setSendMessageTemplateOpen] = useState(false);
  const [sendMessageForm, setSendMessageForm] = useState({
    contactIds: [] as string[],
    templateId: '',
    message: '',
    attachmentNames: '',
    logAsActivity: true,
  });
  const MESSAGE_TEMPLATES = [
    { id: 'follow-up', label: 'Follow-up' },
    { id: 'placement-confirm', label: 'Placement confirmation' },
    { id: 'invoice-reminder', label: 'Invoice reminder' },
    { id: 'custom', label: 'Custom' },
  ];

  const openSendMessageForm = () => {
    setSendMessageForm({
      contactIds: [],
      templateId: '',
      message: '',
      attachmentNames: '',
      logAsActivity: true,
    });
    setSendMessageChannel('Email');
    setSendMessageTemplateOpen(false);
    setShowSendMessageForm(true);
  };

  const closeSendMessageForm = () => {
    setShowSendMessageForm(false);
    setSendMessageTemplateOpen(false);
  };

  const toggleSendMessageContact = (contactId: string) => {
    setSendMessageForm((prev) =>
      prev.contactIds.includes(contactId)
        ? { ...prev, contactIds: prev.contactIds.filter((id) => id !== contactId) }
        : { ...prev, contactIds: [...prev.contactIds, contactId] }
    );
  };

  const toggleOverviewSection = (key: string) => {
    setOverviewOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
    { id: 'contacts' as const, label: 'Contacts', icon: Users },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase },
    { id: 'pipeline' as const, label: 'Pipeline', icon: GitBranch },
    { id: 'placements' as const, label: 'Placements', icon: Award },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'activity' as const, label: 'Activity', icon: Activity },
    { id: 'notes' as const, label: 'Notes', icon: StickyNote },
    { id: 'files' as const, label: 'Files', icon: Paperclip },
  ];

  const revenue = client?.revenue ?? `$${(Number(client?.placements ?? 0) * 3.5).toFixed(1)}k`;

  return (
    <AnimatePresence>
      {client && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
          />
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-1/2 bg-white shadow-2xl z-50 pointer-events-auto border-l border-slate-200 flex flex-col"
          >
            {/* Sticky Header */}
            <div className="shrink-0 bg-white border-b border-slate-200">
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
                    <ImageWithFallback src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900 truncate">{client.name}</h2>
                    <span
                      className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${STAGE_STYLES[client.stage]}`}
                    >
                      {client.stage}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('jobs'); openAddJobForm(); }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Add Job"
                  >
                    <Briefcase size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={openSendMessageForm}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Message Client"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMoreMenuOpen((v) => !v)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {moreMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMoreMenuOpen(false)}
                          aria-hidden
                        />
                        <div className="absolute right-0 top-full mt-1 w-52 py-2 bg-white rounded-xl border border-slate-200 shadow-lg z-20">
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Edit2 size={16} /> Edit Client
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <UserPlus size={16} /> Add Contact
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <FileText size={16} /> Add Note
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Upload size={16} /> Upload File
                          </button>
                          <button
                            type="button"
                            onClick={openChangeStageForm}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            Change Stage
                          </button>
                          <button
                            type="button"
                            onClick={openArchiveClientForm}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Archive size={16} /> Archive Client
                          </button>
                          <button
                            type="button"
                            onClick={openDeleteClientForm}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Quick stats chips */}
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Briefcase size={14} className="text-slate-500" />
                  Open Jobs: {client.openJobs}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  <Award size={14} className="text-indigo-500" />
                  Placements: {client.placements}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <CreditCard size={14} className="text-emerald-500" />
                  Revenue: {revenue}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 bg-slate-50/80 border-b border-slate-200 px-4 pt-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-1 min-w-max">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px shadow-sm'
                          : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} strokeWidth={isActive ? 2.25 : 1.5} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30">
              <div className="p-5">
                {showSendMessageForm ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={closeSendMessageForm}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Back"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <h2 className="text-lg font-bold text-slate-900">Send Message</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                      {/* Channel tabs */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSendMessageChannel('Email')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sendMessageChannel === 'Email' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          <Mail size={16} />
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => setSendMessageChannel('WhatsApp')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sendMessageChannel === 'WhatsApp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </button>
                      </div>
                      {/* Select contact(s) */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select contact(s)</label>
                        <div className="rounded-xl border border-slate-200 bg-white max-h-40 overflow-y-auto">
                          {(client.contacts ?? []).length === 0 ? (
                            <p className="px-4 py-3 text-sm text-slate-500">No contacts</p>
                          ) : (
                            <ul className="py-1">
                              {(client.contacts ?? []).map((c) => (
                                <li key={c.id}>
                                  <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={sendMessageForm.contactIds.includes(c.id)}
                                      onChange={() => toggleSendMessageContact(c.id)}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                    />
                                    <span className="text-sm font-medium text-slate-900">{c.name}</span>
                                    <span className="text-xs text-slate-500">{c.designation}</span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {/* Template selector */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Template</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setSendMessageTemplateOpen((v) => !v)}
                            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <span className={sendMessageForm.templateId ? 'text-slate-900' : 'text-slate-400'}>
                              {MESSAGE_TEMPLATES.find((t) => t.id === sendMessageForm.templateId)?.label ?? 'Select template'}
                            </span>
                            <ChevronDown size={16} className="text-slate-400 shrink-0" />
                          </button>
                          {sendMessageTemplateOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setSendMessageTemplateOpen(false)} aria-hidden />
                              <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                {MESSAGE_TEMPLATES.map((t) => (
                                  <li key={t.id}>
                                    <button
                                      type="button"
                                      onClick={() => { setSendMessageForm((prev) => ({ ...prev, templateId: t.id })); setSendMessageTemplateOpen(false); }}
                                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${sendMessageForm.templateId === t.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                                    >
                                      {t.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Message editor */}
                      <div>
                        <label htmlFor="send-message-body" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                        <textarea
                          id="send-message-body"
                          value={sendMessageForm.message}
                          onChange={(e) => setSendMessageForm((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder="Type your message..."
                          rows={5}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                        />
                      </div>
                      {/* Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                        <label className="relative flex rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 cursor-pointer hover:border-slate-300 hover:bg-slate-50/80 transition-colors">
                          <input
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={(e) => setSendMessageForm((prev) => ({ ...prev, attachmentNames: Array.from(e.target.files ?? []).map((f) => f.name).join(', ') }))}
                          />
                          <div className="flex items-center justify-center gap-2 w-full">
                            <Paperclip size={18} className="text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-500">{sendMessageForm.attachmentNames || 'Click or drag files to attach'}</span>
                          </div>
                        </label>
                      </div>
                      {/* Log as activity */}
                      <div className="flex items-center justify-between">
                        <label htmlFor="send-message-log-activity" className="text-sm font-medium text-slate-700">Log as activity</label>
                        <input
                          id="send-message-log-activity"
                          type="checkbox"
                          checked={sendMessageForm.logAsActivity}
                          onChange={(e) => setSendMessageForm((prev) => ({ ...prev, logAsActivity: e.target.checked }))}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeSendMessageForm}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => { closeSendMessageForm(); onMessage?.(client.id); }}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : showChangeStageForm ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={closeChangeStageForm}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Back"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <h2 className="text-lg font-bold text-slate-900">Change Client Stage</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Client Stage</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setChangeStageDropdownOpen((v) => !v); setChangeStageReasonDropdownOpen(false); }}
                            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <span className={changeStageForm.stage ? 'text-slate-900' : 'text-slate-400'}>{changeStageForm.stage}</span>
                            <ChevronDown size={16} className="text-slate-400 shrink-0" />
                          </button>
                          {changeStageDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setChangeStageDropdownOpen(false)} aria-hidden />
                              <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                {CLIENT_STAGES.map((s) => (
                                  <li key={s}>
                                    <button
                                      type="button"
                                      onClick={() => { setChangeStageForm((prev) => ({ ...prev, stage: s, reason: s === 'On Hold' || s === 'Inactive' ? prev.reason : '' })); setChangeStageDropdownOpen(false); }}
                                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${changeStageForm.stage === s ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                                    >
                                      {s}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                      {needsReason && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reason <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => { setChangeStageReasonDropdownOpen((v) => !v); setChangeStageDropdownOpen(false); }}
                              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                              <span className={changeStageForm.reason ? 'text-slate-900' : 'text-slate-400'}>{changeStageForm.reason || 'Select reason'}</span>
                              <ChevronDown size={16} className="text-slate-400 shrink-0" />
                            </button>
                            {changeStageReasonDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setChangeStageReasonDropdownOpen(false)} aria-hidden />
                                <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                  {STAGE_REASONS.map((r) => (
                                    <li key={r}>
                                      <button
                                        type="button"
                                        onClick={() => { setChangeStageForm((prev) => ({ ...prev, reason: r })); setChangeStageReasonDropdownOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${changeStageForm.reason === r ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                                      >
                                        {r}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeChangeStageForm}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={needsReason && !changeStageForm.reason}
                        onClick={closeChangeStageForm}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Stage
                      </button>
                    </div>
                  </div>
                ) : showArchiveClientForm ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={closeArchiveClientForm}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Back"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <h2 className="text-lg font-bold text-slate-900">Archive Client</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Archiving will hide the client from active lists but retain historical data.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeArchiveClientForm}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => { closeArchiveClientForm(); /* onArchive?.(client.id); */ }}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-slate-600 rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ) : showDeleteClientForm ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={closeDeleteClientForm}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Back"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <h2 className="text-lg font-bold text-slate-900">Delete Client</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        This action permanently deletes the client and all associated records.
                      </p>
                      <div>
                        <label htmlFor="delete-confirm-name" className="block text-sm font-medium text-slate-700 mb-2">
                          Type the company name to confirm
                        </label>
                        <input
                          id="delete-confirm-name"
                          type="text"
                          value={deleteConfirmName}
                          onChange={(e) => setDeleteConfirmName(e.target.value)}
                          placeholder={client.name}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeDeleteClientForm}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!deleteConfirmMatches}
                        onClick={() => { closeDeleteClientForm(); onDelete?.(client.id); onClose(); }}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete Client
                      </button>
                    </div>
                  </div>
                ) : activeTab === 'overview' ? (
                  <div className="space-y-4">
                    {/* 1. Company Snapshot Card */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleOverviewSection('companySnapshot')}
                        className="w-full p-5 flex items-center justify-between gap-2 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Building2 size={14} className="text-slate-400" />
                          Company Snapshot
                        </h4>
                        {overviewOpen.companySnapshot ? (
                          <ChevronDown size={18} className="text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-slate-400 shrink-0" />
                        )}
                      </button>
                      {overviewOpen.companySnapshot && (
                        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                          <FieldRow label="Industry" value={client.industry} />
                          <FieldRow label="Company size" value={client.companySize ?? '—'} />
                          <FieldRow label="Locations / Hiring locations" value={client.hiringLocations ?? client.location ?? '—'} />
                          <FieldRow label="Website" value={client.website ?? '—'} href={!!client.website} />
                          <FieldRow label="LinkedIn" value={client.linkedin ?? '—'} href={!!client.linkedin} />
                          <FieldRow label="Timezone" value={client.timezone ?? '—'} />
                          <FieldRow label="Client since" value={client.clientSince ?? '—'} />
                        </div>
                      )}
                    </section>

                    {/* 2. Relationship & Ownership Card */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleOverviewSection('relationship')}
                        className="w-full p-5 flex items-center justify-between gap-2 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Users size={14} className="text-slate-400" />
                          Relationship & Ownership
                        </h4>
                        {overviewOpen.relationship ? (
                          <ChevronDown size={18} className="text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-slate-400 shrink-0" />
                        )}
                      </button>
                      {overviewOpen.relationship && (
                        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                          <div className="flex flex-col gap-0.5 py-2 border-b border-slate-100">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account manager</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <ImageWithFallback src={client.owner.avatar} alt={client.owner.name} className="w-6 h-6 rounded-full border border-slate-200" />
                              <span className="text-sm font-medium text-slate-900">{client.owner.name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5 py-2 border-b border-slate-100">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recruiter team</p>
                            <p className="text-sm font-medium text-slate-900">
                              {client.recruiterTeam?.length ? client.recruiterTeam.join(', ') : client.owner.name}
                            </p>
                          </div>
                          <FieldRow label="Client stage" value={client.stage} />
                          <FieldRow label="Priority" value={client.priority ?? '—'} />
                          <FieldRow label="SLA / Response expectations" value={client.sla ?? '—'} />
                        </div>
                      )}
                    </section>

                    {/* 3. Performance Metrics Cards */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleOverviewSection('performance')}
                        className="w-full p-5 flex items-center justify-between gap-2 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <TrendingUp size={14} className="text-slate-400" />
                          Performance metrics
                        </h4>
                        {overviewOpen.performance ? (
                          <ChevronDown size={18} className="text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-slate-400 shrink-0" />
                        )}
                      </button>
                      {overviewOpen.performance && (
                        <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open jobs</p>
                            <p className="text-lg font-bold text-slate-900 mt-0.5">{client.openJobs}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidates in progress</p>
                            <p className="text-lg font-bold text-slate-900 mt-0.5">{client.candidatesInProgress ?? client.activeCandidates}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interviews this week</p>
                            <p className="text-lg font-bold text-slate-900 mt-0.5">{client.interviewsThisWeek ?? '—'}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placements this month</p>
                            <p className="text-lg font-bold text-slate-900 mt-0.5">{client.placementsThisMonth ?? client.placements}</p>
                          </div>
                          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 col-span-2">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Revenue generated</p>
                            <p className="text-lg font-bold text-emerald-800 mt-0.5">{client.revenueGenerated ?? client.revenue ?? '—'}</p>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* 4. Client Health Widget */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleOverviewSection('health')}
                        className="w-full p-5 flex items-center justify-between gap-2 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Heart size={14} className="text-slate-400" />
                          Client health
                        </h4>
                        {overviewOpen.health ? (
                          <ChevronDown size={18} className="text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-slate-400 shrink-0" />
                        )}
                      </button>
                      {overviewOpen.health && (
                        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                          <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                            {(() => {
                              const status = client.healthStatus ?? 'Good';
                              const s = HEALTH_STYLES[status];
                              return (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                                  {status === 'Good' && '🟢 '}
                                  {status === 'Needs attention' && '🟡 '}
                                  {status === 'At risk' && '🔴 '}
                                  {s.label}
                                </span>
                              );
                            })()}
                          </div>
                          <FieldRow label="Last activity" value={client.lastActivity} />
                          <FieldRow label="Next follow-up due" value={client.nextFollowUpDue ?? '—'} />
                          <FieldRow label="Stale jobs count" value={client.staleJobsCount != null ? String(client.staleJobsCount) : '—'} />
                          <FieldRow label="Pending invoices" value={client.pendingInvoicesCount != null ? String(client.pendingInvoicesCount) : '—'} />
                          <FieldRow label="Average time-to-fill" value={client.avgTimeToFill ?? '—'} />
                        </div>
                      )}
                    </section>

                    {/* 5. Quick Actions Strip — always visible, no dropdown */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => { setActiveTab('jobs'); openAddJobForm(); }}
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all"
                        >
                          <Briefcase size={16} className="text-slate-600" />
                          Add Job Requirement
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all">
                          <UserPlus size={16} className="text-slate-600" />
                          Add Contact
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all">
                          <CalendarPlus size={16} className="text-slate-600" />
                          Schedule Meeting / Follow-up
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all">
                          <FileCheck size={16} className="text-slate-600" />
                          Upload Agreement / SLA
                        </button>
                      </div>
                    </section>
                  </div>
                ) : activeTab === 'contacts' ? (
                  showAddContactForm ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setShowAddContactForm(false)}
                          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Back to Contacts"
                        >
                          <ChevronRight size={20} className="rotate-180" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-900">Add Contact</h2>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                        <div>
                          <label htmlFor="add-contact-name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                          <input
                            id="add-contact-name"
                            type="text"
                            value={addContactForm.fullName}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="Full name"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="add-contact-designation" className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
                          <input
                            id="add-contact-designation"
                            type="text"
                            value={addContactForm.designation}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, designation: e.target.value }))}
                            placeholder="e.g. Head of Talent"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setAddContactDeptOpen((v) => !v)}
                              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                              <span className={addContactForm.department ? 'text-slate-900' : 'text-slate-400'}>
                                {addContactForm.department || 'Select department'}
                              </span>
                              <ChevronDown size={16} className="text-slate-400" />
                            </button>
                            {addContactDeptOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setAddContactDeptOpen(false)} aria-hidden />
                                <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                  {ADD_CONTACT_DEPARTMENTS.map((d) => (
                                    <li key={d}>
                                      <button
                                        type="button"
                                        onClick={() => { setAddContactForm((p) => ({ ...p, department: d })); setAddContactDeptOpen(false); }}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${addContactForm.department === d ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                                      >
                                        {d}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="add-contact-email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                          <input
                            id="add-contact-email"
                            type="email"
                            value={addContactForm.email}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="email@company.com"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="add-contact-phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                          <input
                            id="add-contact-phone"
                            type="tel"
                            value={addContactForm.phone}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="+1 (555) 000-0000"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            id="add-contact-whatsapp"
                            type="checkbox"
                            checked={addContactForm.whatsAppSameAsPhone}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, whatsAppSameAsPhone: e.target.checked }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="add-contact-whatsapp" className="text-sm font-medium text-slate-700 cursor-pointer">
                            WhatsApp same as phone
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            id="add-contact-primary"
                            type="checkbox"
                            checked={addContactForm.isPrimary}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, isPrimary: e.target.checked }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="add-contact-primary" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Primary Contact
                          </label>
                        </div>
                        <div>
                          <label htmlFor="add-contact-notes" className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                          <textarea
                            id="add-contact-notes"
                            value={addContactForm.notes}
                            onChange={(e) => setAddContactForm((p) => ({ ...p, notes: e.target.value }))}
                            placeholder="Add notes..."
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddContactForm(false)}
                          className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddContactForm(false)}
                          className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Save Contact
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="relative flex gap-0 min-h-0">
                    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-w-0 flex flex-col ${selectedContact ? 'mr-4' : ''}`}>
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacts</h4>
                        <button
                          type="button"
                          onClick={openAddContactForm}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <UserPlus size={16} />
                          Add Contact
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Primary</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last contacted</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-32">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(client.contacts ?? []).length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                                  No contacts yet. Click Add Contact to add one.
                                </td>
                              </tr>
                            ) : (
                              (client.contacts ?? []).map((contact) => (
                                <tr
                                  key={contact.id}
                                  onClick={() => setSelectedContact(contact)}
                                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                        {contact.avatar ? (
                                          <img src={contact.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                            {contact.name.charAt(0)}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                                        <p className="text-xs text-slate-500">{contact.designation}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{contact.department}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[140px]">{contact.email}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{contact.phone}</td>
                                  <td className="px-4 py-3 text-center">
                                    {contact.isPrimary ? (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600" title="Primary contact">
                                        <span className="sr-only">Primary</span>
                                        <span className="text-[10px] font-bold">✓</span>
                                      </span>
                                    ) : (
                                      <span className="inline-block w-6 h-6 rounded-full border border-slate-200 bg-white" />
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-500">{contact.lastContacted}</td>
                                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Call"><Phone size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="WhatsApp"><MessageCircle size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Email"><Mail size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit"><Edit2 size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedContact && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 320, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                          className="shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                        >
                          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{selectedContact.name}</h4>
                            <button
                              type="button"
                              onClick={() => setSelectedContact(null)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              aria-label="Close"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact info</h5>
                              <div className="space-y-1 text-sm">
                                <p className="font-medium text-slate-900">{selectedContact.designation} · {selectedContact.department}</p>
                                <p className="text-slate-600">{selectedContact.email}</p>
                                <p className="text-slate-600">{selectedContact.phone}</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred communication</h5>
                              <p className="text-sm font-medium text-slate-900">{selectedContact.preferredChannel ?? '—'}</p>
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h5>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedContact.notes || 'No notes.'}</p>
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Activity</h5>
                              <ul className="space-y-2">
                                {(selectedContact.activity ?? []).length === 0 ? (
                                  <li className="text-sm text-slate-500">No activity yet.</li>
                                ) : (
                                  (selectedContact.activity ?? []).map((a, i) => (
                                    <li key={i} className="text-sm border-l-2 border-slate-200 pl-3 py-0.5">
                                      <span className="text-slate-500">{a.date}</span>
                                      <span className="font-medium text-slate-700"> {a.type}</span>
                                      <span className="text-slate-600"> — {a.summary}</span>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  )
                ) : activeTab === 'jobs' ? (
                  showAddJobForm ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setShowAddJobForm(false)}
                          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Back to Jobs"
                        >
                          <ChevronRight size={20} className="rotate-180" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-900">Create Job</h2>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                        <div>
                          <label htmlFor="add-job-title" className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                          <input
                            id="add-job-title"
                            type="text"
                            value={addJobForm.jobTitle}
                            onChange={(e) => setAddJobForm((p) => ({ ...p, jobTitle: e.target.value }))}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="add-job-department" className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                            <input
                              id="add-job-department"
                              type="text"
                              value={addJobForm.department}
                              onChange={(e) => setAddJobForm((p) => ({ ...p, department: e.target.value }))}
                              placeholder="e.g. Engineering"
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="add-job-location" className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                            <input
                              id="add-job-location"
                              type="text"
                              value={addJobForm.location}
                              onChange={(e) => setAddJobForm((p) => ({ ...p, location: e.target.value }))}
                              placeholder="e.g. San Francisco, CA"
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="add-job-positions" className="block text-sm font-medium text-slate-700 mb-2">Number of Positions</label>
                            <input
                              id="add-job-positions"
                              type="number"
                              min={1}
                              value={addJobForm.numberOfPositions}
                              onChange={(e) => setAddJobForm((p) => ({ ...p, numberOfPositions: e.target.value }))}
                              placeholder="1"
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => { setAddJobPriorityOpen((v) => !v); setAddJobHiringManagerOpen(false); }}
                                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                              >
                                <span className={addJobForm.priority ? 'text-slate-900' : 'text-slate-400'}>{addJobForm.priority || 'Select priority'}</span>
                                <ChevronDown size={16} className="text-slate-400" />
                              </button>
                              {addJobPriorityOpen && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setAddJobPriorityOpen(false)} aria-hidden />
                                  <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                    {ADD_JOB_PRIORITIES.map((p) => (
                                      <li key={p}>
                                        <button type="button" onClick={() => { setAddJobForm((prev) => ({ ...prev, priority: p })); setAddJobPriorityOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${addJobForm.priority === p ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}>{p}</button>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Hiring Manager</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => { setAddJobHiringManagerOpen((v) => !v); setAddJobPriorityOpen(false); }}
                              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-left text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                              <span className={addJobForm.hiringManagerId ? 'text-slate-900' : 'text-slate-400'}>
                                {(client.contacts ?? []).find((c) => c.id === addJobForm.hiringManagerId)?.name ?? 'Select from contacts'}
                              </span>
                              <ChevronDown size={16} className="text-slate-400" />
                            </button>
                            {addJobHiringManagerOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setAddJobHiringManagerOpen(false)} aria-hidden />
                                <ul className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg max-h-48 overflow-y-auto">
                                  {(client.contacts ?? []).map((c) => (
                                    <li key={c.id}>
                                      <button type="button" onClick={() => { setAddJobForm((prev) => ({ ...prev, hiringManagerId: c.id })); setAddJobHiringManagerOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${addJobForm.hiringManagerId === c.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}>{c.name} · {c.designation}</button>
                                    </li>
                                  ))}
                                  {(client.contacts ?? []).length === 0 && (
                                    <li className="px-4 py-2.5 text-sm text-slate-500">No contacts</li>
                                  )}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="add-job-closure" className="block text-sm font-medium text-slate-700 mb-2">Expected Closure Date</label>
                          <input
                            id="add-job-closure"
                            type="date"
                            value={addJobForm.expectedClosureDate}
                            onChange={(e) => setAddJobForm((p) => ({ ...p, expectedClosureDate: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="add-job-description" className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                          <textarea
                            id="add-job-description"
                            value={addJobForm.jobDescription}
                            onChange={(e) => setAddJobForm((p) => ({ ...p, jobDescription: e.target.value }))}
                            placeholder="Describe the role, requirements, and responsibilities..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Upload JD file</label>
                          <label className="relative flex rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 cursor-pointer hover:border-slate-300 hover:bg-slate-50/80 transition-colors">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="sr-only"
                              id="add-job-jd"
                              onChange={(e) => setAddJobForm((p) => ({ ...p, jdFileName: e.target.files?.[0]?.name ?? '' }))}
                            />
                            <div className="flex items-center justify-center gap-2 w-full">
                              <Upload size={18} className="text-slate-400 shrink-0" />
                              <span className="text-sm text-slate-500">{addJobForm.jdFileName || 'Click or drag file to upload'}</span>
                            </div>
                          </label>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors">
                            <Sparkles size={16} className="text-amber-500" />
                            Enhance JD with AI
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddJobForm(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                          Cancel
                        </button>
                        <button type="button" onClick={() => setShowAddJobForm(false)} className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                          Create Job
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {/* Jobs overview widgets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Briefcase size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Jobs</p>
                          <p className="text-lg font-bold text-slate-900">{client.jobs?.filter((j) => j.status === 'Open').length ?? client.openJobs}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <AlertCircle size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aging Jobs</p>
                          <p className="text-lg font-bold text-slate-900">{client.jobs?.filter((j) => j.isAging).length ?? 0}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 size={16} className="text-slate-400" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">By department</p>
                        </div>
                        <div className="space-y-1.5">
                          {(() => {
                            const jobs = client.jobs ?? [];
                            const byDept = jobs.reduce<Record<string, number>>((acc, j) => {
                              acc[j.department] = (acc[j.department] ?? 0) + 1;
                              return acc;
                            }, {});
                            const max = Math.max(...Object.values(byDept), 1);
                            return Object.entries(byDept).map(([dept, count]) => (
                              <div key={dept} className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-600 w-20 truncate">{dept}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 w-5">{count}</span>
                              </div>
                            ));
                          })()}
                          {(!client.jobs || client.jobs.length === 0) && (
                            <p className="text-xs text-slate-500">No jobs</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Jobs table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jobs</h4>
                        <button
                          type="button"
                          onClick={openAddJobForm}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Briefcase size={16} />
                          Add Job
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job title</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hiring manager</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Openings</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pipeline</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-36">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(!client.jobs || client.jobs.length === 0) ? (
                              <tr>
                                <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                                  No jobs yet. Click Add Job to create one.
                                </td>
                              </tr>
                            ) : (
                              (client.jobs ?? []).map((job: ClientJob) => (
                                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-slate-900">{job.title}</p>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{job.department}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{job.location}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{job.hiringManager}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[1.5rem] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                                      {job.openings}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      {(job.pipelineStages ?? []).slice(0, 3).map((s) => (
                                        <span key={s.stage} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                                          {s.stage}: {s.count}
                                        </span>
                                      ))}
                                      {(!job.pipelineStages || job.pipelineStages.length === 0) && <span className="text-xs text-slate-400">—</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${JOB_STATUS_STYLES[job.status]}`}>
                                      {job.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-slate-500">{job.createdDate}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View job"><Eye size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Add candidates"><UserPlus size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Pause job"><Pause size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Duplicate job"><Copy size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  )
                ) : activeTab === 'pipeline' ? (() => {
                  const baseCandidates = client.pipelineCandidates ?? [];
                  let filteredCandidates: ClientPipelineCandidate[] = baseCandidates;
                  if (pipelineFilters.jobId) filteredCandidates = filteredCandidates.filter((c) => c.jobId === pipelineFilters.jobId);
                  if (pipelineFilters.recruiter) filteredCandidates = filteredCandidates.filter((c) => c.assignedRecruiter === pipelineFilters.recruiter);
                  if (pipelineFilters.status) filteredCandidates = filteredCandidates.filter((c) => c.currentStage === pipelineFilters.status);
                  return (
                  <div className="space-y-4">
                    {/* Filters — row 1: Job, Recruiter, Status; row 2: Start date to End date */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <select
                            value={pipelineFilters.jobId}
                            onChange={(e) => setPipelineFilters((f) => ({ ...f, jobId: e.target.value }))}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none pr-8"
                          >
                            <option value="">All Jobs</option>
                            {(client.jobs ?? []).map((j) => (
                              <option key={j.id} value={j.id}>{j.title}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select
                            value={pipelineFilters.recruiter}
                            onChange={(e) => setPipelineFilters((f) => ({ ...f, recruiter: e.target.value }))}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none pr-8"
                          >
                            <option value="">All Recruiters</option>
                            {(client.recruiterTeam ?? [client.owner.name]).map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <select
                            value={pipelineFilters.status}
                            onChange={(e) => setPipelineFilters((f) => ({ ...f, status: e.target.value }))}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none pr-8"
                          >
                            <option value="">All Status</option>
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="date"
                          value={pipelineFilters.dateFrom}
                          onChange={(e) => setPipelineFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          title="Start date"
                        />
                        <span className="text-slate-400 text-sm">to</span>
                        <input
                          type="date"
                          value={pipelineFilters.dateTo}
                          onChange={(e) => setPipelineFilters((f) => ({ ...f, dateTo: e.target.value }))}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          title="End date"
                        />
                      </div>
                    </div>
                    {/* Kanban pipeline — horizontal scroll when needed, scrollbar hidden; scroll only inside each stage card */}
                    <div className="flex gap-4 pb-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {PIPELINE_STAGES.map((stage) => {
                        const candidates = filteredCandidates.filter((c) => c.currentStage === stage);
                        const style = PIPELINE_STAGE_STYLES[stage];
                        return (
                          <div
                            key={stage}
                            className={`shrink-0 w-56 h-[420px] rounded-xl border-2 ${style.border} bg-slate-50/50 flex flex-col overflow-hidden`}
                          >
                            <div className={`shrink-0 px-3 py-2.5 border-b ${style.border} ${style.header}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider">{stage}</span>
                                <span className="text-xs font-bold rounded-full bg-white/80 px-1.5 py-0.5">{candidates.length}</span>
                              </div>
                            </div>
                            {/* Scroll only inside this stage card — candidates list */}
                            <div className="flex-1 min-h-0 p-2 overflow-y-auto overflow-x-hidden space-y-2">
                              {candidates.length === 0 ? (
                                <p className="text-xs text-slate-400 py-4 text-center">No candidates</p>
                              ) : (
                                candidates.map((c) => (
                                  <div
                                    key={c.id}
                                    className="bg-white rounded-lg border border-slate-200 shadow-sm p-2.5 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                        {c.avatar ? (
                                          <ImageWithFallback src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={16} /></div>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                          {c.matchScore != null && (
                                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1 rounded">{c.matchScore}%</span>
                                          )}
                                          <span className="text-[10px] text-slate-500">{c.nextActionDate}</span>
                                        </div>
                                        {c.status && (
                                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{c.status}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Open profile"><User size={12} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Move stage"><ArrowRight size={12} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Schedule interview"><Calendar size={12} /></button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })() : activeTab === 'placements' ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placements</h4>
                        <p className="text-xs text-slate-500">{(client.placementList ?? []).length} placements</p>
                      </div>
                      <div className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate name</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job / role</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placement date</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recruiter</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fee type</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Warranty (days left)</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-40">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(!client.placementList || client.placementList.length === 0) ? (
                              <tr>
                                <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                                  No placements yet.
                                </td>
                              </tr>
                            ) : (
                              (client.placementList ?? []).map((pl) => (
                                <tr key={pl.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-slate-900">{pl.candidateName}</p>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{pl.jobRole}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{pl.placementDate}</td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{pl.recruiter}</td>
                                  <td className="px-4 py-3">
                                    <span className="text-xs font-medium text-slate-600">{pl.feeType}</span>
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{pl.amount}</td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                                      {pl.warrantyDaysLeft}d
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${PLACEMENT_STATUS_STYLES[pl.status]}`}>
                                      {pl.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View placement"><Eye size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Generate invoice"><FileText size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Mark joined"><UserCheck size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Warranty claim"><Shield size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'billing' ? (
                  <div className="space-y-4">
                    {/* Finance summary cards — same soft card layout as Jobs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <TrendingUp size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total revenue</p>
                          <p className="text-lg font-bold text-slate-900">{client.billingTotalRevenue ?? client.revenue ?? '—'}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Clock size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outstanding</p>
                          <p className="text-lg font-bold text-slate-900">{client.billingOutstanding ?? '—'}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <DollarSign size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid amount</p>
                          <p className="text-lg font-bold text-slate-900">{client.billingPaid ?? '—'}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overdue invoices</p>
                          <p className="text-lg font-bold text-slate-900">{client.billingOverdueCount ?? 0}</p>
                        </div>
                      </div>
                    </div>
                    {/* Invoices table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoices</h4>
                        <p className="text-xs text-slate-500">{(client.invoiceList ?? []).length} invoices</p>
                      </div>
                      <div className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoice #</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due date</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-44">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(!client.invoiceList || client.invoiceList.length === 0) ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                                  No invoices yet.
                                </td>
                              </tr>
                            ) : (
                              (client.invoiceList ?? []).map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{inv.date}</td>
                                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{inv.amount}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${INVOICE_STATUS_STYLES[inv.status]}`}>
                                      {inv.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{inv.dueDate}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View invoice"><Eye size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Download PDF"><Download size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Send reminder"><Send size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Record payment"><DollarSign size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Add credit note"><FilePlus size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : activeTab === 'activity' ? (() => {
                  const activities = (client.activityList ?? []).filter(
                    (a) => activityFilter === 'All' || a.category === activityFilter
                  );
                  const CategoryIcon = ({ category }: { category: ClientActivityItem['category'] }) => {
                    switch (category) {
                      case 'Jobs': return <Briefcase size={16} className="text-blue-600" />;
                      case 'Candidates': return <User size={16} className="text-emerald-600" />;
                      case 'Interviews': return <Calendar size={16} className="text-amber-600" />;
                      case 'Billing': return <CreditCard size={16} className="text-violet-600" />;
                      case 'Notes': return <StickyNote size={16} className="text-slate-600" />;
                      case 'Files': return <Paperclip size={16} className="text-slate-600" />;
                      default: return <Activity size={16} className="text-slate-500" />;
                    }
                  };
                  return (
                  <div className="space-y-4">
                    {/* Timeline filters — same soft card layout as Billing */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {ACTIVITY_TIMELINE_FILTERS.map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setActivityFilter(f)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activityFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Vertical timeline */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity timeline</h4>
                        <p className="text-xs text-slate-500">{activities.length} events</p>
                      </div>
                      <div className="p-4 max-h-[420px] overflow-y-auto">
                        {activities.length === 0 ? (
                          <p className="py-8 text-center text-sm text-slate-500">No activity for this filter.</p>
                        ) : (
                          <div className="relative border-l-2 border-slate-200 pl-6 space-y-0">
                            {activities.map((item, idx) => (
                              <div key={item.id} className="relative pb-6 last:pb-0">
                                {/* Timeline dot + icon */}
                                <div className={`absolute -left-[1.625rem] top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${ACTIVITY_CATEGORY_BG[item.category]}`}>
                                  <CategoryIcon category={item.category} />
                                </div>
                                {/* Event card */}
                                <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3 hover:border-slate-300 transition-colors">
                                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                  {item.description && <p className="text-xs text-slate-600 mt-1">{item.description}</p>}
                                  <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                                    <div className="flex items-center gap-2 min-w-0">
                                      {item.user.avatar ? (
                                        <ImageWithFallback src={item.user.avatar} alt={item.user.name} className="w-6 h-6 rounded-full border border-slate-200 shrink-0" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0"><User size={12} className="text-slate-500" /></div>
                                      )}
                                      <span className="text-xs font-medium text-slate-700 truncate">{item.user.name}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 shrink-0">{item.timestamp}</span>
                                  </div>
                                  {item.relatedLabel && (
                                    <button type="button" className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                      {item.relatedLabel}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })() : activeTab === 'notes' ? (() => {
                  const allNotes = client.notesList ?? [];
                  const filteredNotes = notesTagFilter === 'All'
                    ? allNotes
                    : allNotes.filter((n) => n.tags.includes(notesTagFilter));
                  const isPinned = (n: ClientNote) => n.isPinned || pinnedNoteIds.has(n.id);
                  const sortedNotes = [...filteredNotes].sort((a, b) => (isPinned(b) ? 1 : 0) - (isPinned(a) ? 1 : 0));
                  const togglePin = (id: string) => setPinnedNoteIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                  return (
                  <div className="space-y-4">
                    {/* Top bar: Add Note + tag filters — same layout as Activity */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <StickyNote size={16} />
                          Add Note
                        </button>
                        <div className="flex flex-wrap items-center gap-2">
                          {NOTE_TAG_OPTIONS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setNotesTagFilter(tag)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${notesTagFilter === tag ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Notes list — card-based */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
                        <p className="text-xs text-slate-500">{sortedNotes.length} notes</p>
                      </div>
                      <div className="p-4 max-h-[420px] overflow-y-auto space-y-3">
                        {sortedNotes.length === 0 ? (
                          <p className="py-8 text-center text-sm text-slate-500">No notes for this filter.</p>
                        ) : (
                          sortedNotes.map((note) => (
                            <div
                              key={note.id}
                              className={`rounded-xl border p-3 transition-colors ${isPinned(note) ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-slate-50/80 hover:border-slate-300'}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-900 flex-1 min-w-0">{note.title}</p>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => togglePin(note.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${isPinned(note) ? 'text-amber-600 bg-amber-100 hover:bg-amber-200' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                                    title={isPinned(note) ? 'Unpin' : 'Pin note'}
                                  >
                                    <Pin size={14} className={isPinned(note) ? 'fill-current' : ''} />
                                  </button>
                                  <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil size={14} /></button>
                                  <button type="button" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </div>
                              {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {note.tags.map((t) => (
                                    <span key={t} className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${NOTE_TAG_STYLES[t]}`}>
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {note.content && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{note.content}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                {note.createdBy.avatar ? (
                                  <ImageWithFallback src={note.createdBy.avatar} alt={note.createdBy.name} className="w-5 h-5 rounded-full border border-slate-200 shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0"><User size={10} className="text-slate-500" /></div>
                                )}
                                <span className="text-[11px] font-medium text-slate-600">{note.createdBy.name}</span>
                                <span className="text-[11px] text-slate-400">·</span>
                                <span className="text-[11px] text-slate-500">{note.createdAt}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })() : activeTab === 'files' ? (() => {
                  const allFiles = client.fileList ?? [];
                  const filteredFiles = filesTypeFilter === 'All'
                    ? allFiles
                    : allFiles.filter((f) => f.fileType === filesTypeFilter);
                  const FileTypeIcon = ({ type }: { type: ClientFileType }) => {
                    switch (type) {
                      case 'NDA': return <Shield size={14} className="text-slate-600 shrink-0" />;
                      case 'Contract': return <FileText size={14} className="text-blue-600 shrink-0" />;
                      case 'SLA': return <FileCheck size={14} className="text-emerald-600 shrink-0" />;
                      case 'Policy': return <FileText size={14} className="text-amber-600 shrink-0" />;
                      case 'Invoice': return <Receipt size={14} className="text-violet-600 shrink-0" />;
                      case 'Job Brief': return <Briefcase size={14} className="text-indigo-600 shrink-0" />;
                      default: return <Paperclip size={14} className="text-slate-500 shrink-0" />;
                    }
                  };
                  return (
                  <div className="space-y-4">
                    {/* Top bar: Upload File + type filters — same layout as Activity tab */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload size={16} />
                          Upload File
                        </button>
                        <div className="flex flex-wrap items-center gap-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                          {FILE_TYPE_OPTIONS.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFilesTypeFilter(type)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${filesTypeFilter === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Files table — clean document table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Files</h4>
                        <p className="text-xs text-slate-500">{filteredFiles.length} files</p>
                      </div>
                      <div className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">File name</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Uploaded by</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upload date</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right w-32">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredFiles.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                                  No files for this type.
                                </td>
                              </tr>
                            ) : (
                              filteredFiles.map((file) => (
                                <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.fileName}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${FILE_TYPE_BADGE_STYLES[file.fileType]}`}>
                                      <FileTypeIcon type={file.fileType} />
                                      {file.fileType}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      {file.uploadedBy.avatar ? (
                                        <ImageWithFallback src={file.uploadedBy.avatar} alt={file.uploadedBy.name} className="w-6 h-6 rounded-full border border-slate-200 shrink-0" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0"><User size={12} className="text-slate-500" /></div>
                                      )}
                                      <span className="text-sm text-slate-600 truncate">{file.uploadedBy.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">{file.uploadDate}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download"><Download size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Preview"><Eye size={14} /></button>
                                      <button type="button" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  );
                })() : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
