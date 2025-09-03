import { Link } from "react-router-dom";

const Home2 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 bg-black/30">
        <h1 className="text-2xl font-bold">College Management App</h1>
        <nav>
          <ul className="flex gap-6">
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/register" className="hover:underline">Register</Link></li>
          </ul>
        </nav>
      </header>
      
       {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6">
        <h3 className="text-4xl sm:text-5xl font-bold mb-4">
          Enter Your College Code
        </h3>
        <input type="text" className="p-4 w-[50%] h-10 mt-4 border border-gray-500 bg-white text-black rounded-2xl" />
        <div className="flex gap-4">
          <Link to="/login">
            <button className="mt-4 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-200">
              Search
            </button>
          </Link>
        </div>
        <div className="mt-4">
          <Link to="/collegeRegister">
          <p>New User?</p>
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

export default Home2; 