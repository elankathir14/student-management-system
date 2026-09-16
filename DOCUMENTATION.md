# 🎓 College Academic Project Documentation
## Student Management System (SMS)
**Department of Computer Science & Engineering / Information Technology**

---

## 1. Problem Statement

In collegiate academic institutions, managing student administrative data has traditionally involved physical paper registers or uncoordinated spreadsheets. This ad-hoc approach presents several significant operational bottlenecks:

- **Redundant & Inconsistent Records**: Identical student information recorded separately across admission, examination, and department records leads to discrepancies.
- **Accidental Duplicate Admissions**: Lack of automated uniqueness constraints causes accidental duplicate registration entries.
- **Time-Consuming Lookups**: Searching for a student’s record or filtering by department takes disproportionate manual effort.
- **No Format Integrity**: Phone numbers and email addresses are frequently entered with typographical errors or invalid digit lengths without verification.
- **Data Loss Risks**: Physical registries and unversioned spreadsheets are vulnerable to accidental deletion and loss.

To resolve these challenges, the **Student Management System** delivers a robust, centralized, and validated full-stack web application implementing strict data integrity rules and RESTful architectural principles.

---

## 2. Objectives

The primary objectives of this software engineering project are:

1. **Develop an End-to-End CRUD Application**: Build functional Create, Read, Update, and Delete capabilities for student records.
2. **Implement Decoupled RESTful Architecture**: Establish a clean separation between the user interface (Client) and data management logic (Django REST API).
3. **Ensure Dual-Layer Data Integrity**:
   - *Client-side*: Provide immediate, intuitive validation before network transmission.
   - *Server-side*: Guarantee database consistency via Django model constraints and DRF serializers.
4. **Deliver a Zero-Dependency, Modern User Experience**: Build a responsive interface with Semantic HTML5, CSS3, and modern Vanilla JavaScript without the complexity of heavy single-page application frameworks like React.
5. **Facilitate Automated Testing**: Supply unit test suites and standardized Postman collections for institutional evaluation and demonstration.

---

## 3. Scope of the System

### In Scope
- Single-page dashboard displaying the entire student directory with real-time counters.
- Interactive registration form with real-time error clearance and mode switching (Add vs. Edit).
- Real-time client and server-side search across student names, roll numbers, and emails.
- Department-level filtering across institutional academic programs.
- Record modification (PUT/PATCH) with seamless pre-population of existing data.
- Deletion workflow featuring modal confirmation dialogs to prevent accidental loss.
- SQLite embedded database storage with automated Django ORM migrations.
- Complete Postman API test suite covering successful operations and edge-case error scenarios.

### Out of Scope (Recommended for Future Versions)
- User authentication and role-based permissions (Student vs. Faculty vs. Admin).
- Bulk CSV/Excel batch upload and PDF report generation.
- Course syllabus and grading integration.

---

## 4. Technology Stack & Rationale

| Layer | Chosen Technology | Rationale & Academic Justification |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5 (Semantic) & CSS3 | Ensures full semantic accessibility, fast rendering, lightweight bundle size, and responsive viewing across desktop and mobile devices without third-party styling frameworks. |
| **Frontend Logic**| Vanilla JavaScript (ES6+) | Uses native browser capabilities (`fetch`, `async`/`await`, DOM manipulation) without requiring Node.js build pipelines or React complexity. |
| **Backend API** | Python & Django 5.x | Python provides clean, readable syntax. Django provides an enterprise-ready framework with ORM, security middleware, and administrative capabilities. |
| **API Toolkit** | Django REST Framework (DRF) | Industry standard for building RESTful Web APIs, handling JSON serialization, field-level validation, and browsable API explorers. |
| **CORS Middleware**| django-cors-headers | Enables secure cross-origin requests between the frontend client and the Django backend server. |
| **Database** | SQLite3 | Default embedded relational database for Django; requires zero separate database server configuration while adhering to ACID transactions. |
| **API Testing** | Postman & Django TestCase | Postman provides reproducible visual HTTP request testing; Django TestCase executes automated unit tests verifying status codes and DB transactions. |

