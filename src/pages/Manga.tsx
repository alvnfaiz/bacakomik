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

    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleBookmarkClick = () => {
        // Dapatkan array manga dari localStorage atau gunakan array kosong jika tidak ada
    
        const storedMangas = localStorage.getItem("mangas");

        // Check if storedMangas is not null and parse it as JSON
        if (storedMangas !== null) {
            const parsedMangas = JSON.parse(storedMangas);

            // Ensure parsedMangas is an array before setting the state
            if (Array.isArray(parsedMangas)) {
                if (!isBookmarked) {
                    const updatedMangas = [...parsedMangas, manga];
              
                    // Simpan kembali array manga ke localStorage mangas[source]
                    localStorage.setItem("mangas", JSON.stringify(updatedMangas));
                  }else{
                    // Jika manga sudah ada, hapus dari array
                    if (isBookmarked) {
                      const updatedMangas = parsedMangas.filter((m:any) => m?.url !== manga?.url);
                      localStorage.setItem("mangas", JSON.stringify(updatedMangas));
                    }
                  }
            }
        }else{
            const updatedMangas = [manga];
            localStorage.setItem("mangas", JSON.stringify(updatedMangas));
        }
    
        // Jika manga belum ada, tambahkan ke dalam array jika sudah ada
        
        setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
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
            (m:any) => m?.url === manga?.url
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
                        <div className="flex-shrink-0 mx-auto w-fit">
                            <div className="relative">
                                <img
                                    src={manga?.thumbnail?manga?.thumbnail:`https://placehold.co/200x300/fff/0ea5e9?text=${manga?.title}`}
                                    alt={manga?.title}
                                    className="object-cover w-48 h-64 mx-0 rounded-lg"
                                />
                                <div className="absolute top-0 left-0 p-1 font-bold text-white rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                                    {manga?.type}
                                </div>
                            </div>
        
                            <Button
                                type="button"
                                className={`flex gap-4 w-48 my-1 ${!isBookmarked ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-red-100 hover:bg-red-500 text-red-500 hover:text-white"}`}
                                onClick={() => {
                                    handleBookmarkClick();
                                }}
                            >
                                {!isBookmarked ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={"1.5"} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                        </svg> Tambah
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={"1.5"} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                        </svg> Hapus
                                    </>
                                )}
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
                <Link to="https://trakteer.id/sengkomik" target="_blank">
                <div className="w-full py-6 text-xl text-center text-white bg-blue-500 rounded-md hover:bg-blue-200 hover:text-blue-500">Support di Trakteer</div>
            </Link>
                <Card>
                    <h1 className="text-xl font-bold">
                        Chapters
                    </h1>
                    <div className="w-full p-6 mt-2 bg-emerald-200">
                        Jika pada chapter berwarna hijau, berarti kalian sudah pernah membuka chapter tersebut
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        {manga.chapters.map((item, index) => (
                            <Link
                                key={index}
                                to={`/manga/${source}/${url}/${item.url}`}
                                className="flex items-center gap-4 p-2 px-4 text-blue-500 bg-blue-100 border-2 border-transparent rounded-lg hover:text-white hover:bg-blue-500 hover:border-blue-500 visited:bg-emerald-100 visited:text-emerald-500 hover:visited:text-white hover:visited:bg-emerald-500 hover:visited:border-emerald-500"
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