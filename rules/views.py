import json
import os
from django.shortcuts import render
from dotenv import load_dotenv
from django.views import View
from .forms import CalculatorForm
from decimal import Decimal, ROUND_HALF_UP
from .models import TableIpAddressSort, Table
from cvs.settings import BASE_DIR
from django.http import HttpResponse
from django.conf import settings
from django.shortcuts import redirect


# Create your views here.
load_dotenv()
def round_half_up(value, ndigits):
    return float(Decimal(str(value)).quantize(Decimal('1.' + '0'*ndigits), rounding=ROUND_HALF_UP))


class Calculator():
    def __init__(self, target, dist):
        self.target = target
        self.dist = dist

    def resurt_one_try(self):
        if not self.target or not self.dist:
            return 0
        
        try:
            value = ((-1 * float(self.target)) / (float(self.dist) / 100)) + 8
            if 1 <= round_half_up(value, 2) <= 6 and round_half_up(value, 2) != 0:
                return round_half_up(value, 2)
            else:
                return 'Вы не попали в допустимый диапазон'
        except:
            return 0

    def resurt_two_try(self):
        try:
            return round_half_up(self.resurt_one_try() * 0.75, 2)
        except:
            return 'Вы не попали в допустимый диапазон'
    

    def resurt_three_try(self):
        try:
            return round_half_up(self.resurt_one_try() * 0.5, 2)
        except:
            return 'Вы не попали в допустимый диапазон'

    def result_MRAD(self):
        try:
            return round_half_up(float(self.target) / (float(self.dist) * 0.1), 2)
        except:
            return 0

class CalculatorView(View):
    def get(self, request):
        form = CalculatorForm()
        current_user = request.user
        recent_tables = TableIpAddressSort.objects.filter(user=current_user).select_related('table').order_by('-id')

        return render(request, 'calc/calc.html', {'form': form,
                                                  'recent_tables': recent_tables,
                                                  })

    def post(self, request):
        if 'clear' in request.POST:
            form = CalculatorForm()
            current_user = request.user
            TableIpAddressSort.objects.filter(user=current_user).delete()
            recent_tables = []
            
            return render(request, 'calc/calc.html', 
                      {'form': form,
                        'recent_tables': recent_tables,
                      })
        

        form = CalculatorForm(request.POST)
        if form.is_valid():
            target = form.cleaned_data['target']
            dist = form.cleaned_data['dist']
            calculator = Calculator(target, dist)

            current_user = request.user

            table = Table.objects.create(target=target, dist=dist, first_try=calculator.resurt_one_try(), second_try=calculator.resurt_two_try(), third_try=calculator.resurt_three_try(), mrad=calculator.result_MRAD())
            TableIpAddressSort.objects.create(user=current_user, table=table)
            recent_tables = TableIpAddressSort.objects.filter(user=current_user).select_related('table').order_by('-id')
        else:
            recent_tables = []
        
        return render(request, 'calc/calc.html', 
                      {'form': form,
                        'recent_tables': recent_tables,
                      })

class RulesView(View):
    def get(self, request):
        return render(request, 'rules/rules.html')
    
    
class DownloadLauncherView(View):
    def get(self, request):
        file_path = os.path.join(settings.BASE_DIR, '9.1 Правила винтовка статичная (классический снайпинг).docx')    # YOUR_FILE.txt - изменить на будуший лаунчер / билдер 
        file_name = 'rules.docx'         # launcher.txt -> phantom.exe
        
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/vnd.ms-exe")
                response['Content-Disposition'] = f'inline; filename={file_name}'
                return response