import { useEffect, useRef, useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import NotificationCard from "./NotificationCard";

const Notification = () => {
  const { notifications, markAllAsRead, setOpenNotification } =
    useNotification();
  const [tab, setTab] = useState("all");
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={notificationRef}
      className="absolute top-10 right-0 w-96 bg-white rounded-xl shadow-lg p-4 z-50 transition transform origin-top-right"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => setTab("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            tab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setTab("unread")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            tab === "unread"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Unread
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
        {notifications.length > 0 ? (
          notifications
            .filter((n) => (tab === "unread" ? !n.read : true))
            .map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            No notifications yet 🎉
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
