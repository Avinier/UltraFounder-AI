from django.db import models

# Create your models here.

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

class Networks(models.Model):
    name = models.CharField(max_length=70)
    public_ip = models.CharField(max_length=50)
    internal_ip = models.CharField(max_length=50)
    network_type = models.CharField(max_length=50)
    network_speed = models.FloatField()

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

    def __str__(self):
        return self.name

class NattingTable(models.Model):
    network = models.ForeignKey(Networks, on_delete=models.CASCADE)
    rule_type = models.CharField(max_length=50)
    source_port = models.IntegerField()
    dest_port = models.IntegerField()

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

    def __str__(self):
        return self.name