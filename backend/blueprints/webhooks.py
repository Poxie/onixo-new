import os, requests
from flask import Blueprint, jsonify, request
from database import database

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
            { 'name': 'Payment Amount', 'value': f'${invoice["total"] / 100}' },
            { 'name': 'Payment Type', 'value': customer['payment_method']['type'].title() }
        ]
    }

    data = {
        'embeds': [embed]
    }
    res = requests.post(f'{os.getenv("PAYMENT_WEBHOOK")}?wait=true', json=data)

    return jsonify(res.json())

@webhooks.post('/subscription-ended')
def subscription_ended():
    data = request.get_json()
    
    content = data['content']
    
    customer = content['customer']
    subscription = content['subscription']

    plan_type = subscription['billing_period_unit'].title()

    db = database['subscriptions']
    sub = db.find_one({ 'subscription_id': subscription['id'], 'canceled': 0 })

    db.update_one({ 'subscription_id': subscription['id'] }, {
        '$set': {
            'canceled': 1
        }
    })

    settings = database['settings']
    settings.update_one({ '_id': sub['guild_id'] }, {
        '$set': {
            'premium': 0,
        },
        '$unset': {
            'premium_ends_at': 1
        }
    })

    amount = sum([price['amount'] for price in subscription['subscription_items']]) / 100
    embed = {
        'color': 15417396,
        'description': f'[{customer["first_name"]} {customer["last_name"]} has canceled their premium plan](https://{os.getenv("CHARGEBEE_SITE")}.chargebee.com/d/subscriptions/{subscription["id"]})',
        'fields': [
            { 'name': 'Plan Type', 'value': 'Lifetime' if plan_type == 'Day' else plan_type },
            { 'name': 'Payment Amount', 'value': f'${amount}' },
            { 'name': 'Guild ID', 'value': sub['guild_id'] }
        ]
    }

    data = {
        'embeds': [embed]
    }
    res = requests.post(f'{os.getenv("SUBSCRIPTION_ENDED_WEBHOOK")}?wait=true', json=data)
    
    return jsonify(res.json())