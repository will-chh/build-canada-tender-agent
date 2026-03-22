import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import TenderDetailPage from './pages/TenderDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tender/:id" element={<TenderDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
