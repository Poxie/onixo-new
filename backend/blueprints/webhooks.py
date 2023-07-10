import os, requests
from flask import Blueprint, jsonify, request

webhooks = Blueprint('webhooks', __name__)

@webhooks.post('/payment-created')
def payment_created():
    data = request.get_json()

    id = data['id']
    content = data['content']

    invoice = content['invoice']
    customer = content['customer']
    subscription = content['subscription']

    plan_type = subscription['billing_period_unit'].title()
    embed = {
        'color': 58184,
        'description': f'[{customer["first_name"]} {customer["last_name"]} has become a supporter](https://{os.getenv("CHARGEBEE_SITE")}.chargebee.com/d/subscriptions/{subscription["id"]})! :tada:',
        'fields': [
            { 'name': 'Plan Type', 'value': 'Lifetime' if plan_type == 'Day' else plan_type },
            { 'name': 'Payment Amount', 'value': f'{invoice["total"] / 100}$' },
            { 'name': 'Payment Type', 'value': customer['payment_method']['type'].title() }
        ]
    }

    data = {
        'embeds': [embed]
    }
    res = requests.post(f'{os.getenv("PAYMENT_WEBHOOK")}?wait=true', json=data)

    return jsonify(res.json())