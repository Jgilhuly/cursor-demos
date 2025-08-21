package com.lms.controller;

import com.lms.domain.Course;
import com.lms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for course-related operations
 * 
 * Provides endpoints for:
 * - Listing all courses
 * - Getting course details
 * - Creating new courses
 * - Updating existing courses
 */
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*") // Allow all origins for demo purposes
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    /**
     * Get all courses
     */
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findByIsPublishedTrueAndIsActiveTrue();
        return ResponseEntity.ok(courses);
    }

    /**
     * Get course by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get course by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Course> getCourseByCode(@PathVariable String code) {
        Course course = courseRepository.findByCode(code);
        if (course != null) {
            return ResponseEntity.ok(course);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Search courses by title or description
     */
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String q) {
        List<Course> courses = courseRepository.searchByTitleOrDescription(q);
        return ResponseEntity.ok(courses);
    }

    /**
     * Get courses with available enrollment slots
     */
    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        List<Course> courses = courseRepository.findCoursesWithAvailableSlots();
        return ResponseEntity.ok(courses);
    }

    /**
     * Create a new course
     */
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    /**
     * Update an existing course
     */
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    existingCourse.setTitle(courseDetails.getTitle());
                    existingCourse.setDescription(courseDetails.getDescription());
                    existingCourse.setCode(courseDetails.getCode());
                    existingCourse.setMaxEnrollments(courseDetails.getMaxEnrollments());
                    existingCourse.setStartDate(courseDetails.getStartDate());
                    existingCourse.setEndDate(courseDetails.getEndDate());
                    existingCourse.setActive(courseDetails.isActive());
                    existingCourse.setPublished(courseDetails.isPublished());
                    
                    Course updatedCourse = courseRepository.save(existingCourse);
                    return ResponseEntity.ok(updatedCourse);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a course
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
