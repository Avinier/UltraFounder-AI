import subprocess
from rest_framework import generics, viewsets, status, mixins
from rest_framework.decorators import action
from container.serializers import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


class CreateContainerView(generics.CreateAPIView):
    queryset = Container.objects.all()
    serializer_class = CreateContainerSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        url = request.data.get('url')
        ip_address = request.data.get('ip_address')
        user = self.request.user

        if Container.objects.filter(name=name, user=user).exists():
            return Response({"error": "You already have a container with this name."},
                            status=status.HTTP_400_BAD_REQUEST)

        elif Container.objects.filter(url=url).exists():
            return Response({"error": "Container with this URL already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # the function automatically sets the user field by using data of the user that activated the token
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SetContainerSpecsView(generics.CreateAPIView):
    queryset = ContainerSpecs.objects.all()
    serializer_class = ContainerSpecsSerializer
    permission_classes = [IsAuthenticated]

    def extract_data(self, data_str):
        return dict(item.split(": ") for item in data_str.strip("`").split(", "))

    @staticmethod
    def remove_gb(value):
        return int(value.lower().replace("gb", "").strip())

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        parsed_stack = self.extract_data(serializer.validated_data.pop('stack'))
        parsed_resources = self.extract_data(serializer.validated_data.pop('resources'))

        if 'ram' in parsed_resources and 'gb' in parsed_resources['ram'].lower():
            parsed_resources['ram'] = self.remove_gb(parsed_resources['ram'])
        if 'mem' in parsed_resources and 'gb' in parsed_resources['mem'].lower():
            parsed_resources['mem'] = self.remove_gb(parsed_resources['mem'])

        user = request.user
        container_name = serializer.validated_data.pop('container_name')
        container = get_object_or_404(Container, name=container_name, user=user)
        if ContainerDockerMapping.objects.filter(container=container).exists():
            return Response({"error": "You already have a container with this name."},
                            status=status.HTTP_400_BAD_REQUEST)

        mappings = [
            (parsed_stack['frontend'], DockerImage.FRONTEND),
            (parsed_stack['backend'], DockerImage.BACKEND),
            (parsed_stack['database'], DockerImage.DATABASE)
        ]

        for name, image_type in mappings:
            try:
                docker_images = DockerImage.objects.get(name=name, image_type=image_type)
            except DockerImage.MultipleObjectsReturned:
                return Response({"error": f"Multiple Docker images found for {name} with type {image_type}."},
                                status=status.HTTP_400_BAD_REQUEST)
            except DockerImage.DoesNotExist:
                return Response({"error": f"Docker image for {name} with type {image_type} not found."},
                                status=status.HTTP_404_NOT_FOUND)

            ContainerDockerMapping.objects.create(
                container=container,
                docker=docker_images
            )

        ContainerSpecs.objects.create(
            container=container,
            ram=parsed_resources['ram'],
            disk_space=parsed_resources['mem'],
            vcpu=parsed_resources['cpu'],
            **serializer.validated_data
        )

        return Response({"message": "Container specs and Docker mappings created successfully."}, status=201)


class DockerImageCreateView(generics.CreateAPIView):
    queryset = DockerImage.objects.all()
    serializer_class = DockerImageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        docker_image = DockerImage.objects.create(**serializer.validated_data)

        return Response({
            "message": "Docker image created successfully.",
            "docker_image": DockerImageSerializer(docker_image).data
        }, status=status.HTTP_201_CREATED)


class GetUserContainersView(generics.RetrieveAPIView):
    serializer_class = ContainerSerializer

    def get_queryset(self):
        user = self.request.user
        return Container.objects.filter(user=user)

    def get_container_specs(self, container):
        return ContainerSpecs.objects.filter(container=container).first()

    # def get_EnvFile(self, container):
    #     return ContainerEnv.objects.filter(container=container).first()

    def get_docker_mappings(self, container):
        return ContainerDockerMapping.objects.filter(container=container).select_related('docker')

    def get_gitlink(self, container):
        gitlink_obj = ContainerGitLink.objects.filter(container=container).first()
        return gitlink_obj.gitlink if gitlink_obj else None

    def get(self, request, *args, **kwargs):
        # Only retrieve containers for the authenticated user
        containers = self.get_queryset()
        if not containers.exists():
            return Response({'error': 'No containers found for this user.'}, status=404)

        data = []
        for container in containers:
            specs = self.get_container_specs(container)
            docker_mappings = self.get_docker_mappings(container)
            gitlink = self.get_gitlink(container)
            # env_path = self.get_EnvFile(container)

            serialized_container = {
                'name': container.name,
                'url': container.url,
                'created_time': container.created_at,
                'running': container.running,
                'gitlink': gitlink,
                'specs': GetContainerSpecsSerializer(specs).data if specs else {},
                'container_techstack': [
                    {
                        'image': {
                            'name': mapping.docker.name,
                            'description': mapping.docker.description,
                            'version': mapping.docker.version,
                            'image_type': mapping.docker.image_type
                        }
                    } for mapping in docker_mappings
                ],
            }
            data.append(serialized_container)

        return Response(data, status=200)


class ApiTestingView(viewsets.ViewSet):
    @action(detail=False, methods=['post'], url_path='makemigrations-to-db')
    def makemigrations_to_db(self, request):
        try:
            # Run makemigrations
            makemigrations = subprocess.run(
                ["python", "manage.py", "makemigrations"],
                capture_output=True, text=True
            )
            # Prepare response data
            response_data = {
                "makemigrations": {
                    "returncode": makemigrations.returncode,
                    "stdout": makemigrations.stdout,
                    "stderr": makemigrations.stderr
                }
            }
            return Response(response_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['post'], url_path='migrate-to-db')
    def migrate_to_db(self, request):
        try:
            migrate = subprocess.run(
                ["python", "manage.py", "migrate"],
                capture_output=True, text=True
            )
            response_data = {
                "migrate": {
                    "returncode": migrate.returncode,
                    "stdout": migrate.stdout,
                    "stderr": migrate.stderr
                }
            }
            return Response(response_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class DeleteContainer(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    lookup_field = 'name'

    def get_queryset(self):
        user = self.request.user
        # print(user)
        container_name = self.kwargs.get('name')
        return Container.objects.filter(name=container_name, user=user, is_active=True)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

        ContainerSpecs.objects.filter(container=instance).update(is_active=False)
        ContainerDockerMapping.objects.filter(container=instance).update(is_active=False)


class ContainerState(generics.UpdateAPIView):
    serializer_class = ContainerStatusSerializer

    def patch(self, request, *args, **kwargs):
        user = request.user
        print(user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        container_name = serializer.validated_data['container_name']

        container = get_object_or_404(Container, name=container_name, user=user)
        if not container.running:
            container.running = True
            container.save()
            return Response({'message': 'Container Started'}, status=200)
        else:
            container.running = False
            container.save()
            return Response({'message': 'Container Stopped'}, status=200)
