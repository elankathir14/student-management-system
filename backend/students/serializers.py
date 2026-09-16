import re
from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model with field-level validation
    and clean user-friendly error messages.
    """

    class Meta:
        model = Student
        fields = [
            'id',
            'name',
            'register_number',
            'email',
            'department',
            'year',
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Student name cannot be empty or only spaces.")
        if len(trimmed) < 2:
            raise serializers.ValidationError("Student name must be at least 2 characters long.")
        return trimmed

    def validate_register_number(self, value):
        trimmed = value.strip().upper()
        if not trimmed:
            raise serializers.ValidationError("Register number cannot be empty.")
        
        # Check uniqueness manually to provide a clear, friendly error message
        instance = getattr(self, 'instance', None)
        existing = Student.objects.filter(register_number__iexact=trimmed)
        if instance:
            existing = existing.exclude(pk=instance.pk)
        if existing.exists():
            raise serializers.ValidationError(
                f"Student with Register Number '{trimmed}' already exists."
            )
        return trimmed

    def validate_email(self, value):
        trimmed = value.strip().lower()
        if not trimmed:
            raise serializers.ValidationError("Email cannot be empty.")
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, trimmed):
            raise serializers.ValidationError("Please enter a valid email address.")
        return trimmed

    def validate_department(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Department cannot be empty.")
        return trimmed

    def validate_year(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Academic year cannot be empty.")
        return trimmed

    def validate_phone(self, value):
        trimmed = value.strip()
        # Ensure exactly 10 digits
        if not re.match(r'^\d{10}$', trimmed):
            raise serializers.ValidationError("Phone number must contain exactly 10 digits.")
        return trimmed
