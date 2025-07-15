import Heatmap from "../../components/Maps/Heatmap";
import MapView from "../../components/Maps/MapView";

const dummyResults = [
    {
        "fecha": "2022-03-09",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 12,
                "lugares": [
					"Tamanique", "Atiquizaya", "San Lorenzo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 11,
                "lugares": [
                    "San José Villanueva", "El Refugio", "San Salvador"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-10",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 6,
                "lugares": [
                    "Zaragoza", "Atiquizaya","San Fernando","San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 5,
                "lugares": [
                    "Turín", "Meanguera del Golfo", "San Vicente", "sociedad"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-11",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 14,
                "lugares": [
                    "Nuevo Edén de San Juan", "San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 8,
                "lugares": [
                    "Atiquizaya","Ojos de Agua", "San Alejo"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-12",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 4,
                "lugares": [
                    "Zaragoza", "Atiquizaya","San Fernando","San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 15,
                "lugares": [
                    "Turín", "Meanguera del Golfo", "San Vicente", "sociedad"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-13",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 7,
                "lugares": [
                    "Zaragoza", "Atiquizaya","San Fernando","San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 0,
                "lugares": [
                    "Turín", "Meanguera del Golfo", "San Vicente", "sociedad"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-14",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 6,
                "lugares": [
                    "Zaragoza", "Atiquizaya","San Fernando","San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 12,
                "lugares": [
                    "Turín", "Meanguera del Golfo", "San Vicente", "sociedad"
                ]
            }
        ]
    },
    {
        "fecha": "2022-03-15",
        "conteo": [
            {
                "derecho": "vida",
                "cantidad": 0,
                "lugares": [
                    "Zaragoza", "Atiquizaya","San Fernando","San Alejo"
                ]
            },
            {
                "derecho": "educación",
                "cantidad": 5,
                "lugares": [
                    ""
                ]
            }
        ]
    }
]

export default function Results2() {
	return (
		<div className="w-full py-8 flex flex-col gap-4">
			<Heatmap resultados={dummyResults} />

			<hr></hr>

			<MapView resultados={dummyResults} />
		</div>
	)
}
