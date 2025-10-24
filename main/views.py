from django.shortcuts import render
from django.views import View
from cabinet.models import User
from func.models import CompetitionsModel, SeminarModel, TrainingModel

# Create your views here.
class MainView(View):
    def get(self, request):
        user_count = User.objects.all().count()
        competition_count = CompetitionsModel.objects.all().count()
        seminar_count = SeminarModel.objects.all().count()
        training_count = TrainingModel.objects.all().count()
        
        
        return render(request, 'home/main.html', {
            'users': user_count,
            'competition_count': competition_count,
            'seminar_count': seminar_count,
            'training_count': training_count
        })