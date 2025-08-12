import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NetlifyServiceCLI {
    constructor() {
        this.apiToken = process.env.NETLIFY_API_TOKEN;
        
        console.log('🔧 Inicializando NetlifyServiceCLI...');
        console.log('🔑 Token configurado:', !!this.apiToken);
        
        if (!this.apiToken) {
            throw new Error('NETLIFY_API_TOKEN no está configurado en las variables de entorno');
        }
    }

    async createSite(siteName, htmlContent) {
        try {
            console.log('🏗️ Creando sitio con CLI:', siteName);
            console.log('📄 Longitud del HTML:', htmlContent.length);
            
            // Crear directorio temporal
            const tempDir = path.join(__dirname, '..', 'temp', siteName);
            await fs.mkdir(tempDir, { recursive: true });
            console.log('📁 Directorio temporal creado:', tempDir);

            // Escribir archivo HTML
            const htmlPath = path.join(tempDir, 'index.html');
            await fs.writeFile(htmlPath, htmlContent, 'utf8');
            console.log('📄 Archivo HTML creado');

            // Configurar token para CLI
            process.env.NETLIFY_AUTH_TOKEN = this.apiToken;

            // Crear sitio usando CLI
            console.log('🚀 Creando sitio con netlify CLI...');
            const createCommand = `npx netlify sites:create --name "${siteName}"`;
            const createResult = await execAsync(createCommand, { 
                cwd: tempDir,
                env: { ...process.env, NETLIFY_AUTH_TOKEN: this.apiToken },
                timeout: 300000 // 5 minutos para crear sitio
            });

            console.log('📋 Resultado de creación:', createResult.stdout);
            
            // Extraer URL del output (formato: "Site Created: https://xxx.netlify.app")
            const urlMatch = createResult.stdout.match(/https:\/\/[^\s]+\.netlify\.app/);
            const siteUrl = urlMatch ? urlMatch[0] : null;
            
            // Extraer ID del sitio del URL
            const siteId = siteUrl ? siteUrl.split('//')[1].split('.')[0] : siteName;

            console.log('✅ Sitio creado:', siteId);
            console.log('🔗 URL:', siteUrl);

            if (!siteUrl) {
                throw new Error('No se pudo extraer la URL del sitio del output de Netlify CLI');
            }

            // Deploy usando CLI
            console.log('📤 Desplegando con netlify CLI...');
            const deployCommand = `npx netlify deploy --site "${siteId}" --prod --dir .`;
            const deployResult = await execAsync(deployCommand, { 
                cwd: tempDir,
                env: { ...process.env, NETLIFY_AUTH_TOKEN: this.apiToken },
                timeout: 300000 // 5 minutos para deploy
            });

            console.log('🎯 Deploy completado');
            console.log('📊 Resultado:', deployResult.stdout);

            // Limpiar directorio temporal
            await fs.rm(tempDir, { recursive: true, force: true });
            console.log('🧹 Directorio temporal limpiado');

            return {
                success: true,
                siteId,
                url: siteUrl,
                siteName,
                deployOutput: deployResult.stdout
            };

        } catch (error) {
            console.error('💥 Error con CLI:', error.message);
            console.error('📊 Stderr:', error.stderr);
            
            // Intentar limpiar en caso de error
            try {
                const tempDir = path.join(__dirname, '..', 'temp', siteName);
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.log('⚠️ No se pudo limpiar directorio temporal');
            }
            
            throw new Error(`Error con Netlify CLI: ${error.message}`);
        }
    }

    // Generar nombre único basado en el input del usuario
    generateSiteName(baseName) {
        let siteName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        if (siteName.length < 3) {
            siteName = 'landing-page';
        }

        const timestamp = Date.now().toString().slice(-6);
        siteName = `${siteName}-${timestamp}`;

        if (siteName.length > 63) {
            siteName = siteName.substring(0, 57) + '-' + timestamp;
        }

        return siteName;
    }
}
