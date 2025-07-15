const BASE_URL = "http://localhost:8000";

export const ApiServices = {
    classifyNews: async (dates: string[], rights: string[], signal: any) => {
        try {
            const response = await fetch(`${BASE_URL}/news/process`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dates: dates,
                    rights: rights,
                }),
                signal,
            });

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Error al consultar la API:", error);
            return [];
        }
    },
    getHumanRightsValues: async () => {
        try {
            const response = await fetch(`${BASE_URL}/rights`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al consultar la API: ", error);
            return [];
        }
    } 
}