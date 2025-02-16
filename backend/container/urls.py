from django.urls import path, include
from container.api.views import *
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from container.api.EnvFileUpload import *
from container.api.GitLink_view import *
from container.api.CreateDockerContainer import *

router = DefaultRouter()
router.register('', ApiTestingView, basename="api-testing")

urlpatterns = [

    path('', include(router.urls)),
    path('create', CreateContainerView.as_view(), name='create-container'),
    path('set-specs', SetContainerSpecsView.as_view(), name='set-container-specs'),
    path('create-docker-image', DockerImageCreateView.as_view(), name='creating-docker-image'),
    path('get-container', GetUserContainersView.as_view(), name='get-container'),
    path('delete/<str:containerName>', DeleteContainer.as_view(), name='delete-container'),
    path('state-controller', ContainerState.as_view(), name='stop-or-run-container'),
    path('upload-env', UploadEnvView.as_view(), name='upload-porject-env'),
    path('git-link', RepoGitLink.as_view(), name='upload-git-link'),
    path('spinup-container/', CreateDockerContainerView.as_view(), name='container-image'),
    # path('gitlink', GetGitLink.as_view(), name='retrieve-git-link' ),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
