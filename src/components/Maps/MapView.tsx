import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import departamentosGeoJSONData from '../../utils/departamentos-geoJSONData'
import distritosGeoJSONData from '../../utils/distritos-geoJSONData'
import { FeatureCollection } from 'geojson'

interface MapViewProps {
    resultados: {
        fecha: string,
        conteo: {
            derecho: string,
            cantidad: number,
            lugares: string[],
        }[]
    }[]
}

export default function MapView({ resultados }: MapViewProps) {
    const resultadosSet = resultados

    const resultadosLugaresSet = new Set(
        resultadosSet
            .flatMap(entry => entry.conteo) 
            .filter(item => item.lugares !== undefined)
            .flatMap(item =>
                item.lugares.map(lugar => 
                    lugar.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
                )
            )
    );

    const filteredFeatures = distritosGeoJSONData.features.filter(feature => {
        const shapeName = feature.properties?.shapeName;
        if (!shapeName) return false;

        const normalizedShapeName = shapeName
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        return resultadosLugaresSet.has(normalizedShapeName);
    });

    const filteredGeoJSON: FeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures
    };

    const lugarToDerechoMap = new Map<string, string[]>();
    resultadosSet.forEach(entry => {
        entry.conteo.forEach(item => {
            item.lugares.forEach(lugar => {
                const normalizedLugar = lugar
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

                if (!lugarToDerechoMap.has(normalizedLugar)) {
                    lugarToDerechoMap.set(normalizedLugar, []);
                }
                lugarToDerechoMap.get(normalizedLugar)?.push(item.derecho);
            })
        })
    });

    return (
        filteredFeatures.length === 0 ?
            <div className='w-full max-w-[1000px] max-h-[700px] p-8'>
                <h1 className='text-center p-2 font-medium'>Mapa geográfico</h1>
                <h3 className='text-center p-2 font-medium'>No se encontraron lugares de El Salvador en las noticias monitoreadas.</h3>
                <MapContainer
                    center={[13.75135, -88.91741]}
                    zoom={9}
                    scrollWheelZoom={false}
                    className='w-[350px] h-[275px] md:w-[700px] md:h-[500px] lg:w-[900px] lg:h-[585px] mx-auto rounded-lg border border-gray-5 00'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON data={departamentosGeoJSONData} />
                </MapContainer>
            </div> :
            <div className='w-full max-w-[1000px] max-h-[700px] p-8'>
                <h1 className='text-center p-2 font-medium'>Mapa geográfico</h1>
                <MapContainer
                    center={[13.75135, -88.91741]}
                    zoom={9}
                    scrollWheelZoom={false}
                    className='w-[350px] h-[275px] md:w-[700px] md:h-[500px] lg:w-[900px] lg:h-[585px] mx-auto rounded-lg border border-gray-5 00'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredGeoJSON.features.map((feature, index) => {
                        let position: [number, number] | null = null;

                        if (feature.geometry.type === 'Polygon') {
                            const coords = feature.geometry.coordinates[0][0];
                            position = [coords[1], coords[0]];
                        } else if (feature.geometry.type === 'MultiPolygon') {
                            const coords = feature.geometry.coordinates[0][0][0];
                            position = [coords[1], coords[0]];
                        }

                        return position ? (
                            <Marker key={index} position={position}>
                                <Popup>
                                    Derecho(s): 
                                    <b>
                                        {
                                            (() => {
                                                const shapeName = feature.properties?.shapeName;
                                                const normalizedeShapeName = shapeName
                                                ?.normalize("NFD")
                                                .replace(/[\u0300-\u036f]/g, "")
                                                .toLowerCase();

                                                const derechos = normalizedeShapeName ?
                                                lugarToDerechoMap.get(normalizedeShapeName) : null;

                                                return derechos?.length ? " " + derechos.join(", ")+" detectado(s) en "+shapeName : "Sin información";
                                            })()
                                        }
                                    </b>
                                </Popup>
                            </Marker>
                        ) : null;
                    })}
                    <GeoJSON data={departamentosGeoJSONData} />
                </MapContainer>
            </div>
    )
}