---

## 5. System Architecture

The Student Management System follows a 3-Tier Model-View-Controller (MVC) / Model-View-Template (MVT) decoupled architecture:

```
+-------------------------------------------------------------------------+
|                                TIER 1:                                  |
|                       PRESENTATION LAYER (CLIENT)                       |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |  Browser Client (index.html, style.css, script.js)              |   |
|   |  - Form Input Handling & Regex Validation                       |   |
|   |  - Dynamic Table Rendering & Empty States                       |   |
|   |  - Live Search & Department Filter Interactivity                |   |
|   |  - Asynchronous Fetch API Engine                                |   |
|   +-----------------------------------------------------------------+   |
+------------------------------------|------------------------------------+
                                     | HTTP Requests (GET, POST, PUT, DELETE)
                                     | Payload: JSON
                                     v
+-------------------------------------------------------------------------+
|                                TIER 2:                                  |
|                       APPLICATION LAYER (DJANGO)                        |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |  CORS Middleware (Headers Validation)                           |   |
|   +-----------------------------------------------------------------+   |
|   |  URL Router (api/students/ -> StudentViewSet)                   |   |
|   +-----------------------------------------------------------------+   |
|   |  StudentSerializer (Input Sanitization, Uniqueness Checks)      |   |
|   +-----------------------------------------------------------------+   |
|   |  Django ORM QuerySet Engine                                     |   |
|   +-----------------------------------------------------------------+   |
+------------------------------------|------------------------------------+
                                     | SQL Queries (SELECT, INSERT, UPDATE, DELETE)
                                     v
+-------------------------------------------------------------------------+
|                                TIER 3:                                  |
|                         DATABASE LAYER (SQLITE)                         |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |  db.sqlite3                                                     |   |
|   |  Table: students_student (Indexed register_number, constraints) |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 6. Database Design (Entity-Relationship)

### Entity: `Student` (`students_student`)

```
+-------------------------------------------------------------+
|                       STUDENT ENTITY                        |
+-------------------+------------------+----------------------+
| Field Name        | Data Type        | Key / Constraint     |
+-------------------+------------------+----------------------+
| id                | BIGINT (Auto)    | PRIMARY KEY          |
| name              | VARCHAR(100)     | NOT NULL             |
| register_number   | VARCHAR(30)      | NOT NULL, UNIQUE     |
| email             | VARCHAR(100)     | NOT NULL             |
| department        | VARCHAR(100)     | NOT NULL             |
| year              | VARCHAR(20)      | NOT NULL             |
| phone             | VARCHAR(15)      | NOT NULL (10 Digits) |
| created_at        | DATETIME         | AUTO_NOW_ADD         |
| updated_at        | DATETIME         | AUTO_NOW             |
+-------------------+------------------+----------------------+
```

### Relational Schema Representation:
$$\text{Student}(\underline{\text{id}}, \text{name}, \mathbf{\text{register\_number}}, \text{email}, \text{department}, \text{year}, \text{phone}, \text{created\_at}, \text{updated\_at})$$
*where $\text{register\_number}$ has a candidate key unique index constraint.*

---

## 7. Detailed CRUD Operations

### 7.1. CREATE (Student Registration)
1. **User Interaction**: Administrative user fills in student details in the registration card.
2. **Client Validation**: `validateForm()` checks that all required fields are filled, regex for email matches standard format, and phone number contains exactly 10 digits.
3. **Dispatch**: Form sends an asynchronous `POST` request to `/api/students/` with JSON payload.
4. **Server Validation**: `StudentSerializer` validates name length, checks case-insensitive uniqueness of `register_number` in SQLite, and ensures valid email.
5. **Persistence**: Django ORM executes `INSERT INTO students_student ...`.
6. **Response**: Server responds with HTTP `201 Created` and the newly serialized student object.
7. **Feedback**: Form resets, a green success toast appears, and the table dynamically appends/reloads the record.

### 7.2. READ (Directory Listing & Query Filtering)
1. **Initial Load**: `fetchStudents()` issues a `GET` request to `/api/students/`.
2. **ORM Query Execution**: `Student.objects.all()` retrieves records ordered by `id` descending.
3. **Search Mechanism**: When a user types in the search bar, a `300ms` debounce issues `GET /api/students/?search=<query>`, filtering across:
   $$\text{Query} \in \{\text{name}, \text{register\_number}, \text{email}\}$$
4. **Department Filter**: Dropdown selection issues `GET /api/students/?department=<dept>`, filtering students strictly belonging to that academic division.
5. **DOM Render**: Rows are safely rendered with XSS escaping (`escapeHtml()`), displaying badges for register numbers, department, and academic years.

### 7.3. UPDATE (Record Modification)
1. **Edit Trigger**: User clicks the "✏️ Edit" action button on a student row.
2. **Form Pre-population**: The form switches from "Add Student" to "Editing Mode" (highlighted by an amber badge and cancel button). Inputs are populated with current student attributes.
3. **Submission**: User modifies fields and clicks "Update Student".
4. **Dispatch**: Frontend sends a `PUT` request to `/api/students/{id}/`.
5. **Server Validation**: `StudentSerializer` validates changes, allowing the student's existing register number while preventing conflicts with any *other* student's register number.
6. **Persistence**: Django ORM executes `UPDATE students_student SET ... WHERE id = {id}`.
7. **Response & Feedback**: Server returns HTTP `200 OK`. The form resets to "Add Mode", an alert confirms the update, and the table updates in real time.

### 7.4. DELETE (Safe Record Removal)
1. **Delete Trigger**: User clicks "🗑️ Delete" on a student row.
2. **Modal Confirmation**: An accessible modal dialog appears displaying the target student's name and registration number, warning that the action is irreversible.
3. **Confirmation**: Clicking "Yes, Delete" sends a `DELETE` request to `/api/students/{id}/`.
4. **Database Execution**: Django ORM removes the row via `DELETE FROM students_student WHERE id = {id}`.
5. **Response & Feedback**: Server returns HTTP `200 OK` (with deletion message). The modal closes, a success toast appears, and the table refreshes.

---

## 8. Data Validation & Security Measures

### 8.1. Validation Matrix

| Field | Client Validation Rule | Server Validation Rule (DRF) | Error Response |
| :--- | :--- | :--- | :--- |
| `name` | Not empty, length $\ge 2$ | Strip whitespace, minimum 2 characters | `"Student name must be at least 2 characters long."` |
| `register_number` | Not empty, length $\ge 3$ | Strip, uppercase, `unique=True` in DB | `"Student with Register Number '...' already exists."` |
| `email` | Standard email regex pattern | Strip, lowercase, `EmailField` validator | `"Please enter a valid email address."` |
| `department` | Non-empty selection | Valid string, non-null | `"Department cannot be empty."` |
| `year` | Valid choice selection | Choice in `['1st Year', '2nd Year', ...]` | `"Academic year cannot be empty."` |
| `phone` | Regex `^\d{10}$` | Regex `^\d{10}$` (exact 10 digits) | `"Phone number must contain exactly 10 digits."` |

### 8.2. Security Best Practices Implemented
- **XSS Prevention**: All dynamic values injected into the DOM are sanitized through HTML entity encoding.
- **SQL Injection Prevention**: All queries utilize Django's built-in ORM with parameterized SQL queries.
- **CORS Configuration**: Configured specifically with `django-cors-headers` to enable controlled communication between client and backend.
- **Graceful Error Handling**: Database internals and stack traces are suppressed; clear, user-facing JSON error objects are returned.

---

## 9. Testing & Quality Assurance

### 9.1. Automated Unit Test Suite (`backend/students/tests.py`)

A full test suite of 13 automated test cases was authored using Django's `TestCase` and DRF's `APIClient`:

| # | Test Case Identifier | Operation Tested | Expected Status Code | Result |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `test_create_student_success` | Valid student creation | `201 Created` | Passed |
| 2 | `test_create_student_duplicate_register_number` | Duplicate roll number rejection | `400 Bad Request` | Passed |
| 3 | `test_create_student_invalid_phone` | Non-10-digit phone rejection | `400 Bad Request` | Passed |
| 4 | `test_create_student_invalid_email` | Malformed email rejection | `400 Bad Request` | Passed |
| 5 | `test_create_student_missing_field` | Incomplete payload rejection | `400 Bad Request` | Passed |
| 6 | `test_get_all_students` | List all records | `200 OK` | Passed |
| 7 | `test_get_student_by_id` | Fetch specific student | `200 OK` | Passed |
| 8 | `test_get_student_invalid_id` | Query non-existent ID | `404 Not Found` | Passed |
| 9 | `test_search_student_by_name` | Query parameter `?search=...` | `200 OK` | Passed |
| 10 | `test_filter_student_by_department` | Query parameter `?department=...`| `200 OK` | Passed |
| 11 | `test_update_student_put` | Full record update | `200 OK` | Passed |
| 12 | `test_update_student_patch` | Partial field update | `200 OK` | Passed |
| 13 | `test_delete_student` | Record removal from DB | `200 OK` | Passed |

---

## 10. Challenges Encountered & Solutions

| # | Challenge | Root Cause | Solution Implemented |
| :--- | :--- | :--- | :--- |
| 1 | **Cross-Origin Resource Sharing (CORS) Block** | Modern browsers block Fetch API requests across different origins (e.g. `file://` or `localhost:5500` to `127.0.0.1:8000`). | Integrated `django-cors-headers`, placed `CorsMiddleware` at the topmost position in `MIDDLEWARE`, and configured `CORS_ALLOW_ALL_ORIGINS = True` for local development. |
| 2 | **PowerShell Script Execution Policy Restriction** | Windows systems frequently restrict script execution, preventing `Activate.ps1` from loading the virtual environment. | Configured instructions and commands to directly invoke `.\venv\Scripts\python.exe` and `.\venv\Scripts\pip.exe`, bypassing execution policy barriers completely. |
| 3 | **Self-Colliding Duplicate Validation on Update** | During a `PUT` update, validating that `register_number` is unique could reject the update if comparing against the student's own existing record. | Customized `validate_register_number` in `StudentSerializer` to explicitly exclude `self.instance.pk`, allowing the student to retain their current registration number while blocking collisions with other students. |
| 4 | **Unintended Form Reset During Editing** | Accidental clicks or deletions while modifying an existing record could leave the UI in an inconsistent state. | Implemented state tracking (`state.isEditing`, `state.editingStudentId`), a visible "Cancel Edit" button, and automated form reset upon deleting an active record. |

---

## 11. Future Enhancements

1. **Role-Based Authentication (RBAC)**: JWT authentication granting different view/edit permissions to Students, Teachers, and Department Heads.
2. **Document & Photo Uploads**: Incorporating student passport photo uploads with Django storage.
3. **Semester Marks & Attendance Tracker**: Adding associated relational tables for semester marks cards and subject-wise attendance metrics.
4. **Data Exporting**: Adding instant CSV and PDF transcript generation for university submissions.

---

## 12. Conclusion

The **Student Management System** successfully fulfills all requirements outlined in the College Project SOP. By decoupling the presentation layer from the Django REST API backend and enforcing strict validation rules, the system ensures data reliability, high responsiveness, and zero reliance on heavy external frameworks. The application is completely functional, verified through automated unit tests, and fully prepared for academic evaluation and live demonstration.
