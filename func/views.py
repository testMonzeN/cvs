import os
from django.http import HttpResponse
from django.shortcuts import render
from django.views import View
from cabinet.models import TopLadder, User
from .models import CompetitionsModel, TrainingModel, SeminarModel, SinghtingInModel, CompetitionResult
from .froms import (
    CompetitionsCreateForm, CompetitionsEditForm, 
    TrainingCreateForm, TrainingEditForm, 
    SeminarCreateForm, SeminarEditForm, 
    SinghtingInCreateForm, SinghtingInEditForm, CompetitionsMmrRedactorForm, CompetitionResultForm
    )
from django.shortcuts import redirect
from cvs.settings import BASE_DIR


# телепорт
class TeleportView(View):
    def get(self, request):
        return render(request, 'teleport/teleport.html')
# рейтинг
class TotalLadderCheck:
    @staticmethod
    def count_leader_ladder(competitions):
        ladder = User.objects.all().order_by('-mmr')[:20]

        count = 0
        for top_user in ladder:
            if competitions.participants.filter(id=top_user.id).exists():
                count += 1

        return count

class TopLadderView(View):
    def get(self, request):
        top_users = User.objects.all().order_by('-mmr')[:100]
        
        ranked_users = []
        for index, user in enumerate(top_users, start=1):
            ranked_users.append({
                'position': index,
                'user': user,
                'mmr': user.mmr,
                'hometown': user.hometown or 'Не указан',
            })
        
        return render(request, 'raiting/top_ladder.html', {
            'ranked_users': ranked_users,
            'total_users': User.objects.count()
        })

#1 соревнования
class CompetitionsView(View, TotalLadderCheck):
    @staticmethod
    def check_datetime():
        competitions = CompetitionsModel.objects.all()
        for com in competitions:
            com.save()

    def get(self, request):
        filter_type = request.GET.get('name') or request.GET.get('filter')
        
        if not filter_type or filter_type == 'all':
            competitions = CompetitionsModel.objects.all().order_by('-date').order_by('-status')
        else:
            competitions = CompetitionsModel.objects.filter(type=filter_type).order_by('-date').order_by('-status')

        self.check_datetime()
        for competition in competitions:
            if self.count_leader_ladder(competition) >= 5:
                competition.is_raiting = True
                competition.save()

        return render(request, 'func/competitions/competitions.html',
                      {
                          'competitions': competitions,
                          'user': request.user,
                          }
                      )

class CompetitionResultView(View):
    def get(self, request, pk):
        competition = CompetitionsModel.objects.get(pk=pk)
        
        participants = competition.participants.all()
        
        existing_results = CompetitionResult.objects.filter(competition=competition)

        form = CompetitionResultForm()
        
        return render(request, 'func/competitions/results-form.html', {
            'competition': competition,
            'participants': participants,
            'existing_results': existing_results,
            'form': form
        })

    def post(self, request, pk):
        competition = CompetitionsModel.objects.get(pk=pk)
        form = CompetitionResultForm(request.POST)

        if form.is_valid():
            result = form.save(commit=False)
            result.competition = competition
            result.save()  
            
            return redirect('competitions-detail', pk=pk)
        else:
            participants = competition.participants.all()
            existing_results = CompetitionResult.objects.filter(competition=competition)
            
            return render(request, 'func/competitions/results-form.html', {
                'competition': competition,
                'participants': participants,
                'existing_results': existing_results,
                'form': form
            })

class CompetitionsDetailView(View, TotalLadderCheck):
    def get(self, request, pk):
        competition = CompetitionsModel.objects.get(pk=pk)

        if self.count_leader_ladder(competition) >= 5:
            competition.is_raiting = True
            competition.save()
        return render(request, 'func/details/competitions-detail.html', 
                      {
                          'competition': competition,
                          })

class CompetitionsCreateView(View):
    def get(self, request):
        create_form = CompetitionsCreateForm()
        return render(request, 'func/competitions/competitions-create.html', 
                      {
                          'create_form': create_form,
                          })
        
    def post(self, request):
        create_form = CompetitionsCreateForm(request.POST)
        if create_form.is_valid():
            create_form.save()
            return redirect('competitions')
        return render(request, 'func/competitions/competitions-create.html', 
                      {
                          'create_form': create_form,
                          })
        
        
class CompetitionsEditView(View):
    def get(self, request, pk):
        edit_form = CompetitionsEditForm(instance=CompetitionsModel.objects.get(pk=pk))
        return render(request, 'func/competitions/competitions-edit.html', 
                      {
                          'edit_form': edit_form,
                          })
        
    def post(self, request, pk):
        edit_form = CompetitionsEditForm(request.POST, instance=CompetitionsModel.objects.get(pk=pk))
        if edit_form.is_valid():
            edit_form.save()
            return redirect('competitions')
        return render(request, 'func/competitions/competitions-edit.html', 
                      {
                          'edit_form': edit_form,
                          })

class CompetitionsSingUpView(View):
    def get(self, request, pk):
        competition = CompetitionsModel.objects.get(pk=pk)
        competition.participants.add(request.user)
        return redirect('competitions')
        
