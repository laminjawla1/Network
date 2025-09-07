/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import PostCard from "../posts/pages/PostCard";
import { usePost } from "../contexts/PostContext";

const Following = () => {
  const { posts, loadPosts, next, previous } = usePost();

  useEffect(() => {
    loadPosts("/posts/following");
  }, []);

  return posts.length > 0 ? (
    <>
      <div className="flex flex-col gap-6">
        {posts?.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
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
  ) : (
    <div>You are not following anyone.</div>
  );
};

export default Following;
