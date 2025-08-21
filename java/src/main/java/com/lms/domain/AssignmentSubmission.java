package com.lms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * AssignmentSubmission entity representing a student's submission for an assignment
 */
@Entity
@Table(name = "assignment_submissions")
@EntityListeners(AuditingEntityListener.class)
public class AssignmentSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Size(max = 5000, message = "Submission content cannot exceed 5000 characters")
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "attachment_url")
    private String attachmentUrl;
    
    @Column(name = "submitted_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime submittedAt;
    
    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
    
    @Column(name = "score")
    private Double score;
    
    @Column(name = "max_score")
    private Double maxScore;
    
    @Size(max = 1000, message = "Feedback cannot exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.SUBMITTED;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;
    
    // Constructors
    public AssignmentSubmission() {}
    
    public AssignmentSubmission(String content, User user, Assignment assignment) {
        this.content = content;
        this.user = user;
        this.assignment = assignment;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }
    
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    
    public Double getMaxScore() { return maxScore; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }
    
    // Utility methods
    public boolean isGraded() {
        return score != null && gradedAt != null;
    }
    
    public boolean isLate() {
        return assignment != null && assignment.getDueDate() != null && 
               submittedAt.isAfter(assignment.getDueDate());
    }
    
    public Double getPercentageScore() {
        if (score == null || maxScore == null || maxScore == 0) {
            return null;
        }
        return (score / maxScore) * 100;
    }
    
    @Override
    public String toString() {
        return "AssignmentSubmission{" +
                "id=" + id +
                ", user=" + (user != null ? user.getUsername() : "null") +
                ", assignment=" + (assignment != null ? assignment.getTitle() : "null") +
                ", status=" + status +
                ", score=" + score +
                ", submittedAt=" + submittedAt +
                '}';
    }
}
