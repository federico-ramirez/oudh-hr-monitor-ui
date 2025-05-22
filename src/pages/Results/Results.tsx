import { useEffect, useState } from "react";
import HeatmapChart from "../../components/Maps/Heatmap";
import { ApiServices } from "../../services/api.service";
import MapView from "../../components/Maps/MapView";
import { useLocation } from "react-router-dom";

// const resultados = [
//     {
//       fecha: "2022-05-01",
//       conteo: [
//         { derecho: "vida", cantidad: 3 },
//         { derecho: "salud", cantidad: 2 },
//         { derecho: "educación", cantidad: 1 },
//         { derecho: "alimentación", cantidad: 4 },
//         { derecho: "vivienda", cantidad: 0 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 3 },
//         { derecho: "igualdad", cantidad: 5 },
//         { derecho: "seguridad", cantidad: 1 },
//         { derecho: "medio ambiente", cantidad: 2 }
//       ]
//     },
//     {
//       fecha: "2022-05-02",
//       conteo: [
//         { derecho: "vida", cantidad: 0 },
//         { derecho: "salud", cantidad: 3 },
//         { derecho: "educación", cantidad: 2 },
//         { derecho: "alimentación", cantidad: 1 },
//         { derecho: "vivienda", cantidad: 3 },
//         { derecho: "libertad", cantidad: 4 },
//         { derecho: "trabajo", cantidad: 1 },
//         { derecho: "igualdad", cantidad: 2 },
//         { derecho: "seguridad", cantidad: 0 },
//         { derecho: "medio ambiente", cantidad: 1 }
//       ]
//     },
//     {
//       fecha: "2022-05-03",
//       conteo: [
//         { derecho: "vida", cantidad: 1 },
//         { derecho: "salud", cantidad: 2 },
//         { derecho: "educación", cantidad: 0 },
//         { derecho: "alimentación", cantidad: 5 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 1 },
//         { derecho: "trabajo", cantidad: 0 },
//         { derecho: "igualdad", cantidad: 4 },
//         { derecho: "seguridad", cantidad: 1 },
//         { derecho: "medio ambiente", cantidad: 3 }
//       ]
//     },
//     {
//       fecha: "2022-05-04",
//       conteo: [
//         { derecho: "vida", cantidad: 2 },
//         { derecho: "salud", cantidad: 1 },
//         { derecho: "educación", cantidad: 3 },
//         { derecho: "alimentación", cantidad: 2 },
//         { derecho: "vivienda", cantidad: 4 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 1 },
//         { derecho: "igualdad", cantidad: 0 },
//         { derecho: "seguridad", cantidad: 3 },
//         { derecho: "medio ambiente", cantidad: 1 }
//       ]
//     },
//     {
//       fecha: "2022-05-05",
//       conteo: [
//         { derecho: "vida", cantidad: 3 },
//         { derecho: "salud", cantidad: 0 },
//         { derecho: "educación", cantidad: 4 },
//         { derecho: "alimentación", cantidad: 1 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 3 },
//         { derecho: "trabajo", cantidad: 2 },
//         { derecho: "igualdad", cantidad: 1 },
//         { derecho: "seguridad", cantidad: 4 },
//         { derecho: "medio ambiente", cantidad: 0 }
//       ]
//     },
//     {
//       fecha: "2022-05-06",
//       conteo: [
//         { derecho: "vida", cantidad: 2 },
//         { derecho: "salud", cantidad: 3 },
//         { derecho: "educación", cantidad: 0 },
//         { derecho: "alimentación", cantidad: 4 },
//         { derecho: "vivienda", cantidad: 1 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 0 },
//         { derecho: "igualdad", cantidad: 3 },
//         { derecho: "seguridad", cantidad: 2 },
//         { derecho: "medio ambiente", cantidad: 1 }
//       ]
//     },
//     {
//       fecha: "2022-05-07",
//       conteo: [
//         { derecho: "vida", cantidad: 4 },
//         { derecho: "salud", cantidad: 1 },
//         { derecho: "educación", cantidad: 2 },
//         { derecho: "alimentación", cantidad: 3 },
//         { derecho: "vivienda", cantidad: 0 },
//         { derecho: "libertad", cantidad: 3 },
//         { derecho: "trabajo", cantidad: 1 },
//         { derecho: "igualdad", cantidad: 4 },
//         { derecho: "seguridad", cantidad: 1 },
//         { derecho: "medio ambiente", cantidad: 2 }
//       ]
//     },
//     {
//       fecha: "2022-05-08",
//       conteo: [
//         { derecho: "vida", cantidad: 1 },
//         { derecho: "salud", cantidad: 0 },
//         { derecho: "educación", cantidad: 3 },
//         { derecho: "alimentación", cantidad: 1 },
//         { derecho: "vivienda", cantidad: 4 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 1 },
//         { derecho: "igualdad", cantidad: 0 },
//         { derecho: "seguridad", cantidad: 3 },
//         { derecho: "medio ambiente", cantidad: 1 }
//       ]
//     },
//     {
//       fecha: "2022-05-09",
//       conteo: [
//         { derecho: "vida", cantidad: 2 },
//         { derecho: "salud", cantidad: 2 },
//         { derecho: "educación", cantidad: 0 },
//         { derecho: "alimentación", cantidad: 2 },
//         { derecho: "vivienda", cantidad: 3 },
//         { derecho: "libertad", cantidad: 1 },
//         { derecho: "trabajo", cantidad: 4 },
//         { derecho: "igualdad", cantidad: 2 },
//         { derecho: "seguridad", cantidad: 0 },
//         { derecho: "medio ambiente", cantidad: 4 }
//       ]
//     },
//     {
//       fecha: "2022-05-10",
//       conteo: [
//         { derecho: "vida", cantidad: 3 },
//         { derecho: "salud", cantidad: 4 },
//         { derecho: "educación", cantidad: 1 },
//         { derecho: "alimentación", cantidad: 0 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 3 },
//         { derecho: "trabajo", cantidad: 1 },
//         { derecho: "igualdad", cantidad: 2 },
//         { derecho: "seguridad", cantidad: 1 },
//         { derecho: "medio ambiente", cantidad: 0 }
//       ]
//     },
//     {
//       fecha: "2022-05-11",
//       conteo: [
//         { derecho: "vida", cantidad: 0 },
//         { derecho: "salud", cantidad: 1 },
//         { derecho: "educación", cantidad: 4 },
//         { derecho: "alimentación", cantidad: 3 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 0 },
//         { derecho: "trabajo", cantidad: 2 },
//         { derecho: "igualdad", cantidad: 1 },
//         { derecho: "seguridad", cantidad: 4 },
//         { derecho: "medio ambiente", cantidad: 3 }
//       ]
//     },
//     {
//       fecha: "2022-05-12",
//       conteo: [
//         { derecho: "vida", cantidad: 2 },
//         { derecho: "salud", cantidad: 2 },
//         { derecho: "educación", cantidad: 2 },
//         { derecho: "alimentación", cantidad: 2 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 2 },
//         { derecho: "igualdad", cantidad: 2 },
//         { derecho: "seguridad", cantidad: 2 },
//         { derecho: "medio ambiente", cantidad: 2 }
//       ]
//     },
//     {
//       fecha: "2022-05-13",
//       conteo: [
//         { derecho: "vida", cantidad: 5 },
//         { derecho: "salud", cantidad: 4 },
//         { derecho: "educación", cantidad: 3 },
//         { derecho: "alimentación", cantidad: 1 },
//         { derecho: "vivienda", cantidad: 0 },
//         { derecho: "libertad", cantidad: 3 },
//         { derecho: "trabajo", cantidad: 2 },
//         { derecho: "igualdad", cantidad: 1 },
//         { derecho: "seguridad", cantidad: 0 },
//         { derecho: "medio ambiente", cantidad: 2 }
//       ]
//     },
//     {
//       fecha: "2022-05-14",
//       conteo: [
//         { derecho: "vida", cantidad: 0 },
//         { derecho: "salud", cantidad: 1 },
//         { derecho: "educación", cantidad: 2 },
//         { derecho: "alimentación", cantidad: 3 },
//         { derecho: "vivienda", cantidad: 2 },
//         { derecho: "libertad", cantidad: 4 },
//         { derecho: "trabajo", cantidad: 0 },
//         { derecho: "igualdad", cantidad: 3 },
//         { derecho: "seguridad", cantidad: 1 },
//         { derecho: "medio ambiente", cantidad: 3 }
//       ]
//     },
//     {
//       fecha: "2022-05-15",
//       conteo: [
//         { derecho: "vida", cantidad: 1 },
//         { derecho: "salud", cantidad: 3 },
//         { derecho: "educación", cantidad: 0 },
//         { derecho: "alimentación", cantidad: 2 },
//         { derecho: "vivienda", cantidad: 1 },
//         { derecho: "libertad", cantidad: 2 },
//         { derecho: "trabajo", cantidad: 3 },
//         { derecho: "igualdad", cantidad: 0 },
//         { derecho: "seguridad", cantidad: 4 },
//         { derecho: "medio ambiente", cantidad: 1 }
//       ]
//     }
//   ];
  
