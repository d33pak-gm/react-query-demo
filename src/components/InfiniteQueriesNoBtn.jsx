import React, { useEffect } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const fetchFruits = ({ pageParam }) => {
  return axios.get(
    `http://localhost:4000/fruits/?_limit=10&_page=${pageParam}`
  );
};

export default function InfiniteQueriesNoBtn() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      // 20 items
      // 5 pages
      if (allPages.length < 11) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) {
    return <h2>Page is Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  console.log(data);

  return (
    <div className="container">
      {data?.pages?.map((page) => {
        return page?.data.map((fruit) => {
          return (
            <div className="fruit-item" key={fruit.id}>
              {fruit.name}
            </div>
          );
        });
      })}
      <div ref={ref} style={{ border: "5px solid white" }}>
        {isFetchingNextPage && "Loading..."}
      </div>
    </div>
  );
}
