import { useState } from 'react'
import { Building2, MapPin, Calendar, ChevronRight, DollarSign, Sparkles } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import ApplicationDetail from './ApplicationDetail.jsx'

function ApplicationCard({ app, onClick }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div
      onClick={onClick}
      className="glass-card p-4 cursor-pointer hover:border-gray-700 hover:bg-gray-900/90 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <StatusBadge status={app.status} />
            {app.job_description && (
              <span className="flex items-center gap-1 text-indigo-400/70 text-xs">
                <Sparkles size={10} /> AI ready
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm truncate">{app.position}</h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
            <Building2 size={11} />
            <span className="truncate">{app.company}</span>
          </div>
        </div>
        <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-400 flex-shrink-0 mt-1 transition-colors" />
      </div>

      <div className="flex items-center gap-3 mt-3 text-gray-600 text-xs flex-wrap">
        {app.location && (
          <span className="flex items-center gap-1"><MapPin size={10} />{app.location}</span>
        )}
        <span className="flex items-center gap-1"><Calendar size={10} />{fmt(app.date_applied)}</span>
        {app.salary_range && (
          <span className="flex items-center gap-1"><DollarSign size={10} />{app.salary_range}</span>
        )}
      </div>
    </div>
  )
}

export default function ApplicationList({ applications, loading, onUpdate, onDelete }) {
  const [selected, setSelected] = useState(null)

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-4 h-28 animate-pulse bg-gray-900/40" />
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <Building2 size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No applications yet — add your first one!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <ApplicationCard key={app.id} app={app} onClick={() => setSelected(app)} />
        ))}
      </div>

      {selected && (
        <ApplicationDetail
          app={applications.find((a) => a.id === selected.id) ?? selected}
          onUpdate={async (id, data) => { await onUpdate(id, data); setSelected((s) => ({ ...s, ...data })) }}
          onDelete={onDelete}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
