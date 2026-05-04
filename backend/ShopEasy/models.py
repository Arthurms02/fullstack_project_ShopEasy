from django.db import models
from django.utils import timezone
from .manage import ActiveManager, UserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


    objects = ActiveManager()
    all_objects = models.Manager()

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()


class User(AbstractBaseUser, PermissionsMixin , BaseModel):

    CHOICES = [
        ('vendedor', 'Vendedor'),
        ('cliente', 'Cliente'),
        ('admin', 'Admin'),
    ]
    nome_completo = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=CHOICES, default='cliente')

    objects = UserManager()
    all_objects = ActiveManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome_completo']

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'admin'
            if User.objects.filter(role='admin').exclude(pk=self.pk).exists():
                raise ValueError("Já existe um usuário com o papel de admin.")
        elif self.role == 'admin':
            raise PermissionError("Não é permitido definir o papel como admin diretamente.")

        if self.role == "vendedor":
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)


    def __str__(self):
        return self.nome_completo


class Product(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name

class Category(BaseModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    products = models.ManyToManyField(Product, related_name='categories')

    def __str__(self):
        return self.name

class Favorite(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.nome_completo} - {self.product.name}"


class Order(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Processando', 'Processando'),
        ('Enviado', 'Enviado'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    shipping_address = models.TextField()
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return f"Order {self.id} - {self.user.nome_completo}"


class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"OrderItem {self.id} - {self.product.name} (Order {self.order.id})"

class Cart(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()


class PaymentTransaction(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    STATUS_CHOICES = [
        ('Processando', 'Processando'),
        ('Pago', 'Pago'),
        ('Falhou', 'Falhou'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processando')
    method = models.CharField(max_length=50)

    def __str__(self):
        return f"PaymentTransaction {self.transaction_id} - {self.status}"
