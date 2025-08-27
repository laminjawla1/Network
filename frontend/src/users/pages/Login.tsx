import { Link } from "react-router";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 p-4">
      {/* Left side */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm md:max-w-md mb-8 md:mb-0 md:mr-12">
        <div className="flex items-center gap-2 mb-4">
          <img src="/networking.png" alt="Networking" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-gray-800">Network</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Connect with friends and the world around you on{" "}
          <span className="font-semibold">Network</span>.
        </p>
      </div>

      {/* Right side */}
      <form className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <Link
          to="/users/forgot-password"
          className="block text-center text-blue-600 text-sm mt-4 hover:underline"
        >
          Forgot password?
        </Link>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        <Link
          to="/users/register"
          className="block w-full text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Create new account
        </Link>
      </form>
    </div>
  );
};

export default Login;
