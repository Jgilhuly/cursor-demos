import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourses, searchCourses } from '../lib/api'
import type { Course } from '../lib/types'

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`)
  }

  return (
    <div className="glass-card clickable" onClick={handleCardClick}>
      <h3 className="course-card-title">{course.title}</h3>
      {course.code && (
        <div className="course-card-code">Code: {course.code}</div>
      )}
      {course.description && (
        <p className="course-card-description">
          {course.description.length > 160
            ? course.description.slice(0, 157) + '...'
            : course.description}
        </p>
      )}
    </div>
  )
}

export default function CoursesPage() {
  const [query, setQuery] = useState('')

  const { data: courses, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['courses', query],
    queryFn: async () => {
      const trimmed = query.trim()
      if (trimmed.length > 0) return searchCourses(trimmed)
      return getCourses()
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  const body = useMemo(() => {
    if (isLoading) return <div className="loading-state">Loading courses…</div>
    if (isError)
      return (
        <div className="error-state">
          <p>Failed to load courses{error instanceof Error ? `: ${error.message}` : ''}</p>
        </div>
      )
    const list = courses ?? []
    if (list.length === 0) {
      return (
        <div className="glass-card text-center">
          <h3 style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 400 }}>
            No courses found
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
            {query ? 'Try adjusting your search terms' : 'No courses are available at the moment'}
          </p>
        </div>
      )
    }
    return (
      <div className="course-grid">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    )
  }, [isLoading, isError, error, courses])

  return (
    <div className="page-container">
      <div className="text-center mb-4">
        <h1 style={{ marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          📚 Learning Management System
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.125rem' }}>
          Discover and explore available courses
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="search-container">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses by title, code, or description..."
          aria-label="Search courses"
          className="form-input"
        />
        <button
          type="submit"
          disabled={isFetching}
          className="btn btn-primary"
        >
          {isFetching ? 'Searching…' : 'Search'}
        </button>
      </form>
      
      {body}
    </div>
  )
}


