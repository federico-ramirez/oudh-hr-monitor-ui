import { useEffect, useState } from "react";
import HeatmapChart from "../../components/Maps/Heatmap";
import { ApiServices } from "../../services/api.service";
import MapView from "../../components/Maps/MapView";
import { useLocation } from "react-router-dom";

export default function Results() {
    const location = useLocation()
    const { derechos } = location.state || { derechos: [] }
    const [loadingHeatmap, setLoadingHeatmap] = useState(true);

    const [results, setResults] = useState<any[]>([]);

    const getHeatmapData = async () => {
        setLoadingHeatmap(true);

        const data = await ApiServices.classifyNews(derechos);

        setResults(data.resultados);

        setLoadingHeatmap(false);
    }

    useEffect(() => {
        getHeatmapData();
    }, [])

    return (
        <div className="w-full py-8 flex flex-col gap-4">
                {
                    loadingHeatmap
                    ? 
                    <>
                        <p className="text-2xl font-bold">Cargando resultados...</p>
                        <p className="text-xl">Por favor, espere, no recargue y no cierre esta página mientras se procesa el monitoreo</p>
                    </>
                    : 
                    <>
                        <HeatmapChart resultados={results} />
                        <MapView resultados={results} />
                    </>
                }
        </div>
    )
}
