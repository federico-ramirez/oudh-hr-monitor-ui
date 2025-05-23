import { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import { FeatureCollection } from 'geojson'
import { ExportButton } from '../Buttons/ExportButton';
import { useDownloadMenu } from '../../hooks/useDownloadMenu';
import { AvailableImageFormatToExport } from '../../types/types'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image';
import departamentosGeoJSONData from '../../utils/departamentos-geoJSONData'
import distritosGeoJSONData from '../../utils/distritos-geoJSONData'
import 'leaflet/dist/leaflet.css'

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
    const mapaRef = useRef<HTMLDivElement>(null);

    const { openDownloadMenu, toggleOpenDownloadMenu } = useDownloadMenu();

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

    const exportToPdf = () => {
        if (!mapaRef.current) {
            console.error('Mapa no cargado');
            return;
        }

        domtoimage.toPng(mapaRef.current)
            .then((dataUrl) => {
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4',
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const centerX = pageWidth / 2; // X coordinate to center texts

                const img = new Image();
                img.onload = () => {
                    let yOffset = 15; // Initial spacing from the top border of the page

                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(16);
                    pdf.text('Ubicación geográfica de los hechos', centerX, yOffset, { align: 'center' });

                    yOffset += 5; // Add some space after the title

                    pdf.addImage(dataUrl, 'PNG', 10, yOffset, pageWidth - 20, pageHeight - 40);
                    pdf.save('mapa.pdf');
                };
                img.src = dataUrl;
            })
            .catch((error) => {
                console.error('Error generando imagen:', error);
            });
    };

    const exportToImage = (type: AvailableImageFormatToExport) => {
        if (!mapaRef.current) return;

        const toImage = type === 'png' ? domtoimage.toPng : domtoimage.toJpeg;
        const options = type === 'jpg' ? { quality: 0.95 } : undefined;

        toImage(mapaRef.current, options)
            .then((dataUrl: string) => {
                const link = document.createElement('a');
                link.download = `mapa.${type}`;
                link.href = dataUrl;
                link.click();
            })
            .catch((error: any) => console.error(`Error exportando ${type.toUpperCase()}:`, error));
    };

    return (
        <div className="w-full px-8 pt-8 flex flex-col items-center gap-4">
            <div className="w-full relative flex justify-center">
                <p className="text-2xl font-bold">Ubicación geográfica de los hechos</p>

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

            <div className='w-full max-w-[1000px] max-h-[700px] flex flex-col items-center gap-4'>
                {
                    filteredFeatures.length === 0 &&
                    <h2 className='text-center p-2 font-medium'>No se encontraron lugares de El Salvador en las noticias monitoreadas</h2>
                }

                <div id='map-container' ref={mapaRef}>
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

                                                    return derechos?.length ? " " + derechos.join(", ") + " detectado(s) en " + shapeName : "Sin información";
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

            </div>
        </div>
    )
}