from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite que qualquer usuário veja o produto, mas apenas o 
    criador (owner) possa editá-lo ou deletá-lo.
    """
    def has_object_permission(self, request, view, obj):
        # Métodos de leitura (GET, HEAD, OPTIONS) são liberados para todos
        if request.method in permissions.SAFE_METHODS:
            return True

        # Métodos de escrita requerem que o usuário autenticado seja o dono
        return obj.created_by == request.user