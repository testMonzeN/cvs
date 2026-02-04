from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login
from .forms import CustomUserRegisterForm, CustomLoginForm, CustomUserChangeForm, OtpCodeUserChangeForm
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import User
from django.utils import timezone
import datetime
from django.contrib import messages
import os
from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth import logout

import pyotp
import qrcode
import io
import base64

# личный кабинет
class CabinetView(View):
    def get(self, request):
        return render(request, 'account/index.html')

# личный кабинет другого пользователя
class CabinetUtherUserView(View):
    def get(self, request, username):
        user = User.objects.get(username=username)
        return render(request, 'account/index.html', {'user': user})
    
# Регистрация пользователя
class RegisterView(View):
    def get(self, request):
        form = CustomUserRegisterForm()
        return render(request, 'registration/registration.html', {'form': form})
    
    def post(self, request):
        form = CustomUserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('main')
        return render(request, 'registration/registration.html', {'form': form})


# Вход пользователя
class LoginView(View):
    def get(self, request):
        form = CustomLoginForm()
        return render(request, 'login/login.html', {'form': form})
    
    def post(self, request):
        if 'code' in request.POST:
            form2 = OtpCodeUserChangeForm(request.POST)
            username = request.session.get('tmp_username')
            password = request.session.get('tmp_password')
            if not username or not password:
                return redirect('login')
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return redirect('login')
            if form2.is_valid():
                code = form2.cleaned_data.get('code')
                totp = pyotp.TOTP(user.otp_secret)
                if totp.verify(code):
                    login(request, user)

                    request.session.pop('tmp_username', None)
                    request.session.pop('tmp_password', None)
                    return redirect('main')
                else:
                    form2.add_error('code', 'Неверный код')
            return render(request, '2-fa/accept.html', {'form': form2})

        # Обычный вход 
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.mfa_enabled:
                    request.session['tmp_username'] = username
                    request.session['tmp_password'] = password
                    form2 = OtpCodeUserChangeForm()
                    return render(request, '2-fa/accept.html', {'form': form2})
                else:
                    login(request, user)
                    return redirect('main')
            else:
                try:
                    user = User.objects.get(username=username)
                    if check_password(password, user.password):
                        if user.mfa_enabled:
                            request.session['tmp_username'] = username
                            request.session['tmp_password'] = password
                            form2 = OtpCodeUserChangeForm()
                            return render(request, '2-fa/accept.html', {'form': form2})
                        else:
                            login(request, user)
                            return redirect('cabinet')
                except User.DoesNotExist:
                    pass
                
                form.add_error(None, "Неверное имя пользователя или пароль")
        
        return render(request, 'login/login.html', {'form': form})



class LogoutAccountView(View):
    def get(self, request):
        logout(request)
        return redirect('main')
    
    def post(self, request):
        return self.get(request)
    
# Изменение пароля пользователя (если не зарегистрирован, то нельзя)
class UserChangeView(View):   
    def get(self, request):
        form = CustomUserChangeForm(user=request.user)
        return render(request, 'account/change.html', {'form': form})
    
    def post(self, request):
        form = CustomUserChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пароль успешно изменен')
        return render(request, 'account/change.html', {'form': form})

class Authentication(View):
    def get(self, request):
        user = request.user

        if not user.otp_secret:
            user.otp_secret = pyotp.random_base32()
            user.save()

        opt_url = pyotp.totp.TOTP(user.otp_secret).provisioning_uri(
            name = user.username,
            issuer_name='ЦВС'
        )

        qr = qrcode.make(opt_url)
        buffer = io.BytesIO()
        qr.save(buffer, format='PNG')

        buffer.seek(0)
        qr_code = base64.b64encode(buffer.getvalue()).decode('utf-8')

        qr_code_data_url = f'data:image/png;base64,{qr_code}'

        return render(request, '2-fa/auth.html', {
            'qr_code': qr_code_data_url,
            'user': user
        })

    def post(self, request):
        user = request.user
        otp_code = request.POST.get('otp_code')
        
        if not otp_code:
            messages.error(request, 'Пожалуйста, введите код')
            return redirect('authentication')
            
        totp = pyotp.TOTP(user.otp_secret)
        
        if totp.verify(otp_code):
            user.mfa_enabled = True
            user.save()
            messages.success(request, 'Двухфакторная аутентификация успешно настроена!')
            return redirect('cabinet')
        else:
            messages.error(request, 'Неверный код. Пожалуйста, попробуйте снова.')
            return redirect('authentication')