#2 тренировки
class TrainingView(View):
    def get(self, request):
        filter_type = request.GET.get('name') or request.GET.get('filter')
        
        if not filter_type or filter_type == 'all':
            training_list = TrainingModel.objects.all().order_by('-date')
        else:
            training_list = TrainingModel.objects.filter(type=filter_type).order_by('-date')
            
        return render(request, 'func/training/training.html', 
                      {
                          'training_list': training_list,
                          })

# тренировка
class TrainingDetailView(View):
    def get(self, request, pk):
        training = TrainingModel.objects.get(pk=pk)
        return render(request, 'func/training/training-detail.html', 
                      {
                          'training': training,
                          })
    
    def post(self, request, pk):
        training = TrainingModel.objects.get(pk=pk)
        training.participants.add(request.user)
        return redirect('training')
        
class TrainingCreateView(View):
    def get(self, request):
        create_form = TrainingCreateForm()
        return render(request, 'func/training/training-create.html', 
                      {
                          'create_form': create_form,
                          })
        
    def post(self, request):
        create_form = TrainingCreateForm(request.POST)
        if create_form.is_valid():
            create_form.save()
            return redirect('training')
        return render(request, 'func/training/training-create.html', 
                      {
                          'create_form': create_form,
                          })
        
class TrainingEditView(View):
    def get(self, request, pk):
        edit_form = TrainingEditForm(instance=TrainingModel.objects.get(pk=pk))
        return render(request, 'func/training/training-edit.html', 
                      {
                          'edit_form': edit_form,
                          })
    def post(self, request, pk):
        edit_form = TrainingEditForm(request.POST, instance=TrainingModel.objects.get(pk=pk))
        if edit_form.is_valid():
            edit_form.save()
            return redirect('training')
        return render(request, 'func/training/training-edit.html', 
                      {
                          'edit_form': edit_form,
                          })


#3 пристрелка оружия
class SinghtingInView(View):
    def get(self, request):
        sighting_in_list = SinghtingInModel.objects.all().order_by('-date')
        return render(request, 'func/sighting-in/sighting-in.html', 
                      {
                          'sighting_in_list': sighting_in_list,
                          })

class SinghtingInDetailView(View):
    def get(self, request, pk):
        singhting_in = SinghtingInModel.objects.get(pk=pk)
        return render(request, 'func/sighting-in/sighting-in-detail.html', 
                      {
                          'singhting_in': singhting_in,
                          })

class SinghtingInCreateView(View):
    def get(self, request):
        create_form = SinghtingInCreateForm()
        return render(request, 'func/sighting-in/sighting-in-create.html', 
                      {
                          'create_form': create_form,
                          })
    def post(self, request):
        create_form = SinghtingInCreateForm(request.POST)
        if create_form.is_valid():
            create_form.save()
            return redirect('singhting-in')
        return render(request, 'func/sighting-in/sighting-in-create.html', 
                      {
                          'create_form': create_form,
                          })
class SinghtingInEditView(View):
    def get(self, request, pk):
        edit_form = SinghtingInEditForm(instance=SinghtingInModel.objects.get(pk=pk))
        return render(request, 'func/sighting-in/sighting-in-edit.html', 
                      {
                          'edit_form': edit_form,
                          })
    def post(self, request, pk):
        edit_form = SinghtingInEditForm(request.POST, instance=SinghtingInModel.objects.get(pk=pk))
        if edit_form.is_valid():
            edit_form.save()
            return redirect('singhting-in')
        return render(request, 'func/singhting-in/singhting-in-edit.html', 
                      {
                          'edit_form': edit_form,
                          })

#4 семинар
class SeminarView(View):
    def get(self, request):
        seminar_list = SeminarModel.objects.all().order_by('-date')
        return render(request, 'func/seminar/seminar.html', 
                      {
                          'seminar_list': seminar_list,
                          })
    
class SeminarDetailView(View):
    def get(self, request, pk):
        seminar = SeminarModel.objects.get(pk=pk)
        return render(request, 'func/seminar/seminar-detail.html', 
                      {
                          'seminar': seminar,
                          })


class SeminarCreateView(View):
    def get(self, request):
        create_form = SeminarCreateForm()
        return render(request, 'func/seminar/seminar-create.html', 
                      {
            'create_form': create_form,
                          })
    def post(self, request):
        create_form = SeminarCreateForm(request.POST)
        if create_form.is_valid():
            create_form.save()
            return redirect('seminar')
        return render(request, 'func/seminar/seminar-create.html', 
                      {
                          'create_form': create_form,
                          })


class SeminarEditView(View):
    def get(self, request, pk):
        edit_form = SeminarEditForm(instance=SeminarModel.objects.get(pk=pk))
        return render(request, 'func/seminar/seminar-edit.html', 
                      {
                          'edit_form': edit_form,
                          })
    def post(self, request, pk):
        edit_form = SeminarEditForm(request.POST, instance=SeminarModel.objects.get(pk=pk))
        if edit_form.is_valid():
            edit_form.save()
            return redirect('seminar')