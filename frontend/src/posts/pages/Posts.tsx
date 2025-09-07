import { useEffect } from "react";
import PostCard from "./PostCard";
import type { User } from "../../types/user";
import { usePost } from "../../contexts/PostContext";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Posts = () => {
  const {
    posts,
    next,
    previous,
    post,

    setPost,
    createPost,
    loadPosts,
  } = usePost();

  const currentUserData = localStorage.getItem("currentUser");
  const currentUser: User | null = currentUserData
    ? JSON.parse(currentUserData)
    : null;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
    loadPosts("/posts");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Post Composer */}
      <div className="bg-white shadow-sm border border-gray-200 p-4 mb-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border"
            src={
              currentUser?.image.startsWith("http")
                ? currentUser.image
                : `http://localhost:8001${currentUser?.image}`
            }
            alt={currentUser?.username}
          />
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={createPost}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-500">No posts yet.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => previous && loadPosts(previous)}
          disabled={!previous}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
            previous
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>&lt;</span> Prev
        </button>

        <button
          onClick={() => next && loadPosts(next)}
          disabled={!next}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
            next
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <span>&gt;</span>
        </button>
      </div>
    </>
  );
};

export default Posts;
