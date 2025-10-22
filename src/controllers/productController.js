import Product from "../models/Product.js";

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ total: products.length, data: products });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

/**
 * Crear producto
 */
export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "Producto creado correctamente", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
};

/**
 * Actualizar producto completo
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    await product.update(req.body);
    res.json({ message: "Producto actualizado correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

/**
 * 🟢 Actualizar solo el stock
 */
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    if (typeof stock !== "number") return res.status(400).json({ message: "Stock inválido" });

    product.stock = stock;
    await product.save();

    res.json({ message: "Stock actualizado ✅", product });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar stock", error: error.message });
  }
};

/**
 * Eliminar producto
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    await product.destroy();
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};
