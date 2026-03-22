import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Calendar, DollarSign, Building2, ArrowRight, Loader2 } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const profileId = localStorage.getItem('profileId')
    if (!profileId) {
      navigate('/profile')
      return
    }
    api.matchTenders(profileId)
      .then(data => setTenders(Array.isArray(data) ? data : data.tenders ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🍁</span>
          <span className="font-bold text-gray-900">Build Canada</span>
        </Link>
        <Link to="/profile" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Edit Profile
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matched Tenders</h1>
          <p className="text-gray-500 mt-1">
            {loading
              ? 'Finding matches for your profile...'
              : `${tenders.length} tender${tenders.length !== 1 ? 's' : ''} matched to your profile`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <Loader2 className="animate-spin text-red-600" size={28} />
            <span>Matching tenders...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && tenders.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium mb-2">No matches found</p>
            <p className="text-sm">Try adding more NAICS codes to your profile.</p>
            <Link to="/profile" className="mt-4 inline-block text-red-600 text-sm font-medium hover:underline">
              Update Profile →
            </Link>
          </div>
        )}

        {!loading && !error && tenders.length > 0 && (
          <div className="grid gap-4">
            {tenders.map(tender => {
              const days = daysUntil(tender.closing_date)
              const isUrgent = days !== null && days <= 14

              return (
                <div
                  key={tender.id}
                  onClick={() => navigate(`/tender/${tender.id}`, { state: { tender } })}
                  className="bg-white border rounded-xl p-6 hover:border-red-300 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {tender.matching_naics_count > 0 && (
                          <span className="inline-flex items-center bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-100">
                            {tender.matching_naics_count} NAICS match{tender.matching_naics_count > 1 ? 'es' : ''}
                          </span>
                        )}
                        {isUrgent && (
                          <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-amber-100">
                            Closing soon
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 text-lg leading-snug group-hover:text-red-600 transition-colors">
                        {tender.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Building2 size={14} className="flex-shrink-0" />
                          {tender.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="flex-shrink-0" />
                          {formatDate(tender.closing_date)}
                          {days !== null && (
                            <span className={isUrgent ? 'text-amber-600 font-medium' : 'text-gray-400'}>
                              ({days}d)
                            </span>
                          )}
                        </span>
                        {tender.estimated_value && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign size={14} className="flex-shrink-0" />
                            {tender.estimated_value}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-300 group-hover:text-red-600 transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
