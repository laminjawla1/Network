import { FaReply } from "react-icons/fa";
import type { Comment } from "../../types/posts";
import { timeAgo } from "../../utils/date";
import { AiOutlineLike } from "react-icons/ai";

type CommentEntity = {
  comment: Comment;
};

const CommentCard = ({ comment }: CommentEntity) => {
  return (
    <div className="flex gap-3 mb-4">
      {/* User Avatar */}
      <img
        className="h-6 w-6 rounded-full object-cover border"
        src={comment.user.image}
        alt={comment.user.username}
      />

      <div className="flex flex-col">
        {/* Comment Bubble */}
        <div className="bg-gray-100 px-4 py-2 rounded-2xl shadow-sm">
          <p className="font-semibold text-sm">
            {comment.user.first_name} {comment.user.last_name}
          </p>
          <p className="text-gray-800 text-sm">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
          <span>{timeAgo(comment.created_at)}</span>
          <button className="flex items-center gap-1 hover:text-blue-600 transition">
            <AiOutlineLike size={16} />
            Like
          </button>
          <button className="flex items-center gap-1 hover:text-green-600 transition">
            <FaReply size={16} />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
