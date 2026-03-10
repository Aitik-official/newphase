'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Pencil,
  LayoutGrid,
  Activity,
  CheckSquare,
  Calendar,
  Users2,
  Phone,
  Mail,
  FileText,
  Clock,
  MoreVertical,
  MessageSquare,
  Paperclip,
  Trash2,
  ExternalLink,
  Plus,
  AlertCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { TaskSLAAlertBadge, TaskSLAAlertsPanel, getDaysOverdue } from '../TaskSLAAlerts';
import { ImageWithFallback } from '../ImageWithFallback';
import { TaskForm } from '../TaskForm';
import { TaskActivityLog } from '../TaskActivityLog';
import { TaskCommunicationHistory } from '../TaskCommunicationHistory';
import { CandidateInteractionLogs } from '../CandidateInteractionLogs';
import { AITaskSuggestionsPanel } from '../AITaskSuggestionsPanel';
import {
  type TaskRelatedTo,
  type TaskPriority,
  type RelatedEntity,
  type TaskFormValues,
  type AITaskSuggestion,
  MOCK_ASSIGNEES,
  MOCK_CANDIDATES,
  MOCK_JOBS,
  MOCK_CLIENTS,
  MOCK_INTERVIEWS,
} from '../../app/Task&Activites/types';

export type TaskType = 'Call' | 'Email' | 'Interview' | 'Follow-up' | 'Meeting' | 'Note';
export type TaskStatus = 'Pending' | 'Completed' | 'Overdue';

export interface TaskAttachment {
  name: string;
  url?: string;
}

export interface TaskForDrawer {
  id: string;
  title: string;
  type: TaskType;
  relatedTo: { id: string; name: string; type: TaskRelatedTo };
  dueDate: string;
  time: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: { name: string; avatar: string };
  description?: string;
  reminder?: string;
  lastUpdated?: { by: string; at: string };
  createdBy?: { name: string; at: string };
  notes?: string[];
  attachments?: TaskAttachment[];
}

export interface TaskActivityItem {
  id: string;
  type: TaskType;
  note: string;
  timestamp: string;
  recruiter: string;
}

export interface TaskDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'detail' | 'edit';
  task: TaskForDrawer | null;
  /** Legacy note-style activities (optional) */
  activities?: TaskActivityItem[];
  /** Audit-style activity log events for Activity tab */
  activityEvents?: import('../app/Task&Activites/types').TaskActivityEvent[];
  /** Communication history for Communication tab */
  communicationEntries?: import('../app/Task&Activites/types').TaskCommunicationEntry[];
  /** Candidate interaction logs for Communication tab (when task is related to Candidate) */
  candidateInteractionEntries?: import('../app/Task&Activites/types').CandidateInteractionEntry[];
  /** When opening in create mode, optional prefill for the form (e.g. from AI suggestion) */
  createTaskPrefill?: Partial<TaskFormValues> | null;
  /** AI task suggestions shown in the Suggestions tab (detail mode) */
  aiSuggestions?: AITaskSuggestion[];
  /** Called when user clicks Create Task on a suggestion — parent should set prefill and switch to create mode */
  onCreateTaskFromSuggestion?: (suggestion: AITaskSuggestion) => void;
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  /** Called when user clicks Edit from task detail view — parent should set mode to 'edit' */
  onRequestEdit?: () => void;
  /** Called when exiting edit (Cancel or after Save) — parent should set mode to 'detail' */
  onExitEdit?: () => void;
  /** Called when Mark Completed is clicked */
  onMarkCompleted?: (taskId: string) => void;
  /** Called when Delete Task is clicked */
  onDelete?: (taskId: string) => void;
  /** Called when related entity card is clicked (e.g. navigate to candidate profile) */
  onRelatedEntityClick?: (entity: { id: string; name: string; type: TaskRelatedTo }) => void;
  /** Optional loading state when fetching task by id */
  isLoading?: boolean;
}

const TaskTypeIcon = ({ type }: { type: TaskType }) => {
  const icons = { Call: Phone, Email: Mail, Interview: Users2, 'Follow-up': Clock, Meeting: Calendar, Note: FileText };
  const Icon = icons[type];
  return <Icon size={16} className="text-slate-500" />;
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-700 border-slate-200',
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: 'bg-slate-100 text-slate-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Overdue: 'bg-red-100 text-red-700',
};

