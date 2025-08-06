// components/ProtectedRoute.jsx
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openSignIn(); // ✅ opens the modal
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) return null;

  return children;
};

export default ProtectedRoute;
