"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  text: string;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("Loading...");

  const startLoading = (customText?: string) => {
    setIsLoading(true);
    if (customText) {
      setText(customText);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
    setText("Loading...");
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, text, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
