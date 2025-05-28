import { ReturnButton } from '../../components/Buttons/ReturnButton'

export default function NotFound() {
  return (
    <div className='text-center my-auto'>
        <h1 className='text-3xl font-extrabold text-indigo-950 p-4'>404 - Sitio no encontrado</h1>
        <h2 className='text-xl'>Lo sentimos, el sitio al que intentas accesar no existe.</h2>
        <ReturnButton />
    </div>
  )
}
