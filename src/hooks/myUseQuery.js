import { useEffect, useState } from "react";
const cache = {};
export default function myUseQuery({ queryFn, staleTime = 5000 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const now = Date.now();

    if (cache.data && now - cache.timeStamp < staleTime) {
      setData(cache.data);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);

      try {
        const result = await queryFn();
        cache.data = result;
        cache.timeStamp = Date.now();
        setData(result);
        setError(null);
        setIsError(false);
      } catch (err) {
        setError(err);
        setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [queryFn, staleTime]);

  return { data, error, isError, isLoading };
}
