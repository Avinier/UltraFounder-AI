from django.urls import path
from .views import *

urlpatterns = [
    path('insert', CreateWaitlistData.as_view(), name='create-waitlist-entry'),
]