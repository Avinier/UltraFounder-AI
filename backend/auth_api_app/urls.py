from django.urls import path
from auth_api_app.views.views import *
from auth_api_app.views.CreateGitHubCreds_view import  *

urlpatterns = [
    path('login', UserInfoAtSignIn.as_view(), name='token_obtain_pair'),
    path('signup', CreateUserView.as_view(), name='token_obtain_pair'),
    path('github-creds', CreateUserGitHubCreds.as_view(), name='github-creds-insert'),

]
