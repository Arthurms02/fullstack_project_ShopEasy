from decimal import Decimal

from rest_framework import serializers
from ShopEasy.models import Cart, CartItem, Category, Product, Order, PaymentTransaction, OrderItem, User
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nome_completo', 'email', 'role']
        read_only_fields = ['id', 'created_at', 'updated_at', 'deleted_at']

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'nome_completo', 'email', 'password', 'role']
        read_only_fields = ['id', 'created_at', 'updated_at', 'deleted_at']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email já está em uso.")
        return value

    def validate_role(self, value):
        roles_permitidas = ['vendedor', 'cliente']
        if value not in roles_permitidas:
            raise serializers.ValidationError(f"Role deve ser uma das seguintes: {', '.join(roles_permitidas)}.")
        if value == 'admin':
            raise serializers.ValidationError("Não é permitido criar um usuário com role 'admin'.")
        if self.instance and self.instance.role == 'admin':
            raise serializers.ValidationError("Não é permitido alterar o role de um usuário admin.")
        return value

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = ['deleted_at', 'created_at', 'updated_at']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ['deleted_at']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        exclude = ['deleted_at']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ['deleted_at']


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        exclude = ['deleted_at']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'total_price']
        read_only_fields = ['id', 'user', 'items', 'total_items', 'total_price']

    def get_total_items(self, obj):
        return sum(i.quantity for i in obj.items.all())

    def get_total_price(self, obj):
        return sum(int(i.quantity) * Decimal(i.product.price) for i in obj.items.all())




class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        if not attrs.get("refresh"):
            attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        return super().validate(attrs)