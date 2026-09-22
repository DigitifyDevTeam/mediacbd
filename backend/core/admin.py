from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'brand_name',
        'contact_name',
        'email',
        'status',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = ('brand_name', 'contact_name', 'email', 'website', 'address')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
