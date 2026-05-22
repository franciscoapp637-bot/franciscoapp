import jsPDF from 'jspdf';
import { Certificate } from '../types';

export async function generateCertificatePDF(data: Certificate): Promise<Blob> {
  // Configured to Portrait A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Theme Colors
  const RED = { r: 220, g: 38, b: 38 };
  const BLACK = { r: 30, g: 30, b: 30 };
  const GRAY = { r: 100, g: 100, b: 100 };
  const LIGHT_GRAY = { r: 150, g: 150, b: 150 };

  // --- HEADER SECTION ---
  doc.setTextColor(RED.r, RED.g, RED.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('OLIVEIRA MOTO PEÇAS', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('AMAPÁ DO MARANHÃO', pageWidth / 2, 35, { align: 'center' });

  // Space
  doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
  doc.setFontSize(18);
  doc.text('REVISÃO E ENTREGA', pageWidth / 2, 48, { align: 'center' });

  doc.setTextColor(RED.r, RED.g, RED.b);
  doc.setFontSize(8);
  doc.text('PREMIUM SERVICES', pageWidth / 2, 54, { align: 'center' });

  // Graphic Divider line
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line((pageWidth / 2) - 10, 60, (pageWidth / 2) + 10, 60);

  // Intro text
  doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const introText = 'Eu, Francisco, certifico que executei e conferi rigorosamente os serviços detalhados abaixo, seguindo os padrões de qualidade e segurança da nossa oficina.';
  const splitIntro = doc.splitTextToSize(introText, 150);
  doc.text(splitIntro, pageWidth / 2, 68, { align: 'center', lineHeightFactor: 1.5 });

  let cursorY = 70 + (splitIntro.length * 5); // Add spacing

  // --- INFO BOX ---
  doc.setDrawColor(220, 220, 220); // Border color
  doc.setFillColor(254, 254, 254);
  doc.roundedRect(20, cursorY, pageWidth - 40, 36, 4, 4, 'FD');

  // Box content - Row 1 Labels
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
  doc.text('MODELO', 25, cursorY + 7);
  doc.text('PLACA/CHASSI', 105, cursorY + 7);

  // Box content - Row 1 Values
  doc.setFontSize(11);
  doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
  doc.text(data.motoModel.toUpperCase(), 25, cursorY + 13);
  doc.text((data.motoPlate || 'NÃO INFORMADO').toUpperCase(), 105, cursorY + 13);

  // Box content - Row 2 Labels
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
  doc.text('DATA DO SERVIÇO', 25, cursorY + 23);
  doc.text('CLIENTE', 105, cursorY + 23);

  // Box content - Row 2 Values
  doc.setFontSize(11);
  doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
  const dateObj = new Date(data.createdAt);
  const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' às ' + dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  doc.text(formattedDate.toUpperCase(), 25, cursorY + 29);
  
  // Cut client name if too long
  let clientStr = data.clientName.toUpperCase();
  if (clientStr.length > 30) clientStr = clientStr.substring(0, 30) + "...";
  doc.text(clientStr, 105, cursorY + 29);

  // Draw separator line in the box
  doc.setDrawColor(240, 240, 240);
  doc.line(25, cursorY + 31, pageWidth - 25, cursorY + 31);
  
  cursorY += 46;

  // --- SERVICES LIST HEADER ---
  // Draw small circular check icon graphic
  doc.setDrawColor(RED.r, RED.g, RED.b);
  doc.circle(23, cursorY + -1.5, 2.5);
  doc.setDrawColor(RED.r, RED.g, RED.b);
  doc.setLineWidth(0.4);
  doc.line(21.5, cursorY - 1.5, 22.5, cursorY - 0.5);
  doc.line(22.5, cursorY - 0.5, 24.5, cursorY - 2.5);

  doc.setTextColor(RED.r, RED.g, RED.b);
  doc.setFontSize(9);
  doc.text('SERVIÇOS REALIZADOS', 28, cursorY);
  
  cursorY += 5;

  // Header separator
  doc.setTextColor(RED.r, RED.g, RED.b);
  doc.setFontSize(7);
  doc.text('MÃO DE OBRA E PEÇAS', 28, cursorY + 1);
  
  cursorY += 4;

  // --- LOOP SERVICES ---
  data.services.forEach(service => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const desc = service.description.toUpperCase();
    const splitDesc = doc.splitTextToSize(desc, 90);
    const rowHeight = 7 + (splitDesc.length * 4);

    if (cursorY + rowHeight > 270) { 
        doc.addPage(); 
        cursorY = 20; 
    }
    
    // Row background (Light Red padding)
    doc.setFillColor(254, 242, 242); // Very light red
    doc.setDrawColor(254, 226, 226); // Border light red
    doc.roundedRect(20, cursorY, pageWidth - 40, rowHeight, 2, 2, 'FD');
    
    // Green solid Checkmark
    doc.setDrawColor(16, 185, 129); // Emerald green
    doc.setLineWidth(0.7);
    doc.line(23, cursorY + (rowHeight/2) - 0.5, 24.5, cursorY + (rowHeight/2) + 1);
    doc.line(24.5, cursorY + (rowHeight/2) + 1, 27, cursorY + (rowHeight/2) - 2);

    // Text Description
    doc.setTextColor(GRAY.r, GRAY.g, GRAY.b);
    let textY = cursorY + (rowHeight - (splitDesc.length * 4)) / 2 + 3;
    doc.text(splitDesc, 32, textY);

    // Formatting currency right aligned
    const renderCost = (lbl: string, val: number) => `${lbl} R$ ${Number(val).toFixed(2)}`;
    const costText = `${renderCost('M.O.', service.laborCost)}  |  ${renderCost('PEÇAS:', service.partsCost)}`;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(costText, pageWidth - 23, cursorY + (rowHeight/2) + 1, { align: 'right' });

    cursorY += rowHeight + 3;
  });

  cursorY += 3;

  // --- OBSERVATIONS (Optional) ---
  if (data.observations?.trim() || data.motoMileage.trim()) {
    let obsStr = data.observations ? data.observations.trim().toUpperCase() : 'NENHUMA OBSERVAÇÃO ADICIONAL.';
    if (data.motoMileage) {
        obsStr += ` | QUILOMETRAGEM REGISTRADA: ${data.motoMileage} KM`;
    }
    
    doc.setFontSize(8);
    const splitObs = doc.splitTextToSize(obsStr, 155);
    const obsHeight = 15 + (splitObs.length * 4);

    if (cursorY + obsHeight > 270) { doc.addPage(); cursorY = 20; }
    
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(240, 240, 240);
    doc.roundedRect(20, cursorY, pageWidth - 40, obsHeight, 2, 2, 'FD');
    
    doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('NOTAS / OBSERVAÇÕES:', 25, cursorY + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY.r,GRAY.g,GRAY.b);
    doc.text(splitObs, 25, cursorY + 12);
    
    cursorY += obsHeight + 6;
  }

  // --- TOTAL BOX ---
  if (cursorY > 240) { doc.addPage(); cursorY = 20; }
  
  doc.setFillColor(242, 242, 242);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(20, cursorY, pageWidth - 40, 20, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
  doc.setFontSize(10);
  doc.text(`TOTAL MÃO DE OBRA: R$ ${data.laborValue.toFixed(2)}`, 25, cursorY + 8);
  doc.text(`TOTAL PEÇAS: R$ ${data.partsValue.toFixed(2)}`, 25, cursorY + 14);

  doc.setTextColor(RED.r, RED.g, RED.b);
  doc.setFontSize(14);
  doc.text(`VALOR TOTAL: R$ ${data.totalValue.toFixed(2)}`, pageWidth - 25, cursorY + 12, { align: 'right' });

  cursorY += 30;

  // --- PHOTOS ---
  if (data.photoUrls && data.photoUrls.length > 0) {
    if (cursorY > 220) { doc.addPage(); cursorY = 20; }
    doc.setTextColor(BLACK.r, BLACK.g, BLACK.b);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Anexos (Fotos do Serviço)', 20, cursorY);
    cursorY += 6;

    let x = 20;
    let y = cursorY;
    const imgSize = 50;

    for (const photoDataUrl of data.photoUrls) {
      if (x + imgSize > pageWidth - 20) {
        x = 20;
        y += imgSize + 5;
      }
      if (y + imgSize > 270) {
        doc.addPage();
        x = 20;
        y = 20;
      }
      try {
        doc.addImage(photoDataUrl, 'JPEG', x, y, imgSize, imgSize);
      } catch (err) {
        console.warn('Could not add image to PDF');
      }
      x += imgSize + 5;
    }
  }

  // --- FOOTER FUNCTION --- 
  // Add Footer to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Draw Footer Divider
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, 275, pageWidth - 20, 275);
    
    // Address and Contacts
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    
    doc.text('AVENIDA MILTON LEMOS • AMAPÁ DO MARANHÃO', pageWidth / 2, 282, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text('CONTATO: (98) 9 8469-1493  |  INSTAGRAM: @FRANCISCOARAGAO99', pageWidth / 2, 287, { align: 'center' });
  }

  return doc.output('blob');
}
