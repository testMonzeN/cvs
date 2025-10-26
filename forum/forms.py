from django import forms
from .models import QuestionModel, CommentModel


class QuestionForm(forms.ModelForm):
    TYPE_CHOICES = (
        ('---', '---'),
        ('Вопрос', 'Вопрос'),
        ('Предложение', 'Предложение'),
        ('Жалоба', 'Жалоба'),
        ('Обсуждение', 'Обсуждение'),
        ('Другое', 'Другое'),
    )
    
    type = forms.ChoiceField(
        choices=TYPE_CHOICES, 
        label='Тип вопроса',
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    title = forms.CharField(
        label='Заголовок',
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    text = forms.CharField(
        label='Текст',
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
        required=True
    )
    
    class Meta:
        model = QuestionModel
        fields = ['type', 'title', 'text']
        
    def clean(self):
        cleaned_data = super().clean()
        
        type = cleaned_data.get('type')
        title = cleaned_data.get('title')
        text = cleaned_data.get('text')
        
        return cleaned_data

class CommentForm(forms.ModelForm):
    text = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
        label='Текст'
    )
    
    class Meta:
        model = CommentModel
        fields = ['text']
        
    def clean(self):
        cleaned_data = super().clean()
        
        text = cleaned_data.get('text')
        
        return cleaned_data

class CommentUpdateForm(forms.ModelForm):
    text = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 6}),
        label='Текст'
    )

    class Meta:
        model = CommentModel
        fields = ['text']

    def clean(self):
        cleaned_data = super().clean()

        text = cleaned_data.get('text')

        return cleaned_data