from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from .serializers import *
from django.http import JsonResponse, Http404
from django.contrib.auth.models import User
from rest_framework.response import Response
import logging

logger = logging.getLogger('chats')


class CreateTopic(generics.CreateAPIView):
    serializer_class = UserTopicMappingForCreateChatSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        username = request.user.username
        topic = validated_data['topic']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if UserTopicMapping.objects.filter(user=user, topic=topic).exists():
            return Response({'error': 'Topic already exists for this user.'}, status=status.HTTP_400_BAD_REQUEST)

        chat_topic = UserTopicMapping.objects.create(user=user, topic=topic)

        return JsonResponse({'message': 'Chat topic created successfully.', 'chat_topic_id': chat_topic.id},
                            status=status.HTTP_201_CREATED)

class GetUserTopics(generics.RetrieveAPIView):
    def get_serializer_class(self):
        return UserTopicMappingSerializer  # no serializer reqiured only there to avoid AssertionError dont remove

    def get_queryset(self):
        user = self.kwargs.get('user')
        return UserTopicMapping.objects.filter(user__username=user, is_active=True).values_list('topic', 'is_deployed')

    def get(self, request, *args, **kwargs):
        topics = self.get_queryset()
        if not topics:
            return Response({'error': 'No active topics found.'}, status=404)
        deployed = []
        undeployed = []
        for topic, is_deployed in topics:
            if is_deployed:
                deployed.append(topic)
            else:
                undeployed.append(topic)
        logger.info({'deployed': deployed, 'undeployed': undeployed})
        return Response({'deployed': deployed, 'undeployed': undeployed}, status=200)


class DeleteTopic(generics.DestroyAPIView):
    serializer_class = UserTopicMappingSerializer

    def delete(self, request, *args, **kwargs):
        user = get_object_or_404(User, username=self.kwargs['user'])
        topic = UserTopicMapping.objects.filter(user=user, topic=self.kwargs['topic'], is_active=True).first()

        if not topic:
            raise Http404("Topic not found or already inactive.")

        topic.is_active = False
        topic.save()
        ChatMessagesStore.objects.filter(user_topic_mapping=topic).update(is_active=False)

        return Response({'message': f'Topic "{self.kwargs["topic"]}" and its messages deactivated.'}, status=200)


class UpdateTopic(generics.UpdateAPIView):
    serializer_class = UpdateTopicSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_object_or_404(User, username=request.user.username)
        current_topic = serializer.validated_data['current_topic']
        new_topic = serializer.validated_data['new_topic']

        current_topic_mapping = UserTopicMapping.objects.filter(user=user, topic=current_topic, is_active=True).first()

        if not current_topic_mapping:
            return Response({'error': 'Current topic is not active or does not exist.'},
                            status=status.HTTP_404_NOT_FOUND)

        if UserTopicMapping.objects.filter(user=user, topic=new_topic, is_active=True).exists():
            return Response({'error': 'A topic with the new name already exists for this user.'},
                            status=status.HTTP_400_BAD_REQUEST)

        current_topic_mapping.topic = new_topic
        current_topic_mapping.save()

        return Response({'message': 'Topic updated successfully.'}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({'error': 'method not allowed.'}, status=status.HTTP_401_UNAUTHORIZED)


class ChatDump(generics.CreateAPIView):
    serializer_class = ChatDumpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        print("ADI",validated_data)
        # username = request.user.username
        username = validated_data['username']
        topic = validated_data['topic']
        data = validated_data['data']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        #the function will check if the topic exists if it doesnt then it will create the topic
        user_topic_mapping, created = UserTopicMapping.objects.get_or_create(user=user, topic=topic)

        if created:
            message = f"New topic '{topic}' created for the user."
        else:
            message = f"Topic '{topic}' already exists for the user."

        key_value_stores = []
        current_entry = {'user': '', 'assistant': ''}

        for item in data:
            if item['role'] == 'user':
                current_entry['user'] = item['content']
            elif item['role'] == 'assistant':
                if current_entry['user']:
                    current_entry['assistant'] = item['content']
                    key_value_stores.append(ChatMessagesStore(
                        user_topic_mapping=user_topic_mapping,
                        user=current_entry['user'],
                        assistant=current_entry['assistant']
                    ))
                    current_entry = {'user': '', 'assistant': ''}
                else:
                    key_value_stores.append(ChatMessagesStore(
                        user_topic_mapping=user_topic_mapping,
                        user='',
                        assistant=item['content']
                    ))

        if current_entry['user'] or current_entry['assistant']:
            key_value_stores.append(ChatMessagesStore(
                user_topic_mapping=user_topic_mapping,
                user=current_entry['user'],
                assistant=current_entry['assistant']
            ))

        ChatMessagesStore.objects.bulk_create(key_value_stores)

        return Response({"message": f"{len(key_value_stores)} records created successfully. {message}"},
                        status=status.HTTP_201_CREATED)


class GetChatMessages(generics.RetrieveAPIView):
    serializer_class = KeyValueStoreSerializer

    def get_queryset(self):
        username = self.kwargs.get('username')
        topic = self.kwargs.get('topic')

        if not username or not topic:
            return ChatMessagesStore.objects.none()

        user_instance = get_object_or_404(User, username=username)
        user_topic_mapping = get_object_or_404(UserTopicMapping, user=user_instance, topic=topic)

        return ChatMessagesStore.objects.filter(user_topic_mapping=user_topic_mapping, is_active=True)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'error': 'No messages found for the given topic'}, status=status.HTTP_404_NOT_FOUND)

        response_serializer = self.get_serializer(queryset, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

class GetLlmMessages(generics.RetrieveAPIView):
    serializer_class = GetLlmMessages

    def get_queryset(self):
        username = self.kwargs.get('username')
        topic = self.kwargs.get('topic')

        if not username or not topic:
            return ChatMessagesStore.objects.none()

        user_instance = get_object_or_404(User, username=username)
        user_topic_mapping = get_object_or_404(UserTopicMapping, user=user_instance, topic=topic)

        return ChatMessagesStore.objects.filter(user_topic_mapping=user_topic_mapping, is_active=True)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'error': 'No messages found for the given topic'}, status=status.HTTP_404_NOT_FOUND)

        response_serializer = self.get_serializer(queryset, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class DeployedTopic(generics.UpdateAPIView):
    serializer_class = DeployTopicSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_object_or_404(User, username=serializer.validated_data['username'])
        topic = serializer.validated_data['topic']

        topic_mapping = UserTopicMapping.objects.filter(user=user, topic=topic, is_active=True,
                                                        is_deployed=False).first()

        if not topic_mapping:
            raise Http404("Topic not found or has already been deployed")

        topic_mapping.is_deployed = True
        topic_mapping.save()

        return Response({'message': 'Topic is deployed.'}, status=200)

    def put(self, request, *args, **kwargs):
        return Response({'error': 'method not allowed.'}, status=status.HTTP_401_UNAUTHORIZED)
