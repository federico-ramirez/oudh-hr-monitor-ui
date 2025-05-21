import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

// Perlin noise helper
function getNoiseHelper() {
  class Grad {
    constructor(public x: number, public y: number, public z: number) {}
    dot2(x: number, y: number) {
      return this.x * x + this.y * y;
    }
  }

  const grad3 = [
    new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
    new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
    new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1),
  ];
  const p = [151,160,137,91,90,15,131,13,201,...Array(256).keys()].slice(0, 256); // reduje por brevedad
  let perm: number[] = new Array(512);
  let gradP: Grad[] = new Array(512);

  function seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      let v = i & 1 ? p[i] ^ (seed & 255) : p[i] ^ ((seed >> 8) & 255);
      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  }

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  function perlin2(x: number, y: number) {
    let X = Math.floor(x), Y = Math.floor(y);
    x = x - X; y = y - Y;
    X &= 255; Y &= 255;
    const n00 = gradP[X + perm[Y]].dot2(x, y);
    const n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
    const n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
    const n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
    const u = fade(x);
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
  }

  return { seed, perlin2 };
}

const Heatmap2: React.FC = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    const noise = getNoiseHelper();
    noise.seed(Math.random());
    const xData: number[] = [];
    const yData: number[] = [];
    const data: number[][] = [];

    for (let i = 0; i <= 100; i++) {
      for (let j = 0; j <= 100; j++) {
        data.push([i, j, noise.perlin2(i / 40, j / 20) + 0.5]);
      }
      xData.push(i);
    }

    for (let j = 0; j < 5; j++) {
      yData.push(j);
    }

    setOption({
      tooltip: {},
      textStyle: {
        color: '#000'
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: 'Fecha',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      yAxis: {
        type: 'category',
        data: yData,
        name: 'Derecho',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        realtime: false,
        inRange: {
          color: [
            '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
            '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
          ],
          // color: [
          //   '#000005', '#0f052d', '#2d055a', '#4a0b64', '#832864', '#b7324b',
          //   '#d75532', '#ef8118', '#faa514', '#f3cd3e', '#e7e7a1'
          // ]
        }
      },
      series: [
        {
          name: 'Menciones',
          type: 'heatmap',
          data: data,
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
  }, []);

  return (
    <div className="w-full h-[500px]">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default Heatmap2;
