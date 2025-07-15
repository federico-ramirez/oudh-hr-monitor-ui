import { useNavigate } from 'react-router-dom';

export const ReturnButton = () => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('../');
    }

    return (
        <>
            <button
                className="bg-arsenic text-white font-bold w-max h-12 px-8 rounded-lg hover:bg-davy-gray transition duration-200 mt-8"
                onClick={handleClick}>
                Volver al inicio
            </button>
        </>
    )
}
