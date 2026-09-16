# 🎓 Student Management System

A modern, full-stack CRUD web application engineered for college academic administration. Built strictly adhering to the standard college SOP with a **Django REST Framework** backend, **SQLite** relational database, and a responsive **Semantic HTML5, CSS3, and Vanilla JavaScript (Fetch API)** frontend.

---

## 📌 Project Overview

The **Student Management System (SMS)** is an academic management application designed to maintain, query, and manipulate student records seamlessly. It provides institutional faculty and administrative staff with a centralized, real-time portal to manage student admissions, track enrollments, update academic years, and manage department registries.

---

## 🎯 Problem Statement

Traditional academic record-keeping in colleges often relies on disparate spreadsheets or manual paperwork, resulting in:
- High redundancy and duplicate student registrations.
- Data inconsistency across departments.
- Tedious lookup and search times.
- Lack of centralized validation (e.g., malformed phone numbers or invalid emails).
- Risk of unauthorized edits and record loss.

The **Student Management System** addresses these issues by delivering a structured, validated, and intuitive digital portal with guaranteed data integrity via a relational SQLite database and RESTful architecture.

---

## 🏆 Objectives

1. **Implement Core CRUD Operations**: Provide end-to-end Create, Read, Update, and Delete functionalities for student profiles.
2. **Dual-Layer Validation**: Enforce rigorous data validation rules on both the frontend (instant user feedback) and backend (data integrity).
3. **Responsive & Accessible User Interface**: Build an intuitive, zero-dependency modern UI that operates smoothly across desktops, laptops, tablets, and smartphones.
4. **RESTful Standards Compliance**: Expose standard REST endpoints returning proper HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
5. **Standardized College Project Structure**: Maintain clean, beginner-friendly code with zero extraneous frameworks (no React, no paid third-party APIs).

---

## ✨ Features

- **Dynamic Student Registration**: Add new students with instant client-side and server-side validation.
- **Responsive Student Directory**: View all enrolled students in a clean, responsive data table with status badges.
- **Real-Time Live Search**: Search students dynamically by **Student Name**, **Register Number**, or **Email Address**.
- **Department Filtering**: Filter students instantly across various academic engineering and science streams.
- **Inline Editing Mode**: Click the edit button on any student to populate the registration form, switch to "Editing Mode", and save modifications via `PUT`/`PATCH`.
- **Safe Record Deletion**: Modal-based confirmation prompt to prevent accidental data deletion.
- **Toast Notification Engine**: User-friendly visual alerts for success, validation errors, and server offline warnings.
- **Automated Sample Seeding**: Built-in Django command (`python manage.py seed_data`) to populate realistic test data in seconds.
- **Zero-Dependency Frontend**: Clean Vanilla JavaScript using modern `async`/`await` and the browser's native `Fetch API`.

---

## 🛠 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5 | Semantic page structure and accessible forms |
| | CSS3 | Custom responsive grid, flexbox, variables, and animations |
| | Vanilla JavaScript | ES6+ async/await, DOM manipulation, Fetch API |
| **Backend** | Python 3.11+ | Core programming language |
| | Django 5.x | High-level Python web framework |
| | Django REST Framework | Powerful toolkit for building Web APIs |
| | django-cors-headers | Cross-Origin Resource Sharing middleware |
| **Database** | SQLite3 | Embedded ACID-compliant relational database |
| **Testing** | Django TestCase & Postman | Automated unit tests and API endpoint testing |
| **Version Control** | Git & GitHub | Source code tracking and collaboration |

---

## 🏛 System Architecture

```
+-------------------------------------------------------------------------+
|                         CLIENT LAYER (Browser)                         |
|                                                                         |
|   +-----------------------+     +-----------------------------------+   |
|   |   HTML5 / CSS3 UI     | <-> |    Vanilla JavaScript (ES6+)     |   |
|   | (Forms, Tables, Modal)|     | (Validation, State, DOM Renderer) |   |
|   +-----------------------+     +-----------------+-----------------+   |
+---------------------------------------------------|---------------------+
                                                    | HTTP JSON Requests
                                                    | (Fetch API)
                                                    v
+-------------------------------------------------------------------------+
|                  BACKEND API LAYER (Django REST Framework)             |
|                                                                         |
|   +-----------------------+     +-----------------------------------+   |
|   |    CORS Middleware    | --> |       URL Router (/api/...)       |   |
|   +-----------------------+     +-----------------+-----------------+   |
|                                                   |                     |
|                                 +-----------------v-----------------+   |
|                                 |    StudentViewSet (API Views)     |   |
|                                 +-----------------+-----------------+   |
|                                                   |                     |
|                                 +-----------------v-----------------+   |
|                                 |   StudentSerializer (Validation)  |   |
|                                 +-----------------+-----------------+   |
+---------------------------------------------------|---------------------+
                                                    | Django ORM
                                                    v
+-------------------------------------------------------------------------+
|                            DATABASE LAYER                               |
|                                                                         |
|                          SQLite3 (db.sqlite3)                           |
+-------------------------------------------------------------------------+
```

