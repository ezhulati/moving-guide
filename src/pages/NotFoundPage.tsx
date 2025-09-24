import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">404</h1>
        <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Page Not Found</p>
        <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;