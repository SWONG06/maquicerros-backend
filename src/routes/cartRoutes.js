import { Router } from "express";
import { authJWT } from "../middleware/authJWT.js";
import { getMyCart, addToCart } from "../controllers/cartController.js";
import { updateCartItem } from "../controllers/cartController.js";
import { removeCartItem } from "../controllers/cartController.js";
import { clearCart } from "../controllers/cartController.js";
import { checkout } from "../controllers/cartController.js";

const router = Router();

router.get("/", authJWT, getMyCart);
router.post("/items", authJWT, addToCart); 
router.put("/items/:itemId", authJWT, updateCartItem);
router.delete("/items/:itemId", authJWT, removeCartItem);
router.delete("/clear", authJWT, clearCart);
router.post("/checkout", authJWT, checkout);


export default router;