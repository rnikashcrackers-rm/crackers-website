import jsPDF from 'jspdf';

// Helper to render mixed Tamil and English lines (with optional bold title) to a canvas and return an image data URL
function renderTamilEnglishSectionToImage(title: string, lines: string[], fontSize: number, widthMm: number, lineSpacing: number = 3): { dataUrl: string, heightMm: number } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { dataUrl: '', heightMm: 0 };
  }
  
  const scale = 1.5; // Optimized scale to prevent payload size issues (413 Payload Too Large)
  const mmToPx = 3.78; // 1mm ≈ 3.78px at standard 96 DPI
  const widthPx = widthMm * mmToPx;
  
  // Set up temp canvas to measure text wrapping height
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = widthPx;
  tempCanvas.height = 3000;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return { dataUrl: '', heightMm: 0 };
  
  const paddingPx = 5;
  const maxTextWidth = widthPx - paddingPx * 2;
  
  // Wrap lines helper
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxW: number, font: string): string[] => {
    ctx.font = font;
    const words = text.split(' ');
    const wrapped: string[] = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxW) {
        wrapped.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      wrapped.push(currentLine);
    }
    return wrapped;
  };

  const titleFont = `bold ${fontSize + 2.5}px "Cinzel", Georgia, serif`;
  const bodyFont = `bold ${fontSize}px "Inter", Arial, sans-serif`;

  const allWrappedItems: Array<{ text: string, isTitle: boolean }> = [];
  
  if (title) {
    const wrappedTitle = wrapText(tempCtx, title, maxTextWidth, titleFont);
    wrappedTitle.forEach(t => allWrappedItems.push({ text: t, isTitle: true }));
    // Add an empty line spacing after title
    allWrappedItems.push({ text: '', isTitle: false });
  }

  lines.forEach(line => {
    const wrappedBody = wrapText(tempCtx, line, maxTextWidth, bodyFont);
    wrappedBody.forEach(b => allWrappedItems.push({ text: b, isTitle: false }));
  });

  const totalHeightPx = allWrappedItems.reduce((acc, item) => {
    if (item.text === '') return acc + lineSpacing * 2;
    const itemH = item.isTitle ? (fontSize + 2.5) : fontSize;
    return acc + itemH + lineSpacing;
  }, 0) + paddingPx * 2;
  
  const heightMm = totalHeightPx / mmToPx;
  
  // Create final canvas for drawing
  const canvas = document.createElement('canvas');
  canvas.width = widthPx * scale;
  canvas.height = totalHeightPx * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dataUrl: '', heightMm: 0 };
  
  // Fill background with white to support JPEG conversion (no transparency)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.scale(scale, scale);
  ctx.textBaseline = 'top';
  
  let drawY = paddingPx;
  allWrappedItems.forEach(item => {
    if (item.text === '') {
      drawY += lineSpacing * 2;
      return;
    }
    if (item.isTitle) {
      ctx.fillStyle = '#E8394F'; // Gold color matching C.coral
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.fillText(item.text, widthPx / 2, drawY);
      drawY += (fontSize + 2.5) + lineSpacing;
    } else {
      ctx.fillStyle = '#3c3c3c'; // Matches C.dark
      ctx.font = bodyFont;
      ctx.textAlign = 'center';
      ctx.fillText(item.text, widthPx / 2, drawY);
      drawY += fontSize + lineSpacing;
    }
  });
  
  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.7),
    heightMm: heightMm
  };
}

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  mrp: number;
  category?: string;
}

interface ReceiptData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  customerPincode?: string;
  customerState?: string;
  customerDistrict?: string;
  items: ReceiptItem[];
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
  packingCharges?: number;
}

// ─── COLOR CONSTANTS ────────────────────────────────────────────────────────
const C = {
  black:     [30, 30, 30]     as const,
  dark:      [55, 55, 55]     as const,
  mid:       [110, 110, 110]  as const,
  light:     [160, 160, 160]  as const,
  border:    [200, 200, 200]  as const,
  bgRow:     [248, 248, 248]  as const,
  bgCard:    [245, 245, 245]  as const,
  white:     [255, 255, 255]  as const,
  coral:     [255, 107, 74]   as const,
  green:     [22, 128, 57]    as const,
  greenBg:   [235, 250, 240]  as const,
  greenBdr:  [34, 160, 72]    as const,
  tableHead: [38, 38, 38]     as const,
};

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;
const CW = PAGE_W - M * 2;
const FOOTER_ZONE = 20;
const MAX_Y = PAGE_H - M - FOOTER_ZONE;

