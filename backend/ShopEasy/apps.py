from django.apps import AppConfig


class ShopeasyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ShopEasy'

    def ready(self):
        import ShopEasy.signals
