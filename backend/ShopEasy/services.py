from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from .models import Order, PaymentTransaction


@transaction.atomic
def processar_pagamento(payment):
    """
    Processa o pagamento para uma ordem específica.
    """
    
    for item in payment.order.items.all():

        produto = item.product

        if item.order.status == 'Processando':
            return

        if produto.stock < item.quantity:
            raise ValueError(f"Estoque insuficiente para o produto: {produto.name}")

        produto.stock -= item.quantity
        produto.save()

    # Usa update para evitar disparar signals desnecessários
    payment.__class__.objects.filter(pk=payment.pk).update(status='Pago')


def process_webhook_notification(order_id, external_transaction_id, external_status):
    """
    Simular um webhook de notificação de pagamento externo.
    """
    order = get_object_or_404(Order, pk=order_id)

    try:
        transation_record = PaymentTransaction.objects.create(
            order=order,
            transaction_id=external_transaction_id,
            amount=order.total_amount,
            status=external_status
        )
    
        if external_status == 'succeeded':
            processar_pagamento(transation_record)
            return "Pagamento processado com sucesso. Estoque atualizado."

    except IntegrityError:
        return "Transação já processada anteriormente."
    
    except Exception as e:
        return f"Erro ao processar o pagamento: {str(e)}"
