import React, { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext({
  query: "",
  setQuery: () => {},
  categoryId: "",
  setCategoryId: () => {},
  subCategoryId: "",
  setSubCategoryId: () => {},
  fromSidebar: false,        
  setFromSidebar: () => {},   
});

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [fromSidebar, setFromSidebar] = useState(false); 

  const value = useMemo(
    () => ({ query, setQuery, categoryId, setCategoryId, subCategoryId, setSubCategoryId, fromSidebar,        // NEW
        setFromSidebar }),
    [query, categoryId, subCategoryId, fromSidebar]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useGlobalSearch = () => useContext(SearchContext);
