import React, { createContext, useContext, useMemo, useRef, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  loadingCount: 0,
  increment: () => {},
  decrement: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const pending = useRef(0);

  const increment = () => {
    pending.current += 1;
    setLoadingCount((c) => c + 1);
  };

  const decrement = () => {
    // Prevent going below zero
    if (pending.current > 0) pending.current -= 1;
    setLoadingCount((c) => (c > 0 ? c - 1 : 0));
  };

  const value = useMemo(
    () => ({ isLoading: loadingCount > 0, loadingCount, increment, decrement }),
    [loadingCount]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);
