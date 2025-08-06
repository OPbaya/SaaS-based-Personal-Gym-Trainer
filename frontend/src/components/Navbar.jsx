import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
// import Dashboard from "../pages/Dashboard";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          SB AI
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <UserButton />
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:cursor-pointer"
              variant="outline"
            >
              Dashboard
            </button>
            {/* <button onClick={() => openSignIn()}>Sign In</button>
              <button onClick={() => openSignUp()}>Sign Up</button> */}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link>
              <button
                onClick={openSignIn}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:cursor-pointer"
                variant="outline"
              >
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
