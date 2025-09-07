import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import api from "../api";
import type { _Notification, NotificationContextType } from "../types/posts";

type Prop = {
  children: ReactNode;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: Prop) => {
  const [notifications, setNotifications] = useState<_Notification[]>([]);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    api
      .get("/notifications")
      .then((response) => setNotifications(response.data.results))
      .catch((error) =>
        toast.error(
          error?.response?.data?.detail || "Failed to fetch notifications"
        )
      );
  };

  const markAllAsRead = () => {
    api
      .put(`/notifications/mark_all_as_read/`)
      .then((response) => {
        toast.success(response.data.message);
        loadNotifications();
      })
      .catch((error) => console.log(error));
  };

  const markAsRead = (id: number) => {
    api
      .patch(`/notifications/${id}/`, { read: true })
      .then(() => loadNotifications())
      .catch((error) => console.log(error));
  };

  return (
    <NotificationContext.Provider
      value={{
        markAsRead,
        markAllAsRead,
        notifications,
        openNotification,
        setOpenNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
