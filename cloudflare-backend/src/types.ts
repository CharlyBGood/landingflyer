export interface Env {
  // KV Namespace
  IMAGE_CACHE: KVNamespace;

  // Vars
  GEMINI_MODEL: string;

  // Secrets
  API_KEY: string;
  GEMINI_API_KEY: string;
  NETLIFY_API_TOKEN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  UNSPLASH_ACCESS_KEY: string;
  PEXELS_API_KEY: string;
}

export interface BusinessData {
  businessName: string;
  businessType: string;
  description: string;
  style?: string;
  primaryColor: string;
  secondaryColor?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
  services?: Array<{
    name: string;
    description: string;
    price?: string;
  }>;
}

export interface PublishRequest {
  htmlContent: string;
  siteName: string;
}

export interface NetlifyDeployResult {
  success: boolean;
  siteId: string;
  siteName: string;
  url: string;
  deployId: string;
}
