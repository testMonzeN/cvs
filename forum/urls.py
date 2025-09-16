from django.urls import path
from .views import *

urlpatterns = [
    path('', QuestionListView.as_view(), name='question-list'),
    path('<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('create/', QuestionCreateView.as_view(), name='question-create'),
    path('edit/<int:pk>/', QuestionUpdateView.as_view(), name='question-update'),
    path('delete/<int:pk>/', QuestionDeleteView.as_view(), name='question-delete'),
    
    path('comment/create/<int:pk>/', CommentCreateView.as_view(), name='comment-create'),
    path('comment/edit/<int:pk>/', CommentUpdateView.as_view(), name='comment-update'),
    path('comment/delete/<int:pk>/', CommentDeleteView.as_view(), name='comment-delete'),
]