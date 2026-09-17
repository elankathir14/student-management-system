/**
 * Student Management System - Frontend Application Logic
 * Pure Vanilla JavaScript using Fetch API
 */

// Configuration
const API_BASE_URL = 'https://student-management-system-1-atgf.onrender.com/api/students/';
// Application State
const state = {
    students: [],
    isEditing: false,
    editingStudentId: null,
    deletingStudentId: null,
    isLoading: false,
    isOnline: false
};

// DOM Element References
const elements = {
    // Form elements
    form: document.getElementById('studentForm'),
    formTitle: document.getElementById('formTitle'),
    formSubtitle: document.getElementById('formSubtitle'),
    formIcon: document.getElementById('formIcon'),
    editBadge: document.getElementById('editBadge'),
    studentIdInput: document.getElementById('studentId'),
    nameInput: document.getElementById('name'),
    registerNumberInput: document.getElementById('registerNumber'),
    emailInput: document.getElementById('email'),
    departmentInput: document.getElementById('department'),
    yearInput: document.getElementById('year'),
    phoneInput: document.getElementById('phone'),
    submitBtn: document.getElementById('submitBtn'),
    submitBtnText: document.getElementById('submitBtnText'),
    resetBtn: document.getElementById('resetBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),

    // Field error spans
    nameError: document.getElementById('nameError'),
    registerNumberError: document.getElementById('registerNumberError'),
    emailError: document.getElementById('emailError'),
    departmentError: document.getElementById('departmentError'),
    yearError: document.getElementById('yearError'),
    phoneError: document.getElementById('phoneError'),

    // Table & Controls
    tableBody: document.getElementById('studentsTableBody'),
    studentCountBadge: document.getElementById('studentCountBadge'),
    refreshListBtn: document.getElementById('refreshListBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    deptFilter: document.getElementById('deptFilter'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),
    emptyDesc: document.getElementById('emptyDesc'),
    emptyAddBtn: document.getElementById('emptyAddBtn'),

    // Modal elements
    deleteModal: document.getElementById('deleteModal'),
    modalStudentName: document.getElementById('modalStudentName'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalConfirmDeleteBtn: document.getElementById('modalConfirmDeleteBtn'),

    // Status & Notification
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    alertContainer: document.getElementById('alertContainer')
};

// ==========================================================================
// Initialization & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkBackendHealth();
    fetchStudents();
});

function initEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.cancelEditBtn.addEventListener('click', cancelEdit);

    // Search and Filter
    let searchDebounceTimeout = null;
    elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        elements.clearSearchBtn.classList.toggle('hidden', query.length === 0);
        clearTimeout(searchDebounceTimeout);
        searchDebounceTimeout = setTimeout(() => {
            fetchStudents();
        }, 300);
    });

    elements.clearSearchBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        elements.clearSearchBtn.classList.add('hidden');
        fetchStudents();
    });

    elements.deptFilter.addEventListener('change', () => {
        fetchStudents();
    });

    elements.refreshListBtn.addEventListener('click', () => {
        checkBackendHealth();
        fetchStudents();
    });

    elements.emptyAddBtn.addEventListener('click', () => {
        elements.nameInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Delete Modal Actions
    elements.modalCloseBtn.addEventListener('click', closeDeleteModal);
    elements.modalCancelBtn.addEventListener('click', closeDeleteModal);
    elements.modalConfirmDeleteBtn.addEventListener('click', confirmDeleteStudent);
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) {
            closeDeleteModal();
        }
    });

    // Real-time input validation cleanup
    const inputPairs = [
        [elements.nameInput, elements.nameError],
        [elements.registerNumberInput, elements.registerNumberError],
        [elements.emailInput, elements.emailError],
        [elements.departmentInput, elements.departmentError],
        [elements.yearInput, elements.yearError],
        [elements.phoneInput, elements.phoneError]
    ];

    inputPairs.forEach(([inputEl, errorEl]) => {
        inputEl.addEventListener('input', () => {
            inputEl.classList.remove('is-invalid');
            if (errorEl) errorEl.textContent = '';
        });
    });
}

// ==========================================================================
// API Operations (Fetch API)
// ==========================================================================

