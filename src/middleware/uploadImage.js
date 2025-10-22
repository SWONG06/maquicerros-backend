import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "maquicerros/products", // carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Middleware de subida
const upload = multer({ storage });

export default upload;
