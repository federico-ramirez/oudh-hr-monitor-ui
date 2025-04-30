import { useEffect, useState } from 'react'
import MapView from '../../components/Maps/MapView'
import { ApiServices } from '../../services/api.service'

export default function Map() {
    const [resultados, setResultados] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getMapData = async () => {
        setIsLoading(true)
        const data = await ApiServices.localizeNews()
        //console.log(data.resultados)
        setResultados(data.resultados)
        setIsLoading(false)
    }

    const getMonitorData = async () => {
        setIsLoading(true)
        const data = await ApiServices.monitorNews()
        console.log(data.resultados)
        //setResultados(data.resultados)
        setIsLoading(false)
    }

    useEffect(() => {
        //getMapData(),
        getMonitorData()
    }, [])
    return (
        <div className='flex flex-col items-center mx-auto'>
            <h1 className='text-arsenic font-bold text-2xl py-4'>Mapa de resultados</h1>
            {isLoading ? <p>Cargando mapa...</p>
            : <MapView resultados={resultados} />}
        </div>
    )
}
