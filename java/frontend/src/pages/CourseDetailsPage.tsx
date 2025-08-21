import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourse } from '../lib/api'
import type { Course } from '../lib/types'

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const courseId = parseInt(id || '0', 10)

  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: courseId > 0,
  })

  const handleBackClick = () => {
    navigate('/courses')
  }

  if (courseId <= 0) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <div>Invalid course ID</div>
        <button
          onClick={handleBackClick}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            background: '#f9fafb',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Back to Courses
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <div>Loading course details...</div>
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <div>
          Failed to load course details{error instanceof Error ? `: ${error.message}` : ''}
        </div>
        <button
          onClick={handleBackClick}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            background: '#f9fafb',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Back to Courses
        </button>
      </div>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString()
  }

  const getEnrollmentStatus = (course: Course) => {
    if (!course.active) return 'Inactive'
    if (!course.published) return 'Draft'
    if (course.maxEnrollments && course.maxEnrollments > 0) {
      return `Open (${course.maxEnrollments} slots available)`
    }
    return 'Open (Unlimited)'
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={handleBackClick}
        style={{
          marginBottom: 24,
          padding: '8px 16px',
          border: '1px solid #d1d5db',
          background: '#f9fafb',
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        ← Back to Courses
      </button>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 24 }}>
        <h1 style={{ margin: '0 0 16px 0', color: '#111827' }}>{course.title}</h1>
        
        {course.code && (
          <div style={{ 
            fontSize: 14, 
            color: '#6b7280', 
            marginBottom: 16,
            padding: '4px 8px',
            background: '#f3f4f6',
            borderRadius: 4,
            display: 'inline-block'
          }}>
            Course Code: {course.code}
          </div>
        )}

        {course.description && (
          <p style={{ 
            margin: '0 0 24px 0', 
            color: '#374151',
            lineHeight: 1.6,
            fontSize: 16
          }}>
            {course.description}
          </p>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16,
          marginBottom: 24
        }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>Status</h4>
            <div style={{ 
              padding: '4px 8px', 
              background: course.active ? '#dcfce7' : '#fef2f2',
              color: course.active ? '#166534' : '#dc2626',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500
            }}>
              {course.active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>Publication</h4>
            <div style={{ 
              padding: '4px 8px', 
              background: course.published ? '#dbeafe' : '#fef3c7',
              color: course.published ? '#1e40af' : '#92400e',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500
            }}>
              {course.published ? 'Published' : 'Draft'}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>Enrollment</h4>
            <div style={{ 
              padding: '4px 8px', 
              background: '#f3f4f6',
              color: '#374151',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500
            }}>
              {getEnrollmentStatus(course)}
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16,
          borderTop: '1px solid #e5e7eb',
          paddingTop: 24
        }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>Start Date</h4>
            <div style={{ color: '#6b7280', fontSize: 14 }}>
              {formatDate(course.startDate)}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>End Date</h4>
            <div style={{ color: '#6b7280', fontSize: 14 }}>
              {formatDate(course.endDate)}
            </div>
          </div>

          {course.maxEnrollments && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: 14 }}>Max Enrollments</h4>
              <div style={{ color: '#6b7280', fontSize: 14 }}>
                {course.maxEnrollments}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
