from rest_framework import serializers
from .models import *


class UserTopicMappingSerializerForGettingSpeccifCHat(serializers.ModelSerializer):
    assistant = serializers.CharField(source='keyvaluestore.assistant', read_only=True)
    user = serializers.CharField(source='keyvaluestore.user', read_only=True)

    class Meta:
        model = UserTopicMapping
        fields = ['id', 'topic', 'created_at', 'updated_at', 'deleted_at', 'is_active', 'user_id', 'assistant', 'user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}


class GitHubCredsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGitHubCreds
        fields = ["github_username", "github_password"]
