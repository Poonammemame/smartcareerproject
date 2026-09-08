/* ============================================================
   PATHFINDER - PERSONALIZED LEARNING ROADMAP
   With Milestone Quiz Engine & MySQL Learning Resources
   ============================================================ */

console.log("======================================");
console.log("learningRoadmap.js LOADED (Milestone Quiz + Analytics v20260827_10)");
console.log("======================================");


/* ============================================================
   CONFIGURATION
============================================================ */

window.API_BASE_URL = window.API_BASE_URL || (typeof getApiBaseUrl === "function" ? getApiBaseUrl() : "http://localhost:8090/api");

var MY_RESULT_API = API_BASE_URL + "/result/my";
var MY_RECOMMENDATION_API = API_BASE_URL + "/recommendation/my";
var MY_RESOURCE_API = API_BASE_URL + "/resource/my";


/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let jwtToken = null;
let latestResult = null;
let currentCareer = null;
let currentCareerId = 7;
let roadmapData = [];
let dbLearningResources = [];
let completedStages = [];

// Quiz State
let activeQuizStage = 1;
let activeQuizQuestions = [];
let currentQuestionIndex = 0;
let userQuizAnswers = [];
let quizSubmitted = false;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Learning Roadmap Page Loaded");
    jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
        showRoadmapError("Login session not found. Please login again.");
        return;
    }

    const retryButton = document.getElementById("retryRoadmapBtn");
    if (retryButton) {
        retryButton.addEventListener("click", function () {
            loadPersonalizedRoadmap();
        });
    }

    loadPersonalizedRoadmap();
});


/* ============================================================
   LOAD PERSONALIZED ROADMAP & DATABASE RESOURCES
============================================================ */

function loadPersonalizedRoadmap() {
    showRoadmapLoading();
    jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
        showRoadmapError("Login session not found. Please login again.");
        return;
    }

    // 1. Fetch DB Learning Resources
    fetch(MY_RESOURCE_API, {
        method: "GET",
        headers: { "Authorization": "Bearer " + jwtToken, "Accept": "application/json" }
    })
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (resList) {
        if (Array.isArray(resList) && resList.length > 0) {
            dbLearningResources = resList;
            console.log("✅ Loaded " + resList.length + " resources from MySQL database.");
        }
    })
    .catch(function (e) {
        console.warn("DB resource fetch warning:", e);
    });

    // 2. Fetch Career Recommendation
    fetch(MY_RECOMMENDATION_API, {
        method: "GET",
        headers: { "Authorization": "Bearer " + jwtToken, "Accept": "application/json" }
    })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (recData) {
        if (recData) {
            let rec = Array.isArray(recData) ? recData[0] : recData;
            let cName = rec.careerName || rec.career_name || rec.name;
            currentCareerId = rec.careerId || rec.career_id || 7;

            if (cName) {
                currentCareer = getCareerConfig(cName, rec.matchPercentage || 70);
                roadmapData = getRoadmapForCareer(currentCareer.name);
                loadCompletedStages();
                displayCareerInformation();
                displaySummary();
                renderRoadmap();
                updateOverallProgress();
                showRoadmapContent();
                return;
            }
        }
        fetchResultsFallback();
    })
    .catch(function (err) {
        fetchResultsFallback();
    });
}

function fetchResultsFallback() {
    fetch(MY_RESULT_API, {
        method: "GET",
        headers: { "Authorization": "Bearer " + jwtToken, "Accept": "application/json" }
    })
    .then(function (response) {
        if (response.status === 401) throw new Error("Your session has expired. Please login again.");
        if (!response.ok) throw new Error("Unable to load assessment result.");
        return response.json();
    })
    .then(function (data) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error("No assessment result found. Please complete the assessment first.");
        }

        latestResult = Array.isArray(data) ? data[0] : data;
        const percentage = calculatePercentage(latestResult);
        currentCareer = getCareerRecommendationByScore(percentage);
        roadmapData = getRoadmapForCareer(currentCareer.name);

        loadCompletedStages();
        displayCareerInformation();
        displaySummary();
        renderRoadmap();
        updateOverallProgress();
        showRoadmapContent();
    })
    .catch(function (error) {
        showRoadmapError(error.message || "Unable to load personalized roadmap.");
    });
}

function calculatePercentage(result) {
    if (!result) return 0;
    const totalQuestions = Number(result.totalQuestions || result.total_questions || 0);
    const correctAnswers = Number(result.correctAnswers || result.correct_answers || 0);
    let percentage = Number(result.percentage || result.percentage_score || 0);

    if (percentage <= 0 && totalQuestions > 0) {
        percentage = (correctAnswers / totalQuestions) * 100;
    }
    percentage = Math.max(0, Math.min(percentage, 100));
    return Math.round(percentage * 100) / 100;
}


