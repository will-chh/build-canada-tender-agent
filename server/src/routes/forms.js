import { Router } from 'express'
import { supabase } from '../../db/supabase.js'

const router = Router()

const VALID_STATUSES = ['not_started', 'in_progress', 'done']

// PATCH /api/forms/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
    }

    const { data, error } = await supabase
      .from('form_checklists')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
