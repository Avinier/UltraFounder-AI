from django.contrib import admin
from django.urls import path, include
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.authtoken import views  # new here
from rest_framework_simplejwt.views import (  # new her
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import permissions
# from auth_api_app.views import *

schema_view = get_schema_view(
    openapi.Info(
        title="Quantumsenses",
        default_version='v1',
        description="APIs interacting with nextjs",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="aditya,sinha1342@gmail.com"),
        license=openapi.License(name="BSD License"),

    ),
    public=True,
    permission_classes=(permissions.AllowAny,),


)

urlpatterns = [
    # path()
    path('admin/', admin.site.urls),
    path('container/', include('container.urls')),
    path('chats/', include('chats.urls')),
    path('waitlist/', include('waitlist.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('api-token-auth/', views.obtain_auth_token),  # new here
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('login', UserInfoAtSignIn.as_view(), name='token_obtain_pair'),
    path('auth/', include('auth_api_app.urls')),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
]
