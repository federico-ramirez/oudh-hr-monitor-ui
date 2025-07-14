import { FaCaretDown } from 'react-icons/fa';
import { AvailableImageFormatToExport } from '../../types/types';

export const ExportButton = (
    {  
        openDownloadMenu, 
        toggleOpenDownloadMenu,
        exportToPdf,
        exportToImage
    }:     
    { 
        openDownloadMenu: boolean, 
        toggleOpenDownloadMenu: () => void,
        exportToPdf: () => void,
        exportToImage: (type: AvailableImageFormatToExport) => void 
    }
) => {
    const handleClickOption = (callback: () => void) => {
        toggleOpenDownloadMenu();
        callback();
    }

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={toggleOpenDownloadMenu}
                className="bg-[#183555] text-white cursor-pointer font-bold py-2 px-5 flex items-center rounded-md gap-3 hover:bg-[#265588]"
            >
                Exportar
                <FaCaretDown className="text-[22px]" />
            </button>

            {openDownloadMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-[#183555] text-white z-20 logo-card text-mid font-semibold overflow-hidden">
                    <button
                        className="w-full block px-4 py-2 border-b border-tertiary hover:bg-[#1a4775] cursor-pointer"
                        onClick={() => handleClickOption(exportToPdf)}
                    >
                        PDF
                    </button>
                    <button
                        className="w-full block px-4 py-2 border-b border-tertiary hover:bg-[#1a4775] cursor-pointer"
                        onClick={() => handleClickOption(() => exportToImage("png"))}
                    >
                        PNG
                    </button>  
                    <button
                        className="w-full block px-4 py-2 hover:bg-[#1a4775] cursor-pointer"
                        onClick={() => handleClickOption(() => exportToImage("jpg"))}
                    >
                        JPG
                    </button>
                </div>
            )}
        </div>
    )
}
