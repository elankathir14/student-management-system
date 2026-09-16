from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Student CRUD operations:
    - GET    /api/students/          -> List all students (supports ?search= and ?department=)
    - POST   /api/students/          -> Create a new student
    - GET    /api/students/<id>/     -> Retrieve a student by ID
    - PUT    /api/students/<id>/     -> Update all fields of a student
    - PATCH  /api/students/<id>/     -> Partially update a student
    - DELETE /api/students/<id>/     -> Delete a student
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        """
        Optionally filter the returned students by 'search' query
        (matching name or register number) and 'department'.
        """
        queryset = Student.objects.all()
        search_query = self.request.query_params.get('search', '').strip()
        department_query = self.request.query_params.get('department', '').strip()

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(register_number__icontains=search_query) |
                Q(email__icontains=search_query)
            )

        if department_query:
            queryset = queryset.filter(department__iexact=department_query)

        return queryset

    def get_object(self):
        """
        Retrieve student object or raise customized NotFound error.
        """
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs.get(lookup_url_kwarg)
        try:
            return super().get_object()
        except Exception:
            raise NotFound(detail=f"Student with ID '{lookup_value}' was not found.")

    def destroy(self, request, *args, **kwargs):
        """
        Delete student and return friendly confirmation.
        """
        instance = self.get_object()
        student_name = instance.name
        reg_no = instance.register_number
        self.perform_destroy(instance)
        return Response(
            {
                "message": f"Student '{student_name}' ({reg_no}) has been successfully deleted."
            },
            status=status.HTTP_200_OK
        )
