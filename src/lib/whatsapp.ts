import { EnquiryItem } from './store/enquiryStore';

export function buildEnquiryMessage(
  items: EnquiryItem[],
  customerName?: string,
  customerCity?: string
): string {
  const greeting = `Hello NIKASH CRACKERS! 🙏`;
  const intro = `I would like to place a cracker enquiry:`;

  const itemLines = items.map((item) =>
    `• ${item.quantity} x ${item.product.name_en} — ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
  ).join('\n');

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return [
    greeting,
    '',
    intro,
    '',
    itemLines,
    '',
    `📦 Total Items: ${totalItems}`,
    `💰 Estimated Total: ₹${total.toLocaleString('en-IN')}`,
    '',
    'Please confirm stock and final pricing. Thank you! 🎆',
    customerName ? `👤 Name: ${customerName}` : '',
    customerCity ? `📍 Location: ${customerCity}` : '',
  ].filter(Boolean).join('\n');
}

export function buildProductEnquiryMessage(product: {
  name: string;
  price: number;
}): string {
  return [
    `Hello NIKASH CRACKERS! 🙏`,
    '',
    `I'm interested in: ${product.name}`,
    `Price: ₹${product.price}`,
    '',
    'Please share availability and details. Thank you! 🎆',
  ].join('\n');
}

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '917867955841';

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string): void {
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
