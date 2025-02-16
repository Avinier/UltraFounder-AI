from django.urls import path
from .views import *

urlpatterns = [
    path('update', UpdateTopic.as_view(), name='update-topic'),
    path('delete/<str:user>/<str:topic>', DeleteTopic.as_view(), name='deleting-specific-topic'),
    path('get-topics/<str:user>', GetUserTopics.as_view(), name='getting-all-active-user-chats'),
    path('create', CreateTopic.as_view(), name='create-topic'),
    path('dump', ChatDump.as_view(), name='dumping-user-chats'),
    path('get-messages/<str:username>/<str:topic>', GetChatMessages.as_view(), name='getting-all-messages-of-a-specific-chat'),
    path('deploy', DeployedTopic.as_view(), name='deploy-topic'),
    path('llm-messages/<str:username>/<str:topic>', GetLlmMessages.as_view(), name='llm-messages'),
]
