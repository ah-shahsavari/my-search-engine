import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { fetchSearchResults } from "../api/axiosService"

interface SearchResult {
  title: string
  link: string
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const SearchResults: React.FC = () => {
  const query = useQuery().get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query.trim() === "") return

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSearchResults(query) // استفاده از تابع fetchSearchResults
        const relatedTopics = data.RelatedTopics

        const fetchedResults: SearchResult[] = relatedTopics
          .filter((topic: any) => topic.Text && topic.FirstURL)
          .map((topic: any) => ({
            title: topic.Text,
            link: topic.FirstURL,
          }))

        setResults(fetchedResults)
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Error fetching search results.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <main className="container mx-auto">
      <div className="min-h-screen p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Result: "<span className="text-blue-600">{query}</span>"
        </h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-center">No results found.</p>
        )}
        <ul className="space-y-4">
          {results.map((result, index) => (
            <li
              key={index}
              className="flex items-center bg-white shadow-lg rounded-lg p-4 transition transform hover:scale-[1.02]"
            >
              <a
                href={result.link}
                className="text-blue-600 hover:underline flex-grow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="text-lg font-medium">{result.title}</h3>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default SearchResults
