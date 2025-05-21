import Heatmap from "../../components/Maps/Heatmap";
import MapView from "../../components/Maps/MapView";

const results = [
		{
			"fecha": "2022-05-16",
			"conteo": [
				{
					"derecho": "vida",
					"cantidad": 2,
					"lugares": [
						"Antiguo Cuscatlán",
						"Zaragoza"
					]
				},
				{
					"derecho": "salud",
					"cantidad": 0,
					"lugares": []
				},
				{
					"derecho": "vivienda",
					"cantidad": 0,
					"lugares": []
				}
			]
		}
	]

export default function Results2() {
    return (
        <div className="w-full p-8 flex flex-col">
            <div className="flex flex-col items-center">
                <p className="text-2xl font-bold">Cantidad de noticias por derecho</p>

                <Heatmap resultados={results} />
                <MapView resultados={results} />
            </div>

        </div>
    )
}
