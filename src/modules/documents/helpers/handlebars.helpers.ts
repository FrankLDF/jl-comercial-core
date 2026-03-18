import { toCardinal } from 'n2words/es-ES';

export const registerHelpers = (hbs: any) => {
  // Formato de Moneda RD$
  hbs.registerHelper('formatCurrency', (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value || 0);
  });

  // Formato de Fecha DD/MM/YYYY
  hbs.registerHelper('formatDate', (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-DO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  // Número a Letras (Dominicano)
  hbs.registerHelper('numberToWords', (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!value) return '';
    
    const integerPart = Math.floor(value);
    const decimalPart = Math.round((value - integerPart) * 100);
    
    const words = toCardinal(integerPart);
    const decimalStr = decimalPart.toString().padStart(2, '0');
    
    return `${words} pesos dominicanos con ${decimalStr}/100`.toUpperCase();
  });

  // Pad ID to 6 digits
  hbs.registerHelper('padId', (id: number) => {
    return id.toString().padStart(6, '0');
  });
};
