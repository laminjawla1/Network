import { AiTwotoneLike } from "react-icons/ai";
import type { _Notification, NotificationType } from "../types/posts";
import { SlUserFollow } from "react-icons/sl";
import { FaBlog, FaRegComment } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import type { IconType } from "react-icons/lib";
import { timeAgo } from "../utils/date";
import { IoMailUnreadOutline } from "react-icons/io5";
import { useNotification } from "../contexts/NotificationContext";

const icons: Record<NotificationType, IconType> = {
  like: AiTwotoneLike,
  follow: SlUserFollow,
  comment: FaRegComment,
  post: FaBlog,
  system: CiSettings,
};

const NotificationCard = ({
  notification,
}: {
  notification: _Notification;
}) => {
  const { markAsRead } = useNotification();
  const Icon = icons[notification.type];

  return (
    <div
      className="flex items-center gap-3 hover:bg-slate-200 py-3 px-2 rounded-md cursor-pointer"
      onClick={() => markAsRead(notification.id)}
    >
      {/* Avatar + overlay icon */}
      <div className="relative min-w-[3.5rem]">
        <img
          className="h-14 w-14 rounded-full object-cover"
          src={notification.sender.image}
          alt={notification.sender.username}
        />
        <Icon
          className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 text-blue-600 shadow-md"
          size={22}
        />
      </div>

      {/* Message + Time + Unread Icon */}
      <div className="flex-1 flex flex-row items-center justify-between">
        <div
          className={notification.read ? "text-slate-500" : "text-slate-900"}
        >
          <p className="text-sm">{notification.message}</p>
          <p className="text-xs text-slate-500">
            {timeAgo(notification.created_at)}
          </p>
        </div>
        {!notification.read && (
          <IoMailUnreadOutline className="text-lg text-blue-600 ml-2 flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
