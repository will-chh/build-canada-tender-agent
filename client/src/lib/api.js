// Empty string → requests go to same origin, Vite proxy forwards /api/* to port 3001
// In production set VITE_API_URL=https://your-api.com
const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  createProfile: (data) =>
    request('/api/profile', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: (id) =>
    request(`/api/profile/${id}`),

  matchTenders: (profileId) =>
    request('/api/tenders/match', { method: 'POST', body: JSON.stringify({ profile_id: profileId }) }),

  summarizeTender: (tenderId) =>
    request('/api/summarize', { method: 'POST', body: JSON.stringify({ tender_id: tenderId }) }),

  buyCanadianCheck: (data) =>
    request('/api/buy-canadian-check', { method: 'POST', body: JSON.stringify(data) }),

  getTenderForms: (tenderId) =>
    request(`/api/tenders/${tenderId}/forms`),

  updateFormStatus: (formId, status) =>
    request(`/api/forms/${formId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  generateBidDraft: (data) =>
    request('/api/bid-draft', { method: 'POST', body: JSON.stringify(data) }),
}
