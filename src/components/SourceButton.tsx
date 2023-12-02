import { useEffect, useState } from "react";
import Button from "./Button"
import { useQuery } from "@tanstack/react-query";
import ScrapeService from "../services/scrape.service";
import Card from "./Card";

const SourceButton: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [sources, setSources] = useState<string[]>([])

    const { data } = useQuery({
        queryKey: [
            "sources",
        ],
        queryFn: () => ScrapeService.scrape()
    })

    useEffect(() => {
        if (data) {
            setSources(data.data)
        }
    }, [data])
    return (
        <>
            <Button
                type="button"
                className="text-blue-500 bg-blue-100"
                onClick={() => setOpen((prev) => !prev)}
            >
                Source
            </Button>

            <div className={`fixed inset-0 bg-black/20 z-40 ${open ? "block" : "hidden"}`} onClick={() => setOpen(false)}></div>
            <div className={`fixed inset-0 w-full h-full z-50 ${open ? "block" : "hidden"}`}>
                <div className="flex items-center justify-center h-screen overflow-auto">
                    <Card className="w-2/3 overflow-auto">
                        <h1 className="mb-4 text-xl font-bold">
                            Select Sources
                        </h1>
                        <div className="flex flex-wrap flex-basis">
                            {sources.map((source, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    className={`w-48 m-1 ${localStorage.getItem("source") === source ? "bg-pink-100 text-pink-500" : "bg-blue-500"}`}
                                    onClick={() => {
                                        localStorage.setItem("source", source)
                                        window.location.reload()
                                    }}
                                >
                                    {source}
                                </Button>
                            ))}
                        </div>
                        <Button
                type="button"
                className="my-4 bg-red-500"
                onClick={() => setOpen((prev) => !prev)}
            >
                Close
            </Button>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default SourceButton;