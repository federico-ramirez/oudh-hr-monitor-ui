import { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import departamentosGeoJSONData from '../../helpers/departamentos-geoJSONData'
import distritosGeoJSONData from '../../helpers/distritos-geoJSONData'
import { FeatureCollection } from 'geojson'

interface Resultados {
  derecho: string,
  conteo: [
    {
      derecho: string,
      lugar: string,
    }
  ]
  lugar: string
}

interface MapViewProps {
  resultados: any[]
}

export default function MapView({ resultados }: MapViewProps) {
  //const mapRef = useRef(0)
  const responseDistricts: Resultados[] = resultados;
  //console.log(responseDistricts)

  const resultadosLugarSet = new Set(
    responseDistricts
      .flatMap(entry => entry.conteo) // flatten conteo arrays
      .filter(item => item.lugar !== undefined)
      .map(item =>
        item.lugar!.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      )
  );
  //console.log(resultadosLugarSet)

  /*const resultadosLugarSet = new Set(
    responseDistricts.map(d => d.lugar.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
  );*/

  const filteredFeatures = distritosGeoJSONData.features.filter(feature => {
    const shapeName = feature.properties?.shapeName;
    if (!shapeName) return false;

    const normalizedShapeName = shapeName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return resultadosLugarSet.has(normalizedShapeName);
  });
  //console.log(filteredFeatures)

  const filteredGeoJSON: FeatureCollection = {
    type: "FeatureCollection",
    features: filteredFeatures
  };
  //console.log(filteredGeoJSON)

  return (
    <div className='w-full max-w-[1000px] max-h-[700px] pb-8'>
      <MapContainer
        center={[13.75135, -88.91741]}
        zoom={9}
        scrollWheelZoom={false}
        //ref={mapRef}
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
                {feature.properties?.shapeName}
              </Popup>
            </Marker>
          ) : null;
        })}
        <GeoJSON data={departamentosGeoJSONData} />
        {/*<GeoJSON data={filteredGeoJSON} />*/}
      </MapContainer>
    </div>
  )
}
