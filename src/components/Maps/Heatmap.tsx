import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import jsPDF from 'jspdf';
import { useDownloadMenu } from '../../hooks/useDownloadMenu';
import { ExportButton } from '../Buttons/ExportButton';
import { AvailableImageFormatToExport } from '../../types/types';

interface Conteo {
  derecho: string;
  cantidad: number;
}

interface Resultado {
  fecha: string;
  conteo: Conteo[];
}

interface HeatmapChartProps {
  resultados: Resultado[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ resultados }) => {
  const [option, setOption] = useState({});

  const heatmapRef = useRef<any>(undefined);

  const { openDownloadMenu, toggleOpenDownloadMenu } = useDownloadMenu();

  useEffect(() => {
    if (!resultados || resultados.length === 0) return;

    const fechas = resultados.map(r => r.fecha);
    const derechosSet = new Set<string>();

    resultados.forEach(r => {
      r.conteo.forEach(c => derechosSet.add(c.derecho));
    });

    const derechos = Array.from(derechosSet);

    const data: [number, number, number][] = [];

    resultados.forEach((r, xIdx) => {
      r.conteo.forEach(c => {
        const yIdx = derechos.indexOf(c.derecho);
        data.push([xIdx, yIdx, c.cantidad]);
      });
    });

    setOption({
      tooltip: {
        formatter: function (params: any) {
          return `
            <b>${derechos[params.data[1]]}</b> el <b>${fechas[params.data[0]]}</b>: 
            <b>${params.data[2]}</b> mencione(s)
          `;
        }
      },
      textStyle: {
        color: '#000'
      },
      xAxis: {
        type: 'category',
        data: fechas,
        name: 'Fecha',
        nameLocation: 'end',
        nameGap: 60,
        axisLabel: {
          rotate: 45
        },
        nameTextStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        }
      },
      yAxis: {
        type: 'category',
        data: derechos,
        name: 'Derecho',
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map(d => d[2])),
        calculable: true,
        realtime: false,
        inRange: {
          // color: [
          //     '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
          //     '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
          // ]
          color: [
            '#000005', '#0f052d', '#2d055a', '#4a0b64', '#832864', '#b7324b',
            '#d75532', '#ef8118', '#faa514', '#f3cd3e', '#e7e7a1'
          ]
        }
      },
      series: [
        {
          name: 'Menciones',
          type: 'heatmap',
          data,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1
            }
          },
          progressive: 1000,
          animation: false
        }
      ]
    });
  }, [resultados]);

  const exportToPdf = () => {
    const echartsInstance = heatmapRef.current.getEchartsInstance();
    const imgData = echartsInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    });

    const pdf = new jsPDF('landscape');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height - 60);
    pdf.save('heatmap.pdf');
  }

  const exportToImage = (type: AvailableImageFormatToExport) => {
    const echartsInstance = heatmapRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const dataURL = echartsInstance.getDataURL({
      type,
      pixelRatio: 2,
      backgroundColor: '#fff',
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `heatmap.${type}`;
    link.click();
  };

  return (
    <div className="w-full px-8 flex flex-col gap-4">
      <div className="relative flex justify-center">
        <p className="text-2xl font-bold">Cantidad de noticias por derecho</p>

        <div className="absolute right-6">
          <div className="relative inline-block text-left">
            <ExportButton
              openDownloadMenu={openDownloadMenu}
              toggleOpenDownloadMenu={toggleOpenDownloadMenu}
              exportToPdf={exportToPdf}
              exportToImage={exportToImage}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[500px] mt-[-25px]">
        <ReactECharts ref={heatmapRef} option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default HeatmapChart;

