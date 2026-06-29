import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-4">Access Denied</p>
        <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
        <Link to="/login" className="text-primary-600 hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
