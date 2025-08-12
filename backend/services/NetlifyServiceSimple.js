import axios from 'axios';

export class NetlifyService {
    constructor() {
        this.apiToken = process.env.NETLIFY_API_TOKEN;
        this.baseURL = 'https://api.netlify.com/api/v1';
        
        console.log('🔧 Inicializando NetlifyService...');
        console.log('🔑 Token configurado:', !!this.apiToken);
        
        if (!this.apiToken) {
            throw new Error('NETLIFY_API_TOKEN no está configurado en las variables de entorno');
        }
    }

    async createSite(siteName, htmlContent) {
        try {
            console.log('🏗️ Creando sitio en Netlify:', siteName);
            console.log('📄 Longitud del HTML:', htmlContent.length);
            console.log('📄 Primeros 200 caracteres del HTML:', htmlContent.substring(0, 200) + '...');
            
            console.log('📝 Creando sitio...');
            const siteResponse = await axios.post(
                `${this.baseURL}/sites`,
                {
                    name: siteName
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            console.log('✅ Sitio creado:', siteResponse.data.name);
            console.log('🆔 Site ID:', siteResponse.data.id);
            const siteId = siteResponse.data.id;
            const siteUrl = siteResponse.data.ssl_url;
            console.log('🔗 URL asignada:', siteUrl);

            console.log('📤 Método correcto: Manual file deploy...');
            
            // Paso 1: Crear deploy
            console.log('🏗️ Creando deploy...');
            const deployCreateResponse = await axios.post(
                `${this.baseURL}/sites/${siteId}/deploys`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const deployId = deployCreateResponse.data.id;
            console.log('✅ Deploy creado:', deployId);

            // Paso 2: Subir archivo
            console.log('📤 Subiendo index.html...');
            await axios.put(
                `${this.baseURL}/deploys/${deployId}/files/index.html`,
                htmlContent,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'text/html'
                    },
                    timeout: 45000
                }
            );

            console.log('✅ Archivo subido correctamente');

            // Paso 3: Obtener información del deploy
            const deployInfoResponse = await axios.get(
                `${this.baseURL}/sites/${siteId}/deploys/${deployId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`
                    },
                    timeout: 15000
                }
            );

            const deployState = deployInfoResponse.data.state;
            const deployUrl = deployInfoResponse.data.deploy_ssl_url;
            console.log('🎯 Deploy enviado:', deployId);
            console.log('📊 Estado:', deployState);
            console.log('🔗 URL del deploy:', deployUrl);
            console.log('🔗 URL principal del sitio:', siteUrl);
            
            // Retornar inmediatamente con información completa
            return {
                success: true,
                siteId,
                url: siteUrl,
                deployUrl: deployUrl,
                deployId: deployId,
                siteName: siteResponse.data.name,
                deployState: deployState
            };

        } catch (error) {
            console.error('💥 Error detallado:', error.response?.data || error.message);
            console.error('📊 Status HTTP:', error.response?.status);
            console.error('📋 Headers de respuesta:', error.response?.headers);
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Timeout en la solicitud a Netlify');
            }
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error_message || 
                                error.message;
            
            throw new Error(`${errorMessage}`);
        }
    }

    async updateSite(siteId, htmlContent) {
        try {
            const deployResponse = await axios.post(
                `${this.baseURL}/sites/${siteId}/deploys`,
                {
                    files: {
                        "/index.html": htmlContent
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 45000
                }
            );

            return {
                success: true,
                deployId: deployResponse.data.id,
                url: deployResponse.data.deploy_ssl_url
            };

        } catch (error) {
            console.error('Error actualizando sitio:', error.response?.data || error.message);
            throw new Error(`Error al actualizar sitio: ${error.response?.data?.message || error.message}`);
        }
    }

    async deleteSite(siteId) {
        try {
            await axios.delete(
                `${this.baseURL}/sites/${siteId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`
                    }
                }
            );

            return { success: true };

        } catch (error) {
            console.error('Error eliminando sitio:', error.response?.data || error.message);
            throw new Error(`Error al eliminar sitio: ${error.response?.data?.message || error.message}`);
        }
    }

    // Validar que el nombre del sitio sea válido para Netlify
    validateSiteName(siteName) {
        const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        return regex.test(siteName) && siteName.length >= 3 && siteName.length <= 63;
    }

    // Generar nombre único basado en el input del usuario
    generateSiteName(baseName) {
        // Limpiar el nombre: solo letras, números y guiones
        let siteName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, ''); // Remover guiones al inicio y final

        // Si queda muy corto o vacío, usar nombre por defecto
        if (siteName.length < 3) {
            siteName = 'landing-page';
        }

        // Agregar timestamp para asegurar unicidad
        const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos
        siteName = `${siteName}-${timestamp}`;

        // Verificar longitud máxima
        if (siteName.length > 63) {
            siteName = siteName.substring(0, 57) + '-' + timestamp;
        }

        return siteName;
    }

    // Función para verificar el estado de un deploy
    async checkDeployStatus(siteId, deployId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/sites/${siteId}/deploys/${deployId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`
                    },
                    timeout: 10000
                }
            );

            return {
                state: response.data.state,
                url: response.data.deploy_ssl_url,
                errorMessage: response.data.error_message,
                createdAt: response.data.created_at,
                publishedAt: response.data.published_at
            };
        } catch (error) {
            console.error('Error verificando estado del deploy:', error.message);
            return { state: 'unknown', error: error.message };
        }
    }
}
