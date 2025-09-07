import { useEffect, useState } from "react";
import api from "../../api";
import type { User } from "../../types/user";
import { Link } from "react-router";
import { toast } from "react-toastify";

type Props = {
  user: User;
};

const FollowersCard = ({ user }: Props) => {
  let currentUser: User | null = null;
  const currentUserData = localStorage.getItem("currentUser");
  if (currentUserData) {
    currentUser = JSON.parse(currentUserData);
  }
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    loadFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const followOrUnfollow = () => {
    api
      .post(`/users/${user.id}/follow_or_unfollow/`)
      .then((response) => {
        toast.success(response.data.detail);
        loadFollowers();
      })
      .catch((error) =>
        toast.error(
          error.response.data.detail || "Unable to follow or unfollow user"
        )
      );
  };

  const loadFollowers = () => {
    api
      .get(`/users/${user.id}/followers`)
      .then((response) => {
        setFollowers(response.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
      <img
        src={user.image}
        alt={user.username}
        className="h-20 w-20 rounded-full object-cover border mb-3"
      />
      <Link to={`/${user.username}`} className="font-semibold text-gray-900">
        {user.first_name} {user.last_name}
      </Link>
      <Link to={`/${user.username}`} className="text-sm text-gray-500 mb-3">
        @{user.username}
      </Link>

      {currentUserId !== null && (
        <>
          {!followers.map((follower) => follower.id).includes(currentUserId) ? (
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

export default FollowersCard;
