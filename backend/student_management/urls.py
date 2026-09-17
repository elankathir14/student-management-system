"""
URL Configuration for student_management project.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def root_view(request):
    return JsonResponse({
        "status": "online",
        "message": "Student Management System API is running successfully.",
        "endpoints": {
            "students_api": "/api/students/",
            "admin_panel": "/admin/"
        }
    })


urlpatterns = [
    path('', root_view, name='root-status'),
    path('admin/', admin.site.urls),
    # Student API routes mapped to /api/students/
    path('api/', include('students.urls')),
]