/**
 * Check backend connection status and update UI indicator
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(API_BASE_URL, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (response.ok) {
            setServerStatus(true, 'API Connected (Django REST)');
        } else {
            setServerStatus(false, 'API Returned Error ' + response.status);
        }
    } catch (err) {
        setServerStatus(false, 'API Offline - Run Backend Server');
    }
}

function setServerStatus(online, text) {
    state.isOnline = online;
    elements.statusText.textContent = text;
    elements.statusDot.className = 'status-dot ' + (online ? 'status-online' : 'status-offline');
}

/**
 * Fetch students from Django REST API with search and department filtering
 */
async function fetchStudents() {
    setLoading(true);
    clearFieldErrors();

    const searchQuery = elements.searchInput.value.trim();
    const deptQuery = elements.deptFilter.value.trim();

    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (deptQuery) params.append('department', deptQuery);

    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        state.students = Array.isArray(data) ? data : (data.results || []);
        renderStudentsTable(state.students);
        setServerStatus(true, 'API Connected (Django REST)');
    } catch (err) {
        setServerStatus(false, 'API Offline - Run Backend Server');
        renderStudentsTable([]);
        showAlert(
            'Unable to reach Django API backend. Ensure "python manage.py runserver" is running at http://127.0.0.1:8000',
            'error'
        );
    } finally {
        setLoading(false);
    }
}

/**
 * Handle Add Student (POST) or Edit Student (PUT)
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    // 1. Client-side Form Validation
    const validation = validateForm();
    if (!validation.isValid) {
        showAlert('Please resolve the highlighted validation errors before submitting.', 'warning');
        return;
    }

    const payload = {
        name: elements.nameInput.value.trim(),
        register_number: elements.registerNumberInput.value.trim().toUpperCase(),
        email: elements.emailInput.value.trim().toLowerCase(),
        department: elements.departmentInput.value.trim(),
        year: elements.yearInput.value.trim(),
        phone: elements.phoneInput.value.trim()
    };

    const isEdit = state.isEditing && state.editingStudentId;
    const url = isEdit ? `${API_BASE_URL}${state.editingStudentId}/` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';

    // Disable button to prevent double-submit
    elements.submitBtn.disabled = true;
    elements.submitBtnText.textContent = isEdit ? 'Updating...' : 'Saving...';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok || response.status === 201 || response.status === 200) {
            const successMsg = isEdit
                ? `Student "${payload.name}" updated successfully!`
                : `Student "${payload.name}" registered successfully!`;
            showAlert(successMsg, 'success');
            resetForm();
            fetchStudents();
        } else if (response.status === 400) {
            // Handle backend validation errors (e.g. duplicate register number, invalid email/phone)
            handleBackendValidationErrors(data);
        } else if (response.status === 404) {
            showAlert('Student record not found on the server. It may have been deleted.', 'error');
            resetForm();
            fetchStudents();
        } else {
            showAlert(data.detail || 'An unexpected error occurred. Please try again.', 'error');
        }
    } catch (err) {
        showAlert('Network error: Failed to connect to the backend server.', 'error');
    } finally {
        elements.submitBtn.disabled = false;
        elements.submitBtnText.textContent = state.isEditing ? 'Update Student' : 'Add Student';
    }
}

/**
 * Handle loading student details into form for updating
 */
