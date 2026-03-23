import { useEffect, useState } from "react";
import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem("access")){
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}