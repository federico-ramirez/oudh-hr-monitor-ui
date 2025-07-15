import UserPromptInput from '../../components/UserPromptInput/UserPromptInput'

export default function Home() {
    return (
        <>
            <main className='flex h-10/12 md:w-10/12 max-w-[1200px] mx-auto items-center bg-cadet-blue'>
                <div className='w-full p-4'>
                    <div className='w-full max-w-[650px] m-auto text-center text-black'>
                        <h2 className='text-2xl font-semibold text-oudh-blue'>¡Bienvenido!</h2>
                        <h3 className='text-2xl font-semibold text-oudh-blue'>Soy tu asistente de monitoreo de Derechos Humanos</h3>
                        <p className='my-4 font-medium'>Para empezar el monitoreo, por favor selecciona o escribe una o varias temáticas para poder analizarlas</p>
                    </div>
                    <UserPromptInput />
                    <p className='w-full text-center text-arsenic font-light text-xs mt-4'>Powered by Gemma2:9b</p>
                </div>
            </main>
        </>
    )
}
