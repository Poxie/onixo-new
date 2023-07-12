import chargebee, os
from database import database
from flask import Blueprint, jsonify, request, abort
from dotenv import load_dotenv
load_dotenv()

subscriptions = Blueprint('subscriptions', __name__)

@subscriptions.post('/guilds/<int:guild_id>/subscriptions/url')
def get_subscription_url(guild_id: int):
    plan_id = request.form.get('plan_id')
    if not plan_id:
        abort(400, 'plan_id is required')

    entries = chargebee.ItemPrice.list()
    prices = [entry.item_price for entry in entries]

    plan = None
    for price in prices:
        if price.id == plan_id:
            plan = price

    if not plan:
        abort(404, 'plan not found')

    result = chargebee.HostedPage.checkout_new_for_items(dict(
        subscription_items=[
            dict(
                item_price_id=plan.id,
                unit_price=plan.price
            )
        ],
        redirect_url=f'{os.getenv("FRONTEND_ORIGIN")}/dashboard/{guild_id}/premium' 
    ))
    page = result.hosted_page

    return jsonify(dict(
        id=page.id,
        state=page.state,
        created_at=page.created_at,
        url=page.url,
    ))

@subscriptions.delete('/guilds/<int:guild_id>/subscriptions')
def cancel_subscription(guild_id: int):
    db = database['subscriptions']
    
    subscription = db.find_one({ 'guild_id': guild_id, 'canceled': 0 })
    if not subscription:
        abort(404, 'This server does not have premium.')

    result = chargebee.Subscription.cancel_for_items(subscription['subscription_id'])
    premium_ends_at = result.subscription.current_term_end

    settings = database['settings']
    settings.update_one({ '_id': guild_id, 'canceled': 0 }, {
        '$set': {
            'premium_ends_at': premium_ends_at
        }
    })
    
    return jsonify(dict(
        premium_ends_at=premium_ends_at
    ))