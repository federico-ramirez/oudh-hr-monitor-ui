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
                    fechas: ["2022-05-15", "2022-05-16", "2022-05-17", "2022-05-18", "2022-05-19"],
                    derechos: ["vida", "salud", "vivienda", "educación"],
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