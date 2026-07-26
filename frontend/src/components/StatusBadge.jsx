const STATUS_STYLE = {
  Applied:   'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Interview: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Offer:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Rejected:  'bg-red-500/15 text-red-400 border-red-500/25',
  Withdrawn: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cls = STATUS_STYLE[status] ?? STATUS_STYLE.Applied
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${cls} ${pad}`}>
      {status}
    </span>
  )
}
