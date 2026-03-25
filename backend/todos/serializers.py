from rest_framework import serializers
from .models import Todo
from users.serializers import UserSerializer
class TodoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    unAllowedChar = "@#$"
    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'completed', 'created_at', 'isApproved', 'user']

    def validate(self, data):
        title = data.get('title')

        if title:
            for char in self.unAllowedChar:
                if char in title:
                    raise serializers.ValidationError({
                        "title_error" : "Invalid input: Title Contains character."
                    })
        
        return data
class TodoTitleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'created_at']

class TodoDescriptionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'