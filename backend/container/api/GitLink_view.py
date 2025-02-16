from rest_framework import status, generics
from rest_framework.response import Response
from container.serializers import *
from django.shortcuts import get_object_or_404


class RepoGitLink(generics.CreateAPIView):
    serializer_class = ContainerGitRepoSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            gitlink = serializer.validated_data['gitlink']
            container_name = serializer.validated_data['container_name']
            user = request.user

            container = get_object_or_404(Container, name=container_name, user=user)

            ContainerGitLink.objects.create(container=container, gitlink=gitlink)
            return Response({"message": "Repo link for container saved"})


# class GetGitLink(generics.RetrieveAPIView):
#     serializer_class = ContainerGitRepoSerializer
#
#     def get(self, request, *args, **kwargs):
#         user = request.user
#
#         containers = Container.objects.filter(user=user)
#
#         container_git_links = []
#         for container in containers:
#             git_link_obj = ContainerGitLink.objects.filter(container=container).first()
#             if git_link_obj:
#                 container_git_links.append({
#                     "container_name": container.name,
#                     "gitlink": git_link_obj.gitlink
#                 })
#
#         return Response(container_git_links)