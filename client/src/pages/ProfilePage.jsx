import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { X } from 'lucide-react'

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon',
]

const COMMON_NAICS = [
  { code: '541511', label: '541511 — Custom Software Dev' },
  { code: '541512', label: '541512 — Computer Systems Design' },
  { code: '541513', label: '541513 — Computer Facilities Mgmt' },
  { code: '541330', label: '541330 — Engineering Services' },
  { code: '541611', label: '541611 — Management Consulting' },
  { code: '541620', label: '541620 — Environmental Consulting' },
  { code: '541930', label: '541930 — Translation Services' },
  { code: '238210', label: '238210 — Electrical Contractors' },
  { code: '236220', label: '236220 — Commercial Construction' },
  { code: '561210', label: '561210 — Facilities Management' },
  { code: '561320', label: '561320 — Temporary Staffing' },
  { code: '453210', label: '453210 — Office Supplies' },
]

const CERTIFICATIONS = [
  'ISO 9001', 'ISO 27001', 'Controlled Goods',
  'Secret Clearance', 'COR Certification', 'None',
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [naicsInput, setNaicsInput] = useState('')

  const [form, setForm] = useState({
    company_name: '',
    naics_codes: [],
    capabilities: '',
    province: '',
    city: '',
    certifications: [],
    canadian_content_pct: 50,
  })

  const addNaics = (code) => {
    const clean = code.trim()
    if (clean && !form.naics_codes.includes(clean)) {
      setForm(f => ({ ...f, naics_codes: [...f.naics_codes, clean] }))
    }
  }

  const removeNaics = (code) => {
    setForm(f => ({ ...f, naics_codes: f.naics_codes.filter(c => c !== code) }))
  }

  const handleNaicsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addNaics(naicsInput.replace(',', ''))
      setNaicsInput('')
    }
  }

  const toggleCert = (cert) => {
    setForm(f => ({
      ...f,
      certifications: f.certifications.includes(cert)
        ? f.certifications.filter(c => c !== cert)
        : [...f.certifications, cert],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const profile = await api.createProfile(form)
      localStorage.setItem('profileId', profile.id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🍁</span>
          <span className="font-bold text-gray-900">Build Canada</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Business Profile</h1>
        <p className="text-gray-500 mb-8">Tell us about your company to match you to relevant tenders.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-8 space-y-6">

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={form.company_name}
              onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Acme Systems Inc."
            />
          </div>

          {/* NAICS Codes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">NAICS Codes</label>

            {/* Selected tags */}
            {form.naics_codes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.naics_codes.map(code => (
                  <span key={code} className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 rounded-full px-3 py-1 text-xs font-medium">
                    {code}
                    <button type="button" onClick={() => removeNaics(code)} className="hover:text-red-900">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <input
              type="text"
              value={naicsInput}
              onChange={e => setNaicsInput(e.target.value)}
              onKeyDown={handleNaicsKeyDown}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type a 6-digit code and press Enter..."
            />

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_NAICS.filter(n => !form.naics_codes.includes(n.code)).map(n => (
                <button
                  key={n.code}
                  type="button"
                  onClick={() => addNaics(n.code)}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  + {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Capabilities</label>
            <textarea
              value={form.capabilities}
              onChange={e => setForm(f => ({ ...f, capabilities: e.target.value }))}
              rows={4}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Describe your company's services, expertise, and any relevant past government contract experience..."
            />
          </div>

          {/* Province + City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Province / Territory</label>
              <select
                value={form.province}
                onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="">Select province...</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ottawa"
              />
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
            <div className="grid grid-cols-2 gap-y-2.5">
              {CERTIFICATIONS.map(cert => (
                <label key={cert} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.certifications.includes(cert)}
                    onChange={() => toggleCert(cert)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  {cert}
                </label>
              ))}
            </div>
          </div>

          {/* Canadian Content % */}
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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Finding Matches...' : 'Find Matching Tenders →'}
          </button>
        </form>
      </main>
    </div>
  )
}
