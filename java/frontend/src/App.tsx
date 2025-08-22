import { Link, Navigate, Route, Routes } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="*" element={
          <div className="not-found-container">
            <div className="not-found-content">
              <h1>404</h1>
              <p>The page you're looking for doesn't exist.</p>
              <Link to="/courses" className="btn btn-primary">
                Go to Courses
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
