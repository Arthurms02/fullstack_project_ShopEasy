from rest_framework.routers import DefaultRouter
from ShopEasy.api.v1.viewsets import CartViewSet, ProductViewSet, OrderViewSet, PaymentTransactionViewSet, OrderItemViewSet, RegisterViewSet, UserViewSet

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'users', UserViewSet)
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'payment-transactions', PaymentTransactionViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = router.urls