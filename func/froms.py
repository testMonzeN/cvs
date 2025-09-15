from django import forms
from .models import CompetitionsModel
from cabinet.models import User


class CompetitionsCreateForm(forms.ModelForm):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )

    data = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    type = forms.ChoiceField(choices=CompetitionsModel.TYPE_CHOICES)
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    
    def clean(self):
        cleaned_data = super().clean()
        
        data = cleaned_data.get('data')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        
        return cleaned_data

class CompetitionsEditForm(forms.ModelForm):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )

    data = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    type = forms.ChoiceField(choices=CompetitionsModel.TYPE_CHOICES)
    
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    def clean(self):
        cleaned_data = super().clean()
        
        data = cleaned_data.get('data')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status') 
        
        return cleaned_data