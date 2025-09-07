import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api";
import type { User } from "../types/user";
import { NotificationProvider } from "../contexts/NotificationContext";

const Root = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    let user: User | null = null;
    if (userData) user = JSON.parse(userData);
    if (user) {
      setCurrentUser(user);
    } else {
      api
        .post("/users/current_user/")
        .then((response) => {
          setCurrentUser(response.data);
          localStorage.setItem("currentUser", JSON.stringify(response.data));
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div>
      <NotificationProvider>
        <Header currentUser={currentUser} />
      </NotificationProvider>
      <main className="mt-20 pb-20 flex justify-center px-2">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Root;
