from django.db import models
from auth_api_app.models import *


class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        return super(SoftDeleteQuerySet, self).update(is_active=False)

    def restore(self):
        return super(SoftDeleteQuerySet, self).update(is_active=True)

    def alive(self):
        return self.filter(is_active=True)

    def dead(self):
        return self.filter(is_active=False)


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_active=True)

    def restore(self):
        return self.get_queryset().restore()


class ChatMessagesStore(models.Model):
    assistant = models.TextField()
    user = models.TextField()
    user_topic_mapping = models.ForeignKey(UserTopicMapping, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()

    def __str__(self):
        return self.user_topic_mapping.topic
