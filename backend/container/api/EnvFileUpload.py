import os
from rest_framework import status, generics
from rest_framework.response import Response
from container.serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser
import logging

logger = logging.getLogger(__name__)


class UploadEnvView(generics.CreateAPIView):
    serializer_class = UploadEnvSerializer
    parser_classes = [MultiPartParser]

    def env_path_creation(self, container_id):
        parent_dir = os.path.join('media', str(container_id))
        os.makedirs(parent_dir, exist_ok=True)
        return parent_dir

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            container_name = serializer.validated_data['container_name']
            user = request.user

            container = get_object_or_404(Container, name=container_name, user=user)

            if '.env' not in file.name:
                return Response({"error": "file is not of .env type"},
                                status=401)

            logger.warning(file.name)
            print(file.name)

            file_path = self.env_path_creation(container.id)
            file_insert = os.path.join(file_path, file.name)

            if os.path.exists(file_insert):
                os.remove(file_insert)
                with open(file_insert, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
                return Response({"message": "file has been overwritten"}, status=status.HTTP_201_CREATED)

            with open(file_insert, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            ContainerEnv.objects.create(container=container, file=file_insert)

            return Response({"message": "File uploaded successfully", "file_path": file_insert}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
