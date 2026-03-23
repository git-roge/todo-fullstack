from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework import serializers
#from .models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'username', 'email', 'password', 'is_active', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','role', 'is_active']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "non_field_errors": ["Invalid username or password."]
            })
        if not user.check_password(password):
            raise serializers.ValidationError({
                "non_field_errors": ["Invalid username of password."]
            })
        if not user.is_active:
            raise serializers.ValidationError({
                "non_field_errors": ["Account is inactive. Contact admin."]
            },)
        
        data = super().validate(attrs)
        return data