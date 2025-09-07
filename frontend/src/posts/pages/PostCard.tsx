import { BsThreeDots } from "react-icons/bs";
import type { Post } from "../../types/posts";
import { timeAgo } from "../../utils/date";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { FaEdit, FaRegCommentDots } from "react-icons/fa";
import { useState } from "react";
import CommentCard from "./CommentCard";
import type { User } from "../../types/user";
import api from "../../api";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router";
import { usePost } from "../../contexts/PostContext";
import { IoMdClose } from "react-icons/io";

const PostCard = ({ post }: { post: Post }) => {
  const currentUserData = localStorage.getItem("currentUser");
  const currentUser: User | null = currentUserData
    ? JSON.parse(currentUserData)
    : null;
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [likes, setLikes] = useState(post.likes);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  const {
    deletePost,
    setUpdatePost,
    setPostToUpdate,
    editPost,
    setOpenUpdate,
    openUpdate,
    updatePost,
    postToUpdate,
  } = usePost();

  const likeUnlikePost = () => {
    if (currentUserId === null) return;
    api
      .post(`/posts/${post.id}/like_unlike/`)
      .then(() => {
        if (likes.includes(currentUserId)) {
          setLikes(likes.filter((id) => id !== currentUserId));
          setLikesCount((c) => c - 1);
        } else {
          setLikes([...likes, currentUserId]);
          setLikesCount((c) => c + 1);
        }
      })
      .catch(() => console.log("Failed to like/unlike post."));
  };

  const createComment = () => {
    if (!newComment.trim()) return;
    api
      .post(`/posts/${post.id}/comments/`, {
        post: post.id,
        content: newComment,
      })
      .then((res) => {
        setComments((prev) => [res.data, ...prev]);
        setNewComment("");
      })
      .catch(() => console.log("Failed to add comment."));
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border"
            src={post.user.image}
            alt={post.user.username}
          />
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/${post.user.username}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {post.user.first_name} {post.user.last_name}
              </Link>
              <span className="text-gray-400">&middot;</span>
              <Link
                to={`/${post.user.username}`}
                className="text-xs text-gray-500 hover:underline"
              >
                @{post.user.username}
              </Link>
            </div>
            <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        {currentUserId === post.user.id && (
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setOpen((p) => !p)}
            >
              <BsThreeDots size={20} />
            </button>
            {open && (
              <div className="absolute top-10 right-0 w-44 flex flex-col bg-slate-100 p-3 rounded-md shadow-md z-10">
                <button
                  onClick={() => {
                    setOpen(false);
                    setOpenUpdate(true);
                    setUpdatePost(post.content);
                    setPostToUpdate(post.id);
                  }}
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <FaEdit /> <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    deletePost(post.id);
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <MdDelete /> <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 py-4 text-[15px] leading-relaxed">
        {post.content}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
        <span>{likesCount} Likes</span>
        <span>{comments.length} Comments</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around mt-2 border-t border-gray-200 pt-2">
        <button
          onClick={likeUnlikePost}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
        >
          {currentUserId !== null && likes.includes(currentUserId) ? (
            <>
              <AiTwotoneLike size={20} /> <span>Unlike</span>
            </>
          ) : (
            <>
              <AiOutlineLike size={20} /> <span>Like</span>
            </>
          )}
        </button>
        <button
          onClick={() => setCommentsVisible((p) => !p)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
        >
          <FaRegCommentDots size={20} /> <span>Comment</span>
        </button>
      </div>

      {/* Comments */}
      {commentsVisible && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          {comments.length > 0 ? (
            <div className="grid gap-3">
              {comments.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No comments yet. Be the first!
            </p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <img
              src={
                currentUser?.image.startsWith("http")
                  ? currentUser.image
                  : `http://localhost:8001${currentUser?.image}`
              }
              alt={currentUser?.username}
              className="h-8 w-8 rounded-full border object-cover"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={createComment}
              className="text-blue-600 font-medium hover:underline"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Update Post Modal */}
      {openUpdate && (
        <div className="bg-white shadow-lg p-6 rounded-lg fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 w-96">
          <IoMdClose
            onClick={() => setOpenUpdate(false)}
            className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-gray-800"
            size={24}
          />
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
              placeholder="Update your post..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              value={updatePost}
              onChange={(e) => setUpdatePost(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => editPost(postToUpdate)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
