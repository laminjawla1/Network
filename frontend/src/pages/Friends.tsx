import { useEffect, useState } from "react";
import api from "../api";
import FriendsCard from "./components/FriendsCard";
import type { User } from "../types/user";

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    loadUsers("/users");
  }, []);

  const loadUsers = (endpoint: string) => {
    api
      .get(endpoint)
      .then((response) => {
        setUsers(response.data.results);
        setPrevious(response.data.previous);
        setNext(response.data.next);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {users.map((user) => (
          <FriendsCard user={user} key={user.id} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => previous && loadUsers(previous)}
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
          onClick={() => next && loadUsers(next)}
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

export default Friends;
