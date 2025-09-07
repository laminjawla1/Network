import { Link, NavLink } from "react-router";
import type { UserInstance } from "../types/user";
import { IoChatbubbleEllipsesSharp, IoLogOut } from "react-icons/io5";
import { IoIosGitNetwork, IoMdNotifications } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaBlog, FaUserFriends } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { MdAccountCircle } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import Notification from "../notifications/Notification";
import { useNotification } from "../contexts/NotificationContext";

const Header = ({ currentUser }: UserInstance) => {
  const { notifications, openNotification, setOpenNotification } =
    useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: "Posts", url: "/", icon: <FaBlog /> },
    { name: "Friends", url: "friends", icon: <FaUserFriends /> },
    { name: "Followers", url: "followers", icon: <IoIosGitNetwork /> },
    { name: "Following", url: "following", icon: <SlUserFollowing /> },
  ];

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/networking.png" alt="Networking" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-gray-800">Network</h1>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              className={({ isActive }) =>
                `transition flex items-center gap-1 text-lg ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex relative items-center gap-6">
          {/* Chats with badge */}
          <div className="relative cursor-pointer hover:text-blue-600">
            <IoChatbubbleEllipsesSharp size={28} title="Chats" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </div>

          {/* Notifications with badge */}
          <div className="relative cursor-pointer">
            <IoMdNotifications
              onClick={() => setOpenNotification((prev) => !prev)}
              size={28}
              title="Notifications"
              className="hover:text-blue-600"
            />
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </span>
            )}
            {openNotification && <Notification />}
          </div>

          {/* Profile Menu */}
          <div ref={profileRef} className="relative">
            <MdAccountCircle
              size={32}
              title={currentUser?.username}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            />
            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                role="menu"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{currentUser?.username}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col">
                  <NavLink
                    to={`/${currentUser?.username}`}
                    role="menuitem"
                    reloadDocument
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <img
                      className="h-6 w-6 rounded-full border border-gray-200 object-cover"
                      src={
                        currentUser?.image.startsWith("http")
                          ? currentUser.image
                          : `http://localhost:8001${currentUser?.image}`
                      }
                      alt={currentUser?.username}
                    />
                    {"Profile"}
                  </NavLink>

                  {/* <NavLink
                    to="/settings"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <IoMdSettings className="text-gray-500" size={18} />
                    Settings
                  </NavLink> */}

                  <NavLink
                    to="/users/change-password"
                    role="menuitem"
                    aria-label="Change Password"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <RiLockPasswordFill
                      className="text-gray-500 group-hover:text-blue-600 flex-shrink-0"
                      size={18}
                    />
                    <span>Change Password</span>
                  </NavLink>

                  <div className="border-t border-gray-100 my-1"></div>

                  <NavLink
                    to="/users/logout"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <IoLogOut className="text-red-600" size={18} />
                    Logout
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              className={({ isActive }) =>
                `block text-lg ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                {link.icon}
                {link.name}
              </div>
            </NavLink>
          ))}
          <div className="flex items-center gap-4 border-t pt-3 mt-3">
            <MdAccountCircle size={28} title={currentUser?.username} />
            <span className="text-gray-700">{currentUser?.username}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
