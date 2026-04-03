import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { getAccessToken } from "../auth/tokenStore";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRoles }) {
    const { isLoggedIn, isAuthReady } = useContext(AuthContext);
    const token = getAccessToken();
    const decode = jwtDecode(token);
    const role = decode.role;

    // WAIT for auth check to finish
    if (!isAuthReady) {
        return <div>Loading...</div>; // or null / spinner
    }
    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;