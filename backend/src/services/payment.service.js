import { stripe } from "../utils/stripe.js"
const paymentCreateIntent = async (data) => {
    const { total, cartId } = data
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100, // convert to paise/cents
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
            cartId: cartId
        }
    });
    if (paymentIntent) {
        return { status: 200, message: "clientSecret", clientSecret: paymentIntent.client_secret }
    }
    else {
        return { status: 500, message: "something went wrong in creating payment intent!!" }
    }
}
export { paymentCreateIntent }