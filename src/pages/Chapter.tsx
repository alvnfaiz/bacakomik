import { useParams } from "react-router"
import GuestLayout from "../layouts/GuestLayout"
import { useEffect, useState } from "react"
import ScrapeService, { Manga } from "../services/scrape.service"
import { useQueries } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Loader } from "react-feather"
import Card from "../components/Card"
import Button from "../components/Button"
import {Link} from "react-router-dom";

const ChapterPage: React.FC = () => {
    const params = useParams()
    const [manga, setManga] = useState<Manga | null>(null)

    const { source, url, chapter } = params as { source: string, url: string, chapter: string }

    const datas = useQueries({
        queries: [
            {
                queryKey: [
                    "manga",
                    source,
                    url,
                ],
                queryFn: () => ScrapeService.detail({
                    source,
                    url
                })
            },
            {
                queryKey: [
                    "chapter",
                    source,
                    url,
                    chapter
                ],
                queryFn: () => ScrapeService.chapter({
                    source,
                    url: chapter
                })
            }
        ]
    })

    const { data: mangaData } = datas[0]
    const { data: chapterData, isLoading } = datas[1]

    useEffect(() => {
        if (mangaData) {
            setManga(mangaData.data)
        }
    }, [mangaData, chapterData])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen">
                <Loader className="animate-spin" />
            </div>
        )
    }

    return chapterData && (
        <GuestLayout>
            {manga && (
                <CardCoy
                    manga={manga}
                    chapter={chapter}
                    source={source}
                    url={url}
                />
            )}

            <h1 className="py-4 text-xl font-bold text-center">
                {chapterData.data.title}
            </h1>
            <Link to="https://trakteer.id/sengkomik" target="_blank">
                <div className="w-full py-6 text-xl text-center text-white bg-blue-500 rounded-md hover:bg-blue-200 hover:text-blue-500">Support di Trakteer</div>
            </Link>
            <div className="w-full py-4">
                <div className="flex flex-col items-center justify-center">
                    {chapterData.data.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={chapterData.data.title}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
            <Link to="https://trakteer.id/sengkomik" target="_blank">
                <div className="w-full py-6 text-xl text-center text-white bg-blue-500 rounded-md hover:bg-blue-200 hover:text-blue-500">Support di Trakteer</div>
            </Link>
            {manga && (
                <CardCoy
                    manga={manga}
                    chapter={chapter}
                    source={source}
                    url={url}
                />
            )}
        </GuestLayout>
    )
}

export const CardCoy: React.FC<{
    manga: Manga | null
    chapter: string
    source: string,
    url: string,
}> = ({
    manga,
    chapter,
    source,
    url
}) => {
        const [nextURL, setNextURL] = useState<string | null>(null)
        const [prevURL, setPrevURL] = useState<string | null>(null)

        useEffect(() => {
            if (manga) {
                const index = manga.chapters.findIndex((item) => item.url === chapter)

                if (index !== -1) {
                    if (index !== 0) {
                        setPrevURL(manga.chapters[index - 1].url)
                    }

                    if (index !== manga.chapters.length - 1) {
                        setNextURL(manga.chapters[index + 1].url)
                    }
                }
            }
        }, [])

        return (
            <Card>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <img
                        src={manga?.thumbnail?manga?.thumbnail:`https://placehold.co/200x300/fff/0ea5e9?text=${manga?.title}`}
                        about={manga?.title}
                        className="flex-shrink-0 rounded-lg w-14"
                    />

                    <div className="flex flex-col flex-grow">
                        <p className="text-lg font-bold">
                            {manga?.title}
                        </p>
                        <p className="text-xs font-semibold">
                            Total Chapter {manga?.chapters.length}
                        </p>

                        <p className="mt-4">
                            <select
                                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-blue-600 focus:border-transparent ring-blue-300 ring"
                                onChange={(e) => window.location.href = `/manga/${source}/${url}/${e.target.value}`}
                            >
                                {manga?.chapters.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item.url}
                                        className="text-blue-500 bg-white"
                                        selected={item.url === chapter}
                                    >
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            disabled={prevURL === null}
                            onClick={() => window.location.href = `/manga/${source}/${url}/${prevURL}`}
                            className="!px-2 bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-500"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            type="button"
                            disabled={nextURL === null}
                            onClick={() => window.location.href = `/manga/${source}/${url}/${nextURL}`}
                            className="!px-2 bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-500"
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

export default ChapterPage