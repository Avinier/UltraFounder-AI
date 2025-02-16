# container/api/CreateDockerContainer.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
import requests
from container.serializers import *


class CreateDockerContainerView(generics.CreateAPIView):
    serializer_class = ContainerImageSerializer

    @swagger_auto_schema(
        operation_description="Create a Docker container",
        request_body=ContainerImageSerializer,
        responses={
            201: ContainerImageSerializer,
            400: "Bad Request",
            503: "Service Unavailable"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        external_api_url = "http://192.168.1.75:8000/create_container"

        try:
            response = requests.post(
                external_api_url,
                json=serializer.validated_data
            )
            return Response(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return Response(
                {"error": "Failed to communicate with external API", "details": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    def get_serializer(self, *args, **kwargs):
        if getattr(self, 'swagger_fake_view', False):
            return None
        return super().get_serializer(*args, **kwargs)
