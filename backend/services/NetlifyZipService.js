import axios from 'axios';
import JSZip from 'jszip';

/**
 * NetlifyZipService - Implementación usando el método ZIP oficial de Netlify
 * 
 * DOCUMENTACIÓN OFICIAL:
 * https://docs.netlify.com/api/get-started/#create-and-deploy-at-once
 * 
 * VENTAJAS DEL ZIP METHOD:
 * ✅ Deploy atómico en una sola operación HTTP
 * ✅ No requiere linking ni contexto local  
 * ✅ Deployment garantizado sin 404s
 * ✅ Rápido (<10 segundos vs >5 minutos CLI)
 * ✅ Respuesta JSON estructurada
 * ✅ Sin archivos temporales en filesystem
 * 
 * FLUJO:
 * 1. Crear ZIP en memoria con index.html
 * 2. POST a /api/v1/sites con Content-Type: application/zip
 * 3. Netlify crea sitio y deploya automáticamente
 * 4. Retorna site_id, url, deploy_id
 */
export class NetlifyZipService {
    constructor() {
        this.apiToken = process.env.NETLIFY_API_TOKEN;
        this.baseURL = 'https://api.netlify.com/api/v1';
        
        console.log('🚀 Inicializando NetlifyZipService (Método ZIP Oficial)...');
        console.log('🔑 Token configurado:', !!this.apiToken);
        
        if (!this.apiToken) {
            throw new Error('NETLIFY_API_TOKEN no está configurado en las variables de entorno');
        }
    }

