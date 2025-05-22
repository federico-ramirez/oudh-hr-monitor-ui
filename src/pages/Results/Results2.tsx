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
		<div className="w-full py-8 flex flex-col gap-4">
			<Heatmap resultados={results} />

			<hr></hr>

			<MapView resultados={results} />
		</div>
	)
}
