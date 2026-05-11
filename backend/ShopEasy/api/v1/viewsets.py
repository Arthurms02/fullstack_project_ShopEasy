
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from ShopEasy.models import CartItem, Category, Favorite, Product, Order, PaymentTransaction, OrderItem, User, Cart
from ShopEasy.api.v1.serializers import (CartItemSerializer, CartSerializer, CategorySerializer,
                                         CookieTokenRefreshSerializer, FavoriteSerializer, ProductSerializer, OrderSerializer,
                                           PaymentTransactionSerializer,
                                         OrderItemSerializer, RegisterSerializer, UserSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from core import settings

class LogoutViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        return response


class UserViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # detail=False significa que não precisa passar ID na URL para acessar este endpoint
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        # Passa o usuário autenticado da requisição para o serializer
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def get_queryset(self):
        """
        Este método filtra os objetos para que o usuário
        veja apenas o que pertence a ele.
        """
        user = self.request.user

        if user.is_authenticated:
            return User.objects.filter(id=user.id)

        return User.objects.none()


class RegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": RegisterSerializer(user, context=self.get_serializer_context()).data,
             "message": "Usuario registrado com sucesso."},
            status=status.HTTP_201_CREATED
        )

class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Product.objects.all()

        show_deleted = self.request.query_params.get('showDeleted')

        if show_deleted:
            queryset = Product.all_objects.all()

        return queryset

    def retrieve(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def restore(self, request,pk=None):
        """
        Restaura um produto deletado
        POST /api/v1/products/{id}/restore/
        """
        try:
            product = Product.all_objects.get(pk=pk)

            if product.deleted_at is None:
                return Response({'error': 'Produto não está deletado.'}, status=status.HTTP_400_BAD_REQUEST)

            # Restaura o produto
            product.restore()
            serializer = self.get_serializer(product)
            return Response(
                {'message': 'Produto restaurado com sucesso.', 'data': serializer.data}, status=status.HTTP_200_OK
                )
        except Product.DoesNotExist:
            return Response({'error': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class CartViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer
    queryset = Cart.objects.all()

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self.get_cart(request.user)
        serializer = self.get_serializer(cart, context=self.get_serializer_context())
        return Response(serializer.data)

    def create(self, request):
        product_id = request.data.get("productId")
        qty = int(request.data.get("quantity", 1))
        if not product_id:
            return Response({"error": "productId required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart = self.get_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": qty})
        if not created:
            item.quantity += qty
            item.save()

        return Response(CartSerializer(cart, context=self.get_serializer_context()).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        item = CartItem.objects.filter(pk=pk, cart__user=request.user).first()
        if not item:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(CartItemSerializer(item).data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"})


class CartItemViewSet(viewsets.ModelViewSet):

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CartItem.objects.all()

        show_deleted = self.request.query_params.get('showDeleted')

        if show_deleted:
            queryset = CartItem.all_objects.all()

        return queryset

    def create(self, request):

        product_id = request.data.get("product")

        product = Product.objects.get(id=product_id)

        qty = int(request.data.get("quantity", 1))

        cart = Cart.objects.get(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": qty}
        )

        if not created:
            item.quantity += qty
            item.save()

        return Response(
            CartSerializer(cart, context=self.get_serializer_context()).data,
            status=201
        )

    def partial_update(self, request, pk=None):
        print("Entrou no partial_update do CartItemViewSet")
        print("Request data:", request.data)

        nova_quantidade = request.data.get("quantity")
        if nova_quantidade is None:
            return Response({"quantity": "Quantidade Invalida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item não encontrado no carrinho"}, status=status.HTTP_404_NOT_FOUND)

        try:
            nova_quantidade = int(nova_quantidade)
        except (TypeError, ValueError):
            return Response({"quantity": "Quantidade Invalida"}, status=status.HTTP_400_BAD_REQUEST)

        if nova_quantidade <= 0:
            cart_item.delete()
            cart = Cart.objects.filter(user=request.user).first()
            serializer = CartSerializer(cart, context=self.get_serializer_context())
            return Response(serializer.data, status=status.HTTP_200_OK)

        cart_item.quantity = nova_quantidade
        cart_item.save()

        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        item = CartItem.objects.filter(pk=pk, cart__user=request.user).first()
        if not item:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class FavoriteViewSet(viewsets.ModelViewSet):

    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Favorite.objects.filter(user=user)

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        user = request.user

        favorito, created = Favorite.all_objects.get_or_create(user=user, product_id=product_id)

        if not created:
            favorito.delete()
            return Response({'isFavorite': False}, status=status.HTTP_200_OK)

        return Response({'isFavorite': True}, status=status.HTTP_201_CREATED)

    # def destroy(self, request, pk=None):
    #     favorite = Favorite.all_objects.filter(pk=pk, user=request.user).first()
    #     if not favorite:
    #         return Response({"error": "Favorito não encontrado"}, status=status.HTTP_404_NOT_FOUND)
    #     favorite.hard_delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)


class OrderItemViewSet(viewsets.ModelViewSet):

    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = OrderItem.objects.all()

        show_deleted = self.request.query_params.get('showDeleted')

        if show_deleted:
            queryset = OrderItem.all_objects.all()

        return queryset

    @action(detail=True, methods=['post'])
    def restore(self, request,pk=None):
        """
        Restaura um item de pedido deletado
        POST /api/v1/order-items/{id}/restore/
        """
        try:
            order_item = OrderItem.all_objects.get(pk=pk)

            if order_item.deleted_at is None:
                return Response({'error': 'Item de pedido não está deletado.'}, status=status.HTTP_400_BAD_REQUEST)
            order_item.restore()
            serializer = self.get_serializer(order_item)
            return Response(
                {'message': 'Item de pedido restaurado com sucesso.', 'data': serializer.data}, status=status.HTTP_200_OK
                )
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item de pedido não encontrado.'}, status=status.HTTP_404_NOT_FOUND)



class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.all()

        show_deleted = self.request.query_params.get('showDeleted')

        if show_deleted:
            queryset = Order.all_objects.all()

        return queryset

    @action(detail=True, methods=['post'])
    def restore(self, request,pk=None):
        """
        Restaura uma ordem deletada
        POST /api/v1/orders/{id}/restore/
        """
        try:
            order = Order.all_objects.get(pk=pk)

            if order.deleted_at is None:
                return Response({'error': 'Ordem não está deletada.'}, status=status.HTTP_400_BAD_REQUEST)
            order.restore()
            serializer = self.get_serializer(order)
            return Response(
                {'message': 'Ordem restaurada com sucesso.', 'data': serializer.data}, status=status.HTTP_200_OK
                )
        except Order.DoesNotExist:
            return Response({'error': 'Ordem não encontrada.'}, status=status.HTTP_404_NOT_FOUND)


class PaymentTransactionViewSet(viewsets.ModelViewSet):

    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = PaymentTransaction.objects.all()

        show_deleted = self.request.query_params.get('showDeleted')

        if show_deleted:
            queryset = PaymentTransaction.all_objects.all()

        return queryset

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """
        Restaura uma transação deletada.
        POST /api/v1/payment-transactions/{id}/restore/
        """
        try:
            transaction = PaymentTransaction.all_objects.get(pk=pk)

            if transaction.deleted_at is None:
                return Response(
                    {'error': 'Esta transação não está deletada'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            transaction.restore()
            serializer = self.get_serializer(transaction)
            return Response(
                {'message': 'Transação restaurada com sucesso', 'data': serializer.data},
                status=status.HTTP_200_OK
            )
        except PaymentTransaction.DoesNotExist:
            return Response(
                {'error': 'Transação não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # Configura o cookie httpOnly
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.SECURE_COOKIE,
                samesite="Lax",  # ou 'Strict' conforme necessidade
                max_age=3600,
                path="/"
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.SECURE_COOKIE,
                samesite="Lax",
                max_age=30 * 24 * 60 * 60,  # 30 dias
            )
            email_login = request.data.get("email")
            user_auth = User.objects.filter(email=email_login).first()

            serializer = UserSerializer(user_auth)
            del response.data["access"]
            del response.data["refresh"]
            response.data["user"] = serializer.data
        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer