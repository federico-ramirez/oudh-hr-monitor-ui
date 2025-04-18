export default function UserPromptInput() {
    return (
        <div className="grid grid-rows-1 md:flex md:flex-row gap-2 m-auto py-4">
            <div className='flex flex-col md:w-6/12 gap-2'>
                <label htmlFor="" className="text-sm text-arsenic">
                    Seleccione una temática
                </label>
                <select
                    name="hr-topics"
                    id="hr-topics"
                    className='h-12 px-4 bg-white rounded-xl focus:outline-indigo-900'
                    defaultValue=""
                >
                    <option value="1">Derecho a la vida</option>
                    <option value="1">Derecho a la salud</option>
                </select>
            </div>
            <div className='flex flex-col md:w-4/12 gap-2'>
                <label htmlFor="" className="text-sm text-arsenic">
                    Seleccione una fecha
                </label>
                <input
                    name="hr-topics"
                    id="hr-topics"
                    className='h-12 px-4 bg-white rounded-xl focus:outline-indigo-900'
                    type='date'
                >
                </input>
            </div>
            <div className='flex flex-col md:w-2/12 gap-2 items-center justify-end'>
                <button className="bg-arsenic text-french-gray font-bold w-full h-12 rounded-xl hover:bg-davy-gray hover:duration-200">
                    Monitorear
                </button>
            </div>
        </div>
    )
}
