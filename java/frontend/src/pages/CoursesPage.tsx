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
    <div 
      style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: 8, 
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6'
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <h3 style={{ margin: '0 0 8px 0' }}>{course.title}</h3>
      {course.code && (
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Code: {course.code}</div>
      )}
      {course.description && (
        <p style={{ margin: 0, color: '#374151' }}>
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
    if (isLoading) return <div>Loading courses…</div>
    if (isError)
      return (
        <div>
          Failed to load courses{error instanceof Error ? `: ${error.message}` : ''}
        </div>
      )
    const list = courses ?? []
    if (list.length === 0) {
      return <div>No courses found.</div>
    }
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {list.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    )
  }, [isLoading, isError, error, courses])

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Courses</h2>
      <form onSubmit={onSubmit} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
          style={{
            flex: '1 1 auto',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          disabled={isFetching}
          style={{
            padding: '8px 12px',
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: 'white',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {isFetching ? 'Searching…' : 'Search'}
        </button>
      </form>
      {body}
    </div>
  )
}


