import { FaSearch } from "react-icons/fa";
import { useSearch } from "../Contexts/SearchContext";

function Search() {
  const { searchQuery, updateSearchQuery } = useSearch();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    updateSearchQuery(query);
  };

  return (
    <div className="search-container">
      <FaSearch className="h-4 w-4 search-icon" />
      <input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
    </div>
  );
}

export default Search;
