from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Order, PaymentTransaction
from .services import processar_pagamento, process_webhook_notification


@receiver(pre_save, sender=PaymentTransaction)
def atualizar_estoque(sender, instance, **kwargs):
    """Signal para processar o pagamento antes de salvar a transação de pagamento."""

    if instance.pk:
        try:
            old_instance = PaymentTransaction.objects.get(pk=instance.pk)
            # Só processa se o status mudou para 'Pago' e ainda não foi processado
            if old_instance.status != 'Pago' and instance.status == 'Pago':
                processar_pagamento(instance)
                instance.order.status = 'Processando'
                Order.objects.filter(pk=instance.order.pk).update(status='Processando') 
        except PaymentTransaction.DoesNotExist:
            pass  # A transação é nova, nada a fazer aqui
    else:
        # Novo registro sendo criado com status 'Pago'
        if instance.status == 'Pago':
            processar_pagamento(instance)
            # Atualizar o status da ordem sem disparar signal
            Order.objects.filter(pk=instance.order.pk).update(status='Processando')