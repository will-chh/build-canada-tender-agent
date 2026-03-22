import { Router } from 'express'
import { supabase } from '../../db/supabase.js'

const router = Router()

// GET /api/tenders
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('tenders')
      .select('id, title, department, closing_date, estimated_value, naics_codes, source_url')
      .order('closing_date', { ascending: true })

    if (req.query.naics) {
      const codes = req.query.naics.split(',').map(c => c.trim())
      query = query.overlaps('naics_codes', codes)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tenders/match
router.post('/match', async (req, res) => {
  try {
    const { profile_id } = req.body
    if (!profile_id) return res.status(400).json({ error: 'profile_id is required' })

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('naics_codes')
      .eq('id', profile_id)
      .single()

    if (profileError) return res.status(404).json({ error: 'Profile not found' })

    const naicsCodes = profile.naics_codes || []

    let query = supabase
      .from('tenders')
      .select('*')
      .order('closing_date', { ascending: true })

    // Filter by NAICS overlap if profile has codes, otherwise return all
    if (naicsCodes.length > 0) {
      query = query.overlaps('naics_codes', naicsCodes)
    }

    const { data: tenders, error: tendersError } = await query
    if (tendersError) return res.status(500).json({ error: tendersError.message })

    // Compute and sort by match count
    const matched = tenders
      .map(tender => ({
        ...tender,
        matching_naics_count: naicsCodes.filter(code => tender.naics_codes?.includes(code)).length,
      }))
      .sort((a, b) => b.matching_naics_count - a.matching_naics_count)

    res.json(matched)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/tenders/:id/forms
router.get('/:id/forms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('form_checklists')
      .select('*')
      .eq('tender_id', req.params.id)
      .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
