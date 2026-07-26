import { useState } from 'react'
import {
  X, Building2, MapPin, Calendar, DollarSign,
  ExternalLink, User, FileText, Pencil, Trash2, Sparkles,
} from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import ApplicationForm from './ApplicationForm.jsx'
import AIAnalysis from './AIAnalysis.jsx'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn']

export default function ApplicationDetail({ app, onUpdate, onDelete, onClose }) {
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleStatusChange = async (status) => {
    await onUpdate(app.id, { status })
  }

  const handleDelete = async () => {
    await onDelete(app.id)
    onClose()
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
        <div className="glass-card w-full max-w-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-800">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <StatusBadge status={app.status} size="md" />
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <h2 className="text-white font-bold text-xl truncate">{app.position}</h2>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                <Building2 size={13} />
                <span>{app.company}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button onClick={() => setEditing(true)} className="btn-ghost"><Pencil size={14} /> Edit</button>
              <button onClick={onClose} className="btn-ghost p-1.5"><X size={16} /></button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {['details', 'ai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'ai' && <Sparkles size={13} />}
                {tab === 'details' ? 'Details' : 'AI Assistant'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, label: 'Applied', value: fmt(app.date_applied) },
                    { icon: MapPin, label: 'Location', value: app.location || '—' },
                    { icon: DollarSign, label: 'Salary', value: app.salary_range || '—' },
                    { icon: User, label: 'Contact', value: app.contact || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">{label}</p>
                        <p className="text-gray-200 text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {app.job_url && (
                  <a href={app.job_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                    <ExternalLink size={13} /> View Job Posting
                  </a>
                )}

                {app.job_description && (
                  <div>
                    <p className="label">Job Description</p>
                    <div className="bg-gray-800/50 border border-gray-800 rounded-xl p-4 text-gray-300 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                      {app.job_description}
                    </div>
                  </div>
                )}

                {app.notes && (
                  <div>
                    <p className="label">Notes</p>
                    <div className="bg-gray-800/50 border border-gray-800 rounded-xl p-4 text-gray-300 text-sm whitespace-pre-wrap">
                      {app.notes}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <p className="text-gray-600 text-xs">Added {fmt(app.created_at)}</p>
                  {confirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm">Delete this application?</span>
                      <button onClick={handleDelete} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors">Yes, delete</button>
                      <button onClick={() => setConfirmDelete(false)} className="btn-ghost text-xs">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(true)} className="btn-ghost text-red-400 hover:text-red-300">
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <AIAnalysis
                appId={app.id}
                position={app.position}
                company={app.company}
                hasDescription={!!app.job_description}
              />
            )}
          </div>
        </div>
      </div>

      {editing && (
        <ApplicationForm
          initial={app}
          onSave={(data) => onUpdate(app.id, data)}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