/* ============================================================
   CAREER CONFIGURATION BY NAME & SCORE
============================================================ */

function getCareerConfig(careerName, matchScore) {
    const c = (careerName || "").toLowerCase();

    if (c.includes("software developer") || c.includes("java developer")) {
        currentCareerId = 1;
        return {
            name: "Software Developer",
            icon: "fa-code",
            category: "Software Development",
            description: "Your profile aligns with Software Development. Master object-oriented design, algorithms, databases, and enterprise REST APIs.",
            goal: "Become a Job-Ready Software Developer",
            goalDescription: "Master clean coding, data structures, Spring Boot REST APIs, SQL databases, and build portfolio projects."
        };
    } else if (c.includes("web developer") || c.includes("frontend")) {
        currentCareerId = 3;
        return {
            name: "Web Developer",
            icon: "fa-globe",
            category: "Web Development",
            description: "Your results show high aptitude for Web Development. Build responsive UIs, full-stack JavaScript, and modern web applications.",
            goal: "Become a Job-Ready Web Developer",
            goalDescription: "Build interactive SPAs, responsive styling, full-stack backend integrations, and production web apps."
        };
    } else if (c.includes("data analyst") || c.includes("analytics")) {
        currentCareerId = 2;
        return {
            name: "Data Analyst",
            icon: "fa-chart-pie",
            category: "Data & Business Intelligence",
            description: "Strong analytical and problem-solving abilities suited for analyzing datasets and building business intelligence dashboards.",
            goal: "Become a Job-Ready Data Analyst",
            goalDescription: "Master SQL querying, Python for data science, statistics, and PowerBI dashboards."
        };
    } else if (c.includes("qa") || c.includes("testing") || c.includes("tester")) {
        currentCareerId = 4;
        return {
            name: "QA Tester",
            icon: "fa-vial-circle-check",
            category: "Quality Assurance & Testing",
            description: "Logical verification and attention to detail make Software Testing & Automation an ideal career path.",
            goal: "Become a Job-Ready QA Engineer",
            goalDescription: "Learn test design, Selenium automation, API testing with Postman, and defect management."
        };
    } else {
        currentCareerId = 7;
        return {
            name: "Skill Development",
            icon: "fa-graduation-cap",
            category: "Foundational Skill Building",
            description: "Focus on strengthening programming fundamentals, logical reasoning, and aptitude to prepare for developer tracks.",
            goal: "Build a Strong Technical Foundation",
            goalDescription: "Master computer science concepts, object-oriented programming, data structures, and problem-solving."
        };
    }
}

function getCareerRecommendationByScore(percentage) {
    if (percentage >= 80) return getCareerConfig("Software Developer", percentage);
    if (percentage >= 60) return getCareerConfig("Web Developer", percentage);
    if (percentage >= 40) return getCareerConfig("Junior Software Developer", percentage);
    return getCareerConfig("Skill Development", percentage);
}


/* ============================================================
   ROADMAP STAGES DEFINITION
============================================================ */

