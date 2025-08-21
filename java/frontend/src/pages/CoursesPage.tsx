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
    <div className="card card-interactive course-card" onClick={handleCardClick}>
      <h3>{course.title}</h3>
      {course.code && (
        <div className="course-code">Code: {course.code}</div>
      )}
      {course.description && (
        <p className="course-description">
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
    if (isLoading) return <div className="loading">Loading courses…</div>
    if (isError)
      return (
        <div className="error">
          Failed to load courses{error instanceof Error ? `: ${error.message}` : ''}
        </div>
      )
    const list = courses ?? []
    if (list.length === 0) {
      return <div className="text-center text-muted">No courses found.</div>
    }
    return (
      <div className="courses-grid">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    )
  }, [isLoading, isError, error, courses])

  return (
    <div className="container">
      <h2 className="mt-0">Courses</h2>
      <form onSubmit={onSubmit} className="search-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
          className="input search-input"
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


