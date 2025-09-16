import re
from django.shortcuts import render, redirect
from .models import QuestionModel, CommentModel
from .forms import QuestionForm, CommentForm
from django.views import View
from django.shortcuts import get_object_or_404

# Create your views here.
class QuestionListView(View):
    def get(self, request):
        questions = QuestionModel.objects.all()
        return render(request, 'forum/question_list.html', {'questions': questions})

class QuestionDetailView(View):
    def get(self, request, pk):
        question = QuestionModel.objects.get(pk=pk)
        
        comments = CommentModel.objects.filter(question=pk)
        return render(request, 'details/question-detail.html', {'question': question, 'comments': comments})

class QuestionCreateView(View):
    def get(self, request):
        form = QuestionForm()
        return render(request, 'forum/question-create.html', {'form': form})
    
    def post(self, request):
        form = QuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            if request.user.is_authenticated:
                question.author = request.user
            question.save()
            return redirect('question-detail', pk=question.pk)
        return render(request, 'forum/question-create.html', {'form': form})

class QuestionUpdateView(View):
    def get(self, request, pk):
        question = get_object_or_404(model=QuestionModel, pk=pk)
        form = QuestionForm(instance=question)
        return render(request, 'forum/question-update.html', {'form': form})
    
    def post(self, request, pk):
        question = get_object_or_404(model=QuestionModel, pk=pk)
        form = QuestionForm(request.POST, instance=question)
        if form.is_valid():
            form.save()
            return redirect('question-detail', pk=form.instance.pk)
        return render(request, 'forum/question-update.html', {'form': form})

class QuestionDeleteView(View):
    def get(self, request, pk):
        question = get_object_or_404(model=QuestionModel, pk=pk)
        question.delete()
        return redirect('question-list')
    
    def post(self, request, pk):
        question = get_object_or_404(model=QuestionModel, pk=pk)
        question.delete()
        return redirect('question-list')
        
        
class CommentCreateView(View):
    def get(self, request, pk):
        form = CommentForm()
        return render(request, 'forum/comment-create.html', {'form': form, 'pk': pk})
    
    def post(self, request, pk):
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            if request.user.is_authenticated:
                comment.author = request.user
            comment.question = get_object_or_404(QuestionModel, pk=pk)
            comment.save()
            return redirect('question-detail', pk=pk)
        return render(request, 'forum/comment-create.html', {'form': form, 'pk': pk})

class CommentUpdateView(View):
    def get(self, request, pk):
        comment = get_object_or_404(model=CommentModel, pk=pk)
        form = CommentForm(instance=comment)
        return render(request, 'forum/comment-update.html', {'form': form})
    
    def post(self, request, pk):
        comment = get_object_or_404(model=CommentModel, pk=pk)
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            form.save()
            return redirect('question-detail', pk=form.instance.pk)
        return render(request, 'forum/comment-update.html', {'form': form}) 

class CommentDeleteView(View):
    def get(self, request, pk):
        comment = get_object_or_404(model=CommentModel, pk=pk)
        comment.delete()
        return redirect('question-detail', pk=comment.question.pk)
    
    def post(self, request, pk):
        comment = get_object_or_404(model=CommentModel, pk=pk)
        comment.delete()
        return redirect('question-detail', pk=comment.question.pk)
    