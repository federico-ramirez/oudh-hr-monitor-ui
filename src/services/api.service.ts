const BASE_URL = "http://localhost:8000";

export const ApiServices = {
    classifyNews: async () => {
        try {
            const response = await fetch(`${BASE_URL}/procesar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fechas: ["2022-05-16", "2022-05-17"],
                    derechos: ["vida", "salud", "vivienda"],
                }),
            });

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error al consultar la API:", error);
            return [];
        }
    }
}