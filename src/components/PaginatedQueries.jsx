import React, { useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchFruits = (pageId) => {
  return axios.get(`http://localhost:4000/fruits/?_limit=4&_page=${pageId}`);
};

export default function PaginatedQueries() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fruits", page],
    queryFn: () => fetchFruits(page),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>Error has occurred...{error.message}</div>;
  }

  return (
    <div className="container">
      {data?.data.map((item) => (
        <div key={item.id} className="fruit-label">
          {item.name}
        </div>
      ))}
      <button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 1 ? true : false}
      >
        Prev Page
      </button>
      <button
        onClick={() => setPage((next) => next + 1)}
        disabled={page === 5 ? true : false}
      >
        Next Page
      </button>
    </div>
  );
}
