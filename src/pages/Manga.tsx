import { useParams } from "react-router"
import GuestLayout from "../layouts/GuestLayout"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ScrapeService, { Manga } from "../services/scrape.service"
import { Book, Loader } from "react-feather"
import Card from "../components/Card"
import { Link } from "react-router-dom"
import Button from "../components/Button"

const MangaPage: React.FC = () => {
    const params = useParams()
    const [manga, setManga] = useState<Manga | null>(null)

    const { source, url } = params as { source: string, url: string }

    // add state [isBookmarked, setIsBookmarked] to boolean
    const [isBookmarked, setIsBookmarked] = useState(false)
    // use effect the isBookmarked
    

    // check if manga already bookmarked


    const handleBookmarkClick = () => {
        // Dapatkan array manga dari localStorage atau gunakan array kosong jika tidak ada
        const storedMangas = JSON.parse(localStorage.getItem("mangas")) || [];
    
        // Periksa apakah manga sudah ada dalam array atau belum
        const isMangaAlreadyBookmarked = storedMangas.some((m) => m.url === manga.url);
        // add url to manga object
        manga.url = url
        manga.source = source
    
        // Jika manga belum ada, tambahkan ke dalam array jika sudah ada
        if (!isMangaAlreadyBookmarked) {
          const updatedMangas = [...storedMangas, manga];
    
          // Simpan kembali array manga ke localStorage mangas[source]
          localStorage.setItem("mangas", JSON.stringify(updatedMangas));
        }else{
          // Jika manga sudah ada, hapus dari array
          if (isMangaAlreadyBookmarked) {
            const updatedMangas = storedMangas.filter((m) => m.url !== manga.url);
            localStorage.setItem("mangas", JSON.stringify(updatedMangas));
          }
        }
        setIsBookmarked(
          !isBookmarked
        )
      };

    const { data, isLoading } = useQuery({
        queryKey: [
            "manga",
            source,
            url
        ],
        queryFn: () => ScrapeService.detail({
            source,
            url
        })
    })

    useEffect(() => {
        if (data) {
            setManga(data.data)
        }
    }, [data])
    useEffect(()=>{
        if(manga){
            manga.url = url
            manga.source = source
        }
        setIsBookmarked(JSON.parse(localStorage.getItem("mangas") || "[]").some(
            (m) => m.url === manga?.url
        ))
    }, [manga])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen">
                <Loader className="animate-spin" />
            </div>
        )
    }

    if (manga === null) {
        return (
            <GuestLayout>
                <div className="flex flex-col items-center justify-center w-full min-h-screen">
                    <p className="text-2xl font-bold">
                        Manga Not Found
                    </p>
                </div>
            </GuestLayout>
        )
    }

    return !isLoading && manga && (
        <GuestLayout>
            <div className="flex flex-col gap-4">
                <Card>
                    <div className="flex flex-col items-start gap-4 md:gap-8 md:flex-row">
                        <div className="flex-shrink-0 w-fit">
                            <div className="relative">
                                <img
                                    src={manga?.thumbnail?manga?.thumbnail:`https://placehold.co/200x300/fff/0ea5e9?text=${manga?.title}`}
                                    alt={manga?.title}
                                    className="object-cover w-48 h-64 mx-0 rounded-lg"
                                />
                                <div className="absolute top-0 left-0 p-1 font-bold text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                    {manga?.type}
                                </div>
                            </div>
        
                                    <Button
                                        type="button"
                                        className={`w-48 my-1 ${!isBookmarked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                                        onClick={() => {
                                            handleBookmarkClick();
                                        }}
                                    >
                                        {!isBookmarked ? "Add Bookmark" : "Hapus Bookmark"}
                                    </Button>
                        </div>

                        <div className="flex-grow w-full">
                            <h1 className="text-2xl font-bold">
                                {manga?.title}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-sm font-semibold">
                                        Status: {manga?.status}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Author: {manga?.author}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Type: {manga?.type}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Genres: {manga?.genres.join(", ")}
                                    </p>

                                    <div className="flex flex-col gap-1 mt-4">
                                        <p className="text-sm font-semibold">
                                            Synopsis:
                                        </p>
                                        <p className="text-xs">{manga.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h1 className="text-xl font-bold">
                        Chapters
                    </h1>

                    <div className="flex flex-col gap-2 mt-4">
                        {manga.chapters.map((item, index) => (
                            <Link
                                key={index}
                                to={`/manga/${source}/${url}/${item.url}`}
                                className="flex items-center gap-4 p-2 px-4 border-2 border-transparent rounded-lg hover:border-black hover:bg-gray-100"
                            >
                                <Book />
                                <p className="text-sm font-semibold">
                                    {item.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </GuestLayout>
    )
}

export default MangaPage