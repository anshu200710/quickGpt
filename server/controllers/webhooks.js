import Stripe from 'stripe'
import Transition from '../models/transition.js';
import User from '../models/user.js';

export const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })

                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === 'quickgpt') {
                    const transaction = await Transition.findOne({_id: transactionId, isPaid: false})


                    await User.updateOne({_id: transaction.userId}, {$inc: {credits: transaction.credits}})

                    transaction.isPaid = true;
                    await transaction.save();
                } else {
                    return response.json({success: true, message: 'ignored event Invalid app'});
                }

                
                break;
        
            default:
                console.log(`Unhandled event type ${event.type}`);
                
                break;
        }
        response.json({recived: true});
    } catch (error) {
        response.status(500).send("Invalid Server Error");
        response.error("webhook Processing Error: ", error)
    }
}  