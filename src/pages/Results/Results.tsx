import { useEffect, useState } from "react";
import HeatmapChart from "../../components/Maps/Heatmap";
import { ApiServices } from "../../services/api.service";
import MapView from "../../components/Maps/MapView";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ReturnButton } from "../../components/Buttons/ReturnButton";

export default function Results() {
    const location = useLocation()
    const { fechas = [], derechos = [] } = location.state || { fechas: [], derechos: [] }
    const [loadingHeatmap, setLoadingHeatmap] = useState(true);
    const [getDataError, setGetDataError] = useState(false);

    const [results, setResults] = useState<any[]>([]);
    const [newsIds, setNewsIds] = useState<any[]>([]);

    const getHeatmapData = async () => {
        setLoadingHeatmap(true);
        try {
            const data = await ApiServices.classifyNews(fechas, derechos);
            console.log(data)
            if (data.resultados.length > 0) {
                setResults(data.resultados);
                setNewsIds(data.noticias);

                setLoadingHeatmap(false);
                setGetDataError(false);
            } else {
                toast("Algo salió mal al obtener los resultados. Intente nuevamente.", { type: 'error' });
                setGetDataError(true);
            }
        } catch (error) {
            toast("Algo salió mal al obtener los resultados. Intente nuevamente.", { type: 'error' });
            setGetDataError(true);
            console.log(error);
        }
    }

    useEffect(() => {
        getHeatmapData();
    }, [])

    const downloadCsv = async () => {
        const data = await fetchNewsDetails(newsIds, derechos);
        const csv = convertToCSV(data);
        downloadCSV(csv);
    };

    const fetchNewsDetails = async (ids: string[], rights: string[]) => {
        const response = await fetch("http://localhost:8000/news/details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids, rights }),
        });

        const data = await response.json();
        return data;
    };

    const convertToCSV = (data: any[]) => {
        console.log(data);

        const header = ["headline", "content", "news_date", "detalles_derechos"];
        const rows = [];

        for (const item of data) {
            const baseInfo = [item.headline, item.content, item.news_date];

            let detalles = "";

            if (Array.isArray(item.filtered_analysis)) {
                detalles = item.filtered_analysis.map((analysis: any) => {
                    const derecho = analysis.derecho;
                    const cantidad = analysis.cantidad;
                    const lugares = (analysis.lugares || []).join("; ");
                    return lugares
                        ? `${derecho} (${cantidad}) - Lugares: ${lugares}`
                        : `${derecho} (${cantidad})`;
                }).join(" | "); // Puedes cambiar el separador si deseas
            }

            rows.push([...baseInfo, detalles]);
        }

        const csvContent = [header, ...rows].map(row =>
            row.map(cell =>
                `"${String(cell).replace(/"/g, '""')}"` // Escapar comillas para CSV correcto
            ).join(",")
        ).join("\n");

        return csvContent;
    };

    const downloadCSV = (csvContent: string, filename = "reporte.csv") => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full p-8 flex flex-col text-center">
            <div className="flex flex-col items-center">
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                {
                    loadingHeatmap
                        ?
                        <>
                            <p className="text-2xl font-bold">Cargando resultados...</p>
                            <p className="text-xl">Por favor, espere, no recargue y no cierre esta página mientras se procesa el monitoreo</p>
                            {getDataError ?
                                <ReturnButton /> : ""}
                        </>
                        :
                        <>
                            <HeatmapChart resultados={results} />
                            <MapView resultados={results} />
                            <button
                                className="w-max my-4 px-8 py-2 bg-[#183555] text-white rounded-md cursor-pointer"
                                onClick={downloadCsv}
                            >
                                DESCARGAR CSV
                            </button>
                            <ReturnButton />
                        </>
                }
            </div>

        </div>
    )
}
