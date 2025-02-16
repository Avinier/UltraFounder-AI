from rest_framework import serializers
from .models import *


class UpdateTopicSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    current_topic = serializers.CharField(required=True)
    new_topic = serializers.CharField(required=True)


class DeployTopicSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    topic = serializers.CharField(required=True)


class UserTopicMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTopicMapping
        fields = '__all__'


class UserTopicMappingForCreateChatSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)

    class Meta:
        model = UserTopicMapping
        fields = ['username','topic']


class RoleContentSerializer(serializers.Serializer):
    role = serializers.CharField(required=True)
    content = serializers.CharField(required=True)


    content = serializers.CharField(required=True)
class ChatDumpSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    topic = serializers.CharField(required=True)
    data = serializers.ListField(
        child=RoleContentSerializer()
    )


class KeyValueStoreSerializer(serializers.ModelSerializer):
    topic = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessagesStore
        fields = ['assistant', 'user', 'topic']

    def get_topic(self, obj):
        return obj.user_topic_mapping.topic


class GetLlmMessages(serializers.ModelSerializer):
    class Meta:
        model = ChatMessagesStore
        fields = ['assistant']

    def get_topic(self, obj):
        return obj.user_topic_mapping.topic
