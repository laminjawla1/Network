import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <h1 className="text-7xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Access Denied
      </p>
      <p className="text-gray-500 mb-6">
        You don't have permission to view this page.
      </p>
      <Link
        to="/"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded transition duration-300"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Forbidden;
