from django.db import models
from django.core.validators import RegexValidator


# Phone number regex validator: exactly 10 digits (common standard) or 10-15 digits
phone_validator = RegexValidator(
    regex=r'^\d{10}$',
    message="Phone number must be exactly 10 digits without country code or spaces."
)


class Student(models.Model):
    """
    Student model representing a student entity in the College Management System.
    """
    YEAR_CHOICES = [
        ('1st Year', '1st Year'),
        ('2nd Year', '2nd Year'),
        ('3rd Year', '3rd Year'),
        ('4th Year', '4th Year'),
    ]

    name = models.CharField(
        max_length=100,
        help_text="Full name of the student"
    )
    register_number = models.CharField(
        max_length=30,
        unique=True,
        help_text="Unique college registration/roll number"
    )
    email = models.EmailField(
        max_length=100,
        help_text="Valid email address of the student"
    )
    department = models.CharField(
        max_length=100,
        help_text="Department of study (e.g., Computer Science, Mechanical, etc.)"
    )
    year = models.CharField(
        max_length=20,
        choices=YEAR_CHOICES,
        help_text="Academic year of study"
    )
    phone = models.CharField(
        max_length=15,
        validators=[phone_validator],
        help_text="10-digit contact phone number"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the student record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the student record was last updated"
    )

    class Meta:
        ordering = ['-id']
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def __str__(self):
        return f"{self.name} ({self.register_number}) - {self.department}"
