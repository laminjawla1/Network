import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ChangePassword = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const changePassword = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/users/change_password/", form);
      toast.success(response.data.detail);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data && typeof err.response.data === "object") {
        const messages = Object.values(err.response.data).flat();
        messages.forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error("Unable to change your password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <form onSubmit={changePassword}>
          <h2 className="text-2xl font-bold text-center mb-6">
            Change Password
          </h2>

          {/* Old Password */}
          <div className="mb-4">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.old_password}
              onChange={(e) => updateForm("old_password", e.target.value)}
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.new_password}
              onChange={(e) => updateForm("new_password", e.target.value)}
            />
          </div>

          {/* Confirm New Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.confirm_new_password}
              onChange={(e) =>
                updateForm("confirm_new_password", e.target.value)
              }
            />
          </div>

          <button
            disabled={loading}
            className={`w-full mt-6 font-medium py-2 rounded-full transition duration-200 ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
