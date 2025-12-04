// frontend/src/hooks/utils/useAsync.js
import { useState, useCallback, useEffect } from "react";

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (...params) => {
      setStatus("pending");
      setValue(null);
      setError(null);

      return asyncFunction(...params)
        .then((response) => {
          setValue(response);
          setStatus("success");
          return response;
        })
        .catch((error) => {
          setError(error);
          setStatus("error");
          throw error;
        });
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
};