function getEntitiesForRelatedTo(relatedTo: TaskRelatedTo): RelatedEntity[] {
  switch (relatedTo) {
    case 'Candidate': return MOCK_CANDIDATES;
    case 'Job': return MOCK_JOBS;
    case 'Client': return MOCK_CLIENTS;
    case 'Interview': return MOCK_INTERVIEWS;
    default: return [];
  }
}

/** Map drawer task to form values for edit mode */
function taskToFormValues(t: TaskForDrawer): TaskFormValues {
  const assigneeId = MOCK_ASSIGNEES.find((u) => u.name === t.owner.name)?.id ?? '';
  const statusMap = { Pending: 'Pending' as const, Completed: 'Completed' as const, Overdue: 'Pending' as const };
  return {
    title: t.title,
    description: t.description ?? '',
    relatedTo: t.relatedTo.type,
    relatedEntityId: t.relatedTo.id,
    assigneeId,
    priority: t.priority,
    dueDate: t.dueDate,
    reminder: t.reminder ?? '',
    attachmentNames: '',
    notifyAssignee: true,
    status: statusMap[t.status],
  };
}

const CREATE_FORM_INITIAL: TaskFormValues = {
  title: '',
  description: '',
  relatedTo: '',
  relatedEntityId: '',
  assigneeId: '',
  priority: '',
  dueDate: '',
  reminder: '',
  attachmentNames: '',
  notifyAssignee: true,
};

