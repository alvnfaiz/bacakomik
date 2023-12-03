import { useEffect, useState } from "react"
import GuestLayout from "../layouts/GuestLayout"
import ScrapeService, { ListManga } from "../services/scrape.service"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import CardManga from "../components/CardManga"
import { Loader } from "react-feather"

const Search: React.FC = () => {
    const [mangas, setMangas] = useState<ListManga[]>([])
    const [page, setPage] = useState<number>(1)

    const [sources, setSources] = useState<string[] | null>(null)

    const params = useParams<{ query: string }>();

    const { data, isLoading } = useQuery({
          queryKey: [
            "sources",
        ],
        queryFn: () => ScrapeService.scrape(),
        enabled: sources !== null
    })  

    useEffect(() => {
        if (data ) {
            setSources(data.data)
        }
    }, [data])

    useEffect(() => {
      if (sources) {
          const fetchPromises = sources.map((source:string) => {
              return ScrapeService.manga({
                  page,
                  search: params.query,
                  source,
              }).catch((error) => {
                  // Handle individual request errors, e.g., log the error
                  return { data: [] }; // Provide a default result to continue with other requests
              });
          });
  
          // Use Promise.all to wait for all requests to complete
          Promise.all(fetchPromises)
              .then((results:any) => {
                  console.log(results);
                  // Flatten the array of arrays into a single array of mangas
                  const allMangas = results.flatMap((result) => result.data);
                  setMangas(allMangas);
              })
              .catch((error) => {
              });
      }
  }, [sources, params.query, page]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen">
                <Loader className="animate-spin" />
            </div>
        )
    }

    return (
        <GuestLayout>
            <Link to="https://trakteer.id/sengkomik" target="_blank">
                <div className="w-full py-6 text-xl text-center text-white bg-blue-500 rounded-md hover:bg-blue-200 hover:text-blue-500">Support di Trakteer</div>
            </Link>
            <h1 className="text-xl font-bold">
                Projects Update
            </h1>
            <div className="w-full mt-4">
                <div className="flex flex-wrap justify-between gap-y-6">
                    {mangas.map((manga, index) => (
                        <CardManga key={index} manga={manga} />
                    ))}
                </div>
                {mangas.length === 0 && (
                    <div className="text-center col-span-full">
                        <p className="text-sm text-gray-500">
                            No data found
                        </p>
                    </div>
                )}
            </div>

            

            <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="text-blue-500 bg-blue-100 hover:text-blue-100 hover:bg-blue-500"
                >
                    Previous
                </Button>
                <Link to="https://trakteer.id/sengkomik" target="_blank">
                    <img
                    id="wse-buttons-preview"
                    src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023"
                    height="40"
                    style={{ border: '0px', height: '40px' }}
                    alt="Trakteer Saya"
                    />
                </Link>
                <Button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    className="text-blue-500 bg-blue-100 hover:text-blue-100 hover:bg-blue-500"
                    disabled={isLoading || data && data?.data.length === 0}
                >
                    Next
                </Button>
            </div>
        </GuestLayout>
    )
}

export default Search