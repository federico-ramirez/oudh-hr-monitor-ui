import { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON, Circle, FeatureGroup } from 'react-leaflet'
import { ExportButton } from '../Buttons/ExportButton';
import { useDownloadMenu } from '../../hooks/useDownloadMenu';
import { AvailableImageFormatToExport } from '../../types/types'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image';
import departamentosGeoJSONData from '../../utils/departamentos-geoJSONData'
import distritosCoordinatesData from '../../utils/distritosCoordinatesData';
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
};

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
                    lugar.normalize("NFD").replace(/[\u0300-\u036f]/g, "")//.toLowerCase()
                )
            )
    );

    const filteredDistricts = distritosCoordinatesData.filter(district => {
        const districtValue = district.distrito;
        if (!districtValue) return false;

        const normalizedDistrictValue = districtValue
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        //.toLowerCase();
        return resultadosLugaresSet.has(normalizedDistrictValue);
    });

    const lugarToDerechoMap = new Map<string, { derecho: string, fecha: string }[]>();
    resultadosSet?.forEach(entry => {
        entry.conteo?.forEach(item => {
            item.lugares?.forEach(lugar => {
                const normalizedLugar = lugar
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                if (!lugarToDerechoMap.has(normalizedLugar)) {
                    lugarToDerechoMap.set(normalizedLugar, []);
                }
                lugarToDerechoMap.get(normalizedLugar)?.push({
                    derecho: item.derecho,
                    fecha: entry.fecha
                });
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
                <p className="text-2xl font-bold text-oudh-blue">Ubicación geográfica de los hechos</p>

                <div className="absolute right-6">
                    <div className="relative inline-block text-left">
                        {
                            filteredDistricts.length > 0 ?
                                <ExportButton
                                    openDownloadMenu={openDownloadMenu}
                                    toggleOpenDownloadMenu={toggleOpenDownloadMenu}
                                    exportToPdf={exportToPdf}
                                    exportToImage={exportToImage}
                                />
                                : <></>
                        }
                    </div>
                </div>
            </div>

            <div className='w-full max-w-[1000px] max-h-[700px] flex flex-col items-center gap-4'>
                {filteredDistricts.length > 0 ?
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
                            {filteredDistricts.map((district, index) => {
                                const position = district.position as [number, number];

                                return position ? (
                                    <FeatureGroup key={index}>
                                        <Marker position={position}>
                                            <Popup
                                                autoClose={false}
                                                closeOnClick={false}
                                            >
                                                <span className='text-indigo-950 inter-font'>
                                                    {
                                                        (() => {
                                                            const distrito = district.distrito;
                                                            const normalizedeShapeName = distrito
                                                                ?.normalize("NFD")
                                                                .replace(/[\u0300-\u036f]/g, "")
                                                                .toLowerCase();

                                                            const entries = normalizedeShapeName
                                                                ? lugarToDerechoMap.get(normalizedeShapeName)
                                                                : null;

                                                            if (!entries?.length) return <span>Sin información</span>

                                                            const fechasByDerecho = entries.reduce((acc, { fecha, derecho }) => {
                                                                if (!acc[derecho]) acc[derecho] = new Set();
                                                                acc[derecho].add(fecha);
                                                                return acc;
                                                            }, {} as Record<string, Set<string>>);

                                                            function capitalizeFirstLetter(word: string) {
                                                                if (!word) return '';
                                                                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                                            }

                                                            const formattedFechas = Object.entries(fechasByDerecho).map(
                                                                ([derecho, fechas]) => `${capitalizeFirstLetter(derecho)} en la(s) fecha(s): ${Array.from(fechas).join(", ")}`
                                                            );

                                                            return (
                                                                <>
                                                                    <span>Derecho(s) detectado(s):</span>
                                                                    <br />
                                                                    <ol className='font-semibold list-decimal list-inside'>
                                                                        {formattedFechas.map((line, i) => (
                                                                            <li key={i}>{line}</li>
                                                                        ))}
                                                                    </ol>
                                                                    Ubicación: <span className='font-semibold'> {district.distrito+", "+district.municipio+", "+district.departamento} </span>
                                                                </>
                                                            );
                                                        })()
                                                    }
                                                </span>
                                            </Popup>
                                        </Marker>
                                        <Circle center={position} radius={2500} pathOptions={{ color: "#f55505" }} />
                                    </FeatureGroup>
                                ) : null;
                            })}
                            <GeoJSON data={departamentosGeoJSONData} style={{ color: "#28366A" }} />
                        </MapContainer>
                    </div>
                    :
                    <h2 className='text-center p-2'>No se encontraron lugares de El Salvador en las noticias monitoreadas.</h2>
                }
            </div>
        </div >
    )
}