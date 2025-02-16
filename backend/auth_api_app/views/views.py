from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import authenticate, get_user_model
from auth_api_app.models import *
from django.db import IntegrityError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as SerializerValidationError
from auth_api_app.serializers import *
from django.db.models import Count


class UserInfoAtSignIn(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            access_token['username'] = user.username

            # Query for deployed topics
            deployed = UserTopicMapping.objects.filter(user=user, is_active=True, is_deployed=True).values_list('topic',
                                                                                                                flat=True)

            # Query for undeployed topics and annotate with message count
            undeployed = UserTopicMapping.objects.filter(user=user, is_active=True, is_deployed=False).annotate(
                message_count=Count('chatmessagesstore')
            ).values('topic', 'message_count')

            data = {
                'refresh': str(refresh),
                'access': str(access_token),
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'deployed': list(deployed),
                'undeployed': list(undeployed),
            }

            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def validate_password(self, password):
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise SerializerValidationError({'password': e.messages})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data.get('password')
        email = serializer.validated_data.get('email')

        try:
            # please remove after going live just doing it for now for development so that people dont abuse our website and use chatbot or else we will have million dollar bill
            if 'quantumsenses.com' not in email:
                return Response({"error": "Unauthorized email, should be of quantumsenses.com organization"},
                                status=401)

            self.validate_password(password)

            # Check if a user with this email already exists
            User = get_user_model()
            if User.objects.filter(email=email).exists():
                return Response({'error': 'A user with this email already exists.'},
                                status=status.HTTP_400_BAD_REQUEST)

            hashed_password = make_password(password)
            serializer.validated_data['password'] = hashed_password
            self.perform_create(serializer)
        except SerializerValidationError as e:
            return Response({'error': str(e), 'message': "Data params not valid"},
                            status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({'error': 'A user with this email already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
