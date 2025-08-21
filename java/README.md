# Learning Management System (LMS)

A comprehensive Learning Management System built with Spring Boot, demonstrating modern Java development practices and enterprise application architecture.

## 🎯 Project Overview

This LMS is designed to showcase Java development capabilities including:
- **Spring Boot 3.2** with Java 17
- **JPA/Hibernate** for data persistence
- **RESTful API** design
- **Comprehensive domain modeling**
- **Professional project structure**

## 🚀 Features

### Core Functionality
- **User Management**: Students, Instructors, and Administrators
- **Course Management**: Create, publish, and manage courses
- **Content Organization**: Modules and lessons with rich content support
- **Student Enrollment**: Course registration and progress tracking
- **Assignment System**: Create, submit, and grade assignments
- **Progress Tracking**: Monitor student advancement through courses

### Technical Features
- **Data Validation**: Comprehensive input validation and error handling
- **Audit Trail**: Automatic timestamp tracking for all entities
- **Flexible Content**: Support for text, video, and file attachments
- **Scalable Architecture**: Designed for enterprise-level deployment

## 🏗️ Architecture

### Domain Model
```
User (STUDENT, INSTRUCTOR, ADMIN)
├── Course (created by INSTRUCTOR)
│   ├── Module (course sections)
│   │   └── Lesson (individual content units)
│   ├── Assignment (graded tasks)
│   └── Enrollment (student participation)
└── AssignmentSubmission (student work)
```

### Technology Stack
- **Backend**: Spring Boot 3.2, Java 17
- **Database**: H2 (development), PostgreSQL (production)
- **Build Tool**: Maven
- **API**: RESTful endpoints (no authentication in this demo)
- **Frontend**: Thymeleaf templates (can be extended to React/Angular)

## 🛠️ Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning-management-system
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - Main API: http://localhost:8080/api
   - H2 Console: http://localhost:8080/api/h2-console
   - Database: jdbc:h2:mem:lmsdb (username: sa, password: password)

## 📚 API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Enrollments
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments/user/{userId}` - Get user enrollments
- `PUT /api/enrollments/{id}/status` - Update enrollment status

### Assignments
- `GET /api/assignments/course/{courseId}` - List course assignments
- `POST /api/assignments` - Create assignment
- `POST /api/assignments/{id}/submissions` - Submit assignment
- `PUT /api/submissions/{id}/grade` - Grade submission

## 🗄️ Database Schema

The application uses JPA/Hibernate with automatic schema generation. Key tables include:

- **users**: User accounts and profiles
- **courses**: Course information and metadata
- **modules**: Course sections
- **lessons**: Individual learning units
- **assignments**: Graded tasks
- **enrollments**: Student course registrations
- **assignment_submissions**: Student work submissions

## 🔒 Security

For this demo, authentication and authorization are disabled. All endpoints are publicly accessible.

## 🧪 Testing

Run tests with:
```bash
mvn test
```

The project includes:
- Unit tests for services and repositories
- Integration tests for API endpoints
 

## 🚀 Deployment

### Development
- Uses H2 in-memory database
- Automatic schema generation
- Detailed logging enabled

### Production
- Configure PostgreSQL database
- Enable production logging levels
- Configure CORS for production domains

## 📈 Future Enhancements

- **Real-time notifications** using WebSockets
- **File upload service** for assignments and content
- **Advanced analytics** and reporting
- **Mobile app** support
- **Integration** with external LMS standards (SCORM, xAPI)
- **Multi-language support**
- **Advanced assessment types** (quizzes, surveys)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Spring Boot and Java 17**
