from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer, TodoTitleListSerializer, TodoDescriptionListSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .pagination import TodoPagination
from .permissions import IsAdminOrWorkerNoDelete
from rest_framework.exceptions import ValidationError

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    pagination_class = TodoPagination
    permission_classes = [IsAdminOrWorkerNoDelete]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Todo.objects.none()
        
        if user.role == 'worker':
            self.queryset = super().get_queryset().filter(user=user)
        else:
            self.queryset = super().get_queryset()
        
        search = self.request.query_params.get('search')
        field = self.request.query_params.get('field')

        if search and field:
            if field == 'title':
                self.queryset = self.queryset.filter(title__icontains=search)
            elif field == 'description':
                self.queryset = self.queryset.filter(description__icontains=search)
            elif field == 'user':
                self.queryset = self.queryset.annotate(
                    full_name = concat('user__first_name', value(' '), 'user__last_name')
                ).filter(full_name__icontains=search)
        
        return self.queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response(
            {"message": "Todo deleted successfully"},
            status=status.HTTP_200_OK
        )
    
    def perform_create(self, serializer):
        workerId = self.request.data.get('user')
        serializer.save(user_id=workerId)
    
    