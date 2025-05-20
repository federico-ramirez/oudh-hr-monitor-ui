export default function UserPromptInput() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 py-4 w-full mx-auto">
            <div className="flex flex-col lg:w-6/12">
                <label className="text-sm text-arsenic mb-1">
                    Seleccione una temática
                </label>
                <select
                    name="hr-topics"
                    id="hr-topics"
                    className="h-12 px-4 bg-white rounded-xl focus:outline-indigo-900"
                    defaultValue=""
                >
                    <option value="1">Derecho a la vida</option>
                    <option value="2">Derecho a la salud</option>
                </select>
            </div>
            <div className="flex flex-col lg:w-2/12">
                <label className="text-sm text-arsenic mb-1">
                    Seleccione una fecha inicial
                </label>
                <input
                    type="date"
                    className="h-12 px-4 bg-white rounded-xl focus:outline-indigo-900"
                />
            </div>
            <div className="flex flex-col lg:w-2/12">
                <label className="text-sm text-arsenic mb-1">
                    Seleccione una fecha final
                </label>
                <input
                    type="date"
                    className="h-12 px-4 bg-white rounded-xl focus:outline-indigo-900"
                />
            </div>
            <div className="flex lg:w-2/12">
                <button className="bg-arsenic text-french-gray font-bold w-full h-12 rounded-xl hover:bg-davy-gray transition duration-200 mt-6 md:mt-0">
                    Monitorear
                </button>
            </div>
        </div>

    )
}
