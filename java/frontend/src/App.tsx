import { Link, Navigate, Route, Routes } from 'react-router-dom'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import './App.css'

function App() {
  return (
    <div className="min-h-screen">
      <header className="app-header">
        <nav className="app-nav">
          <Link to="/courses" className="app-logo">
            📚 Learning Management System
          </Link>
        </nav>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="*" element={
            <div className="not-found">
              <h1>404</h1>
              <p>Page not found</p>
              <Link to="/courses" className="btn btn-primary mt-4">
                Go back to Courses
              </Link>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
