import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

/**
 * 🟢 Crear un pago (por ejemplo, simular Stripe o pago directo)
 */
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;

    // Verifica que el pedido exista
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Crea el registro de pago
    const payment = await Payment.create({
      orderId,
      method,
      amount,
      status: "pending",
    });

    res.status(201).json({
      message: "Pago creado correctamente",
      payment,
    });
  } catch (error) {
    console.error("❌ Error al crear pago:", error);
    res.status(500).json({ message: "Error al crear pago" });
  }
};

/**
 * 🟡 Subir comprobante (voucher)
 */
export const uploadVoucherPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { voucherUrl } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });

    payment.voucherUrl = voucherUrl;
    payment.status = "pending";
    await payment.save();

    res.json({ message: "Voucher actualizado correctamente", payment });
  } catch (error) {
    console.error("❌ Error al subir voucher:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

/**
 * 🟣 Revisar comprobante (cambiar estado a success/failed)
 */
export const reviewVoucherPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // success o failed

    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });

    payment.status = status;
    await payment.save();

    res.json({ message: "Estado del pago actualizado", payment });
  } catch (error) {
    console.error("❌ Error al revisar pago:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

/**
 * 🔵 Obtener todos los pagos
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: Order });
    res.json(payments);
  } catch (error) {
    console.error("❌ Error al listar pagos:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