// ─── Rupee formatter (uses "Rs." to avoid font glyph issues) ────────────────
function rs(n: number): string {
  return 'Rs. ' + n.toLocaleString('en-IN');
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export async function generateReceipt(data: ReceiptData): Promise<jsPDF> {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = M;

  // ─── Load logo ────────────────────────────────────────────────────────
  let logoLoaded = false;
  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  try {
    await new Promise<void>((resolve) => {
      logoImg.onload = () => { logoLoaded = true; resolve(); };
      logoImg.onerror = () => resolve();
      logoImg.src = '/logo/logo.png';
    });
  } catch { /* silent */ }

  // ═══════════════════════════════════════════════════════════════════════
  //  COLUMN LAYOUT — well-spaced, no overflow
  //  Total content width = 182mm (M=14 on each side)
  // ═══════════════════════════════════════════════════════════════════════
  //  S.No: 10mm | Product Description: 65mm | Qty: 12mm | Actual Price: 22mm | Actual Total: 25mm | Actual Discount: 24mm | Net Total: 24mm = 182
  const col = {
    sno:         M,             // x = 14, width = 10
    prod:        M + 10,        // x = 24, width = 65
    qty:         M + 75,        // x = 89, width = 12
    actPrice:    M + 87,        // x = 101, width = 22
    actTotal:    M + 109,       // x = 123, width = 25
    actDiscount: M + 134,       // x = 148, width = 24
    netTotal:    M + 158,       // x = 172, width = 24
    end:         M + CW,        // x = 196
  };
  const colBorders = [col.sno, col.prod, col.qty, col.actPrice, col.actTotal, col.actDiscount, col.netTotal, col.end];

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Company Header (repeated every page)
  // ═══════════════════════════════════════════════════════════════════════
  const drawCompanyHeader = (isFirstPage: boolean) => {
    y = M;

    // Logo
    if (logoLoaded && logoImg.complete && logoImg.naturalHeight > 0) {
      doc.addImage(logoImg, 'PNG', M, y, 20, 20, undefined, 'FAST');
    }

    // Company name block
    const tx = M + 24;
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...C.black);
    doc.text('NIKASH CRACKERS', tx, y + 7);

    doc.setFontSize(8);
    doc.setTextColor(...C.coral);
    doc.text('NIKASH CRACKERS | SIVAKASI FACTORY DIRECT FIREWORKS', tx, y + 12.5);

    doc.setFontSize(6.5);
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.mid);
    doc.text('1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office, Vembakottai, Tamil Nadu', tx, y + 16.5);
    doc.text('Phone: +91 78679 55841  |  Email: rnikashcrackers@gmail.com', tx, y + 20);

    // Receipt title (right side)
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...C.coral);
    doc.text('ORDER RECEIPT', PAGE_W - M, y + 7, { align: 'right' });

    doc.setFontSize(7);
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.mid);
    if (isFirstPage) {
      doc.text('ORIGINAL FOR CUSTOMER - ' + String(data.customerName || ''), PAGE_W - M, y + 12, { align: 'right' });
    } else {
      doc.text('Order: ' + String(data.orderNumber || '') + '  (Continued)', PAGE_W - M, y + 12, { align: 'right' });
    }

    y += 24;

    // Separator line
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.5);
    doc.line(M, y, PAGE_W - M, y);
    y += 5;
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Footer (post-processed on every page)
  // ═══════════════════════════════════════════════════════════════════════
  const drawFooter = (pageNum: number, totalPgs: number) => {
    const fy = PAGE_H - M - FOOTER_ZONE + 4;
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(M, fy, PAGE_W - M, fy);

    doc.setFont('times', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.black);
    doc.text('NIKASH CRACKERS  |  SIVAKASI', PAGE_W / 2, fy + 5, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...C.mid);
    doc.text('Premium Friendly Sivakasi Fireworks  |  Contact: +91 78679 55841', PAGE_W / 2, fy + 9, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.dark);
    doc.text('Page ' + pageNum + ' of ' + totalPgs, PAGE_W / 2, fy + 14, { align: 'center' });
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Draw Table Header with vertical borders
  // ═══════════════════════════════════════════════════════════════════════
  const TH = 7; // table header row height

  const drawTableHeader = () => {
    // Dark background
    doc.setFillColor(...C.tableHead);
    doc.rect(M, y, CW, TH, 'F');

    doc.setFontSize(6.5);
    doc.setFont('times', 'bold');
    doc.setTextColor(...C.white);

    const ty = y + 4.8;
    doc.text('S.No',               col.sno + 2,         ty);
    doc.text('Product Description', col.prod + 2,        ty);
    doc.text('Qty',                 col.qty + 10,        ty, { align: 'right' });
    doc.text('Actual Price',        col.actPrice + 20,   ty, { align: 'right' });
    doc.text('Actual Total',        col.actTotal + 23,   ty, { align: 'right' });
    doc.text('Actual Discount',     col.actDiscount + 22, ty, { align: 'right' });
    doc.text('Net Total',           col.end - 2,         ty, { align: 'right' });

    // Vertical white separators inside header
    doc.setDrawColor(...C.white);
    doc.setLineWidth(0.15);
    for (let i = 1; i < colBorders.length - 1; i++) {
      doc.line(colBorders[i], y, colBorders[i], y + TH);
    }

    y += TH;
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: Draw vertical grid lines for a table row
  // ═══════════════════════════════════════════════════════════════════════
  const ROW_H = 7.5;

  const drawRowBorders = (rowY: number) => {
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.15);
    // Vertical lines
    for (const bx of colBorders) {
      doc.line(bx, rowY, bx, rowY + ROW_H);
    }
    // Bottom horizontal line
    doc.line(M, rowY + ROW_H, PAGE_W - M, rowY + ROW_H);
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  HELPER: New page with header + table header
  // ═══════════════════════════════════════════════════════════════════════
  const startNewPage = () => {
    doc.addPage();
    drawCompanyHeader(false);
    drawTableHeader();
  };

  // ═══════════════════════════════════════════════════════════════════════
  //  PAGE 1: Header
  // ═══════════════════════════════════════════════════════════════════════
  drawCompanyHeader(true);

  // ── Order Info Card ──────────────────────────────────────────────────
  const cardH = 16;
  doc.setFillColor(...C.bgCard);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, cardH, 1.5, 1.5, 'FD');

  // Row 1: Order Ref & Date
  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.dark);
  doc.text('Order Reference:', M + 6, y + 5.5);
  doc.setTextColor(...C.coral);
  doc.text(String(data.orderNumber || ''), M + 38, y + 5.5);

  doc.setTextColor(...C.dark);
  doc.text('Order Date:', M + 100, y + 5.5);
  doc.setFont('times', 'normal');
  doc.setTextColor(...C.mid);
  doc.text(String(data.date || ''), M + 122, y + 5.5);

  // Row 2: Order Status — CONFIRMED badge
  doc.setFont('times', 'bold');
  doc.setTextColor(...C.dark);
  doc.text('Order Status:', M + 6, y + 11.5);

  // Green badge — wider to prevent clipping
  const bx = M + 38;
  const by = y + 8;
  const bw = 32;
  const bh = 5.5;
  doc.setFillColor(...C.greenBg);
  doc.setDrawColor(...C.greenBdr);
  doc.setLineWidth(0.5);
  doc.roundedRect(bx, by, bw, bh, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.setTextColor(...C.green);
  doc.text('CONFIRMED', bx + bw / 2, by + 3.8, { align: 'center' });

  y += cardH + 5;

  // ── Customer Details — 2-Column Card ───────────────────────────────
  const custState = data.customerState || '';
  const custDistrict = data.customerDistrict || '';
  const custAddress = data.customerAddress || '';
  const custCity = data.customerCity || '';
  const custPincode = data.customerPincode || '';
  const hasAddr = !!(custAddress || custCity || custPincode);
  const boxH = hasAddr ? 34 : 26;

  doc.setFillColor(...C.bgCard);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, boxH, 1.5, 1.5, 'FD');

  // Vertical divider
  const midX = M + CW / 2;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.2);
  doc.line(midX, y + 2, midX, y + boxH - 2);

  // LEFT: Customer Details
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.setTextColor(...C.coral);
  doc.text('CUSTOMER DETAILS', M + 6, y + 6);

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.black);
  doc.text(String(data.customerName || ''), M + 6, y + 12);

  doc.setFont('times', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.dark);
  doc.text('Phone:  ' + String(data.customerPhone || ''), M + 6, y + 17);
  if (data.customerEmail) {
    doc.text('Email:  ' + String(data.customerEmail), M + 6, y + 21.5);
  }
  if (hasAddr) {
    doc.setFontSize(6.5);
    doc.setTextColor(...C.mid);
    const addr = [custAddress, custCity, custPincode].filter(Boolean).join(', ');
    const addrLines = doc.splitTextToSize(addr, CW / 2 - 14);
    doc.text(addrLines, M + 6, data.customerEmail ? y + 26 : y + 21.5);
  }

  // RIGHT: Place of Supply & Transport
  const rx = midX + 6;
  doc.setFontSize(7);
  doc.setFont('times', 'bold');
  doc.setTextColor(...C.coral);
  doc.text('PLACE OF SUPPLY & TRANSPORT', rx, y + 6);

  doc.setFont('times', 'normal');
  doc.setFontSize(7);
  const supplyData = [
    ['State:', custState || 'N/A'],
    ['District:', custDistrict || 'N/A'],
    ['Destination:', custCity || 'N/A'],
    ['Postal Code:', custPincode || 'N/A'],
  ];
  let ry = y + 12;
  for (const [label, value] of supplyData) {
    doc.setFont('times', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(label, rx, ry);
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.black);
    doc.text(String(value), rx + 26, ry);
    ry += 4.5;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.coral);
  doc.text('Pickup: Nearest Transport Office Hub', rx, ry + 1);

  y += boxH + 5;

  // ═══════════════════════════════════════════════════════════════════════
  //  PRODUCT TABLE
  // ═══════════════════════════════════════════════════════════════════════

  // Top border of entire table
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(M, y, PAGE_W - M, y);

  drawTableHeader();

  data.items.forEach((item, index) => {
    // Check for page break
    if (y > MAX_Y - ROW_H) {
      startNewPage();
    }

    const rowTop = y;

    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(...C.bgRow);
      doc.rect(M, rowTop, CW, ROW_H, 'F');
    }

    const ty = rowTop + 5;

    // S.No
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.mid);
    doc.text(String(index + 1), col.sno + 5, ty, { align: 'center' });

    // Product Description
    doc.setTextColor(...C.black);
    doc.setFont('times', 'normal');
    const nameStr = String(item.name || '');
    const maxNameW = col.qty - col.prod - 4; // 89 - 24 - 4 = 61mm
    const nameLines = doc.splitTextToSize(nameStr, maxNameW);
    doc.text(nameLines[0] || '', col.prod + 2, ty);

    // Qty (right-aligned)
    doc.setTextColor(...C.dark);
    doc.text(String(item.quantity || 0), col.qty + 10, ty, { align: 'right' });

    // Actual Price (MRP, right-aligned)
    doc.setTextColor(...C.light);
    doc.text(rs(item.mrp || 0), col.actPrice + 20, ty, { align: 'right' });

    // Actual Total (MRP * Qty, right-aligned)
    const lineMrpTotal = (item.mrp || 0) * (item.quantity || 0);
    doc.text(rs(lineMrpTotal), col.actTotal + 23, ty, { align: 'right' });

    // Actual Discount (Discount * Qty, right-aligned)
    const lineDiscount = ((item.mrp || item.price) - item.price) * item.quantity;
    doc.setTextColor(...C.green);
    doc.text(rs(lineDiscount), col.actDiscount + 22, ty, { align: 'right' });

    // Net Total (Price * Qty, right-aligned, bold)
    doc.setFont('times', 'bold');
    doc.setTextColor(...C.black);
    const lineTotal = (item.price || 0) * (item.quantity || 0);
    doc.text(rs(lineTotal), col.end - 2, ty, { align: 'right' });
    doc.setFont('times', 'normal');

    // Draw row grid lines
    drawRowBorders(rowTop);

    y += ROW_H;
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  TOTALS (last page only)
  // ═══════════════════════════════════════════════════════════════════════

  // Ensure enough space for totals (~45mm)
  if (y > MAX_Y - 45) {
    doc.addPage();
    drawCompanyHeader(false);
  }

  y += 5;

  const totLabelX = M + 105;
  const totValueX = PAGE_W - M - 4;

  // 1. Gross Amount (Actual Total MRP)
  const grossAmount = data.subtotal || data.items.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
  doc.setFontSize(7.5);
  doc.setFont('times', 'normal');
  doc.setTextColor(...C.mid);
  doc.text('Gross Amount (Actual Total):', totLabelX, y);
  doc.setTextColor(...C.dark);
  doc.setFont('times', 'bold');
  doc.text(rs(grossAmount), totValueX, y, { align: 'right' });
  y += 5.5;

  // 2. Less: Discount
  const totalDiscount = data.discountTotal || 0;
  if (totalDiscount > 0) {
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.mid);
    doc.text('Less: Discount:', totLabelX, y);
    doc.setTextColor(...C.green);
    doc.setFont('times', 'bold');
    doc.text('-' + rs(totalDiscount), totValueX, y, { align: 'right' });
    y += 5.5;
  }

  // 3. Total Value (Net)
  const netValue = grossAmount - totalDiscount;
  doc.setFont('times', 'normal');
  doc.setTextColor(...C.mid);
  doc.text('Total Value (Net Amount):', totLabelX, y);
  doc.setTextColor(...C.dark);
  doc.setFont('times', 'bold');
  doc.text(rs(netValue), totValueX, y, { align: 'right' });
  y += 5.5;

  // 4. Add: Packing & Forwarding Charges (3%)
  const packingCharges = data.packingCharges !== undefined ? data.packingCharges : Math.round(netValue * 0.03);
  doc.setFont('times', 'normal');
  doc.setTextColor(...C.mid);
  doc.text('Add: Packing Charges (3%):', totLabelX, y);
  doc.setTextColor(...C.dark);
  doc.setFont('times', 'bold');
  doc.text(rs(packingCharges), totValueX, y, { align: 'right' });
  y += 5.5;

  // Divider
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(totLabelX - 2, y, PAGE_W - M, y);
  y += 4;

  // NET PAYABLE bar (Grand Total)
  const finalGrandTotal = netValue + packingCharges;
  const npX = totLabelX - 4;
  const npW = PAGE_W - M - npX;
  doc.setFillColor(...C.tableHead);
  doc.roundedRect(npX, y - 2.5, npW, 11, 1.5, 1.5, 'F');

  doc.setFontSize(8.5);
  doc.setFont('times', 'bold');
  doc.setTextColor(...C.white);
  doc.text('NET PAYABLE AMOUNT:', npX + 4, y + 4.5);
  doc.setTextColor(...C.coral);
  doc.text(rs(finalGrandTotal), PAGE_W - M - 4, y + 4.5, { align: 'right' });

  // ── Authorized Signatory (left side, dynamically aligned with Net Payable) ──
  const sigX = 44;
  const sigLineY = y - 1; // Aligned near the top of the Net Payable bar
  if (logoLoaded && logoImg.complete && logoImg.naturalHeight > 0) {
    doc.addImage(logoImg, 'PNG', 57.5, sigLineY - 20, 18, 18, undefined, 'FAST');
  }
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.line(sigX, sigLineY, sigX + 45, sigLineY);
  doc.setFont('times', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.mid);
  doc.text('Authorized Signatory', 66.5, sigLineY + 4, { align: 'center' });

  y += 18;

  // ═══════════════════════════════════════════════════════════════════════
  //  THANK YOU NOTE (below Net Payable / Signatory area if space permits)
  // ═══════════════════════════════════════════════════════════════════════

  if (y + 20 > MAX_Y) {
    doc.addPage();
    drawCompanyHeader(false);
  }

  // ── Professional Thank You Message ──
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...C.coral);
  doc.text('Thank you for choosing us!', PAGE_W / 2, y + 5, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(...C.dark);
  doc.text('Celebrate the joy from NIKASH CRACKERS.', PAGE_W / 2, y + 12, { align: 'center' });

  y += 20;

  // ═══════════════════════════════════════════════════════════════════════
  //  TERMS & SAFETY INSTRUCTIONS (last page only, English & Tamil)
  // ═══════════════════════════════════════════════════════════════════════

  const termsLines = [
    '1. Goods once booked cannot be cancelled or returned. (பதிவு செய்யப்பட்ட பொருட்கள் திரும்பப் பெறப்பட மாட்டாது.)',
    '2. Delivery is subject to transport service availability. (பொருட்கள் போக்குவரத்து சேவை கிடைக்கும் தன்மையைப் பொறுத்து விநியோகம் செய்யப்படும்.)',
    '3. Price includes local taxes; transport charges are extra. (விலையில் உள்ளூர் வரிகள் அடங்கும்; போக்குவரத்து கட்டணம் தனி.)',
    '4. Customer must verify goods quantity at transport pickup hub. (போக்குவரத்து மையத்தில் பொருட்களைப் பெறும்போது அளவைச் சரிபார்க்கவும்.)'
  ];

  const safetyLines = [
    '1. Store fireworks in a cool, dry, and secure place. (பட்டாசுகளை குளிர்ந்த, உலர்ந்த மற்றும் பாதுகாப்பான இடத்தில் வைக்கவும்.)',
    '2. Maintain safe distance while lighting fireworks. (பட்டாசு பற்றவைக்கும்போது பாதுகாப்பான தூரத்தை பராமரிக்கவும்.)',
    '3. Use an incense stick (Agarbatti) for lighting; do not use open flame. (பற்றவைக்க ஊதுபத்தி பயன்படுத்தவும்; திறந்த சுடரை பயன்படுத்த வேண்டாம்.)',
    '4. Keep a bucket of water nearby in case of emergency. (அவசர காலத்திற்கு அருகில் ஒரு வாலி தண்ணீரை வைத்திருக்கவும்.)',
    '5. Supervision by adults is mandatory for children. (குழந்தைகளுக்கு பெரியவர்களின் கண்காணிப்பு கட்டாயமாகும்.)'
  ];

  // Draw Terms & Conditions
  const termsRes = renderTamilEnglishSectionToImage('TERMS & CONDITIONS / விதிகளும் நிபந்தனைகளும்', termsLines, 12, CW);
  if (termsRes.dataUrl) {
    if (y + termsRes.heightMm > MAX_Y) {
      doc.addPage();
      drawCompanyHeader(false);
    }
    doc.addImage(termsRes.dataUrl, 'JPEG', M, y, CW, termsRes.heightMm, undefined, 'FAST');
    y += termsRes.heightMm + 6;
  }

  // Draw Safety Instructions
  const safetyRes = renderTamilEnglishSectionToImage('SAFETY INSTRUCTIONS / பாதுகாப்பு வழிமுறைகள்', safetyLines, 12, CW);
  if (safetyRes.dataUrl) {
    if (y + safetyRes.heightMm > MAX_Y) {
      doc.addPage();
      drawCompanyHeader(false);
    }
    doc.addImage(safetyRes.dataUrl, 'JPEG', M, y, CW, safetyRes.heightMm, undefined, 'FAST');
    y += safetyRes.heightMm;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  POST-PROCESSING: Footers on all pages
  // ═══════════════════════════════════════════════════════════════════════
  const finalTotal = doc.getNumberOfPages();
  for (let i = 1; i <= finalTotal; i++) {
    doc.setPage(i);
    drawFooter(i, finalTotal);
  }

  return doc;
}

// ─── Download helper ────────────────────────────────────────────────────────
export function downloadReceipt(doc: jsPDF, orderNumber: string) {
  doc.save('NC-Crackers-Receipt-' + String(orderNumber || 'order') + '.pdf');
}
