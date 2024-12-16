import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// GET Method
const fetchPosts = () => {
  return axios.get("http://localhost:4000/posts");
};

//POST Method
const addPost = (post) => {
  return axios.post("http://localhost:4000/posts", post);
};

export default function PostsRqMutation() {
  // /posts -> ["posts"] acts as unique key
  // /posts/1 -> ["posts", post.id]
  // /posts/1/comments ["posts", post.id, "comments"]

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: false,
  });

  const { mutate } = useMutation({
    mutationFn: addPost,
    
    ////Non-Optimestic-Way:

    // onSuccess: (newData) => {
    // //   queryClient.invalidateQueries("posts");
    // queryClient.setQueryData(["posts"], (oldQueryData)=>{
    //     return {
    //         ...oldQueryData,
    //         data:[...oldQueryData.data, newData.data]
    //     }
    // })
    // },

    ////Optimestic Update:
    // called before mutation fn trigered

    onMutate: async (newPost) => {
      // cancel refetching
      await queryClient.cancelQueries(["posts"]);
      const previousPostData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            { ...newPost, id: String(oldQueryData?.data?.length + 1) },
          ],
        };
      });
      return {
        previousPostData,
      };
    },
    onError: (_error, _post, context) => {
      queryClient.setQueryData(["posts"], context.previousPostData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = { title, body };
    mutate(post);
    setTitle("");
    setBody("");
  };

  if (isLoading) {
    return <div>Page is loading...</div>;
  }

  if (isError) {
    return <div>Error has occurred...{error.message}</div>;
  }

  console.log(data);

  return (
    <div className="post-list">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          value={title}
        />
        <input
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter post body"
          value={body}
        />
        <button type="submit">Post</button>
      </form>
      {data?.data.map((post) => (
        <Link key={post.id} to={`/rq-posts/${post.id}`}>
          <div key={post.id} className="post-item">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </div>
        </Link>
      ))}
      <button onClick={refetch}>Fetch Posts</button>
    </div>
  );
}
