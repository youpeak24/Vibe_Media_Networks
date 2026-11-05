import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function downloadCardAsPDF(elementIdOrRef) {
  try {
    const element = typeof elementIdOrRef === 'string' 
      ? document.getElementById(elementIdOrRef) 
      : elementIdOrRef?.current || elementIdOrRef;

    if (!element) {
      console.error('Card element not found for PDF export.');
      return false;
    }

    // Capture element with crisp scale and specific options
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#0B1320',
      logging: false,
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('digital-business-card');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.borderRadius = '16px';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Business card standard aspect ratio in mm
    const cardWidth = 110;
    const cardHeight = (canvas.height * cardWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [cardWidth + 12, cardHeight + 12],
    });

    // Center image on the page with a clean margin
    pdf.addImage(imgData, 'PNG', 6, 6, cardWidth, cardHeight, '', 'FAST');
    pdf.save('S_Vijay_VibeMediaNetworks_BusinessCard.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF business card:', error);
    return false;
  }
}
