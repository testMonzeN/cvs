from django.shortcuts import render
from rest_framework import serializers
from cabinet.models import User
from forum.models import QuestionModel, CommentModel
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import pyotp


# Create your views here.
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionModel
        fields = ['id', 'type', 'title', 'text', 'created_at', 'updated_at', 'author']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role_user', 'registration_date', 'last_login_date', 'mfa_enabled']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentModel
        fields = ['id', 'question', 'question_text', 'text', 'created_at', 'updated_at', 'author']


class UserViewSet(viewsets.ModelViewSet):
    def list(self, request):
        metod = request.data.get('method')
        
        if metod:
            if metod == 'hello world':
                return Response({'message': 'Hello World'}, status=status.HTTP_200_OK)
            
            elif metod == 'help':
                return Response({'message': 'Available methods: hello world (*^▽^*)'}, status=status.HTTP_200_OK)
            
            elif metod == 'get-users':
                users = User.objects.all()
                return Response({'users': UserSerializer(users, many=True).data}, status=status.HTTP_200_OK)
            
            elif metod == 'get-user-info':
                username = request.data.get('username')
                password = request.data.get('password')
                
                if not username or not password:
                    return Response({'message': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                user = authenticate(username=username, password=password)
                if user is not None:
                    return Response({'user': UserSerializer(user).data}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            elif metod == 'login':
                username = request.data.get('username')
                password = request.data.get('password')
                
                if not username or not password:
                    return Response({'message': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                user = authenticate(username=username, password=password)
                if user is not None:
                    if not user.mfa_enabled:
                        return Response({'user': UserSerializer(user).data, 'message': 'Login successful', 'status': True}, status=status.HTTP_200_OK)
                    else:
                        code = request.data.get('code')
                        if code:
                            totp = pyotp.TOTP(user.otp_secret)
                            if totp.verify(code):
                                return Response({'user': UserSerializer(user).data, 'message': 'Login successful', 'status': True}, status=status.HTTP_200_OK)
                            else:
                                return Response({'message': 'Invalid code', 'status': False, 'message': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            return Response({'message': 'Code is required', 'status': False, 'message': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'User not found', 'status': False, 'message': 'Invalid username or password'}, status=status.HTTP_404_NOT_FOUND)
            
            elif metod == 'register':
                username = request.data.get('username')
                password = request.data.get('password')
                
                if not username or not password:
                    return Response({'message': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                user = authenticate(username=username, password=password)
                if user is not None:
                    return Response({'user': UserSerializer(user).data, 'message': 'Register successful', 'status': True}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'User not found', 'status': False, 'message': 'Invalid username or password'}, status=status.HTTP_404_NOT_FOUND)
            
            else:
                return Response({'message': 'Method not found or wrong method, try metod: help'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'Method not found or wrong method'}, status=status.HTTP_404_NOT_FOUND)
        
    def create(self, request):
        metod = request.data.get('method')
        
        if metod:
            if metod == 'create-question':
                title = request.data.get('title')
                text = request.data.get('text')
                type = request.data.get('type')
                
                if not title or not text or not type:
                    return Response({'message': 'Title, text and type are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                question = QuestionModel.objects.create(title=title, text=text, type=type, author=request.user)
                return Response({'question': QuestionSerializer(question).data, 'message': 'Question created', 'status': True}, status=status.HTTP_200_OK)
            
            elif metod == 'create-comment':
                question = request.data.get('question')
                text = request.data.get('text')
                
                if not question or not text:
                    return Response({'message': 'Question and text are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                comment = CommentModel.objects.create(question=question, text=text, author=request.user)
                return Response({'comment': CommentSerializer(comment).data, 'message': 'Comment created', 'status': True}, status=status.HTTP_200_OK)
            
            elif metod == 'register':
                username = request.data.get('username')
                password = request.data.get('password')
                password2 = request.data.get('password2')
                email = request.data.get('email')
                
                if not password2:
                    return Response({'message': 'Password2 is required'}, status=status.HTTP_400_BAD_REQUEST)
                
                if password != password2:
                    return Response({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
                
                if not email:
                    return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
                
                if not username or not password or not email:
                    return Response({'message': 'Username, password and email are required'}, status=status.HTTP_400_BAD_REQUEST)
                
                user = User.objects.create(username=username, password=password, email=email, role_user='user')
                return Response({'user': UserSerializer(user).data, 'message': 'Register successful', 'status': True}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Method not found or wrong method, try metod: help'}, status=status.HTTP_404_NOT_FOUND)