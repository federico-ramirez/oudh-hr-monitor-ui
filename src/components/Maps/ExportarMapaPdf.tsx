import { useMap } from 'react-leaflet';
import leafletImage from 'leaflet-image';
import jsPDF from 'jspdf';

export const ExportarMapaPDF = () => {
  const map = useMap();

  const exportar = () => {
    leafletImage(map, (err: any, canvas: HTMLCanvasElement) => {
      if (err) {
        console.error('Error exportando mapa:', err);
        return;
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 250;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
      const y = 10;

      pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
      pdf.save('mapa.pdf');
    });
  };

  return (
    <div className="text-center my-4">
      <button
        onClick={exportar}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Exportar Mapa a PDF
      </button>
    </div>
  );
};
