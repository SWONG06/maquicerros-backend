import { stripe } from "../config/stripe.js";
import db from "../models/index.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // ✅ Pago exitoso
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await db.Order.update(
        { status: "PAGADO", payment_status: "APROBADO" },
        { where: { id: orderId } }
      );
      console.log(`✅ Orden ${orderId} marcada como PAGADA`);
    }

    // ❌ Pago fallido
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await db.Order.update(
        { status: "FALLIDO", payment_status: "RECHAZADO" },
        { where: { id: orderId } }
      );
      console.log(`❌ Pago fallido para la orden ${orderId}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️ Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
