import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 bg-black/30">
        <h1 className="text-2xl font-bold">College Management App</h1>
      </header>
      
       {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Smart College Management App
        </h2>
        <p className="text-lg sm:text-xl max-w-2xl mb-6">
          A modern management system for managing attendance, students, faculty, and reports with ease.
        </p>
        <div className="flex gap-4">
          <Link to="/home2">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-200">
              Get Started
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-4 bg-black/30 text-sm">
        © {new Date().getFullYear()} College Management App. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Home; 