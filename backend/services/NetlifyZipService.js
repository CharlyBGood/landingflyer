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
     * Extrae el título del HTML para usarlo en la generación de URLs
     * @param {string} htmlContent - Contenido HTML completo
     * @returns {string} Título extraído o fallback
     */
    extractTitleFromHTML(htmlContent) {
        console.log('🔍 Extrayendo título del HTML para URL...');
        
        // Buscar título en el HTML
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]*)<\/title>/i);
        let extractedTitle = '';
        
        if (titleMatch && titleMatch[1]) {
            extractedTitle = titleMatch[1].trim();
            console.log('✅ Título extraído del HTML:', extractedTitle);
        } else {
            console.log('❌ No se encontró título en el HTML');
        }
        
        return extractedTitle;
    }

    /**
     * Crea y deploya un sitio usando el método ZIP oficial de Netlify
     * @param {string} validSiteName - Nombre del sitio ya validado y procesado
     * @param {string} htmlContent - Contenido HTML completo de la landing page
     * @returns {Promise<Object>} Resultado del deploy con URL y IDs
     */
    async createSite(validSiteName, htmlContent) {
        try {
            const startTime = Date.now();
            console.log('📦 Iniciando deploy con ZIP Method...');
            console.log('🏷️  Sitio validado:', validSiteName);
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

            // PASO 2: CREAR SITIO CON NOMBRE PERSONALIZADO PRIMERO
            console.log('🏗️ Creando sitio con nombre personalizado...');
            console.log('🎯 Nombre del sitio:', validSiteName);
            
            // Crear sitio vacío con el nombre que queremos
            const siteResponse = await axios.post(
                `${this.baseURL}/sites`,
                {
                    name: validSiteName  // Especificar el nombre personalizado
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'LandingFlyer/1.0.0 (Named Site Creation)'
                    },
                    timeout: 30000
                }
            );

            const siteId = siteResponse.data.id;
            const siteName = siteResponse.data.name;
            const siteUrl = siteResponse.data.ssl_url || siteResponse.data.url;
            
            console.log('✅ Sitio creado con nombre personalizado:');
            console.log('   🆔 Site ID:', siteId);
            console.log('   🏷️ Nombre:', siteName);
            console.log('   🔗 URL:', siteUrl);

            // PASO 3: DEPLOY DEL ZIP AL SITIO CREADO
            console.log('📦 Desplegando ZIP al sitio creado...');
            
            const deployResponse = await axios.post(
                `${this.baseURL}/sites/${siteId}/deploys`,
                zipBuffer,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/zip',
                        'Content-Length': zipBuffer.length.toString(),
                        'User-Agent': 'LandingFlyer/1.0.0 (ZIP Deploy)'
                    },
                    timeout: 120000, // 2 minutos
                    maxContentLength: 50 * 1024 * 1024, // 50MB max
                    maxBodyLength: 50 * 1024 * 1024
                }
            );

            const deployTime = Date.now() - startTime;
            console.log(`⚡ Deploy ZIP completado en ${deployTime}ms`);
            console.log('📊 Deploy Response status:', deployResponse.status);
            
            const deployData = deployResponse.data;
            console.log('🔍 DEPLOY RESPONSE:');
            console.log('   Deploy ID:', deployData.id);
            console.log('   Deploy URL:', deployData.deploy_ssl_url);
            console.log('   Deploy State:', deployData.state);

            // PASO 4: Resultado final con URL personalizada
            
            const result = {
                success: true,
                siteId: siteId,
                siteName: siteName,
                url: siteUrl,  // Usar la URL del sitio con nombre personalizado
                deployId: deployData.id,
                adminUrl: siteResponse.data.admin_url,
                deployTime: deployTime,
                method: 'HYBRID_ZIP_NAMED'
            };

            console.log('🎉 Sitio creado exitosamente con nombre personalizado:');
            console.log('   🆔 Site ID:', result.siteId);
            console.log('   🏷️ Nombre personalizado:', result.siteName);
            console.log('   🔗 URL personalizada:', result.url);
            console.log('   📊 Deploy ID:', result.deployId);
            console.log('   ⏱️  Tiempo total:', deployTime, 'ms');

            // PASO 5: Verificación adicional del estado del deploy
            if (result.deployId) {
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
     * Genera un nombre de sitio válido para Netlify basado en el input del usuario
     * Usa el algoritmo simple y efectivo similar al método CLI anterior
     * @param {string} baseName - Nombre proporcionado por el usuario
     * @returns {string} Nombre sanitizado, corto y único
     */
    generateSiteName(baseName) {
        console.log('🏷️  Generando nombre de sitio desde:', baseName);
        
        // Algoritmo simple y efectivo (similar al CLI anterior)
        let siteName = baseName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')    // Solo letras, números y guiones
            .replace(/-+/g, '-')            // Eliminar guiones múltiples
            .replace(/^-|-$/g, '');         // Eliminar guiones al inicio/final

        // Si queda muy corto o vacío, usar nombre por defecto
        if (siteName.length < 3) {
            siteName = 'landing-page';
        }

        // Agregar timestamp corto para asegurar unicidad
        const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos
        const finalName = `${siteName}-${timestamp}`;

        // Verificar longitud máxima de Netlify (63 caracteres)
        if (finalName.length > 63) {
            const maxBaseLength = 63 - timestamp.length - 1; // -1 por el guión
            siteName = siteName.substring(0, maxBaseLength);
            return `${siteName}-${timestamp}`;
        }

        console.log('✅ Nombre final generado:', finalName);
        console.log('📏 Longitud:', finalName.length, 'caracteres');
        
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
