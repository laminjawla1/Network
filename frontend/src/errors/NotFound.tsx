import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-7xl font-bold text-purple-700 mb-4">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </p>
      <p className="text-gray-500 mb-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded transition duration-300"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
