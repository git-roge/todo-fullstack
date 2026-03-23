import { Navigate } from "react-router-dom";

function ProtectedRoute({children, allowedRoutes}) {
    const access = localStorage.getItem("access");
    const role = localStorage.getItem("role")

    if(!access) {
        return <Navigate to="/login" replace />;
    }
    
    if(allowedRoutes && !allowedRoutes.includes(role)) {
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default ProtectedRoute;