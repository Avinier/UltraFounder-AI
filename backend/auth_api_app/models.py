from django.db import models
from django.contrib.auth.models import User


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


class UserGitHubCreds(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    github_username = models.CharField(max_length=100)
    github_password = models.CharField(max_length=125)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # This manager includes soft-deleted objects.

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()



class UserTopicMapping(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_deployed = models.BooleanField(default=False)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # This manager includes soft-deleted objects.

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()

    def __str__(self):
        return self.topic