from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import generics, status

from auth_api_app.serializers import *
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as SerializerValidationError



class CreateUserGitHubCreds(generics.CreateAPIView):
    serializer_class = GitHubCredsSerializer

    def validate_password(self, password):
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise SerializerValidationError({'password': e.messages})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        user = request.user
        github_username = validated_data['github_username']
        github_password = validated_data['github_password']

        # user = get_object_or_404(User, username=username)

        try:
            self.validate_password(github_password)
            serializer.validated_data['github_password'] = make_password(github_password)
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except SerializerValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
