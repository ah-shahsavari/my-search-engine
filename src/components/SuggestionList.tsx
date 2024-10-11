import React from "react"
import { Link } from "react-router-dom"

interface Suggestion {
  text: string
  url: string
}

interface SuggestionListProps {
  suggestions: Suggestion[]
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions }) => {
  return (
    <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto z-10">
      {suggestions.map((suggestion, index) => (
        <li key={index}>
          <Link
            to={`/search?q=${encodeURIComponent(suggestion.text)}`}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {suggestion.text}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SuggestionList
