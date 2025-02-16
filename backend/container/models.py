from django.db import models
from django.contrib.auth.models import User


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


class Container(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField(max_length=200)
    ip_address = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    running = models.BooleanField(default=True)
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


class ContainerSpecs(models.Model):
    ram = models.IntegerField()
    disk_type = models.CharField(max_length=50)
    disk_space = models.IntegerField()
    ram_type = models.CharField(max_length=50)
    vcpu = models.IntegerField()
    vcpu_type = models.CharField(max_length=50)
    autoscalingmode = models.BooleanField(default=False)
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
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
        return self.container.name


class DockerImage(models.Model):
    FRONTEND = 'frontend'
    BACKEND = 'backend'
    DATABASE = 'database'

    IMAGE_TYPE_CHOICES = [
        (FRONTEND, 'Frontend'),
        (BACKEND, 'Backend'),
        (DATABASE, 'Database'),
    ]
    name = models.CharField(max_length=50)
    description = models.TextField()
    version = models.CharField(max_length=20)
    image_type = models.CharField(
        max_length=10,
        choices=IMAGE_TYPE_CHOICES,
        default=FRONTEND,
    )

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


class ContainerDockerMapping(models.Model):
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
    docker = models.ForeignKey(DockerImage, on_delete=models.CASCADE)

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
        return self.container.name


class ContainerVolumeMapping(models.Model):
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    imagevolumelocation = models.CharField(max_length=200)
    hostvolumelocation = models.CharField(max_length=200)

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
        return self.container.name


# container app.... maybe!!
class PortMapping(models.Model):
    docker = models.ForeignKey(DockerImage, on_delete=models.CASCADE)
    port_no = models.IntegerField()
    port_type = models.CharField(max_length=100)

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
        return self.docker.name


class PortMappingContainer(models.Model):
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
    port_no = models.IntegerField()

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
        return self.container.name


# container app.. maybe
class DockerNetwork(models.Model):
    name = models.CharField(max_length=50)
    network = models.ForeignKey('network.Networks', on_delete=models.CASCADE)
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
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
        self.name


class DockerNetworkDMZ(models.Model):
    docker_network = models.ForeignKey(DockerNetwork, on_delete=models.CASCADE)
    source_port = models.IntegerField()
    dest_port = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    # is_active = models.BooleanField(default=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # This manager includes soft-deleted objects.

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()

    def __str__(self):
        return self.source_port


class ContainerEnv(models.Model):
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
    file = models.FileField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # This manager includes soft-deleted objects.

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()


class ContainerGitLink(models.Model):
    container = models.ForeignKey(Container, on_delete=models.CASCADE)
    gitlink = models.URLField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # This manager includes soft-deleted objects.

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def restore(self, *args, **kwargs):
        self.is_active = True
        self.save()
