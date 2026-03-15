import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.log');

// Asegurar que el directorio de logs existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

export class Logger {
  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const stack = error instanceof Error ? error.stack : '';
    const logEntry = `[${timestamp}] ERROR: ${message}\n${stack}\n${error ? JSON.stringify(error, null, 2) : ''}\n------------------------------------------\n`;

    // Escribir en la consola
    console.error(`[${timestamp}] ❌ ${message}`, error);

    // Persistir en archivo
    fs.appendFileSync(ERROR_LOG_FILE, logEntry, 'utf8');
  }

  static info(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️ ${message}`);
  }
}
