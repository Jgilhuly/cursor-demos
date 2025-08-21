package com.lms.repository;

import com.lms.domain.Lesson;
import com.lms.domain.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Lesson entity operations
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    /**
     * Find lessons by module
     */
    List<Lesson> findByModule(Module module);
    
    /**
     * Find published lessons by module
     */
    List<Lesson> findByModuleAndIsPublishedTrue(Module module);
    
    /**
     * Find lessons by module ordered by order index
     */
    List<Lesson> findByModuleOrderByOrderIndexAsc(Module module);
}
