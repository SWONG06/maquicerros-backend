import db from "../models/index.js";
import { sequelize } from "../config/db.js";


// ✅ Obtener carrito del usuario logueado
export const getMyCart = async (req, res) => {
  try {
    // Buscar carrito del usuario
    let cart = await db.Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: db.CartItem,
          include: [{ model: db.Product }]
        }
      ]
    });

    // Si no tiene carrito, crear uno vacío
    if (!cart) {
      cart = await db.Cart.create({ userId: req.user.id });
    }

    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo carrito", error: error.message });
  }
};

// ✅ Agregar producto al carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId y quantity son obligatorios" });
    }

    // Buscar producto
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Validar stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    // Buscar o crear carrito del usuario
    let cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await db.Cart.create({ userId: req.user.id });
    }

    // Buscar si producto ya está en carrito
    let cartItem = await db.CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      // ✅ Ya existe → aumentar cantidad
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // ✅ No existe → crear nuevo item
      await db.CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        priceAtAddition: product.price // guarda precio en ese momento
      });
    }

    return res.json({ message: "Producto agregado al carrito" });
  } catch (error) {
    return res.status(500).json({ message: "Error agregando al carrito", error: error.message });
  }
};

// ✅ Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    // Buscar item en el carrito
    const cartItem = await db.CartItem.findOne({
      where: { id: itemId },
      include: [{ model: db.Product }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item no encontrado en el carrito" });
    }

    // ✅ Si cantidad = 0, eliminar del carrito
    if (quantity === 0) {
      await cartItem.destroy();
      return res.json({ message: "Producto eliminado del carrito" });
    }

    // Validar stock
    if (quantity > cartItem.Product.stock) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    // Actualizar cantidad
    cartItem.quantity = quantity;
    await cartItem.save();

    return res.json({ message: "Cantidad actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error actualizando carrito", error: error.message });
  }
};

// ✅ Eliminar un ítem del carrito
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItem = await db.CartItem.findOne({ where: { id: itemId } });
    if (!cartItem) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    await cartItem.destroy();
    return res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando producto", error: error.message });
  }
};

// ✅ Vaciar todo el carrito
export const clearCart = async (req, res) => {
  try {
    // Buscar carrito del usuario
    const cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Eliminar todos los items
    await db.CartItem.destroy({ where: { cartId: cart.id } });

    return res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error vaciando el carrito", error: error.message });
  }
};

// ✅ CHECKOUT - Crear orden desde el carrito
export const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Buscar carrito del usuario
    const cart = await db.Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: db.CartItem, include: [db.Product] }]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Tu carrito está vacío" });
    }

    // Calcular total
    let total = 0;
    for (let item of cart.CartItems) {
      total += item.quantity * item.Product.price;

      // Validar stock
      if (item.quantity > item.Product.stock) {
        return res.status(400).json({ message: `Stock insuficiente para ${item.Product.name}` });
      }
    }

    // Crear orden
    const order = await db.Order.create(
      {
        userId: req.user.id,
        total,
        status: "PENDIENTE",
        payment_status: "PENDIENTE",
        payment_method: null // Se define luego en pago
      },
      { transaction }
    );

    // Crear OrderItems y descontar stock
    for (let item of cart.CartItems) {
      await db.OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.Product.price,
          subtotal: item.quantity * item.Product.price
        },
        { transaction }
      );

      // Descontar stock
      await db.Product.update(
        { stock: item.Product.stock - item.quantity },
        { where: { id: item.productId }, transaction }
      );
    }

    // Vaciar carrito
    await db.CartItem.destroy({ where: { cartId: cart.id }, transaction });

    // Confirmar transacción
    await transaction.commit();

    return res.json({
      message: "Orden creada correctamente. Procede al pago.",
      orderId: order.id,
      total
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: "Error en checkout", error: error.message });
  }
};