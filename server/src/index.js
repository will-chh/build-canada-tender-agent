import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import profileRoutes from './routes/profile.js'
import tenderRoutes from './routes/tenders.js'
import formRoutes from './routes/forms.js'
import aiRoutes from './routes/ai.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Health checks
app.get('/', (req, res) => res.json({ status: 'ok' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/profile', profileRoutes)
app.use('/api/tenders', tenderRoutes)
app.use('/api/forms', formRoutes)
app.use('/api', aiRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
