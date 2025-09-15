from django.shortcuts import render
from django.views import View
from .models import CompetitionsModel
from .froms import CompetitionsCreateForm, CompetitionsEditForm
from django.shortcuts import redirect

# телепорт
class TeleportView(View):
    def get(self, request):
        return render(request, 'templates/teleport/teleport.html')

#1 соревнования
class CompetitionsView(View):
    def get(self, request):
        competitions = CompetitionsModel.objects.all()
        return render(request, 'templates/func/competitions.html', 
                      {
                          'competitions': competitions,
                          }
                      )
        
class CompetitionsDetailView(View):
    def get(self, request, pk):
        competition = CompetitionsModel.objects.get(pk=pk)
        return render(request, 'templates/func/competitions_detail.html', 
                      {
                          'competition': competition,
                          })

class CompetitionsCreateView(View):
    def get(self, request):
        create_form = CompetitionsCreateForm()
        return render(request, 'templates/func/competitions_create.html', 
                      {
                          'create_form': create_form,
                          })
    def post(self, request):
        create_form = CompetitionsCreateForm(request.POST)
        if create_form.is_valid():
            create_form.save()
            return redirect('competitions')
        return render(request, 'templates/func/competitions_create.html', 
                      {
                          'create_form': create_form,
                          })
class CompetitionsEditView(View):
    def get(self, request, pk):
        edit_form = CompetitionsEditForm(instance=CompetitionsModel.objects.get(pk=pk))
        return render(request, 'templates/func/competitions_edit.html', 
                      {
                          'edit_form': edit_form,
                          })
    def post(self, request, pk):
        edit_form = CompetitionsEditForm(request.POST, instance=CompetitionsModel.objects.get(pk=pk))
        if edit_form.is_valid():
            edit_form.save()
            return redirect('competitions')
        return render(request, 'templates/func/competitions_edit.html', 
                      {
                          'edit_form': edit_form,
                          })
#2 семинар
class TrainingView(View):
    def get(self, request):
        return render(request, 'templates/func/training.html')

#3 пристрелка оружия
class SinghtingInView(View):
    def get(self, request):
        return render(request, 'templates/func/singhting-in.html')

#4 семинар
class SeminarView(View):
    def get(self, request):
        return render(request, 'templates/func/seminar.html')