import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    // Return a loading indicator
    return null;
  }

  if (!user) {
    console.warn(`Please sign in to continue..`);
    return <Navigate to="/login" replace={true} state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