function getRoadmapForCareer(careerName) {
    const c = (careerName || "").toLowerCase();

    if (c.includes("software developer") || c.includes("java")) {
        return [
            { stageNumber: 1, title: "Core Java & OOP Fundamentals", description: "Build a rock-solid foundation in Java syntax, memory architecture, and OOP principles.", skills: ["Java Syntax", "Encapsulation & Inheritance", "Polymorphism & Abstraction", "Java Collections"] },
            { stageNumber: 2, title: "Data Structures & Algorithms (DSA)", description: "Develop problem-solving and algorithmic thinking required for technical coding interviews.", skills: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Binary Search"] },
            { stageNumber: 3, title: "Databases & SQL Engineering", description: "Master relational database modeling, writing optimized SQL queries, indexes, and transactions.", skills: ["Relational Schema", "Joins & Subqueries", "Indexes & Optimization", "Spring JDBC"] },
            { stageNumber: 4, title: "Backend Development & Spring Boot REST APIs", description: "Build robust REST APIs, security filters, JWT authentication, and persistence layers.", skills: ["Spring Boot Architecture", "REST Controllers", "Spring Security & JWT", "Maven Build"] },
            { stageNumber: 5, title: "Project Development & Career Readiness", description: "Assemble full-stack applications, deploy to Tomcat/Cloud, build your portfolio, and ace interviews.", skills: ["Full Stack App", "Git & GitHub Workflows", "API Testing", "Technical Interviews"] }
        ];
    } else if (c.includes("web developer")) {
        return [
            { stageNumber: 1, title: "HTML5 & Modern CSS3 Layouts", description: "Master semantic markup, modern CSS grid, flexbox, and mobile-first responsive design.", skills: ["Semantic HTML5", "CSS Flexbox", "CSS Grid", "Responsive Design"] },
            { stageNumber: 2, title: "JavaScript ES6+ & DOM Manipulation", description: "Learn dynamic UI manipulation, events, asynchronous programming, and REST API consumption.", skills: ["ES6+ Syntax", "DOM & Events", "Fetch API & Async/Await", "Local Storage"] },
            { stageNumber: 3, title: "Frontend Frameworks (React.js)", description: "Build single-page web applications with components, state hooks, and routing.", skills: ["JSX", "useState & useEffect", "React Router", "API Integration"] },
            { stageNumber: 4, title: "Backend API Integration & Databases", description: "Connect frontends to backend services, handle user authentication, and manage databases.", skills: ["REST API Consumption", "JWT Handling", "MySQL Queries", "Error Handling"] },
            { stageNumber: 5, title: "Portfolio & Full-Stack Projects", description: "Deploy production applications, write clean code, and showcase projects on GitHub.", skills: ["Full Stack Project", "Git Version Control", "Hosting & Deployment", "Web Interviews"] }
        ];
    } else {
        return [
            { stageNumber: 1, title: "Computer Science & Programming Basics", description: "Start by understanding how computers execute code, memory allocation, and algorithmic logic.", skills: ["Computer Architecture", "Variables & Types", "Conditional Logic", "Loops & Iterations"] },
            { stageNumber: 2, title: "Core Programming Language (Java / Python)", description: "Gain hands-on proficiency in writing clean, modular code using a high-level language.", skills: ["Syntax & Operators", "Strings & Arrays", "OOP Concepts", "Exception Handling"] },
            { stageNumber: 3, title: "Aptitude, Quantitative & Logical Reasoning", description: "Sharpen your analytical problem solving, numerical ability, and pattern recognition skills.", skills: ["Percentages & Ratios", "Time & Speed", "Series & Patterns", "Logical Deductions"] },
            { stageNumber: 4, title: "Database Fundamentals & Basic Web Concepts", description: "Understand how data is stored in relational tables and how browsers communicate with servers.", skills: ["SQL Queries", "Table Creation", "HTML/CSS Basics", "Client-Server Requests"] },
            { stageNumber: 5, title: "Mini-Projects & Placement Preparation", description: "Apply your newly acquired skills to build mini-projects and prepare for entry-level hiring.", skills: ["Mini-Projects", "GitHub Version Control", "Resume Building", "Technical Communication"] }
        ];
    }
}


/* ============================================================
   DISPLAY CAREER INFORMATION & SUMMARY
============================================================ */

function displayCareerInformation() {
    if (!currentCareer) return;
    const nameEl = document.getElementById("careerName");
    const descEl = document.getElementById("roadmapDescription");
    const goalEl = document.getElementById("careerGoal");
    const goalDescEl = document.getElementById("careerGoalDescription");
    const iconEl = document.getElementById("careerIcon");

    if (nameEl) nameEl.textContent = currentCareer.name;
    if (descEl) descEl.textContent = currentCareer.description;
    if (goalEl) goalEl.textContent = currentCareer.goal;
    if (goalDescEl) goalDescEl.textContent = currentCareer.goalDescription;
    if (iconEl && currentCareer.icon) iconEl.className = "fa-solid " + currentCareer.icon;
}

function displaySummary() {
    const totalStagesEl = document.getElementById("totalStages");
    const totalSkillsEl = document.getElementById("totalSkills");
    const completedCountEl = document.getElementById("completedCount");

    let skillCount = 0;
    roadmapData.forEach(function (s) {
        if (Array.isArray(s.skills)) skillCount += s.skills.length;
    });

    if (totalStagesEl) totalStagesEl.textContent = String(roadmapData.length);
    if (totalSkillsEl) totalSkillsEl.textContent = String(skillCount);
    if (completedCountEl) completedCountEl.textContent = String(completedStages.length);
}


/* ============================================================
   RENDER ROADMAP STAGES WITH QUIZ & RESOURCE BUTTONS
============================================================ */

function renderRoadmap() {
    const container = document.getElementById("roadmapSteps");
    if (!container) return;
    container.innerHTML = "";

    roadmapData.forEach(function (stage, index) {
        const stepNumber = index + 1;
        const isCompleted = completedStages.includes(stepNumber);

        const step = document.createElement("div");
        step.className = "roadmap-step" + (isCompleted ? " completed" : "");
        step.setAttribute("data-step", stepNumber);

        step.innerHTML =
            '<div class="step-number">' +
                '<span>' + (isCompleted ? '<i class="fa-solid fa-check"></i>' : stepNumber) + '</span>' +
            '</div>' +
            '<div class="step-content">' +
                '<div class="step-top">' +
                    '<div>' +
                        '<span class="step-label">STAGE ' + String(stepNumber).padStart(2, "0") + '</span>' +
                        '<h3>' + escapeHtml(stage.title) + '</h3>' +
                    '</div>' +
                    '<span class="step-status ' + (isCompleted ? "completed-status" : "pending-status") + '">' +
                        (isCompleted ? "Completed" : "In Progress") +
                    '</span>' +
                '</div>' +
                '<p>' + escapeHtml(stage.description) + '</p>' +
                '<div class="skill-list">' +
                    stage.skills.map(function (skill) {
                        return '<span>' + escapeHtml(skill) + '</span>';
                    }).join("") +
                '</div>' +
                '<div class="step-actions">' +
                    '<button class="resource-btn" type="button" onclick="openResourceModal(' + stepNumber + ')">' +
                        '<i class="fa-solid fa-book-open"></i> Learning Resources' +
                    '</button>' +
                    '<button class="quiz-btn" type="button" onclick="startMilestoneQuiz(' + stepNumber + ')">' +
                        '<i class="fa-solid fa-graduation-cap"></i> Milestone Quiz' +
                    '</button>' +
                    '<button class="complete-btn ' + (isCompleted ? "completed-btn" : "") + '" type="button" onclick="toggleStageCompletion(' + stepNumber + ')">' +
                        (isCompleted ? '<i class="fa-solid fa-check"></i> Completed' : '<i class="fa-regular fa-circle"></i> Mark Complete') +
                    '</button>' +
                '</div>' +
            '</div>';

        container.appendChild(step);
    });
}


/* ============================================================
   CURATED MILESTONE QUIZ QUESTIONS BANK
============================================================ */

function getMilestoneQuizQuestions(stageNumber) {
    const questionsByStage = {
        1: [
            {
                q: "Which of the following principles refers to wrapping data (variables) and code (methods) together into a single unit?",
                options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
                answer: 1,
                explanation: "Encapsulation bundles fields and methods within a class and restricts direct access using private access modifiers."
            },
            {
                q: "What is the size of an 'int' data type in Java?",
                options: ["2 bytes (16-bit)", "4 bytes (32-bit)", "8 bytes (64-bit)", "Depends on the CPU"],
                answer: 1,
                explanation: "In Java, an int is strictly 4 bytes (32-bit signed two's complement integer) across all platforms."
            },
            {
                q: "Which keyword is used in Java to inherit a class?",
                options: ["implements", "extends", "inherits", "instanceof"],
                answer: 1,
                explanation: "The 'extends' keyword is used to derive a child class from a parent class in Java."
            },
            {
                q: "What is method overloading?",
                options: ["Defining methods with the same name but different parameters in the same class", "Overriding a parent class method in a child class", "Calling a method recursively", "Passing an object to a method"],
                answer: 0,
                explanation: "Method Overloading allows multiple methods in the same class to share the same name with different argument lists (compile-time polymorphism)."
            }
        ],
        2: [
            {
                q: "What is the time complexity of searching for an element in a sorted array using Binary Search?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                answer: 2,
                explanation: "Binary Search divides the search interval in half each step, giving an O(log n) time complexity."
            },
            {
                q: "Which data structure follows the LIFO (Last In First Out) principle?",
                options: ["Queue", "Stack", "Linked List", "Tree"],
                answer: 1,
                explanation: "A Stack operates on LIFO (Last In, First Out) principle using push and pop operations."
            },
            {
                q: "In Java Collections, which interface does NOT allow duplicate elements?",
                options: ["List", "Set", "Queue", "ArrayList"],
                answer: 1,
                explanation: "The Set interface (e.g. HashSet, TreeSet) models the mathematical set abstraction and prevents duplicate entries."
            },
            {
                q: "What is the worst-case time complexity of QuickSort?",
                options: ["O(n log n)", "O(log n)", "O(n^2)", "O(n)"],
                answer: 2,
                explanation: "QuickSort degrades to O(n^2) when the chosen pivot is always the smallest or largest element (e.g., sorted array with first element as pivot)."
            }
        ],
        3: [
            {
                q: "Which SQL clause is used to filter records resulting from an aggregate function like COUNT() or AVG()?",
                options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
                answer: 1,
                explanation: "The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions."
            },
            {
                q: "What does the SQL command 'DROP TABLE users;' do?",
                options: ["Deletes all rows but keeps table structure", "Permanently removes the table definition and all its data", "Hides the table from queries", "Removes primary keys only"],
                answer: 1,
                explanation: "DROP TABLE completely deletes the table definition, metadata, and all stored rows."
            },
            {
                q: "Which JOIN returns all rows from the left table, and the matched rows from the right table?",
                options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
                answer: 1,
                explanation: "LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, even if there are no matches in the right table."
            },
            {
                q: "What is a Primary Key constraint in relational databases?",
                options: ["A column that allows duplicates", "A column that uniquely identifies each row and cannot contain NULL values", "A link to another table's column", "An index used only for sorting"],
                answer: 1,
                explanation: "A Primary Key uniquely identifies each row in a table and cannot contain NULL values."
            }
        ],
        4: [
            {
                q: "In Spring Boot, which annotation is used to create a RESTful web controller that returns JSON responses?",
                options: ["@Controller", "@RestController", "@Service", "@Component"],
                answer: 1,
                explanation: "@RestController is a convenience annotation that combines @Controller and @ResponseBody."
            },
            {
                q: "Which HTTP method should be used when you want to update an existing resource on the server?",
                options: ["GET", "POST", "PUT", "DELETE"],
                answer: 2,
                explanation: "HTTP PUT (or PATCH) is used to update or replace an existing resource."
            },
            {
                q: "What does JWT stand for in web security and authentication?",
                options: ["Java Web Technology", "JSON Web Token", "JavaScript Wire Terminal", "Joined Web Tool"],
                answer: 1,
                explanation: "JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties."
            },
            {
                q: "Which annotation is used in Spring to automatically inject bean dependencies?",
                options: ["@Injectable", "@Autowired", "@Bean", "@Entity"],
                answer: 1,
                explanation: "@Autowired marks a constructor, field, or setter method to be autowired by Spring's dependency injection."
            }
        ],
        5: [
            {
                q: "Which Git command is used to stage modified files before creating a commit?",
                options: ["git push", "git commit", "git add", "git checkout"],
                answer: 2,
                explanation: "'git add <file>' stages changes in the working directory for the next commit."
            },
            {
                q: "What is the purpose of Continuous Integration (CI) in software development?",
                options: ["Manually testing code once a year", "Automatically building and testing code changes frequently to catch defects early", "Writing documentation only", "Deploying hardware servers"],
                answer: 1,
                explanation: "CI is a software development practice where developers merge code into a central repository, triggering automated builds and test suites."
            },
            {
                q: "What is a web servlet container (such as Apache Tomcat)?",
                options: ["A database management system", "A web server component that manages the lifecycle of Java Servlets and routes HTTP requests", "A text editor for Java", "A network router"],
                answer: 1,
                explanation: "Apache Tomcat is a web server and servlet container that executes Java Servlets and renders JavaServer Pages (JSPs)."
            },
            {
                q: "What does the HTTP 401 status code signify?",
                options: ["Resource Not Found", "Unauthorized / Unauthenticated", "Internal Server Error", "Success OK"],
                answer: 1,
                explanation: "HTTP 401 Unauthorized indicates that the client request lacks valid authentication credentials for the target resource."
            }
        ]
    };

    return questionsByStage[stageNumber] || questionsByStage[1];
}


/* ============================================================
   MILESTONE QUIZ ENGINE
============================================================ */

function startMilestoneQuiz(stageNumber) {
    console.log("👉 Starting Milestone Quiz for Stage:", stageNumber);
    activeQuizStage = stageNumber;
    activeQuizQuestions = getMilestoneQuizQuestions(stageNumber);
    currentQuestionIndex = 0;
    userQuizAnswers = new Array(activeQuizQuestions.length).fill(null);
    quizSubmitted = false;

    const modal = document.getElementById("quizModal");
    const badgeEl = document.getElementById("quizModalStageBadge");
    const titleEl = document.getElementById("quizModalTitle");

    const stage = roadmapData[stageNumber - 1];
    if (badgeEl) badgeEl.textContent = "Stage " + String(stageNumber).padStart(2, "0") + " Milestone Check";
    if (titleEl) titleEl.textContent = (stage ? stage.title : "Milestone") + " Knowledge Quiz";

    renderQuizQuestion(0);

    if (modal) {
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
        document.body.style.overflow = "hidden";
    }
}

function renderQuizQuestion(qIdx) {
    currentQuestionIndex = qIdx;
    const bodyEl = document.getElementById("quizModalBody");
    if (!bodyEl) return;

    const total = activeQuizQuestions.length;
    const item = activeQuizQuestions[qIdx];
    const progressPct = Math.round(((qIdx + 1) / total) * 100);
    const selectedAns = userQuizAnswers[qIdx];

    const letters = ["A", "B", "C", "D"];

    let optionsHtml = "";
    item.options.forEach(function (optText, optIdx) {
        let isSel = selectedAns === optIdx;
        let cardClass = isSel ? "quiz-option-card selected" : "quiz-option-card";

        optionsHtml +=
            '<div class="' + cardClass + '" onclick="selectQuizOption(' + optIdx + ')">' +
                '<span class="quiz-letter-badge">' + letters[optIdx] + '</span>' +
                '<span class="quiz-option-text">' + escapeHtml(optText) + '</span>' +
            '</div>';
    });

    const isLast = qIdx === total - 1;

    bodyEl.innerHTML =
        '<div class="quiz-progress-wrap">' +
            '<div class="quiz-progress-meta">' +
                '<span>Question ' + (qIdx + 1) + ' of ' + total + '</span>' +
                '<span>' + progressPct + '% Completed</span>' +
            '</div>' +
            '<div class="quiz-bar-track">' +
                '<div class="quiz-bar-fill" style="width:' + progressPct + '%;"></div>' +
            '</div>' +
        '</div>' +
        '<div class="quiz-question-box">' +
            '<div class="quiz-question-text">' + escapeHtml(item.q) + '</div>' +
        '</div>' +
        '<div class="quiz-options-stack">' +
            optionsHtml +
        '</div>' +
        '<div class="quiz-actions-footer">' +
            (qIdx > 0 ? '<button type="button" class="complete-btn" style="background:#f1f5f9;color:#334155;" onclick="renderQuizQuestion(' + (qIdx - 1) + ')"><i class="fa-solid fa-arrow-left"></i> Previous</button>' : '<div></div>') +
            (isLast
                ? '<button type="button" class="quiz-next-btn" ' + (selectedAns === null ? 'disabled' : '') + ' onclick="finishMilestoneQuiz()"><i class="fa-solid fa-check-double"></i> Submit Quiz</button>'
                : '<button type="button" class="quiz-next-btn" ' + (selectedAns === null ? 'disabled' : '') + ' onclick="renderQuizQuestion(' + (qIdx + 1) + ')">Next Question <i class="fa-solid fa-arrow-right"></i></button>') +
        '</div>';
}

function selectQuizOption(optIdx) {
    userQuizAnswers[currentQuestionIndex] = optIdx;
    renderQuizQuestion(currentQuestionIndex);
}

function finishMilestoneQuiz() {
    const total = activeQuizQuestions.length;
    let correctCount = 0;

    activeQuizQuestions.forEach(function (q, idx) {
        if (userQuizAnswers[idx] === q.answer) {
            correctCount++;
        }
    });

    const scorePct = Math.round((correctCount / total) * 100);
    const passed = scorePct >= 75;

    // If passed, auto-complete stage!
    if (passed && !completedStages.includes(activeQuizStage)) {
        completedStages.push(activeQuizStage);
        saveCompletedStages();
        renderRoadmap();
        displaySummary();
        updateOverallProgress();
    }

    const bodyEl = document.getElementById("quizModalBody");
    if (!bodyEl) return;

    bodyEl.innerHTML =
        '<div class="quiz-result-view">' +
            '<div class="quiz-score-badge-lg ' + (passed ? 'score-pass' : 'score-fail') + '">' +
                scorePct + '%' +
            '</div>' +
            '<div class="quiz-result-title">' +
                (passed ? '🎉 Milestone Check Passed!' : 'Keep Studying!') +
            '</div>' +
            '<p class="quiz-result-subtitle">' +
                (passed
                    ? 'Outstanding job! You scored ' + correctCount + ' out of ' + total + ' correct. Stage ' + String(activeQuizStage).padStart(2, "0") + ' has been marked as Completed on your roadmap!'
                    : 'You scored ' + correctCount + ' out of ' + total + ' correct (Passing threshold is 75%). Review the learning resources for this milestone and try again!') +
            '</p>' +
            '<div class="quiz-result-actions">' +
                '<button type="button" class="complete-btn" style="background:#f1f5f9;color:#334155;" onclick="startMilestoneQuiz(' + activeQuizStage + ')"><i class="fa-solid fa-rotate-right"></i> Retry Quiz</button>' +
                '<button type="button" class="modal-close-action" onclick="closeQuizModal()">Return to Roadmap</button>' +
            '</div>' +
        '</div>';
}

function closeQuizModal() {
    const modal = document.getElementById("quizModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function handleQuizBackdropClick(event) {
    if (event.target && event.target.id === "quizModal") {
        closeQuizModal();
    }
}


/* ============================================================
   LEARNING RESOURCES MODAL
============================================================ */

function openResourceModal(stepNumber) {
    const stageIndex = stepNumber - 1;
    const stage = roadmapData[stageIndex];
    const modal = document.getElementById("resourceModal");
    const titleEl = document.getElementById("resourceModalTitle");
    const badgeEl = document.getElementById("resourceModalStageBadge");
    const descEl = document.getElementById("resourceModalDesc");
    const sectionsEl = document.getElementById("resourceModalSections");

    if (!modal) return;

    if (badgeEl) badgeEl.textContent = "Stage " + String(stepNumber).padStart(2, "0");
    if (titleEl && stage) titleEl.textContent = stage.title;
    if (descEl && stage) descEl.textContent = stage.description;

    const stageDbResources = dbLearningResources.filter(function (r) {
        return Number(r.stageNumber || r.stage_number) === Number(stepNumber);
    });

    let html = "";

    if (stageDbResources.length > 0) {
        const categories = {};
        stageDbResources.forEach(function (item) {
            const cat = item.category || "Recommended Resources";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(item);
        });

        for (const cat in categories) {
            html += '<div class="resource-group">';
            html += '<div class="resource-group-title"><i class="fa-solid fa-bookmark"></i> ' + escapeHtml(cat) + '</div>';
            html += '<div class="resource-list">';
            categories[cat].forEach(function (item) {
                let rType = item.resourceType || item.resource_type || "doc";
                let iconClass = rType === 'video' ? 'icon-video' : (rType === 'practice' ? 'icon-practice' : (rType === 'cheatsheet' ? 'icon-cheatsheet' : 'icon-doc'));
                let iconFa = rType === 'video' ? 'fa-play' : (rType === 'practice' ? 'fa-laptop-code' : (rType === 'cheatsheet' ? 'fa-file-lines' : 'fa-book'));

                html += '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer" class="resource-item">' +
                    '<div class="resource-info">' +
                    '<div class="resource-type-icon ' + iconClass + '"><i class="fa-solid ' + iconFa + '"></i></div>' +
                    '<div class="resource-details">' +
                    '<h4>' + escapeHtml(item.title) + '</h4>' +
                    '<span>' + escapeHtml(item.description || "") + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<i class="fa-solid fa-arrow-up-right-from-square resource-open-icon"></i>' +
                    '</a>';
            });
            html += '</div>';
            html += '</div>';
        }
    } else if (stage && stage.skills) {
        html += '<div class="resource-group">';
        html += '<div class="resource-group-title"><i class="fa-solid fa-book"></i> Interactive Study Guides</div>';
        html += '<div class="resource-list">';
        stage.skills.forEach(function (skill) {
            html += '<a href="https://www.google.com/search?q=' + encodeURIComponent(skill + ' tutorial guide') + '" target="_blank" rel="noopener noreferrer" class="resource-item">' +
                '<div class="resource-info">' +
                '<div class="resource-type-icon icon-doc"><i class="fa-solid fa-book-open"></i></div>' +
                '<div class="resource-details"><h4>' + escapeHtml(skill) + ' Guide</h4><span>Learn ' + escapeHtml(skill) + ' concepts online.</span></div>' +
                '</div>' +
                '<i class="fa-solid fa-arrow-up-right-from-square resource-open-icon"></i>' +
                '</a>';
        });
        html += '</div>';
        html += '</div>';
    }

    if (sectionsEl) sectionsEl.innerHTML = html;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeResourceModal() {
    const modal = document.getElementById("resourceModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function handleModalBackdropClick(event) {
    if (event.target && event.target.id === "resourceModal") closeResourceModal();
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeResourceModal();
        closeQuizModal();
    }
});

// Window Exports
window.openResourceModal = openResourceModal;
window.closeResourceModal = closeResourceModal;
window.handleModalBackdropClick = handleModalBackdropClick;
window.startMilestoneQuiz = startMilestoneQuiz;
window.renderQuizQuestion = renderQuizQuestion;
window.selectQuizOption = selectQuizOption;
window.finishMilestoneQuiz = finishMilestoneQuiz;
window.closeQuizModal = closeQuizModal;
window.handleQuizBackdropClick = handleQuizBackdropClick;
window.toggleStageCompletion = toggleStageCompletion;


/* ============================================================
   STAGE COMPLETION & PROGRESS TRACKING
============================================================ */

function toggleStageCompletion(step) {
    const index = completedStages.indexOf(step);
    if (index === -1) {
        completedStages.push(step);
    } else {
        completedStages.splice(index, 1);
    }

    saveCompletedStages();
    renderRoadmap();
    displaySummary();
    updateOverallProgress();
}

function getProgressStorageKey() {
    if (!jwtToken) return "pathfinder_roadmap_progress";
    return "pathfinder_roadmap_progress_" + btoa(jwtToken).substring(0, 30);
}

function loadCompletedStages() {
    try {
        const key = getProgressStorageKey();
        const saved = localStorage.getItem(key);
        if (!saved) { completedStages = []; return; }
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            completedStages = parsed.filter(function (step) {
                return step >= 1 && step <= roadmapData.length;
            });
        }
    } catch (e) {
        completedStages = [];
    }
}

function saveCompletedStages() {
    try {
        const key = getProgressStorageKey();
        localStorage.setItem(key, JSON.stringify(completedStages));
    } catch (e) {}
}

function updateOverallProgress() {
    const total = roadmapData.length;
    const completed = completedStages.length;
    let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const overallProgressEl = document.getElementById("overallProgress");
    const progressPercentageEl = document.getElementById("progressPercentage");
    const mainProgressBarEl = document.getElementById("mainProgressBar");
    const progressMessageEl = document.getElementById("progressMessage");

    if (overallProgressEl) overallProgressEl.textContent = percentage + "%";
    if (progressPercentageEl) progressPercentageEl.textContent = percentage + "%";
    if (mainProgressBarEl) mainProgressBarEl.style.width = percentage + "%";

    if (progressMessageEl) {
        if (percentage === 100) progressMessageEl.textContent = "🎉 Congratulations! You have completed all roadmap milestones and are ready for job opportunities.";
        else if (percentage >= 50) progressMessageEl.textContent = "Great progress! You are more than halfway through your career roadmap.";
        else if (percentage > 0) progressMessageEl.textContent = "Keep going! Complete upcoming stages to advance your career readiness.";
        else progressMessageEl.textContent = "Follow your personalized roadmap and pass milestone quizzes to advance your career.";
    }
}


/* ============================================================
   UI VISIBILITY HELPERS
============================================================ */

function showRoadmapLoading() {
    const loading = document.getElementById("roadmapLoading");
    const error = document.getElementById("roadmapError");
    const content = document.getElementById("roadmapContent");
    if (loading) loading.style.display = "flex";
    if (error) error.style.display = "none";
    if (content) content.style.display = "none";
}

function showRoadmapError(message) {
    const loading = document.getElementById("roadmapLoading");
    const error = document.getElementById("roadmapError");
    const content = document.getElementById("roadmapContent");
    const msgEl = document.getElementById("roadmapErrorMessage");
    if (loading) loading.style.display = "none";
    if (error) error.style.display = "flex";
    if (content) content.style.display = "none";
    if (msgEl) msgEl.textContent = message || "Something went wrong.";
}

function showRoadmapContent() {
    const loading = document.getElementById("roadmapLoading");
    const error = document.getElementById("roadmapError");
    const content = document.getElementById("roadmapContent");
    if (loading) loading.style.display = "none";
    if (error) error.style.display = "none";
    if (content) content.style.display = "block";
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
}

// ============================================================
// GLOBAL EXPORTS ON WINDOW OBJECT
// ============================================================
window.openResourceModal = openResourceModal;
window.closeResourceModal = closeResourceModal;
window.handleModalBackdropClick = handleModalBackdropClick;
window.startMilestoneQuiz = startMilestoneQuiz;
window.closeQuizModal = closeQuizModal;
window.handleQuizBackdropClick = handleQuizBackdropClick;
window.renderQuizQuestion = renderQuizQuestion;
window.selectQuizOption = selectQuizOption;
window.finishMilestoneQuiz = finishMilestoneQuiz;
window.toggleStageCompletion = toggleStageCompletion;
