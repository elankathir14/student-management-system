from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Student


class StudentAPITestCase(TestCase):
    """
    Test suite for Student Management System REST API endpoints.
    Verifies full CRUD operations, input validations, error handling, and query filters.
    """

    def setUp(self):
        self.client = APIClient()
        self.student_data = {
            "name": "Alice Johnson",
            "register_number": "REG2026001",
            "email": "alice.johnson@example.com",
            "department": "Computer Science and Engineering",
            "year": "3rd Year",
            "phone": "9876543210"
        }
        self.student = Student.objects.create(**self.student_data)
        self.list_url = reverse('student-list')
        self.detail_url = reverse('student-detail', kwargs={'pk': self.student.id})

    def test_create_student_success(self):
        """Test creating a new valid student returns 201 Created."""
        payload = {
            "name": "Bob Smith",
            "register_number": "REG2026002",
            "email": "bob.smith@example.com",
            "department": "Information Technology",
            "year": "2nd Year",
            "phone": "9876543211"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Bob Smith")
        self.assertEqual(response.data['register_number'], "REG2026002")
        self.assertTrue(Student.objects.filter(register_number="REG2026002").exists())

    def test_create_student_duplicate_register_number(self):
        """Test creating a student with duplicate register number returns 400 Bad Request."""
        payload = {
            "name": "Another Alice",
            "register_number": "REG2026001",  # Same as in setUp
            "email": "another.alice@example.com",
            "department": "Mechanical Engineering",
            "year": "1st Year",
            "phone": "9876543212"
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('register_number', response.data)

    def test_create_student_invalid_phone(self):
        """Test creating a student with invalid phone number returns 400."""
        payload = self.student_data.copy()
        payload['register_number'] = "REG2026003"
        payload['phone'] = "12345"  # Too short
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)

    def test_create_student_invalid_email(self):
        """Test creating a student with invalid email returns 400."""
        payload = self.student_data.copy()
        payload['register_number'] = "REG2026004"
        payload['email'] = "invalid-email-format"
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_student_missing_field(self):
        """Test creating a student with missing required field returns 400."""
        payload = {
            "name": "Incomplete Student",
            # missing register_number, email, department, year, phone
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('register_number', response.data)

    def test_get_all_students(self):
        """Test retrieving list of all students returns 200 OK."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_student_by_id(self):
        """Test retrieving a student by ID returns 200 OK."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.student.id)
        self.assertEqual(response.data['name'], self.student.name)

    def test_get_student_invalid_id(self):
        """Test retrieving a nonexistent student returns 404 Not Found."""
        invalid_url = reverse('student-detail', kwargs={'pk': 99999})
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_student_by_name(self):
        """Test search query parameter returns matched students."""
        response = self.client.get(f"{self.list_url}?search=Alice")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Alice Johnson")

    def test_filter_student_by_department(self):
        """Test department query parameter filters students."""
        response = self.client.get(f"{self.list_url}?department=Computer Science and Engineering")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_student_put(self):
        """Test full update of student returns 200 OK."""
        updated_payload = {
            "name": "Alice Johnson Updated",
            "register_number": "REG2026001",
            "email": "alice.updated@example.com",
            "department": "Computer Science and Engineering",
            "year": "4th Year",
            "phone": "9876543210"
        }
        response = self.client.put(self.detail_url, updated_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Alice Johnson Updated")
        self.assertEqual(response.data['year'], "4th Year")

    def test_update_student_patch(self):
        """Test partial update of student returns 200 OK."""
        partial_payload = {"phone": "9123456780"}
        response = self.client.patch(self.detail_url, partial_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.phone, "9123456780")

    def test_delete_student(self):
        """Test deleting a student removes it from the database."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Student.objects.filter(id=self.student.id).exists())
