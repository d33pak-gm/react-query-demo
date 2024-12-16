import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PostsRQ() {
  // /posts -> ["posts"] acts as unique key
  // /posts/1 -> ["posts", post.id]
  // /posts/1/comments ["posts", post.id, "comments"]

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return axios.get("http://localhost:4000/posts");
    },
    enabled: false,
  });

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>Error has occurred...{error.message}</div>;
  }

  console.log(data);

  return (
    <div className="post-list">
      <button onClick={refetch}>Fetch Posts</button>
      {data?.data.map((post) => (
        <Link to={`/rq-posts/${post.id}`}>
          <div key={post.id} className="post-item">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
