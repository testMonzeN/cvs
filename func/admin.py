from django.contrib import admin
from .models import CompetitionsModel, TrainingModel, SeminarModel, SinghtingInModel, CompetitionResult, OrganizerList

# Регистрация организаторов
@admin.register(OrganizerList)
class OrganizerListAdmin(admin.ModelAdmin):
    list_display = ('organizer',)
    search_fields = ('organizer',)

# Инлайн для результатов в соревновании
class CompetitionResultInline(admin.TabularInline):
    model = CompetitionResult
    extra = 1
    fields = ('participant', 'place', 'points', 'rating_points', 'final_rating_points')
    readonly_fields = ('rating_points', 'final_rating_points')

# Регистрация соревнований
@admin.register(CompetitionsModel)
class CompetitionsModelAdmin(admin.ModelAdmin):
    list_display = ('date', 'type', 'is_raiting', 'status', 'cof', 'participants_count')
    list_filter = ('type', 'is_raiting', 'status', 'date', 'organizer')
    search_fields = ('description', 'organizer__organizer', 'location')
    filter_horizontal = ('participants',)  # ← Убрали 'organizer', т.к. это ForeignKey
    inlines = [CompetitionResultInline]
    
    def participants_count(self, obj):
        return obj.participants.count()
    participants_count.short_description = 'Участников'

# Регистрация результатов
@admin.register(CompetitionResult)
class CompetitionResultAdmin(admin.ModelAdmin):
    list_display = ('competition', 'participant', 'place', 'points', 'rating_points', 'final_rating_points')
    list_filter = ('competition__date', 'competition__type')
    search_fields = ('participant__username', 'competition__description')
    readonly_fields = ('rating_points', 'final_rating_points')
    ordering = ('competition', 'place')

# Остальные модели
admin.site.register(TrainingModel)
admin.site.register(SeminarModel)
admin.site.register(SinghtingInModel)
