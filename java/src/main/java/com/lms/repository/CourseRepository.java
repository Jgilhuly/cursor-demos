package com.lms.repository;

import com.lms.domain.Course;
import com.lms.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Course entity operations
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    /**
     * Find courses by instructor
     */
    List<Course> findByInstructor(User instructor);
    
    /**
     * Find published courses
     */
    List<Course> findByIsPublishedTrue();
    
    /**
     * Find active courses
     */
    List<Course> findByIsActiveTrue();
    
    /**
     * Find published and active courses
     */
    List<Course> findByIsPublishedTrueAndIsActiveTrue();
    
    /**
     * Find courses by code
     */
    Course findByCode(String code);
    
    /**
     * Check if course code exists
     */
    boolean existsByCode(String code);
    
    /**
     * Search courses by title or description
     */
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:searchTerm% OR c.description LIKE %:searchTerm%")
    List<Course> searchByTitleOrDescription(@Param("searchTerm") String searchTerm);
    
    /**
     * Find courses with available enrollment slots
     */
    @Query("SELECT c FROM Course c WHERE c.isActive = true AND c.isPublished = true AND (c.maxEnrollments IS NULL OR c.maxEnrollments > (SELECT COUNT(e) FROM Enrollment e WHERE e.course = c))")
    List<Course> findCoursesWithAvailableSlots();
}
