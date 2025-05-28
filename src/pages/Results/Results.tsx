import { useEffect, useState } from "react";
import HeatmapChart from "../../components/Maps/Heatmap";
import { ApiServices } from "../../services/api.service";
import MapView from "../../components/Maps/MapView";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function Results() {
    const location = useLocation()
    const { fechas = [], derechos = [] } = location.state || { fechas: [], derechos: [] }
    const [loadingHeatmap, setLoadingHeatmap] = useState(true);
    const [getDataError, setGetDataError] = useState(false);

    const [results, setResults] = useState<any[]>([]);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('../');
    }

    const getHeatmapData = async () => {
        setLoadingHeatmap(true);
        try {
            const data = await ApiServices.classifyNews(fechas, derechos);
            console.log(data)
            if (data.resultados.length > 0) {
                setResults(data.resultados);
    
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
                                <button
                                onClick={handleClick}
                                className="bg-arsenic text-french-gray font-bold w-max h-12 px-8 rounded-lg hover:bg-davy-gray transition duration-200 mt-8">
                                Volver a intentar
                            </button> : ""}
                        </>
                        :
                        <>
                            <p className="text-2xl font-bold">Cantidad de noticias por derecho</p>
                            <HeatmapChart resultados={results} />
                            <MapView resultados={results} />
                            <button
                                onClick={handleClick}
                                className="bg-arsenic text-french-gray font-bold w-max h-12 px-8 rounded-lg hover:bg-davy-gray transition duration-200 mt-8">
                                Volver al inicio
                            </button>
                        </>
                }
            </div>

        </div>
    )
}
