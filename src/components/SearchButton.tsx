import { useSearchParams } from "react-router-dom"
import Button from "./Button"
import { useState } from "react"
import { Search } from "react-feather"

const SearchButton: React.FC = () => {
    const [searchParams] = useSearchParams()
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <input
                type="text"
                placeholder="Search manga..."
                className="hidden px-4 py-2 bg-gray-100 rounded-lg md:block dark:bg-gray-800 focus:outline-none focus:ring focus:ring-indigo-200"
                defaultValue={searchParams.get("search") || ""}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        window.location.href = `/search/${e.currentTarget.value}`
                    }
                }}
            />

            <div className="relative">
                <Button
                    type="button"
                    className="block text-blue-500 bg-blue-100 md:hidden"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <Search size={24} />
                </Button>

            </div>
            <div className={`absolute top-16 left-0 z-50 w-full ${open ? "block" : "hidden"}`}>
                <div className="flex items-center justify-center w-full px-4 py-2 bg-white">
                    <input
                        type="text"
                        placeholder="Search manga..."
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-800 focus:outline-none focus:ring focus:ring-indigo-200"
                        defaultValue={searchParams.get("search") || ""}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                window.location.href = `/search/${e.currentTarget.value}`
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default SearchButton