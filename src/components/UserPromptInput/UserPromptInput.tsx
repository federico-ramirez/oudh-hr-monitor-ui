import React, { useEffect, useRef, useState } from 'react'

export default function UserPromptInput() {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        autoResize();
    };

    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = textarea.scrollHeight + 'px'; 
        }
    };

    useEffect(() => {
        autoResize(); 
    }, []);

    return (
        <div className="w-full max-w-[850px] m-auto bg-french-gray px-6 py-3 rounded-3xl">
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleInput}
                    placeholder="¿Qué tema quieres monitorear?"
                    className="bg-transparent w-full min-h-12 max-h-28 md:max-h-52 text-black font-medium active:outline-none focus:outline-none resize-none overflow-x-auto rounded-lg p-2 transition-all duration-200 ease-in-out"
                    rows={1}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-2 gap-2">
                <button className="bg-french-gray border border-arsenic text-arsenic font-medium h-12 rounded-lg hover:bg-chinese-silver">
                    Cargar archivos
                </button>
                <button className="bg-french-gray text-arsenic lg:col-span-2 h-12">
                    Razonamiento
                </button>
                <button className="bg-arsenic text-french-gray font-bold h-12 rounded-lg hover:bg-davy-gray">
                    Monitorear
                </button>
            </div>
        </div>
    )
}
