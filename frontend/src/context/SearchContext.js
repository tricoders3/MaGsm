import React, { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext({
  query: "",
  setQuery: () => {},
  categoryId: "",
  setCategoryId: () => {},
  subCategoryId: "",
  setSubCategoryId: () => {},
});

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const value = useMemo(
    () => ({ query, setQuery, categoryId, setCategoryId, subCategoryId, setSubCategoryId }),
    [query, categoryId, subCategoryId]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useGlobalSearch = () => useContext(SearchContext);
