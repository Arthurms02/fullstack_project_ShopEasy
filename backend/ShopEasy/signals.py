from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order, PaymentTransaction
from .services import processar_pagamento


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

@receiver(post_save, sender=PaymentTransaction)
def enviar_email_confirmção(instance, created, **kwargs):
    """Signal para enviar email de confirmação após o pagamento ser processado."""
    if created and instance.status == 'Pago':
        # Lógica para enviar email de confirmação
        print(f"Email de confirmação enviado para o {instance.order.user} que tem como email {instance.order.user.email}.")
    elif not created and instance.status == 'Pago':
        # Lógica para enviar email de confirmação se o status mudou para 'Pago'
        print(f"Email de confirmação atualizado enviado para o {instance.order.user} que tem como email {instance.order.user.email}.")