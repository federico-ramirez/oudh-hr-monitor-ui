import { useState } from "react";
import AsyncSelect from "react-select/async"
import { MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";

type OptionType = {
    value: string;
    label: string;
}

export default function UserPromptInput() {
    const [derechosSeleccionados, setDerechosSeleccionados] = useState<MultiValue<OptionType>>([])

    const humanRightsOptions = [
        { value: "vida", label: "Derecho a la vida" },
        { value: "salud", label: "Derecho a la salud" },
        { value: "vivienda", label: "Derecho a la vivienda" },
        { value: "educación", label: "Derecho a la educación" }
    ]

    const loadSelectOptions = (searchValue: string, callback: any) => {
        setTimeout(() => {
            const filteredOptions = humanRightsOptions.filter((option) => 
                option.label
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
            callback(filteredOptions);
        }, 100);
    }

    const navigate = useNavigate()

    const handleClick = () => {
        const derechos: string[] = derechosSeleccionados.map(option => option.value)

        navigate('./results', {
            state: {
                derechos
            },
        });
    }

    return (
        <div className="flex flex-col lg:flex-wrap lg:flex-row w-full mx-auto">
            <div className="flex flex-col lg:w-6/12 p-2">
                <label className="text-sm font-semilight text-arsenic mb-1">
                    Seleccione una fecha inicial
                </label>
                <input
                    type="date"
                    className="h-10 px-4 bg-white rounded-sm focus:outline-indigo-900"
                />
            </div>
            <div className="flex flex-col lg:w-6/12 p-2">
                <label className="text-sm font-semilight text-arsenic mb-1">
                    Seleccione una fecha final
                </label>
                <input
                    type="date"
                    className="h-10 px-4 bg-white rounded-sm focus:outline-indigo-900"
                />
            </div>
            <div id="select" className="flex flex-col w-full p-2">
                <label className="text-sm font-semilight text-arsenic mb-1">
                    Ingrese una o varias temáticas de su interés para monitorear
                </label>
                <AsyncSelect
                    loadOptions={loadSelectOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={(selectedOptions) => {
                        setDerechosSeleccionados(selectedOptions)
                    }}
                    defaultOptions={humanRightsOptions}
                />
            </div>
            <div className="flex flex-col w-full lg:w-4/12 lg:mx-auto p-2">
                <button 
                    onClick={handleClick}
                    className="bg-arsenic text-french-gray font-bold w-full h-12 rounded-lg hover:bg-davy-gray transition duration-200 mt-6 md:mt-0">
                    Monitorear
                </button>
            </div>
        </div>

    )
}
