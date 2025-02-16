from rest_framework import serializers
from .models import *


class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistData
        fields = '__all__'
