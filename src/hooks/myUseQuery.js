import { useEffect, useState } from "react";
const cache = {};
export default function myUseQuery({ key, queryFn, staleTime = 5000 }) {
  const [data, setData] = useState(cache[key]?.data || null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const result = await queryFn();
      cache[key] = { data: result, timeStamp: Date.now() };
      setData(result);
      setError(null);
      setIsError(false);
    } catch (err) {
      setError(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const entry = cache[key];
    const now = Date.now();

    const run = async () => {
      if (entry) {
        if (now - entry.timeStamp < staleTime) {
          setData(entry.data);
          setIsError(false);
          setIsLoading(false);
          return;
        } else {
          setData(entry.data);
          await fetchData();
          return;
        }
      }
      await fetchData();
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [queryFn, staleTime, key]);

  return { data, error, isError, isLoading, refetch: fetchData };
}
