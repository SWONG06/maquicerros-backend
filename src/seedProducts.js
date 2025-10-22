import { sequelize } from "./config/db.js";
import Product from "./models/Product.js";

const products = [
  {
    sku: "TAL001",
    name: "Taladro Percutor 1/2” Bosch 550W",
    brand: "Bosch",
    description: "Taladro percutor profesional con potencia de 550W, ideal para concreto y metal.",
    unit: "unidad",
    price: 279.90,
    discountType: "none",
    discountValue: 0,
    stock: 15,
    imageUrl: "https://i.imgur.com/JnkkVZt.jpeg",
    status: "available",
  },
  {
    sku: "MAR001",
    name: "Martillo Mango de Fibra Truper 16oz",
    brand: "Truper",
    description: "Martillo con mango ergonómico y cabeza de acero templado. Ideal para carpintería y obra.",
    unit: "unidad",
    price: 45.00,
    discountType: "none",
    discountValue: 0,
    stock: 30,
    imageUrl: "https://i.imgur.com/pH5U4Qw.jpeg",
    status: "available",
  },
  {
    sku: "PINT001",
    name: "Pintura Látex Vinílica Blanca 1 Galón",
    brand: "CPP",
    description: "Pintura látex lavable, excelente cubrimiento para interiores y exteriores.",
    unit: "galon",
    price: 78.50,
    discountType: "none",
    discountValue: 0,
    stock: 20,
    imageUrl: "https://i.imgur.com/7D3AtLt.jpeg",
    status: "available",
  },
  {
    sku: "BROC001",
    name: "Broca SDS Plus 8x160mm Dewalt",
    brand: "Dewalt",
    description: "Broca para concreto con cuerpo reforzado y punta de carburo, alta duración.",
    unit: "unidad",
    price: 18.90,
    discountType: "none",
    discountValue: 0,
    stock: 50,
    imageUrl: "https://i.imgur.com/rrzNHan.jpeg",
    status: "available",
  },
  {
    sku: "GUAN001",
    name: "Guantes de Seguridad Nitrilo Negro",
    brand: "Venitex",
    description: "Guantes industriales resistentes a químicos y cortes. Excelente agarre.",
    unit: "par",
    price: 9.90,
    discountType: "none",
    discountValue: 0,
    stock: 100,
    imageUrl: "https://i.imgur.com/yRmZUEq.jpeg",
    status: "available",
  },
  {
    sku: "DISC001",
    name: "Disco Corte Metal 4.5” x 1mm Bosch",
    brand: "Bosch",
    description: "Disco de corte profesional para metal, acero y estructuras.",
    unit: "unidad",
    price: 5.50,
    discountType: "none",
    discountValue: 0,
    stock: 80,
    imageUrl: "https://i.imgur.com/l4e2B4y.jpeg",
    status: "available",
  },
];

const seedProducts = async () => {
  try {
    await sequelize.sync({ alter: true });
    await Product.bulkCreate(products);
    console.log("✅ Productos cargados correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    process.exit(1);
  }
};

seedProducts();
