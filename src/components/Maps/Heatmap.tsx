import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

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
            color: [
                '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
                '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
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

  return (
    <div className="w-full h-[500px] mt-[-25px]">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default HeatmapChart;
