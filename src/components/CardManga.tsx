import { Link } from "react-router-dom"
import { ListManga } from "../services/scrape.service"

interface Props {
    manga: ListManga
}

const CardManga: React.FC<Props> = ({ manga }) => {
    return (
        <Link
            to={`/manga/${manga.source}/${manga.url}`}
            className="w-1/2 p-2 overflow-hidden border border-gray-200 rounded-md shadow-sm sm:w-1/3 md:w-56 hover:bg-white hover:shadow-lg hover:border-blue-500 group">
            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={manga.thumbnail?manga.thumbnail:`https://placehold.co/200x300/8b5cf6/fff?text=${manga.title}`}
                    alt={manga.title}
                    className="object-cover w-full h-64"
                />
                <div className="absolute top-0 px-4 text-sm font-bold text-white bg-blue-500 rounded -left-2 -py-2 group-hover:bg-blue-100 group-hover:text-blue-500">
                    {manga.source}
                </div>
            </div>

            <div className="mt-2">
                <p className="text-sm font-semibold group-hover:text-blue-500">
                    {manga.title}
                </p>
            </div>
        </Link>
    )
}

export default CardManga