from django.core.management.base import BaseCommand
from students.models import Student


class Command(BaseCommand):
    help = 'Seeds database with realistic sample student records for demonstration.'

    def handle(self, *args, **options):
        sample_students = [
            {
                "name": "Aarav Sharma",
                "register_number": "2026CS101",
                "email": "aarav.sharma@college.edu",
                "department": "Computer Science and Engineering",
                "year": "3rd Year",
                "phone": "9876543210"
            },
            {
                "name": "Priya Patel",
                "register_number": "2026IT102",
                "email": "priya.patel@college.edu",
                "department": "Information Technology",
                "year": "2nd Year",
                "phone": "9876543211"
            },
            {
                "name": "Rohan Verma",
                "register_number": "2026EC103",
                "email": "rohan.verma@college.edu",
                "department": "Electronics and Communication Engineering",
                "year": "4th Year",
                "phone": "9876543212"
            },
            {
                "name": "Sneha Reddy",
                "register_number": "2026ME104",
                "email": "sneha.reddy@college.edu",
                "department": "Mechanical Engineering",
                "year": "1st Year",
                "phone": "9876543213"
            },
            {
                "name": "Vikram Das",
                "register_number": "2026AI105",
                "email": "vikram.das@college.edu",
                "department": "Artificial Intelligence and Data Science",
                "year": "3rd Year",
                "phone": "9876543214"
            }
        ]

        created_count = 0
        for data in sample_students:
            student, created = Student.objects.get_or_create(
                register_number=data['register_number'],
                defaults=data
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {created_count} sample students into SQLite database.")
        )
