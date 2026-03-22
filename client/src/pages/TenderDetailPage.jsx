import { useEffect, useState } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Loader2, CheckCircle2, Circle, Clock, ArrowLeft } from 'lucide-react'

// ─── Simple Tabs ────────────────────────────────────────────────────────────

function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id)
  return (
    <div>
      <div className="border-b flex">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-6 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === t.id
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  )
}

// ─── Summary Tab ─────────────────────────────────────────────────────────────

function SummaryTab({ tenderId }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.summarizeTender(tenderId)
      .then(data => setSummary(data.summary ?? data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [tenderId])

  if (loading) return (
    <div className="flex items-center gap-3 text-gray-500 py-4">
      <Loader2 className="animate-spin text-red-600" size={20} />
      Claude is reading this tender...
    </div>
  )

  if (error) return (
    <div className="text-red-600 text-sm bg-red-50 rounded-lg p-4 border border-red-100">{error}</div>
  )

  return (
    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">{
      typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2)
    }</div>
  )
}

// ─── Buy Canadian Tab ─────────────────────────────────────────────────────────

// Defined outside BuyCanadianTab to prevent remount on every state change
function YesNo({ label, field, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex gap-4">
        {['yes', 'no'].map(v => (
          <label key={v} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input
              type="radio"
              name={field}
              value={v}
              checked={value === v}
              onChange={() => onChange(field, v)}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="capitalize">{v}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function BuyCanadianTab({ tenderId, profileId }) {
  const [form, setForm] = useState({
    incorporated_in_canada: '',
    files_taxes_with_cra: '',
    majority_canadian_personnel: '',
    contract_performed_in_canada: '',
    canadian_content_pct: 80,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleField = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await api.buyCanadianCheck({ ...form, tender_id: tenderId, profile_id: profileId })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    const passed = result.eligible === true || result.result === 'pass' || result.passed === true
    return (
      <div>
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-4 ${
          passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {passed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {passed ? 'PASS — Buy Canadian Eligible' : 'FAIL — Not Eligible'}
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {result.explanation ?? result.message ?? JSON.stringify(result, null, 2)}
        </p>
        <button
          onClick={() => setResult(null)}
          className="mt-5 text-sm text-gray-400 hover:text-gray-700 underline"
        >
          Re-check
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <YesNo label="Is your business incorporated or registered in Canada?" field="incorporated_in_canada" value={form.incorporated_in_canada} onChange={handleField} />
      <YesNo label="Do you file taxes with the Canada Revenue Agency (CRA)?" field="files_taxes_with_cra" value={form.files_taxes_with_cra} onChange={handleField} />
      <YesNo label="Are the majority of your key personnel Canadian citizens or permanent residents?" field="majority_canadian_personnel" value={form.majority_canadian_personnel} onChange={handleField} />
      <YesNo label="Will the majority of this contract be performed in Canada?" field="contract_performed_in_canada" value={form.contract_performed_in_canada} onChange={handleField} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Estimated Canadian Content —{' '}
          <span className="text-red-600 font-semibold">{form.canadian_content_pct}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={form.canadian_content_pct}
          onChange={e => setForm(f => ({ ...f, canadian_content_pct: Number(e.target.value) }))}
          className="w-full accent-red-600"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
      >
        {loading ? <><Loader2 size={14} className="animate-spin" /> Checking...</> : 'Check Eligibility'}
      </button>
    </form>
  )
}

// ─── Forms Checklist Tab ──────────────────────────────────────────────────────

const STATUS_STYLES = {
  not_started: 'text-gray-500 bg-gray-50 border-gray-200',
  in_progress: 'text-amber-700 bg-amber-50 border-amber-200',
  done: 'text-green-700 bg-green-50 border-green-200',
}

function StatusIcon({ status }) {
  if (status === 'done') return <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
  if (status === 'in_progress') return <Clock size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
  return <Circle size={16} className="text-gray-300 flex-shrink-0 mt-0.5" />
}

function FormsTab({ tenderId }) {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getTenderForms(tenderId)
      .then(data => setForms(Array.isArray(data) ? data : data.forms ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [tenderId])

  const updateStatus = async (formId, status) => {
    // Optimistic update
    setForms(prev => prev.map(f => f.id === formId ? { ...f, status } : f))
    try {
      await api.updateFormStatus(formId, status)
    } catch {
      // Silently revert would require storing prev state — skipping for hackathon
    }
  }

  if (loading) return (
    <div className="flex items-center gap-3 text-gray-500 py-4">
      <Loader2 className="animate-spin text-red-600" size={20} />
      Loading forms...
    </div>
  )

  if (error) return (
    <div className="text-red-600 text-sm bg-red-50 rounded-lg p-4 border border-red-100">{error}</div>
  )

  const done = forms.filter(f => f.status === 'done').length
  const pct = forms.length > 0 ? Math.round((done / forms.length) * 100) : 0

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-gray-700">Completion</span>
          <span className="text-gray-500">{done} of {forms.length} complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Forms list */}
      <div className="space-y-3">
        {forms.map(form => (
          <div key={form.id} className="flex items-start gap-3 p-4 border rounded-lg">
            <StatusIcon status={form.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm text-gray-900">{form.form_name}</p>
                {form.is_mandatory && (
                  <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded px-1.5 py-0.5 leading-none">
                    Mandatory
                  </span>
                )}
              </div>
              {form.form_description && (
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{form.form_description}</p>
              )}
              {form.form_url && (
                <a
                  href={form.form_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:underline mt-1 inline-block"
                >
                  View form ↗
                </a>
              )}
            </div>
            <select
              value={form.status}
              onChange={e => updateStatus(form.id, e.target.value)}
              className={`text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 flex-shrink-0 ${STATUS_STYLES[form.status]}`}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TenderDetailPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const tender = state?.tender
  const profileId = localStorage.getItem('profileId')

  const [bidDraft, setBidDraft] = useState(null)
  const [bidLoading, setBidLoading] = useState(false)
  const [bidError, setBidError] = useState(null)

  const generateBid = async () => {
    setBidLoading(true)
    setBidError(null)
    try {
      const data = await api.generateBidDraft({ tender_id: id, profile_id: profileId })
      setBidDraft(data.draft ?? data)
    } catch (err) {
      setBidError(err.message)
    } finally {
      setBidLoading(false)
    }
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span>🍁</span>
          <span className="font-bold text-gray-900">Build Canada</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Tender header */}
        {tender && (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {tender.naics_codes?.map(code => (
                <span key={code} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                  {code}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-5 leading-snug">{tender.title}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Department</p>
                <p className="font-medium text-gray-800 text-xs leading-snug">{tender.department}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Closing Date</p>
                <p className="font-medium text-gray-800 text-xs">{formatDate(tender.closing_date)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Est. Value</p>
                <p className="font-medium text-gray-800 text-xs">{tender.estimated_value || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Source</p>
                <a
                  href={tender.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-red-600 hover:underline text-xs"
                >
                  CanadaBuys ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tabs + Bid Draft */}
        <div className="bg-white rounded-xl border">
          <Tabs
            tabs={[
              {
                id: 'summary',
                label: 'AI Summary',
                content: <SummaryTab tenderId={id} />,
              },
              {
                id: 'buy-canadian',
                label: 'Buy Canadian Check',
                content: <BuyCanadianTab tenderId={id} profileId={profileId} />,
              },
              {
                id: 'forms',
                label: 'Forms Checklist',
                content: <FormsTab tenderId={id} />,
              },
            ]}
          />

          {/* Bid Draft */}
          <div className="border-t px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Bid Draft Assistant</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Generate a proposal outline using your profile + this tender's requirements
                </p>
              </div>
              <button
                onClick={generateBid}
                disabled={bidLoading}
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 flex-shrink-0 transition-colors"
              >
                {bidLoading
                  ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
                  : '✍️ Generate Bid Draft'}
              </button>
            </div>

            {bidError && (
              <p className="text-red-600 text-sm">{bidError}</p>
            )}

            {bidDraft && !bidError && (
              <div className="bg-gray-50 rounded-lg p-5 border">
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {typeof bidDraft === 'string' ? bidDraft : JSON.stringify(bidDraft, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
