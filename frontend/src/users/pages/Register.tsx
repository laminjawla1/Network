import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<Array<string>>([]);

  const updateForm = async (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError([]);
  };

  const handleRegistrationFormSubmission = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError([]);
    e.preventDefault();

    if (!form.firstName) {
      setError(["First name is required!"]);
      return;
    }
    if (!form.lastName) {
      setError(["Last name is required!"]);
      return;
    }
    if (!form.username) {
      setError(["Username is required!"]);
      return;
    }
    if (!form.password) {
      setError(["Password is required!"]);
      return;
    }
    if (!form.confirmPassword) {
      setError(["Confirm password is required!"]);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(["Passwords does not match"]);
      return;
    }

    api
      .post("/users/register/", {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        password: form.password,
      })
      .then(() => {
        navigate("/users/login", {
          state: { message: "Registration successful!" },
        });
      })
      .catch((error) => {
        if (error.response?.data && typeof error.response.data === "object") {
          const values = Object.values(error.response.data);

          for (const val of values) {
            if (Array.isArray(val)) {
              setError((prev) => [...(prev ?? []), ...(val as string[])]);
            }
          }
        }
      });
  };

  useEffect(() => {
    if (error) {
      error.forEach((error) => toast.error(error));
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <img src="/networking.png" alt="Networking" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-gray-800">Network</h1>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">
          Create a new account
        </h2>
        <p className="text-gray-600 text-center mb-4">It's quick and easy.</p>
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Form */}
        <form onSubmit={handleRegistrationFormSubmission}>
          {/* First + Last Name */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="First name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.firstName}
              onChange={(e) => updateForm("firstName", e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.lastName}
              onChange={(e) => updateForm("lastName", e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.username}
              onChange={(e) => updateForm("username", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.confirmPassword}
              onChange={(e) => updateForm("confirmPassword", e.target.value)}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/users/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
