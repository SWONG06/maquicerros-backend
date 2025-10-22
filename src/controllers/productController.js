import db from "../models/index.js";
import cloudinary from "../config/cloudinary.js";
import { Op } from "sequelize";

// ✅ Crear producto
export const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      brand,
      description,
      price,
      discountType,
      discountValue,
      stock,
      unit,
      categoryId,
    } = req.body;

    // Validar datos
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ message: "La imagen es obligatoria" });
    }

    if (!sku || !name || !brand || !description || !price || !stock || !unit || !categoryId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar SKU único
    const skuExists = await db.Product.findOne({ where: { sku } });
    if (skuExists) return res.status(400).json({ message: "El SKU ya existe" });

    // Manejar imagen subida o URL externa
    let imageUrl = req.body.imageUrl;
    let imagePublicId = null;

    if (req.file) {
      imageUrl = req.file.path; // Cloudinary genera esto
      imagePublicId = req.file.filename;
    }

    // Insertar en BD
    const product = await db.Product.create({
      sku,
      name,
      brand,
      description,
      price,
      discountType,
      discountValue,
      stock,
      unit,
      categoryId,
      imageUrl,
      imagePublicId,
      status: stock > 0 ? "available" : "out_of_stock",
    });

    return res.status(201).json({ message: "Producto creado", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creando producto", error: error.message });
  }
};

// ✅ Obtener productos (con paginación, filtros y búsqueda)
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, q, categoryId, brand } = req.query;

    const where = {};

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (categoryId) where.categoryId = categoryId;
    if (brand) where.brand = brand;

    const products = await db.Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [{ model: db.Category, attributes: ["name"] }],
    });

    return res.json({
      total: products.count,
      page: Number(page),
      pages: Math.ceil(products.count / limit),
      data: products.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error obteniendo productos", error: error.message });
  }
};


// ✅ Obtener producto por id
export const getProductById = async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo producto", error: error.message });
  }
};

// ✅ Eliminar producto solo si no tiene relaciones
export const deleteProduct = async (req, res) => {
  try {
    const exists = await db.Product.findByPk(req.params.id);
    if (!exists) return res.status(404).json({ message: "Producto no encontrado" });

    // *** IMPORTANTE: VALIDAR ANTES PEDIDOS CUANDO EXISTA ORDER 🟡

    // Si tiene imagen en Cloudinary, eliminarla
    if (exists.imagePublicId) {
      await cloudinary.uploader.destroy(`maquicerros/products/${exists.imagePublicId}`);
    }

    await db.Product.destroy({ where: { id: req.params.id } });

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando producto", error: error.message });
  }
};

// ✅ Editar producto
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discountType,
      discountValue,
      unit,
      categoryId,
      status
    } = req.body;

    const { id } = req.params;

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // SKU, imagen y stock no se modifican aquí
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountType = discountType || product.discountType;
    product.discountValue = discountValue || product.discountValue;
    product.unit = unit || product.unit;
    product.categoryId = categoryId || product.categoryId;
    product.status = status || product.status;

    await product.save();

    return res.json({ message: "Producto actualizado", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error actualizando producto", error: error.message });
  }
};

// ✅ Actualizar stock de producto
export const updateProductStock = async (req, res) => {
  try {
    const { quantity } = req.body; // cantidad a sumar/restar

    if (quantity === undefined) {
      return res.status(400).json({ message: "Debes enviar quantity" });
    }

    const product = await db.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // nuevo stock
    const newStock = product.stock + Number(quantity);

    if (newStock < 0) {
      return res.status(400).json({ message: "No hay suficiente stock para restar" });
    }

    product.stock = newStock;

    // actualizar estado automáticamente
    product.status = newStock === 0 ? "out_of_stock" : "available";

    await product.save();

    return res.json({ message: "Stock actualizado", stock: product.stock });
  } catch (error) {
    return res.status(500).json({ message: "Error actualizando stock", error: error.message });
  }
};

// ✅ Cambiar imagen del producto
export const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Validar si viene archivo
    if (!req.file) {
      return res.status(400).json({ message: "Debes enviar una nueva imagen" });
    }

    // Eliminar imagen anterior de Cloudinary si existe
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    // Subir nueva imagen (Cloudinary ya lo hace con multer)
    product.imageUrl = req.file.path;
    product.imagePublicId = req.file.filename;

    await product.save();

    return res.json({ message: "Imagen actualizada", imageUrl: product.imageUrl });
  } catch (error) {
    return res.status(500).json({ message: "Error cambiando imagen", error: error.message });
  }
};

// ✅ Activar / Desactivar producto
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["available", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Estado inválido. Usa: available o inactive"
      });
    }

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.status = status;
    await product.save();

    return res.json({
      message: `Producto ${status === "inactive" ? "desactivado" : "activado"} correctamente`,
      product
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar estado", error: error.message });
  }
};
