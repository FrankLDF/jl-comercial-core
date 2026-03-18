import hbs from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerHelpers } from '../helpers/handlebars.helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

registerHelpers(hbs);

export class TemplateRenderer {
  private static templatesPath = path.join(__dirname, '../templates');
  private static assetsPath = path.join(__dirname, '../assets');

  static async render(templateName: string, data: any): Promise<string> {
    const filePath = path.join(this.templatesPath, `${templateName}.hbs`);
    const templateContent = await fs.readFile(filePath, 'utf-8');
    const compiledTemplate = hbs.compile(templateContent);
    
    // Convertir ruta absoluta a formato URL file:/// para Puppeteer
    const assetsUrl = `file:///${this.assetsPath.replace(/\\/g, '/')}`;

    // Cargar logo en Base64 para máxima compatibilidad
    let logoBase64 = '';
    try {
      const logoPath = path.join(this.assetsPath, 'logo_documentos.png');
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (e) {
      console.error('No se pudo cargar el logo:', e);
    }
    
    return compiledTemplate({ 
      ...data, 
      assetsPath: assetsUrl,
      logoBase64
    });
  }
}
