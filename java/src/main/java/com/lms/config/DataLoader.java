package com.lms.config;

import com.lms.domain.*;
import com.lms.repository.UserRepository;
import com.lms.repository.CourseRepository;
import com.lms.repository.ModuleRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Data loader to populate the database with sample data for demonstration purposes
 * 
 * This class runs on application startup and creates:
 * - Sample users (admin, instructor, student)
 * - Sample course with modules and lessons
 * - Sample assignments
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    

    @Override
    public void run(String... args) throws Exception {
        // Only load data if no users exist
        if (userRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        // Create users
        User admin = createUser("admin", "admin@lms.com", "admin123", "Admin", "User", UserRole.ADMIN);
        User instructor = createUser("instructor", "instructor@lms.com", "instructor123", "John", "Doe", UserRole.INSTRUCTOR);
        User student1 = createUser("student1", "student1@lms.com", "student123", "Alice", "Johnson", UserRole.STUDENT);
        User student2 = createUser("student2", "student2@lms.com", "student123", "Bob", "Smith", UserRole.STUDENT);

        // Create course
        Course javaCourse = createCourse("Introduction to Java Programming", 
            "Learn the fundamentals of Java programming language including OOP concepts, data structures, and best practices.", 
            "JAVA101", instructor);

        // Create modules
        com.lms.domain.Module module1 = createModule("Getting Started with Java", 
            "Introduction to Java basics, setting up development environment, and writing your first program.", 
            1, javaCourse);
        
        com.lms.domain.Module module2 = createModule("Object-Oriented Programming", 
            "Learn about classes, objects, inheritance, polymorphism, and encapsulation in Java.", 
            2, javaCourse);

        // Create lessons
        createLesson("What is Java?", 
            "Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.", 
            1, module1);
        
        createLesson("Setting up Java Development Environment", 
            "Learn how to install Java JDK, set up environment variables, and configure your IDE for Java development.", 
            2, module1);
        
        createLesson("Your First Java Program", 
            "Write and run your first Java program. Learn about the main method, System.out.println, and basic syntax.", 
            3, module1);
        
        createLesson("Classes and Objects", 
            "Understand the relationship between classes and objects. Learn how to create classes and instantiate objects.", 
            1, module2);
        
        createLesson("Inheritance", 
            "Learn about inheritance in Java, how to extend classes, and use the 'extends' keyword.", 
            2, module2);

        // Create assignments
        createAssignment("Hello World Program", 
            "Create a simple Java program that prints 'Hello, World!' to the console. Submit your source code file.", 
            javaCourse, LocalDateTime.now().plusDays(7), 50);
        
        createAssignment("Simple Calculator", 
            "Create a basic calculator class with methods for addition, subtraction, multiplication, and division. Include proper error handling.", 
            javaCourse, LocalDateTime.now().plusDays(14), 100);

        System.out.println("✅ Sample data loaded successfully!");
        System.out.println("👤 Users created: " + userRepository.count());
        System.out.println("📚 Courses created: " + courseRepository.count());
        System.out.println("📖 Modules created: " + moduleRepository.count());
        System.out.println("📝 Lessons created: " + lessonRepository.count());
        System.out.println("📋 Assignments created: " + assignmentRepository.count());
    }

    private User createUser(String username, String email, String password, String firstName, String lastName, UserRole role) {
        User user = new User(username, email, password, firstName, lastName, role);
        return userRepository.save(user);
    }

    private Course createCourse(String title, String description, String code, User instructor) {
        Course course = new Course(title, description, code, instructor);
        course.setPublished(true);
        course.setStartDate(LocalDateTime.now());
        course.setEndDate(LocalDateTime.now().plusMonths(3));
        course.setMaxEnrollments(50);
        return courseRepository.save(course);
    }

    private com.lms.domain.Module createModule(String title, String description, Integer orderIndex, Course course) {
        com.lms.domain.Module module = new com.lms.domain.Module(title, description, orderIndex, course);
        module.setPublished(true);
        module.setEstimatedDurationMinutes(120);
        return moduleRepository.save(module);
    }

    private Lesson createLesson(String title, String content, Integer orderIndex, com.lms.domain.Module module) {
        Lesson lesson = new Lesson(title, content, orderIndex, module);
        lesson.setPublished(true);
        lesson.setEstimatedDurationMinutes(30);
        return lessonRepository.save(lesson);
    }

    private Assignment createAssignment(String title, String description, Course course, LocalDateTime dueDate, Integer maxPoints) {
        Assignment assignment = new Assignment(title, description, course);
        assignment.setDueDate(dueDate);
        assignment.setMaxPoints(maxPoints);
        assignment.setPublished(true);
        assignment.setAllowLateSubmission(true);
        return assignmentRepository.save(assignment);
    }
}
