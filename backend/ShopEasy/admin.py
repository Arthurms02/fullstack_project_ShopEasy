from django.contrib import admin
from .models import User, Product, Order, OrderItem, Cart, CartItem, PaymentTransaction


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at')
    search_fields = ('user__email',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'created_at', 'updated_at')
    search_fields = ('cart__id', 'product__name')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'nome_completo', 'role', 'is_staff', 'created_at', 'updated_at')
    search_fields = ('email', 'nome_completo')
    list_filter = ('role', 'is_staff')

    def get_exclude(self, request, obj=None):
        # Oculta deleted_at ao criar novo objeto
        if obj is None:
            return ['deleted_at']
        return []


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('price',)

    def get_exclude(self, request, obj=None):
        # Oculta deleted_at ao criar novo objeto
        if obj is None:
            return ['deleted_at']
        return []


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'status')
    list_filter = ('status',)

    def get_exclude(self, request, obj=None):
        # Oculta deleted_at ao criar novo objeto
        if obj is None:
            return ['deleted_at']
        return []


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price_at_purchase', 'created_at', 'updated_at')
    search_fields = ('order__id', 'product__name')

    def get_exclude(self, request, obj=None):
        # Oculta deleted_at ao criar novo objeto
        if obj is None:
            return ['deleted_at']
        return []


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('order', 'transaction_id', 'amount', 'status', 'created_at', 'updated_at')
    search_fields = ('order__id', 'transaction_id')
    list_filter = ('status',)

    def get_exclude(self, request, obj=None):
        # Oculta deleted_at ao criar novo objeto
        if obj is None:
            return ['deleted_at']
        return []