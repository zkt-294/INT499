import React, { useState } from "react";

export default function Movies({ onAddToCart }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const API_KEY = "1d40c85e82ef66315e8dc6cf6a10f531"; //  TMDB v3 key

  // Search TMDB
  const handleSearch = async (searchPage = 1) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&page=${searchPage}&include_adult=false`
      );
      const data = await response.json();
      setResults(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
      if (!data.results || data.results.length === 0) {
        setError("No results found.");
      }
    } catch (err) {
      setError("Error fetching TMDB data.");
      console.error("Error fetching TMDB data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search on input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      if (e.target.value.trim()) handleSearch(1);
    }, 500);
    setDebounceTimeout(timeout);
  };

  return (
    <div className="movies-page">
      <h2 id="movies-heading">Search Movies & Shows</h2>

      {/* Search Bar as a form with accessibility */}
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(1);
        }}
        aria-labelledby="movies-heading"
      >
        <label htmlFor="movies-search-input">Search</label>
        <input
          id="movies-search-input"
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={handleInputChange}
          aria-required="true"
        />
        <button type="submit" aria-label="Search for movies or TV shows">Search</button>
      </form>

      {/* Loading and error feedback */}
      {loading && <div role="status" aria-live="polite">Loading...</div>}
      {error && <div role="alert" aria-live="assertive">{error}</div>}

      {/* layout for result */}
      <div className="results-grid" aria-live="polite">
        {results
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .map((item) => {
            const posterUrl = item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : "https://via.placeholder.com/200x300?text=No+Image";
            const altText = item.title || item.name || "No title available";
            let typeLabel = "Other";
            if (item.media_type === "tv") typeLabel = "TV Show";
            else if (item.media_type === "movie") typeLabel = "Movie";

            return (
              <div key={item.id} className="result-card">
                <img src={posterUrl} alt={altText} />

                <h4>{altText}</h4>

                <p>{typeLabel}</p>

                {/* Add to Cart Button */}
                <button onClick={() => onAddToCart(item)} aria-label={`Add ${altText} to cart`}>
                  Add to Cart
                </button>
              </div>
            );
          })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handleSearch(page - 1)}
            disabled={page <= 1 || loading}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handleSearch(page + 1)}
            disabled={page >= totalPages || loading}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}