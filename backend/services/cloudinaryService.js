import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary y retorna la URL pública.
 * @param {Buffer} fileBuffer - Buffer de la imagen.
 * @param {string} publicId - Nombre público (sin extensión).
 * @param {string} folder - Carpeta destino en Cloudinary.
 * @returns {Promise<string>} URL pública de la imagen subida.
 */
export async function uploadImageToCloudinary(fileBuffer, publicId, folder = '') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        resource_type: 'image',
        overwrite: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

export default cloudinary;
