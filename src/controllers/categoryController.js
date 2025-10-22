import db from "../models/index.js";

// ✅ Listar con filtro opcional de búsqueda
export const getCategories = async (req, res) => {
  try {
    const { q } = req.query;
    let where = {};

    if (q) where.name = { [db.sequelize.Op.like]: `%${q}%` };

    const categories = await db.Category.findAll({ where });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo categorías", error: error.message });
  }
};

// ✅ Crear categoría
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "El nombre es obligatorio" });

    const exists = await db.Category.findOne({ where: { name } });
    if (exists) return res.status(400).json({ message: "La categoría ya existe" });

    const category = await db.Category.create({ name });
    return res.status(201).json({ message: "Categoría creada", category });
  } catch (error) {
    return res.status(500).json({ message: "Error creando categoría", error: error.message });
  }
};

// ✅ Editar categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await db.Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

    category.name = name;
    await category.save();

    return res.json({ message: "Categoría actualizada", category });
  } catch (error) {
    return res.status(500).json({ message: "Error actualizando categoría", error: error.message });
  }
};

// ✅ Eliminar solo si no hay productos asociados
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await db.Product.findOne({ where: { categoryId: id } });
    if (products) {
      return res.status(400).json({
        message: "No se puede eliminar: existen productos con esta categoría"
      });
    }

    const result = await db.Category.destroy({ where: { id } });
    if (!result) return res.status(404).json({ message: "Categoría no encontrada" });

    return res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error eliminando categoría", error: error.message });
  }
};
