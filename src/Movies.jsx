import React, { useState } from "react";

export default function Movies({ onAddToCart }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const API_KEY = "1d40c85e82ef66315e8dc6cf6a10f531"; //  TMDB v3 key

  // Search TMDB
  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false`
      );

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Error fetching TMDB data:", err);
    }
  };

  return (
    <div className="movies-page">
      <h2>Search Movies & Shows</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* layout for result */}
      <div className="results-grid">
        {results.map((item) => {
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Image";

          return (
            <div key={item.id} className="result-card">
              <img src={posterUrl} alt={item.title || item.name} />

              <h4>{item.title || item.name}</h4>

              <p>{item.media_type === "tv" ? "TV Show" : "Movie"}</p>

              {/* Add to Cart Button */}
              <button onClick={() => onAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}