package com.lms.repository;

import com.lms.domain.User;
import com.lms.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users by role
     */
    List<User> findByRole(UserRole role);
    
    /**
     * Find active users
     */
    List<User> findByIsActiveTrue();
    
    /**
     * Find users by role and active status
     */
    List<User> findByRoleAndIsActiveTrue(UserRole role);
    
    /**
     * Search users by name (first name or last name contains search term)
     */
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm%")
    List<User> searchByName(@Param("searchTerm") String searchTerm);
    
    /**
     * Find users enrolled in a specific course
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.enrollments e WHERE e.course.id = :courseId")
    List<User> findUsersEnrolledInCourse(@Param("courseId") Long courseId);
}
