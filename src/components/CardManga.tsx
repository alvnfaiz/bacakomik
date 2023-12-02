import { Link } from "react-router-dom"
import { ListManga } from "../services/scrape.service"

interface Props {
    manga: ListManga
}

const CardManga: React.FC<Props> = ({ manga }) => {
    return (
        <Link
            to={`/manga/${manga.source}/${manga.url}`}
            className="w-56 p-2 overflow-hidden border border-gray-200 rounded-md shadow-sm hover:bg-white hover:shadow-lg hover:border-purple-500 group">
            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={manga.thumbnail?manga.thumbnail:`https://placehold.co/200x300/8b5cf6/fff?text=${manga.title}`}
                    alt={manga.title}
                    className="object-cover w-full h-64"
                />
                <div className="absolute top-0 px-4 text-sm font-bold text-white -left-2 -py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    {manga.source}
                </div>
            </div>

            <div className="mt-2">
                <p className="text-sm font-semibold group-hover:text-purple-500">
                    {manga.title}
                </p>
            </div>
        </Link>
    )
}

export default CardManga