export function TaskDetailsDrawer({
  isOpen,
  onClose,
  mode,
  task,
  activities = [],
  activityEvents = [],
  communicationEntries = [],
  candidateInteractionEntries = [],
  createTaskPrefill = null,
  aiSuggestions = [],
  onCreateTaskFromSuggestion,
  onCreateSuccess,
  onUpdateSuccess,
  onRequestEdit,
  onExitEdit,
  onMarkCompleted,
  onDelete,
  onRelatedEntityClick,
  isLoading = false,
}: TaskDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'communication' | 'alerts' | 'suggestions'>('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [createForm, setCreateForm] = useState<TaskFormValues>(CREATE_FORM_INITIAL);
  const [editForm, setEditForm] = useState<TaskFormValues>(CREATE_FORM_INITIAL);
  const [isEditDirty, setIsEditDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<'exit_edit' | 'close' | null>(null);

  // When entering edit mode, prefill from task
  useEffect(() => {
    if (mode === 'edit' && task) {
      setEditForm(taskToFormValues(task));
      setIsEditDirty(false);
    }
  }, [mode, task?.id]);

  // When opening in create mode: apply prefill from AI suggestion or reset form
  useEffect(() => {
    if (!isOpen || mode !== 'create') return;
    if (createTaskPrefill && Object.keys(createTaskPrefill).length > 0) {
      setCreateForm((prev) => ({ ...CREATE_FORM_INITIAL, ...createTaskPrefill }));
    } else {
      setCreateForm(CREATE_FORM_INITIAL);
    }
  }, [isOpen, mode, createTaskPrefill]);

  const resetCreateForm = () => setCreateForm(CREATE_FORM_INITIAL);

  const handleClose = () => {
    if (mode === 'edit' && isEditDirty) {
      setPendingCloseAction('close');
      setShowCloseConfirm(true);
      return;
    }
    if (mode === 'create') resetCreateForm();
    onClose();
  };

  const handleConfirmCloseOrExit = () => {
    if (pendingCloseAction === 'exit_edit') onExitEdit?.();
    if (pendingCloseAction === 'close') onClose();
    setShowCloseConfirm(false);
    setPendingCloseAction(null);
    setIsEditDirty(false);
  };

  const handleCreateTask = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Task created successfully');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onCreateSuccess?.();
        handleClose();
      }, 2000);
    }, 600);
  };

  const handleSaveTask = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Task updated successfully');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onUpdateSuccess?.();
        onExitEdit?.(); // switch back to detail view
      }, 2000);
    }, 600);
  };

  const handleCancelEdit = () => {
    if (isEditDirty) {
      setPendingCloseAction('exit_edit');
      setShowCloseConfirm(true);
      return;
    }
    onExitEdit?.();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
      />
      <motion.div
        key="panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-1/2 max-w-2xl bg-white shadow-2xl z-50 pointer-events-auto border-l border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 p-5 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {mode === 'detail' && task ? (
              <>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TASK DETAILS</p>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5 truncate">{task.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[task.status]}`}>{task.status}</span>
                  <TaskSLAAlertBadge dueDate={task.dueDate} status={task.status} variant="header" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-900">
                  {mode === 'create' && 'Create New Task'}
                  {mode === 'edit' && 'Edit Task'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'create' && 'Add a follow-up or operational task'}
                  {mode === 'edit' && 'Update task details and assignment'}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {mode === 'detail' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu((v) => !v)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="More actions"
                >
                  <MoreVertical size={20} />
                </button>
                {showMoreMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} aria-hidden />
                    <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20">
                      <button type="button" onClick={() => { onRequestEdit?.(); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Pencil size={14} /> Edit Task
                      </button>
                      <button type="button" onClick={() => { task && onMarkCompleted?.(task.id); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <CheckSquare size={14} /> Mark Completed
                      </button>
                      <button type="button" onClick={() => { task && onDelete?.(task.id); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={14} /> Delete Task
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {mode === 'create' ? (
          <TaskForm
            mode="create"
            values={createForm}
            onChange={setCreateForm}
            onSubmit={handleCreateTask}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        ) : mode === 'edit' && task ? (
          <TaskForm
            mode="edit"
            values={editForm}
            initialValues={taskToFormValues(task)}
            onChange={setEditForm}
            onSubmit={handleSaveTask}
            onCancel={handleCancelEdit}
            isSubmitting={isSaving}
            lastUpdated={task.lastUpdated ?? { by: task.owner.name, at: 'Feb 12, 10:45 AM' }}
            onDirtyChange={setIsEditDirty}
          />
        ) : (
          /* Task Detail — full layout: banners, tabs Overview | Activity | Communication, sticky footer */
          <>
            {task && (
              <>
                {/* Overdue / Completed banners */}
                {task.status === 'Overdue' && (
                  <div className="shrink-0 flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-red-800">
                    <AlertCircle size={18} className="shrink-0" />
                    <span className="text-sm font-medium">This task is overdue.</span>
                  </div>
                )}
                {task.status === 'Completed' && (
                  <div className="shrink-0 flex items-center gap-2 px-5 py-3 bg-emerald-50 border-b border-emerald-100 text-emerald-800">
                    <CheckSquare size={18} className="shrink-0" />
                    <span className="text-sm font-medium">This task is completed.</span>
                  </div>
                )}
              </>
            )}

            {isLoading ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-2/3" />
                <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            ) : (
              <>
                <div className="shrink-0 bg-slate-50/80 border-b border-slate-200 px-4 pt-1">
                  <div className="flex gap-1 min-w-max overflow-x-auto no-scrollbar">
                    {[
                      { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
                      { id: 'activity' as const, label: 'Activity', icon: Activity },
                      { id: 'communication' as const, label: 'Communication', icon: MessageSquare },
                      { id: 'alerts' as const, label: 'SLA Alerts', icon: AlertTriangle },
                      { id: 'suggestions' as const, label: 'AI Suggestions', icon: Sparkles },
                    ].map((tab) => {
                      const isActive = activeTab === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                            isActive ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px shadow-sm' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} strokeWidth={isActive ? 2.25 : 1.5} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/30 p-5">
                  {task && activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Task Information Section */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned To</p>
                            <div className="flex items-center gap-2 mt-1">
                              <ImageWithFallback src={task.owner.avatar} alt="" className="w-6 h-6 rounded-full border border-slate-200" />
                              <span className="text-sm font-medium text-slate-900">{task.owner.name}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</p>
                            <p className="text-sm font-medium text-slate-900 mt-1">{task.priority}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                            <p className="text-sm font-medium text-slate-900 mt-1">{task.dueDate} {task.time && `· ${task.time}`}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                            <p className="text-sm font-medium text-slate-900 mt-1">{task.status}</p>
                          </div>
                          {task.reminder && (
                            <div className="col-span-2">
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reminder</p>
                              <p className="text-sm font-medium text-slate-900 mt-1">{task.reminder}</p>
                            </div>
                          )}
                          {task.createdBy && (
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created By</p>
                              <p className="text-sm font-medium text-slate-900 mt-1">{task.createdBy.name} · {task.createdBy.at}</p>
                            </div>
                          )}
                          {task.lastUpdated && (
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</p>
                              <p className="text-sm font-medium text-slate-900 mt-1">{task.lastUpdated.by} · {task.lastUpdated.at}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Related Entity Card — clickable */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Related {task.relatedTo.type}</h4>
                        <button
                          type="button"
                          onClick={() => onRelatedEntityClick?.(task.relatedTo)}
                          className="w-full flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left group"
                        >
                          <span className="text-sm font-medium text-slate-900">{task.relatedTo.name}</span>
                          <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </button>
                        <p className="text-[11px] text-slate-500 mt-1">Click to open {task.relatedTo.type.toLowerCase()} profile</p>
                      </div>

                      {task.description && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{task.description}</p>
                        </div>
                      )}

                      {/* Notes Section */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
                          <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                            <Plus size={14} /> Add Note
                          </button>
                        </div>
                        {task.notes && task.notes.length > 0 ? (
                          <div className="space-y-2">
                            {task.notes.map((note, i) => (
                              <p key={i} className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100">{note}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No notes yet.</p>
                        )}
                      </div>

                      {/* Attachments */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attachments</h4>
                        {task.attachments && task.attachments.length > 0 ? (
                          <ul className="space-y-2">
                            {task.attachments.map((att, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                <Paperclip size={14} className="text-slate-400 shrink-0" />
                                <span>{att.name}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No attachments.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {task && activeTab === 'activity' && (
                    <TaskActivityLog events={activityEvents} />
                  )}

                  {task && activeTab === 'communication' && (
                    <div className="space-y-6">
                      <TaskCommunicationHistory entries={communicationEntries} />
                      {task.relatedTo?.type === 'Candidate' && candidateInteractionEntries.length > 0 && (
                        <CandidateInteractionLogs entries={candidateInteractionEntries} />
                      )}
                    </div>
                  )}

                  {task && activeTab === 'alerts' && (
                    <div className="space-y-4">
                      {getDaysOverdue(task.dueDate) > 0 && task.status !== 'Completed' ? (
                        <TaskSLAAlertsPanel
                          tasks={[{ id: task.id, title: task.title, dueDate: task.dueDate, status: task.status }]}
                          showAITip
                        />
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                          <AlertTriangle size={32} className="mx-auto text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-600">No SLA alert for this task.</p>
                          <p className="text-xs text-slate-500 mt-1">This task is not overdue.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {task && activeTab === 'suggestions' && (
                    <div className="space-y-4">
                      {aiSuggestions.length > 0 ? (
                        <AITaskSuggestionsPanel
                          suggestions={aiSuggestions}
                          onCreateTask={onCreateTaskFromSuggestion}
                        />
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                          <Sparkles size={32} className="mx-auto text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-600">No AI suggestions right now.</p>
                          <p className="text-xs text-slate-500 mt-1">Suggestions will appear here based on inactivity and pending follow-ups.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sticky footer actions */}
                {task && (
                  <div className="shrink-0 border-t border-slate-200 bg-white p-4 flex flex-wrap items-center justify-end gap-3">
                    <button type="button" onClick={onRequestEdit} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                      <Pencil size={14} /> Edit Task
                    </button>
                    <button type="button" onClick={() => onMarkCompleted?.(task.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700">
                      <CheckSquare size={14} /> Mark Completed
                    </button>
                    <button type="button" onClick={() => onDelete?.(task.id)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100">
                      <Trash2 size={14} /> Delete Task
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Discard unsaved changes confirm */}
        {showCloseConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-5 max-w-sm w-full">
              <p className="text-sm font-medium text-slate-900 mb-1">Discard unsaved changes?</p>
              <p className="text-xs text-slate-500 mb-4">Your changes will be lost.</p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => { setShowCloseConfirm(false); setPendingCloseAction(null); }} className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={handleConfirmCloseOrExit} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700">Discard</button>
              </div>
            </div>
          </div>
        )}

        {/* Success toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-6 right-6 z-[60] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <CheckSquare size={18} />
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
