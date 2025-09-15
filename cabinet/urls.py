from django.urls import path
from .views import (
    CabinetView, RegisterView, LoginView, 
    UserChangeView, LogoutAccountView, Authentication
)



urlpatterns = [
    path('', CabinetView.as_view(), name='cabinet'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change/', UserChangeView.as_view(), name='change'),

    path('logout/', LogoutAccountView.as_view(), name='logout'),

    path('authentication/', Authentication.as_view(), name='authentication'),

]
    