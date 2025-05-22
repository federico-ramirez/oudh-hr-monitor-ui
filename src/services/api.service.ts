const BASE_URL = "http://localhost:8000";

export const ApiServices = {
    classifyNews: async (fechas: string[], derechos: string[]) => {
        try {
            const response = await fetch(`${BASE_URL}/procesar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fechas: fechas,
                    derechos: derechos,
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