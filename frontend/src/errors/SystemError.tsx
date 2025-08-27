import { Link, useRouteError } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

const SystemError = () => {
  const error = useRouteError();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-6 text-center">
      <FaExclamationTriangle className="text-red-600 text-6xl mb-6" />

      <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-2">
        Oops! Something went wrong.
      </h1>

      <p className="text-base md:text-lg text-gray-700 mb-6 max-w-xl">
        An unexpected error occurred. Please try again later or contact support
        if the issue continues.
      </p>

      {error?.message && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mb-6 max-w-xl w-full text-sm">
          <strong>Error details:</strong> {error.message}
        </div>
      )}

      <Link
        to="/"
        className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300"
      >
        Go back home
      </Link>
    </div>
  );
};

export default SystemError;
