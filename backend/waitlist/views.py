from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from .serializers import *
from django.http import JsonResponse, Http404
from django.contrib.auth.models import User
from rest_framework.response import Response
import logging


class CreateWaitlistData(generics.CreateAPIView):
    serializer_class = WaitlistSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
