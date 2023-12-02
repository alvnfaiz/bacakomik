import { useEffect, useState } from "react"
import GuestLayout from "../layouts/GuestLayout"
import CardManga from "../components/CardManga"

const Bookmark: React.FC = () => {
    const [mangas, setMangas] = useState<any[]>([])


    useEffect(() => {
      const storedMangas = localStorage.getItem("mangas");
      
      // Check if storedMangas is not null and parse it as JSON
      if (storedMangas !== null) {
          const parsedMangas = JSON.parse(storedMangas);
  
          // Ensure parsedMangas is an array before setting the state
          if (Array.isArray(parsedMangas)) {
              setMangas(parsedMangas);
          }
      }
  }, []);

    return (
        <GuestLayout>
            <h1 className="text-xl font-bold">
                Projects Update
            </h1>

            <div className="w-full mt-4">
                {mangas.length === 0 ? (
                    <div className="text-center col-span-full">
                        <p className="text-sm text-gray-500">
                            No data found
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-between gap-y-6">
                        {mangas.map((manga, index) => (
                            <CardManga key={index} manga={manga} />
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    )
}

export default Bookmark