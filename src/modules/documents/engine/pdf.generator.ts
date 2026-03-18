import puppeteer from 'puppeteer';

export class PDFGenerator {
  static async generatePDF(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
