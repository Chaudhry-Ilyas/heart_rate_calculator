from rest_framework import serializers
from ..models import PhotoacousticFile


class PhotoacousticFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoacousticFile
        fields = "__all__"
