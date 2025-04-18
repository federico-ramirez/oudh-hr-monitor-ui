import UserPromptInput from '../../components/UserPromptInput/UserPromptInput'

export default function Home() {
    return (
        <>
            <main className='flex h-10/12 max-w-[1200px] mx-auto bg-cadet-blue'>
                <div className='w-full p-4 md:p-8'>
                    <div className='w-full max-w-[650px] m-auto text-center text-black'>
                        <h2 className='text-2xl font-semibold'>¡Bienvenido!</h2>
                        <h3 className='text-2xl font-semibold'>Soy tu asistente de monitoreo de Derechos Humanos</h3>
                        <p className='my-4'>Para empezar el monitoreo, por favor escribe el tema en el que tengas interés y sube el archivo para poder analizarlo</p>
                    </div>
                    <UserPromptInput />
                    <p className='w-full text-center text-arsenic font-light text-xs mt-4'>Powered by Gemma3:9b</p>
                </div>
            </main>
        </>
    )
}
