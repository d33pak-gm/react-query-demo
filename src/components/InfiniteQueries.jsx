import React from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchFruits = ({ pageParam }) => {
  return axios.get(`http://localhost:4000/fruits/?_limit=4&_page=${pageParam}`);
};

export default function InfiniteQueries() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      // 20 items
      // 5 pages
      if (allPages.length < 5) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  if (isLoading) {
    return <h2>Page is Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  console.log(data)

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
      <button disabled={!hasNextPage} onClick={fetchNextPage}>Load More..</button>
    </div>
  );
}