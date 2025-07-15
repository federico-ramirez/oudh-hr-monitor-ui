import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const useNewsClassification = (dates: string[], rights: string[]) => {
    const [progress, setProgress] = useState<number>(0);
    const [progressMessage, setProgressMessage] = useState<string>("");
    const [progressStage, setProgressStage] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);
    const [newsIds, setNewsIds] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [type, setType] = useState<string>("");

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(false);

        const socket = new WebSocket("ws://127.0.0.1:8000/news/ws/process");
        wsRef.current = socket;

        const payload = {
            action: "classifyNews",
            dates,
            rights,
        };

        socket.onopen = () => {
            socket.send(
                JSON.stringify(payload)
            );
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "progress") {
                setProgress(data.progreso);
                setProgressMessage(data.message);
                setProgressStage(data.etapa);
            }

            if (data.type === "result") {
                setType("result")
                setResults(data.resultados);
                setNewsIds(data.noticias);
                setLoading(false);
                setError(false);
                toast("Monitoreo finalizado exitosamente.", { type: "success" })
                socket.close();
            }

            if (data.type === "warning") {
                toast(data.message, { type: "info" })
                console.log(data.message)
            }

            if (data.type === "error") {
                setType("error")
                setError(true);
                setLoading(false);
                console.error(data.message);
                toast(data.message, { type: "error" })
                socket.close();
            }
        };

        socket.onerror = () => {
            setError(true);
            setLoading(false);
        };

        return () => {
            socket.close();
        };
    }, [dates, rights]);

    return {
        loading,
        progress,
        progressMessage,
        progressStage,
        results,
        newsIds,
        type,
        error,
    };
}