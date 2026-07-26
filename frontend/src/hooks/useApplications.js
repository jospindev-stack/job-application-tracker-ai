import { useState, useEffect, useCallback } from 'react'

const API = '/api/applications'

export function useApplications(filters = {}) {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const buildQuery = (f) => {
    const p = new URLSearchParams()
    if (f.status) p.set('status', f.status)
    if (f.search) p.set('search', f.search)
    return p.toString()
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const q = buildQuery(filters)
      const [appsRes, statsRes] = await Promise.all([
        fetch(`${API}${q ? `?${q}` : ''}`),
        fetch(`${API}/stats`),
      ])
      if (!appsRes.ok) throw new Error('Failed to load applications')
      setApplications(await appsRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.search])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((await res.json()).detail ?? 'Create failed')
    const created = await res.json()
    setApplications((prev) => [created, ...prev])
    fetchAll()
    return created
  }

  const update = async (id, data) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((await res.json()).detail ?? 'Update failed')
    const updated = await res.json()
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
    fetchAll()
    return updated
  }

  const remove = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    setApplications((prev) => prev.filter((a) => a.id !== id))
    fetchAll()
  }

  return { applications, stats, loading, error, refetch: fetchAll, create, update, remove }
}