// const resultados = [
//     {
//         "fecha": "2022-05-16",
//         "conteo": [
//             {
//                 "derecho": "vida",
//                 "cantidad": 2
//             },
//             {
//                 "derecho": "salud",
//                 "cantidad": 0
//             },
//             {
//                 "derecho": "vivienda",
//                 "cantidad": 0
//             }
//         ]
//     }
// ]

export default function Results() {
    const location = useLocation()
    const { fechas = [], derechos = [] } = location.state || { fechas: [], derechos: [] }
    const [loadingHeatmap, setLoadingHeatmap] = useState(true);

    const [results, setResults] = useState<any[]>([]);

    const getHeatmapData = async () => {
        setLoadingHeatmap(true);

        const data = await ApiServices.classifyNews(fechas, derechos);

        setResults(data.resultados);

        setLoadingHeatmap(false);
    }

    useEffect(() => {
        getHeatmapData();
    }, [])

    return (
        <div className="w-full p-8 flex flex-col text-center">
            <div className="flex flex-col items-center">
                {
                    loadingHeatmap
                    ? 
                    <>
                        <p className="text-2xl font-bold">Cargando resultados...</p>
                        <p className="text-xl">Por favor, espere, no recargue y no cierre esta página mientras se procesa el monitoreo</p>
                    </>
                    : 
                    <>
                        <p className="text-2xl font-bold">Cantidad de noticias por derecho</p>
                        <HeatmapChart resultados={results} />
                        <MapView resultados={results} />
                    </>
                }
            </div>

        </div>
    )
}
