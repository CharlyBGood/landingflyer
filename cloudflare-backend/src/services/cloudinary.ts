import { arrayBufferToBase64, sha1Hex } from '../utils/helpers.js';

interface CloudinaryEnv {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

/**
 * Upload an image buffer to Cloudinary using the REST API (no SDK needed).
 * Uses signed uploads with SHA-1 signature.
 */
export async function uploadToCloudinary(
  buffer: ArrayBuffer,
  publicId: string,
  folder: string,
  env: CloudinaryEnv
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Build the string to sign (params sorted alphabetically)
  const paramsToSign = [
    `folder=${folder}`,
    `overwrite=false`,
    `public_id=${publicId}`,
    `timestamp=${timestamp}`,
    `unique_filename=false`,
  ].join('&');

  const signature = await sha1Hex(paramsToSign + env.CLOUDINARY_API_SECRET);

  const base64Data = `data:image/jpeg;base64,${arrayBufferToBase64(buffer)}`;

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('public_id', publicId);
  formData.append('folder', folder);
  formData.append('timestamp', timestamp);
  formData.append('api_key', env.CLOUDINARY_API_KEY);
  formData.append('signature', signature);
  formData.append('overwrite', 'false');
  formData.append('unique_filename', 'false');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload error ${response.status}: ${error}`);
  }

  const data = await response.json<{ secure_url: string }>();
  return data.secure_url;
}
