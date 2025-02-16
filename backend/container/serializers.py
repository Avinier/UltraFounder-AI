from rest_framework import serializers
from .models import *
from chats.models import *
from auth_api_app.models import *


class KeyValueStoreSerializer(serializers.ModelSerializer):
    topic = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessagesStore
        fields = ['assistant', 'user', 'topic']

    def get_topic(self, obj):
        return obj.user_topic_mapping.topic


class UserTopicMappingSerializerForGettingSpeccifCHat(serializers.ModelSerializer):
    assistant = serializers.CharField(source='keyvaluestore.assistant', read_only=True)
    user = serializers.CharField(source='keyvaluestore.user', read_only=True)

    class Meta:
        model = UserTopicMapping
        fields = ['id', 'topic', 'created_at', 'updated_at', 'deleted_at', 'is_active', 'user_id', 'assistant', 'user']


class KeyValueStoreTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessagesStore
        fields = ['assistant', 'user']
        # fields = '__all__'


class ContainerSpecsSerializer(serializers.ModelSerializer):
    container_name = serializers.CharField(write_only=True, required=True)
    # vcpu_type = serializers.CharField(required=False)
    # disk_type = serializers.CharField(required=False)
    # ram_type = serializers.CharField(required=False)
    # frontend = serializers.CharField(write_only=True, required=False)
    # backend = serializers.CharField(write_only=True, required=False)
    # database = serializers.CharField(write_only=True, required=False)
    # ram = serializers.IntegerField(required=False)
    # disk_space = serializers.IntegerField(required=False)
    # vcpu = serializers.IntegerField(required=False)

    stack = serializers.CharField(required=True)
    resources = serializers.CharField(required=True)

    class Meta:
        model = ContainerSpecs
        # fields = ['container_name', 'stack', 'resources', 'ram', 'disk_type', 'disk_space', 'ram_type', 'vcpu', 'vcpu_type',
        #           'autoscalingmode', 'frontend', 'backend', 'database'
        #           ]
        fields = ['container_name', 'stack', 'resources']


class CreateContainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Container
        fields = ['name', 'url', 'ip_address']


class DockerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DockerImage
        fields = ['name', 'description', 'version', 'image_type']


class ContainerDockerMappingSerializer(serializers.ModelSerializer):
    image = DockerImageSerializer()

    class Meta:
        model = ContainerDockerMapping
        fields = ['image']


class GetContainerSpecsSerializer(serializers.ModelSerializer):
    container_name = serializers.CharField(write_only=True, required=True)
    vcpu_type = serializers.CharField(required=False)
    disk_type = serializers.CharField(required=False)
    ram_type = serializers.CharField(required=False)
    frontend = serializers.CharField(write_only=True, required=False)
    backend = serializers.CharField(write_only=True, required=False)
    database = serializers.CharField(write_only=True, required=False)
    ram = serializers.IntegerField(required=False)
    disk_space = serializers.IntegerField(required=False)
    vcpu = serializers.IntegerField(required=False)

    class Meta:
        model = ContainerSpecs
        fields = ['container_name', 'ram', 'disk_type', 'disk_space', 'ram_type', 'vcpu', 'vcpu_type',
                  'autoscalingmode', 'frontend', 'backend', 'database'
                  ]


class ContainerSerializer(serializers.ModelSerializer):
    specs = GetContainerSpecsSerializer(source='containerspecs', read_only=True)
    docker_mappings = ContainerDockerMappingSerializer(source='containerdockermapping_set', many=True, read_only=True)

    class Meta:
        model = Container
        fields = ['name', 'specs', 'docker_mappings']


class ContainerStatusSerializer(serializers.Serializer):
    container_name = serializers.CharField(required=True)


class UploadEnvSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    container_name = serializers.CharField(required=True)

    class Meta:
        fields = ['file', 'container_name']


class ContainerGitRepoSerializer(serializers.ModelSerializer):
    container_name = serializers.CharField(required=True)
    class Meta:
        model = ContainerGitLink
        fields = ['container_name', 'gitlink']



class ContainerImageSerializer(serializers.Serializer):
    image_name = serializers.CharField()
    container_name = serializers.CharField()
    network = serializers.CharField()