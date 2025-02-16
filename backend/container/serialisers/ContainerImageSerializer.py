from rest_framework import serializers


class ContainerImageSerializer(serializers.Serializer):
    class Meta:
        image_name = serializers.CharField()
        container_name = serializers.CharField()
        network = serializers.CharField()