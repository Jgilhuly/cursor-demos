# Learning Management System - Architecture Diagram

## System Overview

This Learning Management System (LMS) is a full-stack application built with Spring Boot (Java) backend and React (TypeScript) frontend, designed to manage courses, modules, lessons, assignments, and user enrollments.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        UI[React Components]
        API[API Client]
        Router[React Router]
    end
    
    subgraph "Backend (Spring Boot)"
        Controllers[REST Controllers]
        Services[Business Logic]
        Repositories[Data Access Layer]
        Entities[Domain Models]
    end
    
    subgraph "Database"
        DB[(H2/PostgreSQL)]
    end
    
    subgraph "External"
        Browser[Web Browser]
    end
    
    Browser --> UI
    UI --> API
    API --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Entities
    Entities --> DB
```

## Backend Architecture (Spring Boot)

### 1. Domain Layer (Entities)

```mermaid
classDiagram
    class User {
        +Long id
        +String username
        +String email
        +String password
        +String firstName
        +String lastName
        +UserRole role
        +Set~Enrollment~ enrollments
        +Set~Course~ instructorCourses
    }
    
    class Course {
        +Long id
        +String title
        +String description
        +String code
        +boolean isActive
        +boolean isPublished
        +Integer maxEnrollments
        +LocalDateTime startDate
        +LocalDateTime endDate
        +User instructor
        +Set~Module~ modules
        +Set~Assignment~ assignments
        +Set~Enrollment~ enrollments
    }
    
    class Module {
        +Long id
        +String title
        +String description
        +Integer orderIndex
        +boolean isPublished
        +Integer estimatedDurationMinutes
        +Course course
        +Set~Lesson~ lessons
    }
    
    class Lesson {
        +Long id
        +String title
        +String content
        +Integer orderIndex
        +boolean isPublished
        +Integer estimatedDurationMinutes
        +Module module
    }
    
    class Assignment {
        +Long id
        +String title
        +String description
        +LocalDateTime dueDate
        +Integer maxPoints
        +boolean isPublished
        +boolean allowLateSubmission
        +Course course
        +Set~AssignmentSubmission~ submissions
    }
    
    class Enrollment {
        +Long id
        +LocalDateTime enrolledAt
        +EnrollmentStatus status
        +User student
        +Course course
    }
    
    class AssignmentSubmission {
        +Long id
        +String content
        +LocalDateTime submittedAt
        +Integer score
        +SubmissionStatus status
        +User student
        +Assignment assignment
    }
    
    User ||--o{ Enrollment : has
    User ||--o{ Course : instructs
    Course ||--o{ Module : contains
    Course ||--o{ Assignment : has
    Course ||--o{ Enrollment : receives
    Module ||--o{ Lesson : contains
    Assignment ||--o{ AssignmentSubmission : receives
    User ||--o{ AssignmentSubmission : submits
```

### 2. Repository Layer

```mermaid
graph LR
    subgraph "Repository Interfaces"
        UserRepo[UserRepository]
        CourseRepo[CourseRepository]
        ModuleRepo[ModuleRepository]
        LessonRepo[LessonRepository]
        AssignmentRepo[AssignmentRepository]
    end
    
    subgraph "Spring Data JPA"
        JPA[Spring Data JPA]
        Query[Custom Queries]
    end
    
    subgraph "Database"
        DB[(H2/PostgreSQL)]
    end
    
    UserRepo --> JPA
    CourseRepo --> JPA
    ModuleRepo --> JPA
    LessonRepo --> JPA
    AssignmentRepo --> JPA
    JPA --> Query
    Query --> DB
```

### 3. Controller Layer

```mermaid
graph TB
    subgraph "REST Controllers"
        CourseCtrl[CourseController]
        UserCtrl[UserController]
        ModuleCtrl[ModuleController]
        LessonCtrl[LessonController]
        AssignmentCtrl[AssignmentController]
    end
    
    subgraph "HTTP Endpoints"
        GET[GET /courses]
        POST[POST /courses]
        PUT[PUT /courses/{id}]
        DELETE[DELETE /courses/{id}]
        SEARCH[GET /courses/search]
        AVAILABLE[GET /courses/available]
    end
    
    subgraph "Cross-Origin"
        CORS[Cross-Origin Support]
    end
    
    CourseCtrl --> GET
    CourseCtrl --> POST
    CourseCtrl --> PUT
    CourseCtrl --> DELETE
    CourseCtrl --> SEARCH
    CourseCtrl --> AVAILABLE
    CourseCtrl --> CORS
```

## Frontend Architecture (React + TypeScript)

### 1. Component Structure

```mermaid
graph TB
    subgraph "App Component"
        App[App.tsx]
        Router[React Router]
    end
    
    subgraph "Pages"
        CoursesPage[CoursesPage.tsx]
        CourseDetail[CourseDetail.tsx]
        UserProfile[UserProfile.tsx]
    end
    
    subgraph "Components"
        CourseCard[CourseCard.tsx]
        SearchBar[SearchBar.tsx]
        Navigation[Navigation.tsx]
    end
    
    subgraph "Libraries"
        API[API Client]
        Types[TypeScript Types]
        Utils[Utility Functions]
    end
    
    App --> Router
    Router --> CoursesPage
    Router --> CourseDetail
    Router --> UserProfile
    CoursesPage --> CourseCard
    CoursesPage --> SearchBar
    CoursesPage --> Navigation
    CoursesPage --> API
    API --> Types
```

### 2. Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React Component
    participant A as API Client
    participant B as Backend API
    participant D as Database
    
    U->>R: Interact with UI
    R->>A: Call API function
    A->>B: HTTP Request
    B->>D: Query Database
    D-->>B: Return Data
    B-->>A: HTTP Response
    A-->>R: Return Promise
    R->>R: Update State
    R-->>U: Re-render UI
```

## Data Loading and Initialization

### 1. Application Startup Flow

```mermaid
graph TB
    subgraph "Spring Boot Startup"
        Main[LmsApplication.main]
        Context[Application Context]
        DataLoader[DataLoader.run]
    end
    
    subgraph "Database Initialization"
        Check[Check if data exists]
        Load[Load sample data]
        Users[Create sample users]
        Courses[Create sample courses]
        Modules[Create sample modules]
        Lessons[Create sample lessons]
        Assignments[Create sample assignments]
    end
    
    subgraph "Sample Data"
        Admin[Admin User]
        Instructor[Instructor User]
        Students[Student Users]
        JavaCourse[Java Course]
        WebCourse[Web Course]
        PythonCourse[Python Course]
        DBCourse[Database Course]
    end
    
    Main --> Context
    Context --> DataLoader
    DataLoader --> Check
    Check --> Load
    Load --> Users
    Load --> Courses
    Load --> Modules
    Load --> Lessons
    Load --> Assignments
    
    Users --> Admin
    Users --> Instructor
    Users --> Students
    Courses --> JavaCourse
    Courses --> WebCourse
    Courses --> PythonCourse
    Courses --> DBCourse
```

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 (development), PostgreSQL (production)
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **Validation**: Bean Validation (Jakarta)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: CSS Modules
- **HTTP Client**: Fetch API

### Development Tools
- **IDE Support**: ESLint configuration
- **Hot Reload**: Spring Boot DevTools + Vite HMR
- **Cross-Origin**: CORS enabled for development

## Key Features

1. **User Management**: Admin, Instructor, and Student roles
2. **Course Management**: Create, update, and manage courses
3. **Content Organization**: Hierarchical structure (Course → Module → Lesson)
4. **Assignment System**: Create and submit assignments
5. **Enrollment Management**: Student course enrollment tracking
6. **RESTful API**: Comprehensive backend API
7. **Modern Frontend**: Responsive React-based UI
8. **Data Persistence**: JPA-based data layer with multiple database support

## Security Considerations

- Input validation using Bean Validation
- CORS configuration for cross-origin requests
- Password handling (should be encrypted in production)
- Role-based access control structure

## Scalability Features

- Repository pattern for data access
- Service layer for business logic
- Entity relationships for efficient queries
- Modular component architecture
- Environment-based configuration

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer]
        Web[Web Server]
        App[Spring Boot App]
        DB[(PostgreSQL)]
    end
    
    subgraph "Development Environment"
        Dev[Local Development]
        H2[(H2 Database)]
    end
    
    LB --> Web
    Web --> App
    App --> DB
    Dev --> H2
```

This architecture provides a solid foundation for a learning management system with clear separation of concerns, modern technology stack, and scalable design patterns.
