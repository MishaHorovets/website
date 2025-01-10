'use client';

export default function NotFound() {
  // idk maybe consider using router instead
  // for now I think works but can have some bugs
  const handleRedirect = () => {
    window.location.href = '/';
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="text-lg text-gray-700 mt-4">Sorry, the page you are looking for does not exist.</p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

