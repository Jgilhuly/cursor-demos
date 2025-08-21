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
      <div className="container-narrow">
        <div className="error">Invalid course ID</div>
        <button onClick={handleBackClick} className="btn btn-secondary mt-4">
          Back to Courses
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container-narrow">
        <div className="loading">Loading course details...</div>
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className="container-narrow">
        <div className="error">
          Failed to load course details{error instanceof Error ? `: ${error.message}` : ''}
        </div>
        <button onClick={handleBackClick} className="btn btn-secondary mt-4">
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
    <div className="container-narrow">
      <button onClick={handleBackClick} className="btn btn-secondary back-button">
        Back to Courses
      </button>

      <div className="card course-details">
        <h1 className="course-title">{course.title}</h1>
        
        {course.code && (
          <div className="badge badge-secondary mb-4">
            Course Code: {course.code}
          </div>
        )}

        {course.description && (
          <p className="text-lg mb-6">
            {course.description}
          </p>
        )}

        <div className="course-meta">
          <div className="course-meta-item">
            <h4>Status</h4>
            <div className={`badge ${course.active ? 'badge-success' : 'badge-destructive'}`}>
              {course.active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="course-meta-item">
            <h4>Publication</h4>
            <div className={`badge ${course.published ? 'badge-primary' : 'badge-warning'}`}>
              {course.published ? 'Published' : 'Draft'}
            </div>
          </div>

          <div className="course-meta-item">
            <h4>Enrollment</h4>
            <div className="badge badge-secondary">
              {getEnrollmentStatus(course)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-responsive course-dates">
          <div className="course-meta-item">
            <h4>Start Date</h4>
            <div className="text-sm text-muted">
              {formatDate(course.startDate)}
            </div>
          </div>

          <div className="course-meta-item">
            <h4>End Date</h4>
            <div className="text-sm text-muted">
              {formatDate(course.endDate)}
            </div>
          </div>

          {course.maxEnrollments && (
            <div className="course-meta-item">
              <h4>Max Enrollments</h4>
              <div className="text-sm text-muted">
                {course.maxEnrollments}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