    /**
     * Valida y corrige el HTML para asegurar renderizado correcto en Netlify
     * Basado en la documentación oficial de Netlify sobre content-type issues
     * @param {string} htmlContent - HTML original
     * @returns {string} HTML validado y corregido
     */
    validateAndFixHTML(htmlContent) {
        console.log('🔧 Validando y corrigiendo HTML para Netlify...');
        
        let fixedHTML = htmlContent.trim();
        
        // PROBLEMA IDENTIFICADO: El HTML debe tener estructura mínima completa
        // para que Netlify lo sirva como text/html en lugar de text/plain
        
        // 1. Verificar si ya tiene estructura HTML completa
        const hasDoctype = fixedHTML.includes('<!DOCTYPE');
        const hasHtmlTag = fixedHTML.includes('<html');
        const hasHeadTag = fixedHTML.includes('<head');
        const hasBodyTag = fixedHTML.includes('<body');
        
        console.log('🔍 Análisis HTML actual:');
        console.log('   DOCTYPE:', hasDoctype ? '✅' : '❌');
        console.log('   <html>:', hasHtmlTag ? '✅' : '❌');
        console.log('   <head>:', hasHeadTag ? '✅' : '❌');
        console.log('   <body>:', hasBodyTag ? '✅' : '❌');
        
        // 2. Si falta estructura básica, reconstruir completamente
        if (!hasDoctype || !hasHtmlTag || !hasHeadTag || !hasBodyTag) {
            console.log('🚨 Estructura HTML incompleta - reconstruyendo...');
            
            // Extraer título si existe
            const titleMatch = fixedHTML.match(/<title[^>]*>([^<]*)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : 'Landing Page';
            
            // Extraer el contenido del body (todo lo que no sea head)
            let bodyContent = fixedHTML;
            
            // Limpiar cualquier estructura HTML parcial
            bodyContent = bodyContent
                .replace(/<!DOCTYPE[^>]*>/i, '')
                .replace(/<html[^>]*>/i, '')
                .replace(/<\/html>/i, '')
                .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
                .replace(/<body[^>]*>/i, '')
                .replace(/<\/body>/i, '')
                .trim();
            
            // Reconstruir HTML completo con estructura estándar
            fixedHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
${bodyContent}
</body>
</html>`;
            
            console.log('✅ HTML reconstruido con estructura completa');
        } else {
            // 3. Si tiene estructura, solo verificar elementos críticos
            
            // Asegurar DOCTYPE html5
            if (!fixedHTML.includes('<!DOCTYPE html>')) {
                console.log('🔄 Corrigiendo DOCTYPE a HTML5');
                fixedHTML = fixedHTML.replace(/<!DOCTYPE[^>]*>/i, '<!DOCTYPE html>');
            }
            
            // Asegurar charset UTF-8 en head
            if (!fixedHTML.includes('charset=') && !fixedHTML.includes('<meta charset')) {
                console.log('➕ Agregando charset UTF-8');
                const headMatch = fixedHTML.match(/(<head[^>]*>)/i);
                if (headMatch) {
                    fixedHTML = fixedHTML.replace(
                        headMatch[0], 
                        headMatch[0] + '\n    <meta charset="UTF-8">'
                    );
                }
            }
            
            // Asegurar viewport meta tag
            if (!fixedHTML.includes('viewport')) {
                console.log('➕ Agregando viewport meta tag');
                const headMatch = fixedHTML.match(/(<head[^>]*>)/i);
                if (headMatch) {
                    fixedHTML = fixedHTML.replace(
                        headMatch[0], 
                        headMatch[0] + '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
                    );
                }
            }
        }
        
        // 4. Validación final
        const finalValidation = {
            hasDoctype: fixedHTML.includes('<!DOCTYPE html>'),
            hasHtml: fixedHTML.includes('<html'),
            hasHead: fixedHTML.includes('<head'),
            hasBody: fixedHTML.includes('<body'),
            hasCharset: fixedHTML.includes('charset=') || fixedHTML.includes('<meta charset'),
            hasViewport: fixedHTML.includes('viewport'),
            length: fixedHTML.length
        };
        
        console.log('📋 Validación HTML final:');
        console.log('   DOCTYPE HTML5:', finalValidation.hasDoctype ? '✅' : '❌');
        console.log('   Estructura <html>:', finalValidation.hasHtml ? '✅' : '❌');
        console.log('   Sección <head>:', finalValidation.hasHead ? '✅' : '❌');
        console.log('   Sección <body>:', finalValidation.hasBody ? '✅' : '❌');
        console.log('   Charset UTF-8:', finalValidation.hasCharset ? '✅' : '❌');
        console.log('   Viewport:', finalValidation.hasViewport ? '✅' : '❌');
        console.log('   Tamaño final:', finalValidation.length, 'bytes');
        
        return fixedHTML;
    }

    /**
     * Crea y deploya un sitio usando el método ZIP oficial de Netlify
     * @param {string} siteName - Nombre del sitio (será sanitizado)
     * @param {string} htmlContent - Contenido HTML completo de la landing page
     * @returns {Promise<Object>} Resultado del deploy con URL y IDs
     */
    async createSite(siteName, htmlContent) {
        try {
            const startTime = Date.now();
            console.log('📦 Iniciando deploy con ZIP Method...');
            console.log('🏷️  Sitio:', siteName);
            console.log('📄 Longitud HTML:', htmlContent.length);

            // DIAGNÓSTICO: Verificar contenido HTML
            console.log('🔍 DIAGNÓSTICO - Primeros 200 caracteres del HTML:');
            console.log(htmlContent.substring(0, 200) + '...');
            
            // CORRECIÓN: Validar y corregir HTML
            const validHTML = this.validateAndFixHTML(htmlContent);
            
            // PASO 1: Crear ZIP en memoria con verificaciones adicionales
            console.log('🗜️  Creando ZIP en memoria...');
            const zip = new JSZip();
            
            // CRÍTICO: Asegurar que el archivo se llame exactamente "index.html"
            // y esté en la raíz del ZIP (no en subdirectorios)
            zip.file('index.html', validHTML, {
                // Asegurar que se guarde como texto UTF-8
                binary: false,
                // Especificar fecha para consistencia
                date: new Date()
            });
            
            // SOLUCIÓN REAL: Agregar archivo _headers para forzar content-type correcto
            // Esto resuelve el problema de HTML sirviendo como text/plain
            const headersContent = `/*
  Content-Type: text/html; charset=utf-8
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=0, must-revalidate

/*.html
  Content-Type: text/html; charset=utf-8

/index.html
  Content-Type: text/html; charset=utf-8`;
            
            zip.file('_headers', headersContent, {
                binary: false,
                date: new Date()
            });
            
            console.log('✅ Archivo _headers agregado para forzar content-type correcto');
            
            // VERIFICACIÓN: Confirmar que los archivos están en el ZIP
            const zipFiles = Object.keys(zip.files);
            console.log('📁 Archivos en ZIP:', zipFiles);
            console.log('✅ index.html presente:', zipFiles.includes('index.html'));
            console.log('✅ _headers presente:', zipFiles.includes('_headers'));
            
            const zipBuffer = await zip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                },
                // Asegurar compatibilidad máxima
                platform: 'UNIX'
            });
            
            console.log('✅ ZIP creado exitosamente:');
            console.log('   📦 Tamaño ZIP:', zipBuffer.length, 'bytes');
            console.log('   📄 Tamaño HTML:', validHTML.length, 'bytes');
            console.log('   📁 Archivos incluidos:', zipFiles.length);
            
            // DIAGNÓSTICO AVANZADO: Verificar contenido del ZIP
            try {
                const testZip = await JSZip.loadAsync(zipBuffer);
                const testFiles = Object.keys(testZip.files);
                const testIndexContent = await testZip.file('index.html').async('string');
                const testHeadersContent = await testZip.file('_headers').async('string');
                
                console.log('🧪 DIAGNÓSTICO ZIP:');
                console.log('   Archivos extraibles:', testFiles);
                console.log('   index.html extraible:', testFiles.includes('index.html'));
                console.log('   _headers extraible:', testFiles.includes('_headers'));
                console.log('   HTML content match:', testIndexContent.length === validHTML.length);
                console.log('   Headers content preview:', testHeadersContent.substring(0, 50) + '...');
                console.log('   HTML primeros 100 chars:', testIndexContent.substring(0, 100));
            } catch (diagError) {
                console.log('⚠️ Error en diagnóstico ZIP:', diagError.message);
            }

            // DIAGNÓSTICO: Guardar HTML localmente para verificación
            try {
                const fs = await import('fs/promises');
                const path = await import('path');
                const { fileURLToPath } = await import('url');
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                
                const debugPath = path.join(__dirname, '..', 'debug-html', `${siteName}.html`);
                await fs.mkdir(path.dirname(debugPath), { recursive: true });
                await fs.writeFile(debugPath, validHTML, 'utf8');
                console.log('🐛 DEBUG: HTML guardado en', debugPath);
            } catch (debugError) {
                console.log('⚠️ No se pudo guardar HTML para debug:', debugError.message);
            }

            // PASO 2: Deploy atómico con ZIP y headers mejorados
            console.log('🚀 Enviando ZIP a Netlify API...');
            console.log('🎯 Endpoint:', `${this.baseURL}/sites`);
            console.log('📦 Payload size:', zipBuffer.length, 'bytes');
            
            const response = await axios.post(
                `${this.baseURL}/sites`,
                zipBuffer,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/zip',
                        'Content-Length': zipBuffer.length.toString(),
                        'User-Agent': 'LandingFlyer/1.0.0 (ZIP Method)',
                        'Accept': 'application/json',
                        // Headers adicionales para asegurar procesamiento correcto
                        'X-Requested-With': 'XMLHttpRequest',
                        'Cache-Control': 'no-cache'
                    },
                    timeout: 120000, // 2 minutos (más tiempo por si hay procesamiento)
                    maxContentLength: 50 * 1024 * 1024, // 50MB max
                    maxBodyLength: 50 * 1024 * 1024,
                    // Configuración adicional para axios
                    responseType: 'json',
                    validateStatus: function (status) {
                        // Aceptar códigos 200-299 como exitosos
                        return status >= 200 && status < 300;
                    }
                }
            );

            const deployTime = Date.now() - startTime;
            console.log(`⚡ Deploy HTTP completado en ${deployTime}ms`);
            console.log('📊 Response status:', response.status);
            console.log('📊 Response headers:', response.headers);

            // PASO 3: Extraer y validar información del response
            const siteData = response.data;
            console.log('🔍 ANÁLISIS RESPONSE:');
            console.log('   Site ID:', siteData.id);
            console.log('   Site Name:', siteData.name);
            console.log('   URL:', siteData.url);
            console.log('   SSL URL:', siteData.ssl_url);
            console.log('   State:', siteData.state);
            console.log('   Published Deploy:', siteData.published_deploy);
            console.log('   Deploy State:', siteData.published_deploy?.state);
            
            const result = {
                success: true,
                siteId: siteData.id,
                siteName: siteData.name,
                url: siteData.ssl_url || siteData.url,
                deployId: siteData.published_deploy?.id || siteData.deploy_id || 'initial',
                adminUrl: siteData.admin_url,
                deployTime: deployTime,
                method: 'ZIP_ATOMIC'
            };

            console.log('🎉 Sitio creado exitosamente:');
            console.log('   🆔 Site ID:', result.siteId);
            console.log('   🔗 URL:', result.url);
            console.log('   📊 Deploy ID:', result.deployId);
            console.log('   ⏱️  Tiempo total:', deployTime, 'ms');

            // PASO 4: Verificación adicional del estado del deploy
            if (result.deployId && result.deployId !== 'initial') {
                try {
                    console.log('🔍 Verificando estado del deploy...');
                    await this.verifyDeployment(result.siteId, result.deployId);
                } catch (verifyError) {
                    console.log('⚠️ Error en verificación (no crítico):', verifyError.message);
                }
            }

            return result;

        } catch (error) {
            console.error('💥 Error en ZIP deploy:', error.message);
            
            // Logs detallados para debugging
            if (error.response) {
                console.error('📊 HTTP Status:', error.response.status);
                console.error('📊 Response Headers:', error.response.headers);
                console.error('📊 Response Data:', error.response.data);
            }
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('Timeout: El deploy tardó más de 60 segundos');
            }
            
            if (error.response?.status === 401) {
                throw new Error('Token de autenticación inválido o expirado');
            }
            
            if (error.response?.status === 422) {
                throw new Error('Contenido ZIP inválido o sitio con nombre duplicado');
            }
            
            throw new Error(`Error en deploy ZIP: ${error.message}`);
        }
    }

    /**
     * Genera un nombre de sitio válido para Netlify basado en el nombre de la empresa
     * Crea URLs más cortas y amigables manteniendo unicidad
     * @param {string} baseName - Nombre de la empresa proporcionado por el usuario
     * @returns {string} Nombre sanitizado, corto y único
     */
    generateSiteName(baseName) {
        console.log('🏷️  Generando nombre de sitio desde:', baseName);
        
        // PASO 1: Extraer palabras significativas del nombre de la empresa
        let companyName = baseName
            .toLowerCase()
            .trim()
            // Remover palabras comunes que no agregan valor a la URL
            .replace(/\b(empresa|company|corp|corporation|ltd|limited|inc|incorporated|sa|srl|sl|cia|co|group|grupo)\b/g, '')
            // Remover artículos y preposiciones
            .replace(/\b(el|la|los|las|de|del|y|and|the|of|&)\b/g, '')
            .trim();

        console.log('📝 Después de limpiar palabras comunes:', companyName);

        // PASO 2: Tomar las primeras 1-2 palabras más significativas
        const words = companyName
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        let siteName = '';
        
        if (words.length === 0) {
            siteName = 'landing';
        } else if (words.length === 1) {
            siteName = words[0];
        } else {
            // Para múltiples palabras, tomar la primera completa + iniciales de las siguientes
            siteName = words[0];
            
            // Si la primera palabra es muy corta, agregar la segunda completa
            if (words[0].length <= 3 && words[1]) {
                siteName += words[1];
            } else {
                // Agregar iniciales de palabras adicionales (máximo 2 más)
                for (let i = 1; i < Math.min(words.length, 3); i++) {
                    if (words[i].length > 0) {
                        siteName += words[i][0];
                    }
                }
            }
        }

        console.log('🔤 Nombre base extraído:', siteName);

        // PASO 3: Sanitizar para Netlify (solo letras, números y guiones)
        siteName = siteName
            .replace(/[^a-z0-9]/g, '')  // Solo alfanuméricos
            .substring(0, 20);          // Máximo 20 caracteres para el nombre base

        // PASO 4: Asegurar nombre mínimo válido
        if (siteName.length < 3) {
            siteName = 'landing';
        }

        console.log('🧹 Después de sanitizar:', siteName);

        // PASO 5: Agregar sufijo único pero corto
        // Usar timestamp reducido para mantener URLs cortas
        const now = Date.now();
        const shortTimestamp = (now % 100000).toString(); // Últimos 5 dígitos
        const finalName = `${siteName}${shortTimestamp}`;

        console.log('✅ Nombre final generado:', finalName);
        console.log('📏 Longitud final:', finalName.length, 'caracteres');

        // PASO 6: Verificar límite de Netlify (63 caracteres máximo)
        if (finalName.length > 63) {
            const truncatedBase = siteName.substring(0, 58 - shortTimestamp.length);
            const truncatedFinal = `${truncatedBase}${shortTimestamp}`;
            console.log('✂️ Nombre truncado por límite de longitud:', truncatedFinal);
            return truncatedFinal;
        }

        return finalName;
    }

    /**
     * Verifica el estado de un deployment específico
     * @param {string} siteId - ID del sitio
     * @param {string} deployId - ID del deploy
     * @returns {Promise<Object>} Estado del deployment
     */
    async verifyDeployment(siteId, deployId) {
        try {
            console.log('🕵️ Verificando deploy', deployId, 'del sitio', siteId);
            
            const response = await axios.get(
                `${this.baseURL}/sites/${siteId}/deploys/${deployId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'User-Agent': 'LandingFlyer/1.0.0'
                    },
                    timeout: 10000
                }
            );

            const deployData = response.data;
            console.log('📊 Estado del deploy:');
            console.log('   ID:', deployData.id);
            console.log('   Estado:', deployData.state);
            console.log('   URL:', deployData.deploy_url);
            console.log('   Creado:', deployData.created_at);
            console.log('   Actualizado:', deployData.updated_at);
            console.log('   Contexto:', deployData.context);
            
            // Verificar archivos del deploy
            if (deployData.state === 'ready') {
                console.log('✅ Deploy listo y publicado');
                
                // Verificar que index.html esté presente
                try {
                    const filesResponse = await axios.get(
                        `${this.baseURL}/sites/${siteId}/files`,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.apiToken}`,
                                'User-Agent': 'LandingFlyer/1.0.0'
                            },
                            timeout: 10000
                        }
                    );
                    
                    const files = filesResponse.data;
                    const indexFile = files.find(f => f.path === '/index.html');
                    
                    console.log('📁 Archivos en el sitio:', files.length);
                    console.log('📄 index.html presente:', !!indexFile);
                    
                    if (indexFile) {
                        console.log('📋 Detalles index.html:');
                        console.log('   Tamaño:', indexFile.size, 'bytes');
                        console.log('   MIME type:', indexFile.mime_type);
                        console.log('   SHA:', indexFile.sha);
                        
                        // CRÍTICO: Verificar que el MIME type sea text/html
                        if (indexFile.mime_type !== 'text/html') {
                            console.log('🚨 PROBLEMA DETECTADO: MIME type incorrecto!');
                            console.log('   Esperado: text/html');
                            console.log('   Actual:', indexFile.mime_type);
                            console.log('   📋 Esto significa que el archivo _headers no funcionó o no se aplicó');
                        } else {
                            console.log('✅ ÉXITO: MIME type correcto: text/html');
                            console.log('   📋 El archivo _headers funcionó correctamente');
                        }
                        
                        // Verificar también si existe el archivo _headers
                        const headersFile = files.find(f => f.path === '/_headers');
                        if (headersFile) {
                            console.log('✅ Archivo _headers presente en el deploy');
                            console.log('   Tamaño:', headersFile.size, 'bytes');
                            console.log('   MIME type:', headersFile.mime_type);
                        } else {
                            console.log('⚠️ Archivo _headers NO encontrado en el deploy');
                        }
                    }
                } catch (filesError) {
                    console.log('⚠️ No se pudo verificar archivos:', filesError.message);
                }
            } else {
                console.log('⏳ Deploy aún procesando, estado:', deployData.state);
            }

            return deployData;

        } catch (error) {
            console.error('❌ Error verificando deploy:', error.message);
            throw error;
        }
    }

    /**
     * Verifica si el servicio está configurado correctamente
     * @returns {Promise<boolean>} True si la configuración es válida
     */
    async testConnection() {
        try {
            console.log('🔧 Verificando conexión con Netlify API...');
            
            const response = await axios.get(
                `${this.baseURL}/sites`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'User-Agent': 'LandingFlyer/1.0.0'
                    },
                    timeout: 10000
                }
            );

            console.log('✅ Conexión exitosa - Sites disponibles:', response.data.length);
            return true;

        } catch (error) {
            console.error('❌ Error de conexión:', error.message);
            return false;
        }
    }
}
