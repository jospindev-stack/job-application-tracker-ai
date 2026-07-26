import { useState } from 'react'
import { Plus, Briefcase, LayoutDashboard, List, Search, Filter } from 'lucide-react'
import { useApplications } from './hooks/useApplications.js'
import Dashboard from './components/Dashboard.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import ApplicationForm from './components/ApplicationForm.jsx'

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn']

const STATUS_COUNT_COLOR = {
  Applied:   'text-blue-400',
  Interview: 'text-amber-400',
  Offer:     'text-emerald-400',
  Rejected:  'text-red-400',
  Withdrawn: 'text-gray-400',
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const { applications, stats, loading, error, create, update, remove } = useApplications({
    status: statusFilter || undefined,
    search: search || undefined,
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-800/60 bg-gray-950/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
              <Briefcase size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Job Tracker AI</h1>
              {stats && (
                <p className="text-gray-500 text-xs">{stats.total} applications</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`btn-ghost ${view === 'dashboard' ? 'text-white bg-gray-800' : ''}`}
            >
              <LayoutDashboard size={14} /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`btn-ghost ${view === 'list' ? 'text-white bg-gray-800' : ''}`}
            >
              <List size={14} /> <span className="hidden sm:inline">Applications</span>
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {error} — make sure the backend is running on port 8000
          </div>
        )}

        {view === 'dashboard' && (
          <>
            <div>
              <h2 className="text-white font-bold text-xl mb-1">Overview</h2>
              <p className="text-gray-500 text-sm">Track your job search progress at a glance</p>
            </div>
            <Dashboard stats={stats} />

            {/* Recent applications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Recent Applications</h3>
                <button onClick={() => setView('list')} className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                  View all →
                </button>
              </div>
              <ApplicationList
                applications={applications.slice(0, 6)}
                loading={loading}
                onUpdate={update}
                onDelete={remove}
              />
            </div>
          </>
        )}

        {view === 'list' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">All Applications</h2>
              <span className="text-gray-500 text-sm">{applications.length} result{applications.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company or position…"
                  className="input pl-9"
                />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value === 'All' ? '' : e.target.value)}
                  className="input pl-9 pr-8 appearance-none cursor-pointer w-40"
                >
                  {STATUSES.map((s) => <option key={s} value={s === 'All' ? '' : s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((s) => {
                const key = s === 'All' ? '' : s
                const count = s === 'All' ? stats?.total : stats?.by_status?.[s]
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      statusFilter === key
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    {s} {count !== undefined && <span className={statusFilter === key ? 'text-indigo-200' : (STATUS_COUNT_COLOR[s] ?? 'text-gray-500')}>({count})</span>}
                  </button>
                )
              })}
            </div>

            <ApplicationList
              applications={applications}
              loading={loading}
              onUpdate={update}
              onDelete={remove}
            />
          </>
        )}
      </main>

      {showForm && (
        <ApplicationForm
          onSave={create}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
