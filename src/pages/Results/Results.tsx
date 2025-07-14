import { useEffect } from "react";
import HeatmapChart from "../../components/Maps/Heatmap";
import MapView from "../../components/Maps/MapView";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ReturnButton } from "../../components/Buttons/ReturnButton";
import { useNewsClassification } from "../../hooks/useNewsClassification";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={150}
                thickness={7}
                sx={{ color: '#d5d5d5', position: 'absolute', left: 0, strokeLinecap: 'round' }}
            />
            <CircularProgress
                variant="determinate"
                {...props}
                size={150}
                thickness={7}
                sx={{ color: '#e7870d', strokeLinecap: 'round' }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="body1"
                    component="div"
                    sx={{ color: 'text.primary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function Results3() {
    const location = useLocation()
    const { fechas = [], derechos = [] } = location.state || { fechas: [], derechos: [] }

    const {
        loading,
        progress,
        progressMessage,
        progressStage,
        results,
        newsIds,
        type,
        error
    } = useNewsClassification(fechas, derechos);

    useEffect(() => {
        // Protección contra recarga de pestaña
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            toast("Por favor, no intente recargar la pestaña mientras se procesa el monitoreo.", { type: 'warning' });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
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
                }).join(" | ");
            }

            rows.push([...baseInfo, detalles]);
        }

        const csvContent = [header, ...rows].map(row =>
            row.map(cell =>
                `"${String(cell).replace(/"/g, '""')}"`
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
                    loading
                        ?
                        <div className="flex items-center justify-center self-center m-auto">
                            {!error ?
                                <div className="px-8 py-4 rounded-lg shadow-xl bg-gray-200 items-center w-fit">
                                    <p className="text-2xl font-bold mt-2 text-oudh-blue">Cargando resultados del monitoreo...</p>
                                    <p className="text-xl font-semibold mt-2">Etapa actual: {progressStage}</p>
                                    <p className="text-xl font-semibold mb-4">{progressMessage}</p>
                                    <CircularProgressWithLabel value={progress} className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80" />
                                    <p className="text-md mt-4">Espere mientras finaliza el monitoreo.</p>
                                    <p className="text-md mb-2">Por favor, no recargue y no cierre esta página.</p>
                                </div>
                                :
                                <div className="p-4 rounded-lg shadow-xl bg-orange-200">
                                    <p className="text-2xl font-bold my-4">Error en monitoreo</p>
                                    <p className="text-xl">Ocurrió un error mientras se realizaba el monitoreo.</p>
                                    <p className="text-xl">{progressMessage}</p>
                                    <p className="text-xl">Regrese al inicio e intente el monitoreo nuevamente.</p>
                                    <ReturnButton />
                                </div>
                            }
                        </div>
                        :
                        <>
                            {type === "result" ?
                                <>
                                    <HeatmapChart resultados={results} />
                                    <MapView resultados={results} />
                                    <button
                                        className="w-max my-4 h-12 px-8 bg-oudh-blue text-white rounded-md cursor-pointer font-semibold hover:bg-liberty-blue transition duration-200"
                                        onClick={downloadCsv}
                                    >
                                        Descargar CSV
                                    </button>
                                    <ReturnButton />
                                </> :
                                <div className="p-4 rounded-lg shadow-xl bg-gray-200">
                                    <p className="text-2xl font-bold my-4">Monitoreo sin resultados</p>
                                    <p className="text-xl">No se obtuvieron resultados con las fechas y temáticas utilizadas</p>
                                    <p className="text-xl">Regrese al inicio y realice otro monitoreo con parámetros distintos.</p>
                                    <ReturnButton />
                                </div>
                            }
                        </>
                }
            </div>

        </div>
    )
}