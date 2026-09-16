from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'register_number',
        'email',
        'department',
        'year',
        'phone',
        'created_at'
    )
    list_filter = ('department', 'year', 'created_at')
    search_fields = ('name', 'register_number', 'email', 'phone')
    ordering = ('-id',)
    list_per_page = 25
