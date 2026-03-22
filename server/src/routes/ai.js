import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../db/supabase.js'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /api/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { tender_id } = req.body
    if (!tender_id) return res.status(400).json({ error: 'tender_id is required' })

    const { data: tender, error } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', tender_id)
      .single()

    if (error) return res.status(404).json({ error: 'Tender not found' })

    const tenderText = [
      `Title: ${tender.title}`,
      `Department: ${tender.department}`,
      `Description: ${tender.description || 'N/A'}`,
      `Estimated Value: ${tender.estimated_value || 'N/A'}`,
      `Closing Date: ${tender.closing_date || 'N/A'}`,
      `NAICS Codes: ${tender.naics_codes?.join(', ') || 'N/A'}`,
      `Required Certifications: ${tender.required_certifications?.join(', ') || 'None specified'}`,
    ].join('\n')

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are a Canadian government procurement expert helping small business owners understand federal tenders. Summarize the tender in plain English using these sections:

**What They Want**
1-2 sentences on the core requirement.

**Key Deadline**
Closing date and urgency level.

**Estimated Value**
Contract value or range.

**Mandatory Requirements**
Bullet list of non-negotiable requirements to bid.

**Evaluation Criteria**
How bids will be scored and weighted.

**Disqualification Risks**
Common reasons bids get rejected for this type of contract.

**Is This a Fit?**
1-2 sentences on what type of company is best positioned to win.

Keep it concise, scannable, and free of government jargon.`,
      messages: [{ role: 'user', content: `Summarize this federal tender:\n\n${tenderText}` }],
    })

    res.json({ summary: message.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/buy-canadian-check
router.post('/buy-canadian-check', async (req, res) => {
  try {
    const {
      incorporated_in_canada,
      files_taxes_with_cra,
      majority_canadian_personnel,
      contract_performed_in_canada,
      canadian_content_pct,
    } = req.body

    const answers = [
      `Business incorporated or registered in Canada: ${incorporated_in_canada}`,
      `Files taxes with the CRA: ${files_taxes_with_cra}`,
      `Majority of key personnel are Canadian citizens or permanent residents: ${majority_canadian_personnel}`,
      `Majority of contract will be performed in Canada: ${contract_performed_in_canada}`,
      `Estimated Canadian content percentage: ${canadian_content_pct}%`,
    ].join('\n')

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: `You are a Canadian government procurement compliance expert specializing in the Buy Canadian policy and the Comprehensive Land Claims Agreement Policy.

Evaluate whether a business qualifies under the Buy Canadian policy. The key criteria are:
1. Business must be incorporated or registered in Canada
2. Must file taxes with the Canada Revenue Agency (CRA)
3. Majority of key personnel must be Canadian citizens or permanent residents
4. Contract work must primarily be performed in Canada
5. Canadian content should be at least 80%

Respond in this exact JSON format with no additional text:
{
  "eligible": true or false,
  "explanation": "2-3 sentence explanation citing the specific criteria passed or failed. If failed, state clearly what needs to change to become eligible."
}`,
      messages: [{ role: 'user', content: `Evaluate Buy Canadian eligibility based on these answers:\n\n${answers}` }],
    })

    try {
      const result = JSON.parse(message.content[0].text)
      res.json(result)
    } catch {
      // Claude didn't return clean JSON — return raw text as explanation
      res.json({ eligible: null, explanation: message.content[0].text })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/bid-draft
router.post('/bid-draft', async (req, res) => {
  try {
    const { tender_id, profile_id } = req.body
    if (!tender_id || !profile_id) {
      return res.status(400).json({ error: 'tender_id and profile_id are required' })
    }

    const [{ data: tender, error: tenderError }, { data: profile, error: profileError }] = await Promise.all([
      supabase.from('tenders').select('*').eq('id', tender_id).single(),
      supabase.from('profiles').select('*').eq('id', profile_id).single(),
    ])

    if (tenderError) return res.status(404).json({ error: 'Tender not found' })
    if (profileError) return res.status(404).json({ error: 'Profile not found' })

    const context = [
      'COMPANY PROFILE:',
      `Company: ${profile.company_name}`,
      `Location: ${profile.city || 'N/A'}, ${profile.province || 'N/A'}`,
      `NAICS Codes: ${profile.naics_codes?.join(', ') || 'N/A'}`,
      `Capabilities: ${profile.capabilities || 'N/A'}`,
      `Certifications: ${profile.certifications?.join(', ') || 'None'}`,
      `Estimated Canadian Content: ${profile.canadian_content_pct}%`,
      '',
      'TENDER:',
      `Title: ${tender.title}`,
      `Department: ${tender.department}`,
      `Description: ${tender.description || 'N/A'}`,
      `Estimated Value: ${tender.estimated_value || 'N/A'}`,
      `Closing Date: ${tender.closing_date || 'N/A'}`,
      `Required Certifications: ${tender.required_certifications?.join(', ') || 'None specified'}`,
      `NAICS Codes: ${tender.naics_codes?.join(', ') || 'N/A'}`,
    ].join('\n')

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: `You are an expert Canadian government bid writer with 20 years of experience winning federal contracts. Generate a tailored proposal outline using the company profile and tender details provided.

Structure the output with these sections:

**1. Executive Summary**
2-3 compelling sentences positioning this specific company for this specific contract.

**2. Understanding of Requirements**
3-4 bullet points demonstrating deep understanding of what the department needs.

**3. Proposed Approach & Methodology**
How this company will deliver — concrete and tailored to the tender's requirements.

**4. Our Qualifications**
Relevant experience and capabilities drawn directly from the company profile.

**5. Canadian Content & Compliance**
Specific commitment percentage, certifications held, and security posture.

**6. Key Personnel & Team Structure**
Brief description of the team appropriate for this contract scope and value.

**7. Risk Mitigation**
2-3 key risks specific to this contract type and concrete mitigation strategies.

Use the company's actual details and the tender's actual requirements throughout. Professional government contracting tone.`,
      messages: [{ role: 'user', content: `Generate a bid proposal outline:\n\n${context}` }],
    })

    res.json({ draft: message.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