async function editStudent(id) {
    clearFieldErrors();

    // Look for student in state first, or fetch from API
    let student = state.students.find(s => s.id === id);

    if (!student) {
        try {
            const response = await fetch(`${API_BASE_URL}${id}/`);
            if (!response.ok) throw new Error('Student not found');
            student = await response.json();
        } catch (err) {
            showAlert('Could not load student details for editing.', 'error');
            return;
        }
    }

    // Populate form fields
    state.isEditing = true;
    state.editingStudentId = student.id;
    elements.studentIdInput.value = student.id;
    elements.nameInput.value = student.name || '';
    elements.registerNumberInput.value = student.register_number || '';
    elements.emailInput.value = student.email || '';
    elements.departmentInput.value = student.department || '';
    elements.yearInput.value = student.year || '';
    elements.phoneInput.value = student.phone || '';

    // Update UI for Edit Mode
    elements.formTitle.innerHTML = '<span id="formIcon">✏️</span> Edit Student Details';
    elements.formSubtitle.textContent = `Modifying record for ${student.name} (ID: ${student.id})`;
    elements.submitBtnText.textContent = 'Update Student';
    elements.editBadge.classList.remove('hidden');
    elements.cancelEditBtn.classList.remove('hidden');

    // Smooth scroll to form
    elements.nameInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Open confirmation modal before deleting
 */
function deleteStudentPrompt(id, name, regNo) {
    state.deletingStudentId = id;
    elements.modalStudentName.textContent = `${name} (${regNo || 'ID: ' + id})`;
    elements.deleteModal.classList.remove('hidden');
}

/**
 * Send DELETE request to Django API
 */
async function confirmDeleteStudent() {
    const id = state.deletingStudentId;
    if (!id) return;

    elements.modalConfirmDeleteBtn.disabled = true;
    elements.modalConfirmDeleteBtn.textContent = 'Deleting...';

    try {
        const response = await fetch(`${API_BASE_URL}${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 204 || response.ok) {
            showAlert('Student record deleted successfully from database.', 'success');
            // If we were editing this deleted student, reset the form
            if (state.isEditing && state.editingStudentId === id) {
                resetForm();
            }
            closeDeleteModal();
            fetchStudents();
        } else if (response.status === 404) {
            showAlert('Student record not found. It may have already been deleted.', 'warning');
            closeDeleteModal();
            fetchStudents();
        } else {
            const data = await response.json();
            showAlert(data.detail || 'Could not delete student record.', 'error');
            closeDeleteModal();
        }
    } catch (err) {
        showAlert('Network error: Unable to contact server for deletion.', 'error');
        closeDeleteModal();
    } finally {
        elements.modalConfirmDeleteBtn.disabled = false;
        elements.modalConfirmDeleteBtn.innerHTML = '<span class="btn-icon">🗑️</span> Yes, Delete';
    }
}

function closeDeleteModal() {
    elements.deleteModal.classList.add('hidden');
    state.deletingStudentId = null;
}

// ==========================================================================
// Validation & Form Handling
// ==========================================================================

/**
 * Validate all form fields on client side
 */
function validateForm() {
    clearFieldErrors();
    let isValid = true;

    const name = elements.nameInput.value.trim();
    const regNo = elements.registerNumberInput.value.trim();
    const email = elements.emailInput.value.trim();
    const department = elements.departmentInput.value.trim();
    const year = elements.yearInput.value.trim();
    const phone = elements.phoneInput.value.trim();

    // 1. Name validation
    if (!name) {
        setFieldError(elements.nameInput, elements.nameError, 'Student name is required.');
        isValid = false;
    } else if (name.length < 2) {
        setFieldError(elements.nameInput, elements.nameError, 'Name must be at least 2 characters long.');
        isValid = false;
    }

    // 2. Register Number validation
    if (!regNo) {
        setFieldError(elements.registerNumberInput, elements.registerNumberError, 'Register number is required.');
        isValid = false;
    } else if (regNo.length < 3) {
        setFieldError(elements.registerNumberInput, elements.registerNumberError, 'Register number must be at least 3 characters.');
        isValid = false;
    }

    // 3. Email validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email) {
        setFieldError(elements.emailInput, elements.emailError, 'Email address is required.');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        setFieldError(elements.emailInput, elements.emailError, 'Please enter a valid email format (e.g. name@college.edu).');
        isValid = false;
    }

    // 4. Department validation
    if (!department) {
        setFieldError(elements.departmentInput, elements.departmentError, 'Please select a department.');
        isValid = false;
    }

    // 5. Year validation
    if (!year) {
        setFieldError(elements.yearInput, elements.yearError, 'Please select an academic year.');
        isValid = false;
    }

    // 6. Phone validation (exact 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
        setFieldError(elements.phoneInput, elements.phoneError, 'Phone number is required.');
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        setFieldError(elements.phoneInput, elements.phoneError, 'Phone number must contain exactly 10 numeric digits.');
        isValid = false;
    }

    return { isValid };
}

function setFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
}

function clearFieldErrors() {
    const inputs = [
        elements.nameInput,
        elements.registerNumberInput,
        elements.emailInput,
        elements.departmentInput,
        elements.yearInput,
        elements.phoneInput
    ];
    inputs.forEach(input => {
        if (input) input.classList.remove('is-invalid');
    });

    const errorSpans = [
        elements.nameError,
        elements.registerNumberError,
        elements.emailError,
        elements.departmentError,
        elements.yearError,
        elements.phoneError
    ];
    errorSpans.forEach(span => {
        if (span) span.textContent = '';
    });
}

function handleBackendValidationErrors(data) {
    let generalMessage = 'Validation failed: Please review the marked fields.';

    if (data.register_number) {
        const msg = Array.isArray(data.register_number) ? data.register_number[0] : data.register_number;
        setFieldError(elements.registerNumberInput, elements.registerNumberError, msg);
        generalMessage = msg;
    }
    if (data.email) {
        const msg = Array.isArray(data.email) ? data.email[0] : data.email;
        setFieldError(elements.emailInput, elements.emailError, msg);
    }
    if (data.phone) {
        const msg = Array.isArray(data.phone) ? data.phone[0] : data.phone;
        setFieldError(elements.phoneInput, elements.phoneError, msg);
    }
    if (data.name) {
        const msg = Array.isArray(data.name) ? data.name[0] : data.name;
        setFieldError(elements.nameInput, elements.nameError, msg);
    }
    if (data.department) {
        const msg = Array.isArray(data.department) ? data.department[0] : data.department;
        setFieldError(elements.departmentInput, elements.departmentError, msg);
    }
    if (data.year) {
        const msg = Array.isArray(data.year) ? data.year[0] : data.year;
        setFieldError(elements.yearInput, elements.yearError, msg);
    }

    showAlert(generalMessage, 'error');
}

/**
 * Reset form back to fresh Add Student state
 */
function resetForm() {
    elements.form.reset();
    elements.studentIdInput.value = '';
    clearFieldErrors();

    state.isEditing = false;
    state.editingStudentId = null;

    elements.formTitle.innerHTML = '<span id="formIcon">➕</span> Add New Student';
    elements.formSubtitle.textContent = "Enter the student's academic and contact credentials";
    elements.submitBtnText.textContent = 'Add Student';
    elements.editBadge.classList.add('hidden');
    elements.cancelEditBtn.classList.add('hidden');
}

function cancelEdit() {
    resetForm();
    showAlert('Edit cancelled. Back to student registration mode.', 'warning');
}

// ==========================================================================
// DOM Rendering Functions
// ==========================================================================

/**
 * Render list of students in the table
 */
function renderStudentsTable(students) {
    elements.tableBody.innerHTML = '';
    elements.studentCountBadge.textContent = `Total: ${students.length} Student${students.length === 1 ? '' : 's'}`;

    if (!students || students.length === 0) {
        elements.emptyState.classList.remove('hidden');
        if (elements.searchInput.value.trim() || elements.deptFilter.value) {
            elements.emptyDesc.textContent = 'No students match your search or filter criteria.';
        } else {
            elements.emptyDesc.textContent = 'No student records found in database. Add a student using the form above.';
        }
        return;
    }

    elements.emptyState.classList.add('hidden');

    students.forEach(student => {
        const row = document.createElement('tr');
        row.id = `student-row-${student.id}`;

        // Escape HTML to prevent XSS
        const id = student.id;
        const name = escapeHtml(student.name);
        const regNo = escapeHtml(student.register_number);
        const email = escapeHtml(student.email);
        const dept = escapeHtml(student.department);
        const year = escapeHtml(student.year);
        const phone = escapeHtml(student.phone);

        row.innerHTML = `
            <td><strong>#${id}</strong></td>
            <td><strong>${name}</strong></td>
            <td><span class="student-reg-badge">${regNo}</span></td>
            <td><a href="mailto:${email}" style="color: var(--primary); text-decoration: none;">${email}</a></td>
            <td><span class="department-badge">${dept}</span></td>
            <td><span class="year-badge">${year}</span></td>
            <td>${phone}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn-action-edit" onclick="editStudent(${id})" title="Edit Student">
                        ✏️ Edit
                    </button>
                    <button type="button" class="btn-action-delete" onclick="deleteStudentPrompt(${id}, '${escapeJs(name)}', '${escapeJs(regNo)}')" title="Delete Student">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        `;

        elements.tableBody.appendChild(row);
    });
}

function setLoading(isLoading) {
    state.isLoading = isLoading;
    elements.loadingState.classList.toggle('hidden', !isLoading);
}

/**
 * Toast / Banner Alert Notification system
 */
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    alert.innerHTML = `
        <span>${icon}</span>
        <div style="flex: 1;">${escapeHtml(message)}</div>
        <button type="button" class="alert-close" aria-label="Close alert">&times;</button>
    `;

    // Close button
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });

    elements.alertContainer.appendChild(alert);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Utility Helpers
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeJs(text) {
    if (!text) return '';
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
