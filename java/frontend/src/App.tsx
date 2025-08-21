import { Navigate, Route, Routes } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/courses" replace />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  )
}

export default App
