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
      <div className="page-container-narrow">
        <div className="error-state">
          <h2>Invalid Course ID</h2>
          <p>The course ID provided is not valid.</p>
          <button onClick={handleBackClick} className="btn btn-secondary mt-4">
            ← Back to Courses
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="page-container-narrow">
        <div className="loading-state">
          <h3>Loading course details...</h3>
        </div>
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className="page-container-narrow">
        <div className="error-state">
          <h2>Failed to Load Course</h2>
          <p>
            {error instanceof Error ? error.message : 'An unexpected error occurred while loading the course details.'}
          </p>
          <button onClick={handleBackClick} className="btn btn-secondary mt-4">
            ← Back to Courses
          </button>
        </div>
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
    <div className="page-container-narrow">
      <button onClick={handleBackClick} className="btn btn-ghost mb-4">
        ← Back to Courses
      </button>

      <div className="main-content-card">
        <h1 className="course-detail-title">{course.title}</h1>
        
        {course.code && (
          <div className="course-detail-code">
            Course Code: {course.code}
          </div>
        )}

        {course.description && (
          <p className="course-detail-description">
            {course.description}
          </p>
        )}

        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-label">Status</div>
            <div className={`status-badge ${course.active ? 'active' : 'inactive'}`}>
              {course.active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item-label">Publication</div>
            <div className={`status-badge ${course.published ? 'published' : 'draft'}`}>
              {course.published ? 'Published' : 'Draft'}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item-label">Enrollment</div>
            <div className="status-badge enrollment">
              {getEnrollmentStatus(course)}
            </div>
          </div>
        </div>

        <div className="info-grid section-divider">
          <div className="info-item">
            <div className="info-item-label">Start Date</div>
            <div className="info-item-value">
              {formatDate(course.startDate)}
            </div>
          </div>

          <div className="info-item">
            <div className="info-item-label">End Date</div>
            <div className="info-item-value">
              {formatDate(course.endDate)}
            </div>
          </div>

          {course.maxEnrollments && (
            <div className="info-item">
              <div className="info-item-label">Max Enrollments</div>
              <div className="info-item-value">
                {course.maxEnrollments}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
