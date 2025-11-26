import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContexts";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    // Optional: show nothing or a skeleton loader while auth state initializes
    return null;
  }

  const role = user?.role; // example: "doctor" | "patient"

  return (
    <header className=" top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-600">
          Doc<span className="text-indigo-500">Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          {/* Role-based menu */}
          {isAuthenticated ? (
            <>
              {role === "doctor" && (
                <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  My Profile
                </Link>
                <Link to="/my-appointment" className="text-gray-700 hover:text-blue-600">
                  My Appointments
                </Link>
                </>
              )}
              {role === "customer" && (
                <>
                <Link to="/doctors" className="text-gray-700 hover:text-blue-600">
            Doctors
          </Link>
          <Link to="/appointments" className="text-gray-700 hover:text-blue-600">
                  My Appointments
                </Link>
              
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>

          <Link to="/consult" className="text-gray-700 hover:text-blue-600">
            Consult
          </Link>
          </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/doctors" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
              Doctors
            </Link>
            <Link to="/consult" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
              Consult
            </Link>

            {isAuthenticated ? (
              <>
                {role === "doctor" && (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                {role === "customer" && (
                  <Link to="/appointments" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
                    My Appointments
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