---

## 📁 Project Folder Structure

```
student-management-system/
│
├── backend/
│   ├── manage.py                     # Django administrative command-line runner
│   ├── requirements.txt              # Python dependencies specification
│   ├── db.sqlite3                    # SQLite database file (created on migrate)
│   ├── student_management/           # Django project configuration package
│   │   ├── __init__.py
│   │   ├── settings.py               # Django & DRF settings, CORS, installed apps
│   │   ├── urls.py                   # Main project URL routing
│   │   ├── wsgi.py                   # WSGI deployment entry point
│   │   └── asgi.py                   # ASGI deployment entry point
│   └── students/                     # Main Student application package
│       ├── __init__.py
│       ├── admin.py                  # Django Admin interface registration
│       ├── apps.py                   # App configuration
│       ├── models.py                 # Student database model & schema
│       ├── serializers.py            # DRF ModelSerializer with field validations
│       ├── views.py                  # ViewSet handling CRUD operations
│       ├── urls.py                   # App router mapping /api/students/
│       ├── tests.py                  # 13 Automated unit test cases
│       ├── migrations/               # Database migration files
│       │   ├── __init__.py
│       │   └── 0001_initial.py
│       └── management/               # Custom management commands
│           └── commands/
│               └── seed_data.py      # Sample data population command
│
├── frontend/
│   ├── index.html                    # Semantic HTML5 user interface
│   ├── style.css                     # Modern CSS3 stylesheet (responsive layout)
│   └── script.js                     # Pure Vanilla JS application logic & Fetch API
│
├── postman_collection.json           # Postman collection for API test automation
├── DOCUMENTATION.md                  # Comprehensive College Project Documentation
├── .gitignore                        # Git version control ignore rules
└── README.md                         # Main project documentation & guide
```

---

## 🗄 Database Schema & Entity Details

The system persists data in SQLite via the `Student` model:

| Field Name | Type | Constraints / Properties | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key, Auto-increment | Unique identifier for each student |
| `name` | CharField(100) | `required=True` | Full name of the student (min 2 chars) |
| `register_number` | CharField(30) | `required=True`, `unique=True` | Unique roll / admission number |
| `email` | EmailField(100) | `required=True`, `format=email` | Valid email address |
| `department` | CharField(100) | `required=True` | Branch / Department name |
| `year` | CharField(20) | `required=True`, `choices` | Academic year (1st to 4th Year) |
| `phone` | CharField(15) | `required=True`, `regex=10 digits`| 10-digit contact mobile number |
| `created_at` | DateTimeField | `auto_now_add=True` | Record creation timestamp |
| `updated_at` | DateTimeField | `auto_now=True` | Last modification timestamp |

---

## 🔌 REST API Endpoints

The backend exposes standard RESTful endpoints under `/api/students/`:

| Method | Endpoint | Description | Status Codes | Query Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/students/` | Retrieve list of all students | `200 OK` | `?search=<term>`<br>`?department=<dept>` |
| **POST** | `/api/students/` | Create a new student record | `201 Created`<br>`400 Bad Request` | None |
| **GET** | `/api/students/{id}/` | Retrieve specific student details | `200 OK`<br>`404 Not Found` | None |
| **PUT** | `/api/students/{id}/` | Full update of student record | `200 OK`<br>`400 Bad Request`<br>`404 Not Found` | None |
| **PATCH**| `/api/students/{id}/` | Partial update of student record | `200 OK`<br>`400 Bad Request`<br>`404 Not Found` | None |
| **DELETE**| `/api/students/{id}/`| Delete student from database | `200 OK`<br>`404 Not Found` | None |

---

## 🔄 CRUD Flow Explanation

```
[Create]   User Fills Form -> Client Validation -> POST /api/students/ -> Serializer Validation -> SQLite Save -> Refresh Table & Alert
[Read]     Page Loads -> GET /api/students/ -> Serializer Serializes Queryset -> JSON Response -> DOM Injects Rows
[Update]   Click Edit -> Load Student into Form -> Edit Values -> PUT /api/students/{id}/ -> SQLite Update -> Refresh Table & Alert
[Delete]   Click Delete -> Modal Confirm Prompt -> DELETE /api/students/{id}/ -> SQLite Delete -> Refresh Table & Alert
```

---

## 🛡 Validation & Error Handling

### 1. Client-Side Validation (`script.js`)
- **Required check**: Prevents empty submissions before firing network requests.
- **Name length**: Enforces at least 2 alphabetic characters.
- **Email format**: Regex `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`.
- **Phone number**: Exactly 10 numeric digits `^\d{10}$`.
- **Visual cues**: Red outlines, inline field error messages, and alert banner notifications.

### 2. Server-Side Validation (`serializers.py` & `models.py`)
- **Duplicate Register Number**: Case-insensitive unique check returning a friendly `400 Bad Request` (`"Student with Register Number '...' already exists."`).
- **Data Integrity**: Enforces strict lengths and non-null constraints.
- **Invalid ID Handling**: Returns `404 Not Found` with `{"detail": "Student with ID '...' was not found."}`.
- **Network Resilience**: When the backend server is offline, the frontend catches the exception and displays an actionable message to run `python manage.py runserver`.

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Python 3.10+** installed on your system.
- Any modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari).
- Terminal or PowerShell.

### Step 1: Open Terminal and Navigate to Backend

```powershell
# Windows PowerShell
cd "C:\Users\elankathir\.gemini\antigravity\scratch\student-management-system\backend"
```

### Step 2: Create and Activate Virtual Environment

```powershell
# On Windows:
python -m venv venv

