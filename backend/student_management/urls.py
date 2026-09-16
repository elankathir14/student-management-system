"""
URL Configuration for student_management project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Student API routes mapped to /api/students/
    path('api/', include('students.urls')),
]
