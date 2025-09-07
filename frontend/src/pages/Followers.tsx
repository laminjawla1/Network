import { useEffect, useState } from "react";
import api from "../api";
import FollowersCard from "./components/FollowersCard";
import type { User } from "../types/user";

const Followers = () => {
  let currentUser: User | null = null;
  const currentUserData = localStorage.getItem("currentUser");
  if (currentUserData) {
    currentUser = JSON.parse(currentUserData);
  }
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api
      .get(`/users/${currentUserId}/followers`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  };
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {users.length > 0 ? (
        <>
          {users.map((user) => (
            <FollowersCard user={user} key={user.id} />
          ))}
        </>
      ) : (
        <div>You have no followers.</div>
      )}
    </div>
  );
};

export default Followers;
