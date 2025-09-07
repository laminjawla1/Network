import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import api from "../api";
import type { Post, PostContextType } from "../types/posts";

type Prop = {
  children: ReactNode;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: Prop) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [post, setPost] = useState("");
  const [updatePost, setUpdatePost] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState<number | null>(null);

  const loadPosts = (endpoint: string) => {
    api
      .get(endpoint)
      .then((response) => {
        setPosts(response.data.results);
        setPrevious(response.data.previous);
        setNext(response.data.next);
      })
      .catch(() => toast.error("Failed to load posts."));
  };

  const editPost = (id: number | null) => {
    if (!id) return;
    if (!updatePost.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }

    api
      .put(`/posts/${id}/update/`, { content: updatePost })
      .then((res) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
        setOpenUpdate(false);
        toast.success("Post updated successfully.");
      })
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to update post.")
      );
  };

  const createPost = () => {
    if (!post.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }
    api
      .post("/posts/", { content: post })
      .then((res) => {
        setPosts((prev) => [res.data, ...prev]);
        setPost("");
        toast.success("Post created successfully.");
      })
      .catch(() => toast.error("Failed to create post."));
  };

  const deletePost = (id: number) => {
    api
      .delete(`/posts/${id}/delete/`)
      .then(() => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Post deleted successfully.");
      })
      .catch((err) =>
        toast.error(err.response?.data?.detail || "Failed to delete post.")
      );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        previous,
        next,
        post,
        updatePost,
        openUpdate,
        postToUpdate,
        setPosts,
        setPost,
        setUpdatePost,
        setOpenUpdate,
        setPostToUpdate,
        createPost,
        loadPosts,
        editPost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
