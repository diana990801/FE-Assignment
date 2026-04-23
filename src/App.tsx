import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NewsAnalyticsPage from '@/pages/NewsAnalytics'
import EntityMonitorPage from '@/pages/EntityMonitor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/news-analytics" replace />} />
        <Route path="/news-analytics" element={<NewsAnalyticsPage />} />
        <Route path="/entity-monitor" element={<EntityMonitorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
