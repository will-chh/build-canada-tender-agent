import { Router } from 'express'
import { supabase } from '../../db/supabase.js'

const router = Router()

// POST /api/profile
router.post('/', async (req, res) => {
  try {
    const { company_name, naics_codes, capabilities, province, city, certifications, canadian_content_pct } = req.body

    if (!company_name) return res.status(400).json({ error: 'company_name is required' })

    const { data, error } = await supabase
      .from('profiles')
      .insert({ company_name, naics_codes, capabilities, province, city, certifications, canadian_content_pct })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/profile/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) return res.status(404).json({ error: 'Profile not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
