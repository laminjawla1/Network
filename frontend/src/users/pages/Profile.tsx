import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { User } from "../../types/user";
import api from "../../api";
import { toast } from "react-toastify";
import NotFound from "../../errors/NotFound";
import ProfileCard from "./ProfileCard";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = () => {
    api
      .get(`/users/${params.username}/`)
      .then((response) => setUser(response.data))
      .catch((error) => {
        toast.error(error.response.data.detail || "Failed to load user");
      });
  };

  return user !== null ? <ProfileCard user={user} /> : <NotFound />;
};

export default Profile;
