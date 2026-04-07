import { paymentCreateIntent } from "../services/payment.service.js"
import { errorResponse, successResponse } from "../utils/response.js"
import { stripe } from "../utils/stripe.js"
import { Cart } from "../models/cart.model.js"

const createpaymetIntent = async (req, res) => {
    try {
        const response = await paymentCreateIntent(req.body)
        if (response.status === 200 || response.status === 201) {
            return successResponse(res, response.status, response.message, response.clientSecret)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in creating payment intent", error)
    }
}

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

            const cartId = paymentIntent.metadata.cartId;
            console.log(cartId)
            if (cartId) {
                try {
                    await Cart.findByIdAndUpdate(cartId, {
                        paymentStatus: 'completed',
                        orderStatus: 'completed'
                    });
                    console.log(`Cart ${cartId} updated to completed via webhook.`);
                } catch (dbError) {
                    console.error("Error updating database from webhook:", dbError);
                }
            }
            break;
        case 'payment_intent.payment_failed':
            console.log('PaymentIntent failed!');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}

export { createpaymetIntent, handleWebhook }

