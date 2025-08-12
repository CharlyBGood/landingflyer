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
            
            // 1. Crear el sitio en Netlify sin deploy automático
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
            const siteId = siteResponse.data.id;
            const siteUrl = siteResponse.data.ssl_url;

            console.log('📤 Creando deploy...');
            // 2. Crear deploy usando el método correcto de Netlify
            const deployData = {
                files: {
                    "/index.html": htmlContent
                }
            };

            const deployResponse = await axios.post(
                `${this.baseURL}/sites/${siteId}/deploys`,
                deployData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 120000 // 2 minutos
                }
            );

            const deployId = deployResponse.data.id;
            console.log('🎯 Deploy iniciado:', deployId);

            // 3. Esperar a que el deploy termine
            console.log('⏳ Esperando que termine el deploy...');
            await this.waitForDeploy(siteId, deployId);

            console.log('� Deploy completado exitosamente!');
            console.log('🔗 URL del sitio:', siteUrl);
            
            return {
                success: true,
                siteId,
                url: siteUrl,
                deployId: deployId,
                siteName: siteResponse.data.name
            };

        } catch (error) {
            console.error('💥 Error creando sitio en Netlify:', error.response?.data || error.message);
            console.error('📊 Status:', error.response?.status);
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Timeout: La publicación está tardando más de lo esperado. Inténtalo de nuevo.');
            }
            
            // Error más específico
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error_message || 
                                error.message;
            
            throw new Error(`Error al publicar en Netlify: ${errorMessage}`);
        }
    }

    // Función para esperar a que termine el deploy
    async waitForDeploy(siteId, deployId, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const deployStatus = await axios.get(
                    `${this.baseURL}/sites/${siteId}/deploys/${deployId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.apiToken}`
                        },
                        timeout: 10000
                    }
                );

                const state = deployStatus.data.state;
                console.log(`📊 Estado del deploy: ${state}`);

                if (state === 'ready') {
                    return true;
                } else if (state === 'error') {
                    throw new Error(`Deploy falló: ${deployStatus.data.error_message || 'Error desconocido'}`);
                }

                // Esperar 3 segundos antes del siguiente check
                await new Promise(resolve => setTimeout(resolve, 3000));
                
            } catch (error) {
                if (i === maxAttempts - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        throw new Error('Deploy timeout: El proceso está tardando más de lo esperado');
    }

    async updateSite(siteId, htmlContent) {
        try {
            const deployResponse = await axios.post(
                `${this.baseURL}/sites/${siteId}/deploys`,
                {
                    files: {
                        'index.html': htmlContent
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    }
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
}