# If PowerShell script execution is restricted, run python directly from venv:
# (Or activate if scripts are enabled: .\venv\Scripts\Activate.ps1)
```

### Step 3: Install Dependencies

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### Step 4: Apply Database Migrations

```powershell
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
```

### Step 5: (Optional) Seed Sample Records

```powershell
.\venv\Scripts\python.exe manage.py seed_data
```
*This preloads 5 realistic student records into SQLite for instant testing and demonstration.*

### Step 6: (Optional) Create Django Superuser for Admin

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```
Follow prompts to set username and password to log in at `http://127.0.0.1:8000/admin/`.

---

## 🏃 How to Run the Application

### 1. Start the Django Backend Server

From the `backend/` directory:
```powershell
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```
The Django REST API will be active at: `http://127.0.0.1:8000/api/students/`

### 2. Launch the Frontend

You can open the frontend in **either** of two simple ways:

**Option A: Direct Browser File (Easiest)**
- Double-click `frontend/index.html` or open it in your browser (`file:///.../frontend/index.html`).
- *Note: CORS is fully enabled on the backend to allow direct local file origin!*

**Option B: Python HTTP Local Server**
Open a second terminal window:
```powershell
cd "C:\Users\elankathir\.gemini\antigravity\scratch\student-management-system\frontend"
python -m http.server 5500
```
Open your browser and navigate to: `http://127.0.0.1:5500`

---

## 🧪 Testing Guide

### 1. Automated Django Unit Tests

Run the built-in test suite covering all 13 test scenarios:
```powershell
cd "C:\Users\elankathir\.gemini\antigravity\scratch\student-management-system\backend"
.\venv\Scripts\python.exe manage.py test
```

**Expected Output:**
```
Found 13 test(s).
Creating test database for alias 'default'...
.............
----------------------------------------------------------------------
Ran 13 tests in 0.15s

OK
Destroying test database for alias 'default'...
```

### 2. Postman API Testing Instructions

A complete, ready-to-import Postman collection is included in the project root: `postman_collection.json`.

#### How to import:
1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Select the file: `student-management-system/postman_collection.json`.
4. The collection `Student Management System API` will appear with all 8 pre-configured test requests:

| Test Case # | Request Name | Method | URL | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Create Student (Success) | `POST` | `http://127.0.0.1:8000/api/students/` | `201 Created` |
| **2** | Get All Students | `GET` | `http://127.0.0.1:8000/api/students/` | `200 OK` |
| **3** | Get Student by ID | `GET` | `http://127.0.0.1:8000/api/students/1/` | `200 OK` |
| **4** | Update Student (PUT) | `PUT` | `http://127.0.0.1:8000/api/students/1/` | `200 OK` |
| **5** | Delete Student | `DELETE` | `http://127.0.0.1:8000/api/students/1/` | `200 OK` |
| **6** | Invalid Student ID | `GET` | `http://127.0.0.1:8000/api/students/99999/` | `404 Not Found` |
| **7** | Duplicate Register Number | `POST` | `http://127.0.0.1:8000/api/students/` | `400 Bad Request` |
| **8** | Missing Required Field | `POST` | `http://127.0.0.1:8000/api/students/` | `400 Bad Request` |

---

## 🔮 Future Enhancements

1. **Role-Based Access Control (RBAC)**: Distinct permissions for Students (View profile), Faculty (Grade/Attendance), and Admin (Full CRUD).
2. **Profile Picture Uploads**: Add avatar uploads with Django media files storage.
3. **Pagination & Export**: Server-side pagination with CSV / PDF export capabilities.
4. **Attendance & Grading Module**: Extend the database schema to track academic marks and semester attendance percentages.
