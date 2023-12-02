import { Link } from "react-router-dom";
import SourceButton from "./SourceButton";
import SearchButton from "./SearchButton";
import BookmarkButton from "./BookmarkButton";

const Header: React.FC = () => {

    return (
        <header className="w-full px-4 py-3 bg-white shadow-lg dark:bg-slate-800">
            <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <h1 className="text-2xl font-bold">Baca Komik</h1>
                    </Link>

                    <div className="items-center hidden gap-2 md:flex">
                        <Link to="/" className="px-4 py-2 text-sm font-semibold text-blue-500 bg-blue-100 rounded-lg hover:bg-blue-500 hover:text-white">Home</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <BookmarkButton/>
                    <SourceButton />
                    <SearchButton />
                </div>
            </div>
        </header>
    )
}

export default Header;