"use client";

import { useState, useEffect } from "react";

interface UseMDXPreviewOptions {
  initialCode?: string;
  delay?: number;
}

export function useMDXPreview({
  initialCode = "",
  delay = 300,
}: UseMDXPreviewOptions = {}) {
  const [code, setCode] = useState(initialCode);
  const [parsedCode, setParsedCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        setParsedCode(code);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing MDX:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [code, delay]);

  return {
    code,
    setCode,
    parsedCode,
    isLoading,
    error,
  };
}
