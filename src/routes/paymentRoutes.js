import express from "express";
import {
  createStripePaymentIntent,
  uploadVoucherPayment,
  reviewVoucherPayment,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// Crear pago
router.post("/", createStripePaymentIntent);

// Subir voucher
router.put("/:id/voucher", uploadVoucherPayment);

// Revisar voucher (aprobar o rechazar)
router.put("/:id/review", reviewVoucherPayment);

// Listar pagos
router.get("/", getAllPayments);

export default router;
