from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'

class TodoTitleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'created_at']

class TodoDescriptionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'