declare module 'leaflet-image' {
  import * as L from 'leaflet';

  export default function leafletImage(
    map: L.Map,
    callback: (err: any, canvas: HTMLCanvasElement) => void
  ): void;
}
