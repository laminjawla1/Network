import { useState } from "react";
import api from "../../api";
import type { User } from "../../types/user";

type Props = {
  user: User;
};

const FollowingCard = ({ user }: Props) => {
  let currentUser: User | null = null;
  const currentUserData = localStorage.getItem("currentUser");
  if (currentUserData) {
    currentUser = JSON.parse(currentUserData);
  }
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const [followers, setFollowers] = useState(user.followers);
  const followOrUnfollow = () => {
    api
      .post(`/users/${user.id}/follow_or_unfollow/`)
      .then((response) => setFollowers(response.data.followers))
      .catch((error) => console.log(error));
  };
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
      <img
        src={user.image}
        alt={user.username}
        className="h-20 w-20 rounded-full object-cover border mb-3"
      />
      <p className="font-semibold text-gray-900">
        {user.first_name} {user.last_name}
      </p>
      <p className="text-sm text-gray-500 mb-3">@{user.username}</p>

      {currentUserId !== null && (
        <>
          {!followers.includes(currentUserId) ? (
            <button
              onClick={followOrUnfollow}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Follow Back
            </button>
          ) : (
            <button
              onClick={followOrUnfollow}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Unfollow
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FollowingCard;
