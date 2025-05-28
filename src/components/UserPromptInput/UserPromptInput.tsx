import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async"
import { MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
import MyDate from "../../helpers/dateHelper";
import { toast, ToastContainer } from "react-toastify";
import { ApiServices } from "../../services/api.service";

type OptionType = {
    value: string;
    label: string;
}

type ResponseProps = {
    right: string,
    id_right: string,
    order: number
}

export default function UserPromptInput() {
    const hoy = new Date();
    const minDate = new Date(2000, 0, 1)
    const [fechaInicial, setFechaInicial] = useState<Date>(new Date())
    const [fechaFinal, setFechaFinal] = useState<Date>(new Date())
    const [sabadoPasado, setSabadoPasado] = useState<Date | null>(null)
    const [derechosSeleccionados, setDerechosSeleccionados] = useState<MultiValue<OptionType>>([])
    const [humanRightsOptions, setHumanRightsOptions] = useState<MultiValue<OptionType>>([])

    const fetchHumanRightsData = async () => {
        try {
            const response = await ApiServices.getHumanRightsValues();
            const values = response.map((item: any) => ({
                value: item.right,
                label: item.right,
            }));
            setHumanRightsOptions(values);
        } catch (error) {
            console.error("Error obteniendo valores para Derechos Humanos");
        }
    }

    useEffect(() => {
        fetchHumanRightsData();
        const semanaPasada = new Date(hoy);
        semanaPasada.setDate(hoy.getDate() - 7);

        const domingoPasado = new Date(semanaPasada);
        domingoPasado.setDate(semanaPasada.getDate() - semanaPasada.getDay());

        const sabadoPasado = new Date(domingoPasado);
        sabadoPasado.setDate(domingoPasado.getDate() + 6);

        setSabadoPasado(sabadoPasado);
        setFechaInicial(domingoPasado);
        setFechaFinal(sabadoPasado);
    }, []);

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

    const formatDateForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseLocalDate = (value: string): Date => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleChangeFechaInicial = (value: string) => {
        const newFechaInicial = parseLocalDate(value);
        if (newFechaInicial < minDate) {
            return false
        }
        if (fechaFinal && newFechaInicial > fechaFinal) {
            toast("La fecha inicial no puede ser mayor que la fecha final.", { type: 'error' });
            return false;
        }
        setFechaInicial(newFechaInicial);
        return true;
    };

    const handleChangeFechaFinal = (value: string) => {
        const newFechaFinal = parseLocalDate(value);
        if (newFechaFinal < minDate) {
            return false
        }
        if (fechaInicial && newFechaFinal < fechaInicial) {
            toast("La fecha final no puede ser menor que la fecha inicial.", { type: 'error' });
            return false;
        }
        setFechaFinal(newFechaFinal);
        return true;
    };

    function formatDateToYMD(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const navigate = useNavigate()

    const handleClick = () => {
        if (isNaN(fechaInicial.getTime()) || isNaN(fechaFinal.getTime())) {
            toast("La(s) fecha(s) ingresada(s) no tiene(n) el formato correcto.", { type: 'error' });
            return
        }
        if (derechosSeleccionados.length > 0) {
            const md = new MyDate();
            const daysBetween: Date[] = md.getDates(fechaInicial, fechaFinal);
            const fechas: string[] = daysBetween.map(formatDateToYMD);
            const derechos: string[] = derechosSeleccionados.map(option => option.value)

            navigate('./results', {
                state: {
                    fechas,
                    derechos
                },
            });
        } else {
            toast("Debe seleccionar una o más temáticas.", { type: 'error' })
        }
    }

    return (
        <div className="flex flex-col lg:flex-wrap lg:flex-row w-full mx-auto">
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="flex flex-col lg:w-6/12 p-2">
                <label className="text-sm font-semilight text-arsenic mb-1">
                    Seleccione una fecha inicial
                </label>
                <input
                    type="date"
                    value={fechaInicial ? formatDateForInput(fechaInicial) : ''}
                    max={sabadoPasado ? formatDateForInput(sabadoPasado) : undefined}
                    min={formatDateForInput(minDate)}
                    onChange={(e) => {
                        const localDate = parseLocalDate(e.target.value)
                        handleChangeFechaInicial(e.target.value) ?
                            setFechaInicial(localDate) : setFechaInicial(fechaInicial)
                    }}
                    className="h-10 px-4 bg-white rounded-sm focus:outline-indigo-900"
                />
            </div>
            <div className="flex flex-col lg:w-6/12 p-2">
                <label className="text-sm font-semilight text-arsenic mb-1">
                    Seleccione una fecha final
                </label>
                <input
                    type="date"
                    value={fechaFinal ? formatDateForInput(fechaFinal) : ''}
                    max={sabadoPasado ? formatDateForInput(sabadoPasado) : undefined}
                    onChange={(e) => {
                        const localDate = parseLocalDate(e.target.value)
                        handleChangeFechaFinal(e.target.value) ?
                            setFechaFinal(localDate) : setFechaFinal(fechaFinal)
                    }}
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
                    onChange={(selectedOption) => {
                        setDerechosSeleccionados(selectedOption)
                    }}
                    defaultOptions={humanRightsOptions}
                    placeholder={"Seleccione o escriba la(s) temática(s) de interés"}
                    maxMenuHeight={250}
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
