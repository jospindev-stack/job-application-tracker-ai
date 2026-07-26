import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { Briefcase, TrendingUp, Users, Award } from 'lucide-react'

const STATUS_COLORS = {
  Applied:   '#3b82f6',
  Interview: '#f59e0b',
  Offer:     '#10b981',
  Rejected:  '#ef4444',
  Withdrawn: '#6b7280',
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm shadow-2xl">
      {label && <p className="text-gray-400 text-xs mb-1">{label}</p>}
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: e.color || e.fill }} />
          <span className="text-white font-semibold">{e.value}</span>
          {e.name && <span className="text-gray-400">{e.name}</span>}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ stats }) {
  if (!stats) return null

  const pieData = Object.entries(stats.by_status)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  const axisStyle = { fill: '#9ca3af', fontSize: 11 }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats.total} icon={Briefcase} color="bg-indigo-600/80" />
        <StatCard label="Response Rate" value={`${stats.response_rate}%`} sub="Interviews + Offers + Rejected" icon={TrendingUp} color="bg-amber-600/80" />
        <StatCard label="Interview Rate" value={`${stats.interview_rate}%`} sub="Reached interview stage" icon={Users} color="bg-blue-600/80" />
        <StatCard label="Offer Rate" value={`${stats.offer_rate}%`} sub="Received offers" icon={Award} color="bg-emerald-600/80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-white font-semibold text-sm mb-4">Applications Over Time</h3>
          {stats.timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.timeline} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="grad-apps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={2.5} fill="url(#grad-apps)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">
              No data yet — add your first application
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Status Breakdown</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} strokeWidth={0}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[entry.name] }} />
                      <span className="text-gray-400">{entry.name}</span>
                    </div>
                    <span className="text-white font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
