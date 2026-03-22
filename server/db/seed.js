import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Returns a date string N days from today
function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const tenders = [
  // --- IT Services ---
  {
    title: 'Enterprise Application Development and Maintenance Services',
    description:
      'PSPC requires custom software development and ongoing maintenance for internal case management systems. Includes full-stack development, API integrations, and DevOps support.',
    department: 'Public Services and Procurement Canada',
    naics_codes: ['541511'],
    estimated_value: '$2,500,000',
    required_certifications: ['ISO 27001', 'Secret Clearance'],
    closing_date: daysFromNow(30),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Cloud Infrastructure Migration and Managed Services',
    description:
      'CRA seeks a vendor to migrate legacy on-premise workloads to a Government of Canada-approved cloud platform and provide ongoing managed services including monitoring, patching, and incident response.',
    department: 'Canada Revenue Agency',
    naics_codes: ['541513', '541512'],
    estimated_value: '$4,200,000',
    required_certifications: ['Protected B Clearance', 'ISO 27001'],
    closing_date: daysFromNow(45),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'IT Help Desk and End-User Support Services',
    description:
      'ESDC requires a managed IT help desk service covering Tier 1–3 support for approximately 2,000 employees. Must support bilingual service delivery in English and French.',
    department: 'Employment and Social Development Canada',
    naics_codes: ['541513'],
    estimated_value: '$850,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(22),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Cybersecurity ---
  {
    title: 'Cybersecurity Penetration Testing and Vulnerability Assessment',
    description:
      'CBSA requires independent penetration testing, red team exercises, and vulnerability assessments for its border management IT systems. Deliverables include a full report with remediation recommendations.',
    department: 'Canada Border Services Agency',
    naics_codes: ['541512'],
    estimated_value: '$375,000',
    required_certifications: ['Top Secret Clearance', 'OSCP Certification'],
    closing_date: daysFromNow(18),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Security Operations Centre (SOC) as a Service',
    description:
      'DND requires a 24/7 managed SOC to monitor, detect, and respond to cyber threats across its unclassified network. Must comply with ITSG-33 and Government of Canada security standards.',
    department: 'Department of National Defence',
    naics_codes: ['541512', '561611'],
    estimated_value: '$5,000,000',
    required_certifications: ['Secret Clearance', 'ISO 27001'],
    closing_date: daysFromNow(55),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Professional Consulting ---
  {
    title: 'Strategic Policy and Program Evaluation Consulting',
    description:
      'Treasury Board Secretariat requires expert consulting services for strategic policy development and program evaluation, including cost-benefit analysis and stakeholder engagement.',
    department: 'Treasury Board of Canada Secretariat',
    naics_codes: ['541611'],
    estimated_value: '$620,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(35),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Environmental Impact Assessment Consulting Services',
    description:
      'Environment and Climate Change Canada requires consulting firms to conduct environmental impact assessments for federal infrastructure projects, including wetland and species-at-risk surveys.',
    department: 'Environment and Climate Change Canada',
    naics_codes: ['541620'],
    estimated_value: '$480,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(40),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Human Resources and Organizational Design Consulting',
    description:
      'Health Canada requires HR consulting support for workforce planning, organizational redesign, and change management services as part of a departmental transformation initiative.',
    department: 'Health Canada',
    naics_codes: ['541612'],
    estimated_value: '$290,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(28),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Transportation Safety Regulatory Advisory Services',
    description:
      'Transport Canada requires specialized consulting to support the review and modernization of aviation and marine safety regulations. Includes comparative analysis with international standards (ICAO, IMO).',
    department: 'Transport Canada',
    naics_codes: ['541611', '541690'],
    estimated_value: '$520,000',
    required_certifications: ['Secret Clearance'],
    closing_date: daysFromNow(50),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Translation Services ---
  {
    title: 'Official Languages Translation and Interpretation Services',
    description:
      'PSPC requires a standing offer for translation, revision, and interpretation services in English and French, with capacity for Indigenous languages including Inuktitut and Cree.',
    department: 'Public Services and Procurement Canada',
    naics_codes: ['541930'],
    estimated_value: '$950,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(20),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Multilingual Document Translation for Newcomer Services',
    description:
      'IRCC requires translation of settlement and immigration documents into French, Spanish, Tagalog, Arabic, and Mandarin. High accuracy and fast turnaround required.',
    department: 'Immigration, Refugees and Citizenship Canada',
    naics_codes: ['541930'],
    estimated_value: '$175,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(17),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Office Supplies ---
  {
    title: 'Office Supplies and Stationery Standing Offer — National Capital Region',
    description:
      'PSPC requires a national master standing offer for office supplies including paper, toner cartridges, writing instruments, binders, and ergonomic accessories for federal departments in the NCR.',
    department: 'Public Services and Procurement Canada',
    naics_codes: ['453210'],
    estimated_value: '$300,000',
    required_certifications: [],
    closing_date: daysFromNow(15),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Medical Office Supplies and Personal Protective Equipment',
    description:
      'Health Canada requires a supply agreement for medical-grade office supplies and PPE including gloves, masks, sanitizers, and lab consumables for health surveillance programs.',
    department: 'Health Canada',
    naics_codes: ['453210', '339113'],
    estimated_value: '$215,000',
    required_certifications: ['Health Canada Vendor Registration'],
    closing_date: daysFromNow(25),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Construction ---
  {
    title: 'RCMP Detachment Renovation and Accessibility Upgrades',
    description:
      'PSPC on behalf of the RCMP requires a general contractor for interior renovation and barrier-free accessibility upgrades at the Surrey RCMP detachment, including HVAC replacement and electrical panel upgrades.',
    department: 'Public Services and Procurement Canada',
    naics_codes: ['236220'],
    estimated_value: '$1,800,000',
    required_certifications: ['RCMP Security Clearance', 'BC Contractor License'],
    closing_date: daysFromNow(42),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Military Base Perimeter Fencing and Gate Security Upgrades',
    description:
      'DND requires construction of perimeter fencing, vehicle anti-ram barriers, and electronic access control gates at CFB Gagetown. Must comply with DND physical security standards.',
    department: 'Department of National Defence',
    naics_codes: ['236220', '238990'],
    estimated_value: '$2,100,000',
    required_certifications: ['Secret Clearance', 'NB Contractor License'],
    closing_date: daysFromNow(58),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Federal Highway Rest Stop Infrastructure Renewal — Trans-Canada',
    description:
      'Infrastructure Canada requires civil construction services for the renewal of four federal highway rest stops along the Trans-Canada Highway in Manitoba, including parking, signage, and accessible washroom facilities.',
    department: 'Infrastructure Canada',
    naics_codes: ['237310'],
    estimated_value: '$3,400,000',
    required_certifications: ['MB Contractor License', 'COR Certification'],
    closing_date: daysFromNow(47),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },

  // --- Facilities Management ---
  {
    title: 'Integrated Facilities Management — Federal Office Tower Ottawa',
    description:
      'PSPC requires an integrated facilities management vendor to deliver hard and soft FM services at 90 Elgin Street, Ottawa, including HVAC maintenance, cleaning, security, and space management.',
    department: 'Public Services and Procurement Canada',
    naics_codes: ['561210'],
    estimated_value: '$4,750,000',
    required_certifications: ['Reliability Clearance', 'BOMA Certification'],
    closing_date: daysFromNow(60),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Janitorial and Cleaning Services — CBSA Regional Offices',
    description:
      'CBSA requires janitorial and commercial cleaning services across six regional offices in British Columbia, including daily cleaning, waste removal, window cleaning, and post-event cleanup.',
    department: 'Canada Border Services Agency',
    naics_codes: ['561720'],
    estimated_value: '$180,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(19),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Grounds Maintenance and Landscaping — Agriculture Canada Research Station',
    description:
      'Agriculture and Agri-Food Canada requires seasonal grounds maintenance, snow removal, and landscaping services for the Lethbridge Research and Development Centre.',
    department: 'Agriculture and Agri-Food Canada',
    naics_codes: ['561730'],
    estimated_value: '$95,000',
    required_certifications: ['Reliability Clearance'],
    closing_date: daysFromNow(23),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
  {
    title: 'Physical Security Guard Services — Transport Canada Headquarters',
    description:
      'Transport Canada requires uniformed security guard services at its Ottawa headquarters, including access control, visitor screening, emergency response, and after-hours patrol.',
    department: 'Transport Canada',
    naics_codes: ['561611'],
    estimated_value: '$420,000',
    required_certifications: ['Reliability Clearance', 'Ontario Security Guard License'],
    closing_date: daysFromNow(33),
    source_url: 'https://canadabuys.canada.ca/en/tender-opportunities',
  },
]

// Forms pool — randomly assigned per tender (3–5 per tender)
const formsPool = [
  {
    form_name: 'Bid Submission Form (PWGSC-TPSGC 1111)',
    form_description: 'Primary bid submission document required for all competitive procurements.',
    form_url: 'https://canadabuys.canada.ca/en/forms/1111',
    is_mandatory: true,
  },
  {
    form_name: 'Offeror / Bidder Declaration Form',
    form_description: 'Confirms the bidder meets eligibility requirements and is not in conflict of interest.',
    form_url: 'https://canadabuys.canada.ca/en/forms/offeror-declaration',
    is_mandatory: true,
  },
  {
    form_name: 'Integrity Declaration',
    form_description:
      'Declaration that the bidder and its affiliates have not engaged in misconduct under the Ineligibility and Suspension Policy.',
    form_url: 'https://canadabuys.canada.ca/en/forms/integrity',
    is_mandatory: true,
  },
  {
    form_name: 'Federal Contractors Program (FCP) Certification',
    form_description:
      'Required for contracts over $1M. Certifies commitment to employment equity obligations.',
    form_url: 'https://canadabuys.canada.ca/en/forms/fcp',
    is_mandatory: true,
  },
  {
    form_name: 'Former Public Servant Disclosure Form',
    form_description:
      'Discloses any former public servants involved in the bid to identify potential conflicts of interest.',
    form_url: 'https://canadabuys.canada.ca/en/forms/fps-disclosure',
    is_mandatory: true,
  },
  {
    form_name: 'Security Requirements Checklist (SRCL)',
    form_description:
      'Identifies personnel and facility security clearance levels required for contract performance.',
    form_url: 'https://canadabuys.canada.ca/en/forms/srcl',
    is_mandatory: true,
  },
  {
    form_name: 'Buy Canadian Certification',
    form_description:
      'Certifies that goods and services provided meet the Canadian content threshold under the Buy Canadian Policy.',
    form_url: 'https://canadabuys.canada.ca/en/forms/buy-canadian',
    is_mandatory: true,
  },
  {
    form_name: 'Financial Capability Declaration',
    form_description:
      'Attests that the bidder has sufficient financial resources to perform the contract.',
    form_url: 'https://canadabuys.canada.ca/en/forms/financial-capability',
    is_mandatory: true,
  },
  {
    form_name: 'Subcontracting and Teaming Arrangement Disclosure',
    form_description:
      'Discloses any subcontractors or teaming partners involved in bid delivery.',
    form_url: 'https://canadabuys.canada.ca/en/forms/subcontracting',
    is_mandatory: true,
  },
  {
    form_name: 'Indigenous Business Declaration (Procurement Strategy)',
    form_description:
      'For set-aside procurements. Certifies eligibility under the Procurement Strategy for Indigenous Business (PSIB).',
    form_url: 'https://canadabuys.canada.ca/en/forms/psib',
    is_mandatory: true,
  },
]

// Pick N unique random forms from the pool
function pickForms(n) {
  const shuffled = [...formsPool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

async function seed() {
  console.log('Seeding tenders...')

  const { data: insertedTenders, error: tenderError } = await supabase
    .from('tenders')
    .insert(tenders)
    .select('id, title')

  if (tenderError) {
    console.error('Error inserting tenders:', tenderError.message)
    process.exit(1)
  }

  console.log(`Inserted ${insertedTenders.length} tenders.`)

  // Build form_checklists rows for all tenders
  const formRows = insertedTenders.flatMap((tender) => {
    const count = 3 + Math.floor(Math.random() * 3) // 3, 4, or 5
    return pickForms(count).map((form) => ({
      tender_id: tender.id,
      ...form,
      status: 'not_started',
    }))
  })

  console.log(`Seeding ${formRows.length} form checklist entries...`)

  const { error: formError } = await supabase.from('form_checklists').insert(formRows)

  if (formError) {
    console.error('Error inserting form checklists:', formError.message)
    process.exit(1)
  }

  console.log('Seed complete.')
}

seed()
