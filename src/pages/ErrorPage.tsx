import { Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-gray-900 mb-8">404</h1>
        <h2 className="text-4xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          {error?.message || 'The page you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 text-xl font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
