import Heatmap2 from "../../components/Maps/Heatmap2";

export default function Results2() {
    return (
        <div className="w-full p-8 flex flex-col">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-bold">Cantidad de noticias por derecho</p>

                <Heatmap2 />
            </div>

        </div>
    )
}
