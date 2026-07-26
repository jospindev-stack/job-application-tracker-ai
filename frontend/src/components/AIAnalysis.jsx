import { useState } from 'react'
import { Sparkles, Brain, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Loader } from 'lucide-react'

const PRIORITY_COLOR = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-emerald-400' }

function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/40 hover:bg-gray-800/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={15} className={color} />
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

export default function AIAnalysis({ appId, position, company, hasDescription }) {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [interviewResult, setInterviewResult] = useState(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingInterview, setLoadingInterview] = useState(false)
  const [error, setError] = useState('')

  const runAnalysis = async () => {
    setLoadingAnalysis(true)
    setError('')
    try {
      const res = await fetch(`/api/ai/analyze/${appId}`)
      if (!res.ok) throw new Error((await res.json()).detail ?? 'Analysis failed')
      setAnalysisResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const runInterviewPrep = async () => {
    setLoadingInterview(true)
    setError('')
    try {
      const res = await fetch(`/api/ai/interview-prep/${appId}`, { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).detail ?? 'Interview prep failed')
      setInterviewResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingInterview(false)
    }
  }

  const scoreColor = analysisResult
    ? analysisResult.match_score >= 70 ? 'text-emerald-400'
      : analysisResult.match_score >= 45 ? 'text-amber-400'
      : 'text-red-400'
    : ''

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={runAnalysis}
          disabled={loadingAnalysis || !hasDescription}
          className="btn-primary"
          title={!hasDescription ? 'Add a job description first' : ''}
        >
          {loadingAnalysis ? <Loader size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loadingAnalysis ? 'Analyzing…' : 'Analyze CV Fit'}
        </button>
        <button onClick={runInterviewPrep} disabled={loadingInterview} className="btn-secondary">
          {loadingInterview ? <Loader size={15} className="animate-spin" /> : <Brain size={15} />}
          {loadingInterview ? 'Generating…' : 'Interview Prep'}
        </button>
      </div>

      {!hasDescription && (
        <p className="text-amber-400/80 text-xs flex items-center gap-1.5">
          <AlertTriangle size={12} /> Add a job description to enable CV analysis
        </p>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* CV Analysis Result */}
      {analysisResult && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 glass-card p-4">
            <div className="text-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{analysisResult.match_score}</span>
              <p className="text-gray-500 text-xs">/100</p>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm mb-0.5">CV Match Score</p>
              <p className="text-gray-400 text-sm leading-relaxed">{analysisResult.summary}</p>
            </div>
          </div>

          <Section title="Key Requirements" icon={CheckCircle} color="text-blue-400">
            <ul className="space-y-1.5">
              {analysisResult.key_requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>{r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="CV Suggestions" icon={Sparkles} color="text-indigo-400">
            <div className="space-y-3">
              {analysisResult.cv_suggestions.map((s, i) => (
                <div key={i} className="border border-gray-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-semibold">{s.section}</span>
                    <span className={`text-xs font-medium capitalize ${PRIORITY_COLOR[s.priority]}`}>{s.priority}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{s.suggestion}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Keywords to Add" icon={Sparkles} color="text-emerald-400">
            <div className="flex flex-wrap gap-2">
              {analysisResult.keywords_to_add.map((kw, i) => (
                <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs px-2.5 py-1 rounded-full">{kw}</span>
              ))}
            </div>
          </Section>

          {analysisResult.red_flags.length > 0 && (
            <Section title="Watch Out" icon={AlertTriangle} color="text-red-400" defaultOpen={false}>
              <ul className="space-y-1.5">
                {analysisResult.red_flags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <AlertTriangle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Interview Prep Result */}
      {interviewResult && (
        <div className="space-y-3 border-t border-gray-800 pt-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Brain size={15} className="text-purple-400" /> Interview Preparation
          </h4>

          <Section title="Likely Questions" icon={Brain} color="text-purple-400">
            <div className="space-y-3">
              {interviewResult.likely_questions.map((q, i) => (
                <div key={i} className="border border-gray-800 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-white text-sm font-medium">{q.question}</p>
                    <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex-shrink-0 capitalize">{q.type}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{q.tip}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Skills to Highlight" icon={CheckCircle} color="text-emerald-400">
            <div className="flex flex-wrap gap-2">
              {interviewResult.skills_to_highlight.map((s, i) => (
                <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </Section>

          <Section title="Company Research Tips" icon={Sparkles} color="text-amber-400">
            <ul className="space-y-1.5">
              {interviewResult.company_research_tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-amber-400 mt-0.5">•</span>{t}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Preparation Checklist" icon={CheckCircle} color="text-emerald-400" defaultOpen={false}>
            <ul className="space-y-2">
              {interviewResult.preparation_checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  )
}
