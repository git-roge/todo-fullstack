import { useContext } from "react";
import { FaBook, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../auth/AuthProvider";
import users from "../../api/users";
import {jwtDecode} from "jwt-decode";
import { getAccessToken, setAccessToken } from "../../auth/tokenStore";

export default function Sidebar({ collapsed, toggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {setIsLoggedIn, setLoggedOut} = useContext(AuthContext)
  const token = getAccessToken();
  const decoded = jwtDecode(token);
  const role = decoded.role || "worker";
  const username = decoded.username || "Guest";
  
  const menuItems = {
    admin: [
        { path: "/", label: "Todo List", icon: "📋" },
        { path: "/create", label: "Create Todo", icon: "➕" },
        { path: "/usersList", label: "Users List", icon: "📋" },
    ],
    worker: [
        { path: "/", label: "Todo List", icon: "📋" },
      ]
    };
  
  let roleMenuItems = menuItems[role] || [];
  const handleLogout = async () => {

    try{
      await users.post("users/logout/", {
        withCredentials: true,
      });
    }catch(err){
      console.log("Logout failed", err);
    }
    
    setIsLoggedIn(false);
    setAccessToken(null);
    navigate('/login', {replace: true})
  }

  return (
    <div
      className={`bg-blue-100 ring-1 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-[280px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-300">
        {!collapsed && (
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <FaBook className="text-3xl text-blue-700" />
              <h1 className="text-2xl font-bold text-blue-900">Todo App</h1>
            </div>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          className="text-blue-700 hover:text-blue-900 focus:outline-none"
        >
          <FaBars size={20} />
        </button>
      </div>
      <div className="flex justify-between py-2 px-6 ring-1">
        <h1 className="text-xl font-semibold text-blue-900">{username}</h1>
        <h1 className="text-xl font-semibold text-blue-900">{role}</h1>
      </div>
      {/* Menu */}
      <nav
        className={`flex flex-col p-4 flex-1 overflow-y-auto space-y-4 ${
          collapsed ? "items-center" : ""
        }`}
      >
        {roleMenuItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`text-blue-800 rounded px-3 py-2 font-medium flex items-center space-x-2 w-full ${
                isActive ? "bg-blue-300 font-semibold" : "hover:bg-blue-200"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`m-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 ${
          collapsed ? "mx-auto px-0 w-10" : ""
        }`}
      >
        {!collapsed ? "Logout" : "🚪"}
      </button>
    </div>
  );
}