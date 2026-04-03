from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrWorkerNoDelete(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False
        
        if user.role == 'admin':
            return True
        
        if user.role == 'worker':
            if request.method in SAFE_METHODS:
                return True
            if request.method in ["PUT", "PATCH"]:
                return True
            if request.method in ["POST", "DELETE"]:
                return False
        
        return False