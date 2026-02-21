import React from 'react';
import { MoreHorizontal, Eye, Briefcase, Mail, ChevronDown, ArrowUpDown, Check } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const clients = [
  {
    id: 1,
    name: 'TechFlow Systems',
    industry: 'Software Engineering',
    location: 'San Francisco, CA',
    openJobs: 12,
    activeCandidates: 45,
    placements: 8,
    stage: 'Active',
    owner: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbiUyMGF2YXRhcnxlbnwxfHx8fDE3NzAzNjIzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    lastActivity: '2 hours ago',
    logo: 'https://images.unsplash.com/photo-1760037028517-e5cc6e3ebd3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2glMjBsb2dvJTIwaWNvbiUyMGJsdWV8ZW58MXx8fHwxNzcwMjY3NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    name: 'Stripe Payments',
    industry: 'Fintech',
    location: 'Dublin, IE',
    openJobs: 5,
    activeCandidates: 18,
    placements: 3,
    stage: 'Prospect',
    owner: { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1589220286904-3dcef62c68ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFuJTIwYXZhdGFyfGVufDF8fHx8MTc3MDM2MjM1NHww&ixlib=rb-4.1.0&q=80&w=1080' },
    lastActivity: 'Yesterday',
    logo: 'https://images.unsplash.com/photo-1643299397136-a6cf89431e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nbyUyMGljb24lMjB0ZWNoJTIwc3RhcnR1cHxlbnwxfHx8fDE3NzAzNzMxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    name: 'GreenEnergy Co.',
    industry: 'Renewables',
    location: 'Austin, TX',
    openJobs: 8,
    activeCandidates: 22,
    placements: 5,
    stage: 'On Hold',
    owner: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1622169804256-0eb6873ff441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbiUyMGF2YXRhcnxlbnwxfHx8fDE3NzAzNjIzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    lastActivity: '3 days ago',
    logo: 'https://images.unsplash.com/photo-1760037035212-216095656f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBsb2dvJTIwZGVzaWduJTIwdGVjaHxlbnwxfHx8fDE3NzAzNzMxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    name: 'Designers Inc.',
    industry: 'Creative Agency',
    location: 'London, UK',
    openJobs: 3,
    activeCandidates: 12,
    placements: 12,
    stage: 'Active',
    owner: { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUymJ1c2luZXNzfGVufDF8fHx8MTc3MDM1NDM1MHww&ixlib=rb-4.1.0&q=80&w=1080' },
    lastActivity: '1 hour ago',
    logo: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcwMzI1ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 5,
    name: 'BioGen Lab',
    industry: 'Healthcare',
    location: 'Boston, MA',
    openJobs: 15,
    activeCandidates: 60,
    placements: 2,
    stage: 'Active',
    owner: { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1589220286904-3dcef62c68ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFuJTIwYXZhdGFyfGVufDF8fHx8MTc3MDM2MjM1NHww&ixlib=rb-4.1.0&q=80&w=1080' },
    lastActivity: 'Just now',
    logo: 'https://images.unsplash.com/photo-1760037028517-e5cc6e3ebd3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2glMjBsb2dvJTIwaWNvbiUyMGJsdWV8ZW58MXx8fHwxNzcwMjY3NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

const stageColors = {
  'Active': 'bg-emerald-100 text-emerald-700',
  'Prospect': 'bg-blue-100 text-blue-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  'Inactive': 'bg-slate-100 text-slate-700',
};

interface ClientTableProps {
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

// Custom Checkbox Component for better design tool compatibility
const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
      checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
    }`}
  >
    {checked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
  </div>
);

export function ClientTable({ selectedIds, onSelectionChange }: ClientTableProps) {
  const toggleSelectAll = () => {
    if (selectedIds.length === clients.length) {
      onSelectionChange([]);
    } else {
      const allIds = clients.map(c => c.id);
      onSelectionChange(allIds);
    }
  };

  const toggleSelect = (id: number) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 w-10">
                <CustomCheckbox 
                  checked={selectedIds.length === clients.length && clients.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  Client Name <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Open Jobs</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Candidates</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Placements</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Owner</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr 
                key={client.id} 
                className={`hover:bg-blue-50/50 transition-colors group ${selectedIds.includes(client.id) ? 'bg-blue-50/80' : ''}`}
              >
                <td className="px-4 py-4">
                  <CustomCheckbox 
                    checked={selectedIds.includes(client.id)}
                    onChange={() => toggleSelect(client.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-white">
                      <ImageWithFallback src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{client.name}</div>
                      <div className="text-xs text-slate-500">ID: CL-100{client.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{client.industry}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{client.location}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {client.openJobs}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {client.activeCandidates}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {client.placements}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stageColors[client.stage as keyof typeof stageColors] || 'bg-slate-100 text-slate-600'}`}>
                    {client.stage}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ImageWithFallback src={client.owner.avatar} alt={client.owner.name} className="w-6 h-6 rounded-full border border-slate-200" />
                    <span className="text-xs font-medium text-slate-700">{client.owner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500">{client.lastActivity}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-100">
                    <button className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-all" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-md text-slate-400 hover:text-emerald-600 transition-all" title="Create Job">
                      <Briefcase className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-all" title="Email Client">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white shadow-sm border border-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-500">
        <div>Showing 5 of 124 clients</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-blue-600 text-white font-medium">1</button>
            <button className="w-8 h-8 rounded hover:bg-slate-50 transition-colors">2</button>
            <button className="w-8 h-8 rounded hover:bg-slate-50 transition-colors">3</button>
          </div>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
