/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext, useState } from "react";

// create context
export const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

// useSearch Custom Hook
export const useSearch = () => {
  return useContext(SearchContext);
};
