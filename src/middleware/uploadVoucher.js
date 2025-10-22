import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "maquicerros/vouchers", // carpeta para vouchers
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploadVoucher = multer({ storage });

export default uploadVoucher;
