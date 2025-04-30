const BASE_URL = "http://localhost:8000";

export const ApiServices = {
    localizeNews: async () => {
        try {
            const response = await fetch(`${BASE_URL}/localizar`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fechas: ["2022-05-16", "2022-05-17"],
                    derechos: ["vida", "salud", "vivienda"],
                })
            })
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error al consultar la API:", error);
            return [];
        }
    },
    monitorNews: async () => {
        try {
            const response = await fetch(`${BASE_URL}/monitorear`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fechas: ["2022-05-16", "2022-05-17"],
                })
            })
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error al consultar la API:", error);
            return [];
        }
    }
}