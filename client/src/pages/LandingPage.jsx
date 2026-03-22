import { Link } from 'react-router-dom'
import { Search, FileText, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍁</span>
          <span className="font-bold text-gray-900 text-lg">Build Canada</span>
        </div>
        <Link
          to="/profile"
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          🍁 AI-Powered Government Procurement
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Find and Win Canadian<br />Government Contracts
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          AI-powered tender matching and bid assistance for small Canadian businesses
        </p>

        <Link
          to="/profile"
          className="inline-block bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
        >
          Get Started →
        </Link>

        <p className="text-sm text-gray-400 mt-4">
          No account required · Free to use
        </p>
      </main>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-xl hover:border-red-200 transition-colors">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <Search className="text-red-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Tender Matching</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Match your NAICS codes and capabilities to relevant federal tenders from CanadaBuys automatically.
          </p>
        </div>

        <div className="p-6 border rounded-xl hover:border-red-200 transition-colors">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <FileText className="text-red-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Bid Assistance</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Claude AI summarizes complex RFPs in plain English and generates a tailored proposal outline for your business.
          </p>
        </div>

        <div className="p-6 border rounded-xl hover:border-red-200 transition-colors">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="text-red-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Compliance Tracking</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Track mandatory forms, verify Buy Canadian eligibility, and stay on top of every procurement requirement.
          </p>
        </div>
      </section>
    </div>
  )
}
