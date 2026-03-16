from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer, TodoTitleListSerializer, TodoDescriptionListSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from .pagination import TodoPagination

# Create your views here.
class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    pagination_class = TodoPagination

    @action(detail=False, methods=['get'])
    def titles(self, request):
        todos = self.get_queryset().only('id', 'title', 'created_at').order_by('id')
        page = self.paginate_queryset(todos)

        if page is not None:
            serializer = TodoTitleListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = TodoTitleListSerializer(todos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def descriptions(self, request):
        todos = self.get_queryset().only('id', 'description', 'created_at')
        serializer = TodoDescriptionListSerializer(todos, many=True)
        return Response(serializer.data)