import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import { fetchSuggestions } from "../api/axiosService"
import SuggestionList from "./SuggestionList"
import { useNavigate } from "react-router-dom"

interface Suggestion {
  text: string
  url: string
}

const SearchBar: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const queryRef = useRef<string>("")
  const navigate = useNavigate()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryRef.current = e.target.value

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      if (queryRef.current.trim()) {
        fetchSuggestionsWithAbort(queryRef.current)
      } else {
        setSuggestions([])
      }
    }, 300)
  }

  const fetchSuggestionsWithAbort = async (query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const data = await fetchSuggestions(query, abortController.signal)
      const suggestionList = data.RelatedTopics.filter(
        (topic: any) => topic.Text
      )
        .slice(0, 5)
        .map((topic: any) => ({
          text: topic.Text,
          url: topic.FirstURL,
        }))

      setSuggestions(suggestionList)
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message)
      } else {
        console.error("Error fetching suggestions:", error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = queryRef.current.trim()
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search..."
          onChange={handleChange}
        />
      </form>
      {suggestions.length > 0 && <SuggestionList suggestions={suggestions} />}
    </div>
  )
}

export default SearchBar
