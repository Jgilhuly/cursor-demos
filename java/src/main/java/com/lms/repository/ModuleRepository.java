package com.lms.repository;

import com.lms.domain.Module;
import com.lms.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Module entity operations
 */
@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    
    /**
     * Find modules by course
     */
    List<Module> findByCourse(Course course);
    
    /**
     * Find published modules by course
     */
    List<Module> findByCourseAndIsPublishedTrue(Course course);
    
    /**
     * Find modules by course ordered by order index
     */
    List<Module> findByCourseOrderByOrderIndexAsc(Course course);
}
