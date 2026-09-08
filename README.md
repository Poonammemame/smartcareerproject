# Smart Career Recommendation and Online Assessment System (`smartcareerproject`)

A comprehensive career guidance and assessment platform featuring an online assessment engine, automated career path recommendations, learning roadmap visualization, and administrative controls.

---

## 📁 Repository Architecture

This repository is organized as a multi-module / separated frontend-backend project:

```
smartcareerproject/
├── frontend/                     # Web Presentation Layer (JSP / Servlet / JSTL)
│   ├── src/main/webapp/          # JSP Views, CSS Styles, JavaScript Controllers
│   │   ├── CSS/                  # UI stylesheets (dashboard, career, assessment, etc.)
│   │   ├── JS/                   # Client-side logic & API integration
│   │   ├── common/               # Shared sidebars and topbars
│   │   ├── WEB-INF/              # web.xml deployment descriptor
│   │   └── *.jsp                 # Pages (login, register, userDashboard, adminDashboard, etc.)
│   └── pom.xml                   # Maven configuration for frontend WAR
│
├── backend/                      # REST API & Business Logic Layer (Spring Boot)
│   ├── src/main/java/org/techhub/# Spring Boot Controllers, Services, Repositories, Models
│   │   ├── controller/           # REST endpoints (Auth, Assessment, Career, Question, etc.)
│   │   ├── service/              # Business logic & Career recommendation algorithms
│   │   ├── repository/           # Spring JDBC data access layers
│   │   ├── security/             # Spring Security & JWT authentication filter
│   │   ├── dto/                  # Request and Response Transfer Objects
│   │   └── model/                # Domain models
│   ├── src/main/resources/       # application.properties configuration
│   ├── pom.xml                   # Maven dependencies (Spring Boot, MySQL, JWT, Mail)
│   ├── mvnw / mvnw.cmd           # Maven wrapper scripts
│   └── .mvn/                     # Maven wrapper configuration
│
├── .gitignore                    # Git ignore file for Java/Maven/Eclipse/IntelliJ
└── README.md                     # Project documentation
```

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 4.x
- **Language**: Java 17
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Database Access**: Spring JDBC (`JdbcTemplate`)
- **Database**: MySQL 8.x
- **Email Service**: Spring Mail (Gmail SMTP)
- **API Documentation**: SpringDoc OpenAPI / Swagger

### Frontend
- **View Engine**: Jakarta JSP (JavaServer Pages) & JSTL
- **Styling**: Responsive Custom CSS
- **Interactivity**: Vanilla JavaScript (Async Fetch API)
- **Server**: Apache Tomcat 10+ (Jakarta EE compatible)

---

## 🚀 Getting Started

### 1. Database Setup
1. Ensure MySQL server is installed and running on `localhost:3306`.
2. Create the database:
   ```sql
   CREATE DATABASE pathfind;
   ```
3. Update MySQL credentials in `backend/src/main/resources/application.properties` if different:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pathfind
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 2. Running the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and run using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```cmd
   mvnw.cmd spring-boot:run
   ```
3. Backend REST APIs will be accessible at: `http://localhost:8080`

### 3. Deploying the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Build the WAR package:
   ```bash
   mvn clean package
   ```
3. Deploy the generated `ROOT.war` (or `PathFinder_Frontend.war`) into Apache Tomcat 10 `webapps` directory, or run directly via your IDE (Eclipse / IntelliJ) configured with Tomcat 10.1+.
4. Access the frontend application in your browser: `http://localhost:8080/` (or configured Tomcat port).

---

## 🔐 Key Features
- **User Authentication**: Secure user registration, login, and password reset with JWT tokens and OTP verification.
- **Online Skill Assessments**: Dynamically assigned assessments with timers and scoring.
- **Career Recommendations**: Personalized career paths based on assessment results and user skills.
- **Learning Roadmaps**: Step-by-step roadmap and resources for suggested career trajectories.
- **Admin Management Panel**:
  - Manage users, questions, careers, recommendations, and resources.
  - View overall test metrics and user assessment outcomes.
