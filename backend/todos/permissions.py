from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrWorkerNoDelete(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False
        
        if user.role == 'admin':
            return True
        
        if user.role == 'worker':
            return getattr(view, "action", None) != "destroy"
        
        return False