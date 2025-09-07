import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { User } from "../../types/user";
import api from "../../api";
import PostCard from "../../posts/pages/PostCard";
import { usePost } from "../../contexts/PostContext";

const ProfileCard = ({ user }: { user: User }) => {
  const { posts, loadPosts, next, previous } = usePost();
  const currentUserData = localStorage.getItem("currentUser");
  const currentUser: User | null = currentUserData
    ? JSON.parse(currentUserData)
    : null;
  const currentUserId = currentUser ? Number(currentUser.id) : null;

  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [profileImage, setProfileImage] = useState(user.image);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFollowing();
    loadFollowers();
    loadPosts(`/users/${user.id}/posts`);
    setProfileImage(user.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const loadFollowing = () => {
    api
      .get(`/users/${user.id}/following`)
      .then((response) => setFollowing(response.data))
      .catch((error) => console.log(error));
  };

  const loadFollowers = () => {
    api
      .get(`/users/${user.id}/followers`)
      .then((response) => setFollowers(response.data))
      .catch((error) => console.log(error));
  };

  const followUser = () => {
    api
      .post(`/users/${user.id}/follow_or_unfollow/`)
      .then(() => loadFollowers())
      .catch((error) => console.log(error));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.patch(`/users/${currentUserId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImage(res.data.image);

      // update localStorage
      if (currentUser) {
        const updatedUser = { ...currentUser, image: res.data.image };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-slate-50 shadow-md p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="relative rounded-full bg-slate-200 overflow-hidden">
            <img
              className="h-32 w-32 object-cover"
              src={profileImage}
              alt={user.username}
            />

            {/* Only show upload button if it's the current user */}
            {currentUserId === user.id && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md hover:bg-black/70 transition"
                >
                  Change
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <span className="text-lg text-gray-500">@{user.username}</span>

              {currentUserId !== null && user.id !== currentUserId && (
                <>
                  {!followers.map((f) => f.id).includes(currentUserId) ? (
                    <button
                      onClick={followUser}
                      className="ml-2 px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      onClick={followUser}
                      className="ml-2 px-4 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Unfollow
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-700 text-lg mt-2">
              <Link to="/followers">{followers.length} followers</Link>
              &middot;
              <Link to="/following">{following.length} following</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="flex flex-col gap-6">
          {posts?.length > 0 ? (
            posts.map((post) => <PostCard post={post} key={post.id} />)
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
          {posts?.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
