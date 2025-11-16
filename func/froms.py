from django import forms
from .models import CompetitionsModel, TrainingModel, SeminarModel, SinghtingInModel, CompetitionResult

# соревнование
class CompetitionsCreateForm(forms.ModelForm):
    date = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        label='Дата и время проведения'
    )
    type = forms.ChoiceField(
        choices=CompetitionsModel.TYPE_CHOICES,
        label='Тип соревнования'
    )
    description = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        label='Описание соревнования'
    )

    class Meta:
        model = CompetitionsModel
        fields = ['date', 'type', 'description']
        
    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.status = True  
        
        if commit:
            instance.save()
        return instance
        
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        #status = cleaned_data.get('status')
        
        return cleaned_data

class CompetitionsMmrRedactorForm(forms.ModelForm):
    place = forms.IntegerField(min_value=1)
    result = forms.FloatField()
    class Meta:
        model = CompetitionResult
        fields = ['place', 'result']

    def clean(self):
        cleaned_data = super().clean()

        place = cleaned_data.get('place')
        result = cleaned_data.get('result')

        return cleaned_data


# соревнование
class CompetitionsEditForm(forms.ModelForm):
    date = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        label='Дата и время проведения'
    )
    type = forms.ChoiceField(
        choices=CompetitionsModel.TYPE_CHOICES,
        label='Тип соревнования'
    )
    description = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        label='Описание соревнования'
    )
    status = forms.BooleanField(
        required=False,
        label='Соревнование активно'
    )
    
    class Meta:
        model = CompetitionsModel
        fields = ['date', 'type', 'description', 'status', 'result']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status') 
        result = cleaned_data.get('result')
        
        return cleaned_data
    


# тренировка
class TrainingCreateForm(forms.ModelForm):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )

    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    type = forms.ChoiceField(choices=TrainingModel.TYPE_CHOICES)
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)

    class Meta:
        model = TrainingModel
        fields = ['date', 'type', 'description', 'status']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status')
        return cleaned_data

# тренировка
class TrainingEditForm(forms.ModelForm):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )

    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    type = forms.ChoiceField(choices=TrainingModel.TYPE_CHOICES)
    
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    class Meta:
        model = TrainingModel
        fields = ['date', 'type', 'description', 'status']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        type = cleaned_data.get('type')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status') 
                
        return cleaned_data

# судейский семинар
class SeminarCreateForm(forms.ModelForm):
    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    status = forms.BooleanField(required=True)
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    class Meta:
        model = SeminarModel
        fields = ['date', 'status', 'description']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        status = cleaned_data.get('status')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status')
        
        return cleaned_data
class SeminarEditForm(forms.ModelForm):
    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    status = forms.BooleanField(required=True)
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    class Meta:
        model = SeminarModel
        fields = ['date', 'status', 'description']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        status = cleaned_data.get('status')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status')
        
        return cleaned_data

class SinghtingInCreateForm(forms.ModelForm):
    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    class Meta:
        model = SinghtingInModel
        fields = ['date', 'status', 'description']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        status = cleaned_data.get('status')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status')
        
        return cleaned_data

class SinghtingInEditForm(forms.ModelForm):
    date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))
    status = forms.BooleanField(required=True)
    
    class Meta:
        model = SinghtingInModel
        fields = ['date', 'status', 'description']
    
    def clean(self):
        cleaned_data = super().clean()
        
        date = cleaned_data.get('date')
        status = cleaned_data.get('status')
        description = cleaned_data.get('description')
        status = cleaned_data.get('status')
        
        return cleaned_data