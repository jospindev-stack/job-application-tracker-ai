import { useState } from 'react'
import { X, Save, Plus } from 'lucide-react'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn']

const EMPTY = {
  company: '', position: '', location: '', job_url: '',
  job_description: '', status: 'Applied',
  date_applied: new Date().toISOString().slice(0, 10),
  salary_range: '', contact: '', notes: '',
}

export default function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? {
    ...EMPTY, ...initial,
    date_applied: initial.date_applied?.slice(0, 10) ?? EMPTY.date_applied,
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.position.trim()) {
      setError('Company and position are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = { ...form }
      Object.keys(payload).forEach((k) => { if (payload[k] === '') payload[k] = null })
      payload.company = form.company.trim()
      payload.position = form.position.trim()
      payload.date_applied = form.date_applied
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-6 px-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="glass-card w-full max-w-2xl p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">{initial ? 'Edit Application' : 'Add Application'}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <input value={form.company} onChange={(e) => set('company', e.target.value)} className="input" placeholder="Google" required />
            </div>
            <div>
              <label className="label">Position *</label>
              <input value={form.position} onChange={(e) => set('position', e.target.value)} className="input" placeholder="Senior Software Engineer" required />
            </div>
            <div>
              <label className="label">Location</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className="input" placeholder="Paris, Remote…" />
            </div>
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date Applied</label>
              <input type="date" value={form.date_applied} onChange={(e) => set('date_applied', e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Salary Range</label>
              <input value={form.salary_range} onChange={(e) => set('salary_range', e.target.value)} className="input" placeholder="50k–65k €" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Job URL</label>
              <input value={form.job_url} onChange={(e) => set('job_url', e.target.value)} className="input" placeholder="https://…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Contact (Recruiter)</label>
              <input value={form.contact} onChange={(e) => set('contact', e.target.value)} className="input" placeholder="Name / email" />
            </div>
          </div>

          <div>
            <label className="label">Job Description <span className="normal-case text-gray-600 font-normal">(paste here for AI analysis)</span></label>
            <textarea
              value={form.job_description}
              onChange={(e) => set('job_description', e.target.value)}
              rows={5}
              className="input resize-y"
              placeholder="Paste the full job posting here…"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Referral, next steps, impressions…"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {initial ? <Save size={15} /> : <Plus size={15} />}
              {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
