import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Boxes,
  Moon,
  Sun,
} from "lucide-react";
import { ThemeContext } from "../Context/ThemeContext"; // Adjust the path as needed

const Sidebar = () => {
  const storedOwner = localStorage.getItem("user");
  const Owner = storedOwner ? JSON.parse(storedOwner) : null;
  const session = useSession();
  const user = session?.user;
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Products", href: "products/add", icon: <ShoppingBag size={20} /> },
    { name: "Orders", href: "orders", icon: <Package size={20} /> },
    { name: "Customers", href: "customers", icon: <Users size={20} /> },
    { name: "Inventory", href: "inventory", icon: <Boxes size={20} /> },
    { name: "Settings", href: "settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={`h-screen border-r transition-all duration-300 ease-in-out ${
        collapsed ? "w-[78px]" : "w-[240px]"
      } ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col h-full">
        <div
          className={`p-4 border-b flex justify-between items-center ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {!collapsed && (
            <div
              className={`font-semibold text-xl tracking-tight ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              ATTIRE
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {collapsed ? (
              <ChevronsRight
                size={18}
                className={theme === "dark" ? "text-white" : "text-gray-800"}
              />
            ) : (
              <ChevronsLeft
                size={18}
                className={theme === "dark" ? "text-white" : "text-gray-800"}
              />
            )}
          </button>
        </div>

        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${
                    location.pathname === link.href
                      ? theme === "dark"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex-shrink-0">
                    {React.cloneElement(link.icon, {
                      className: theme === "dark" ? "text-white" : "text-gray-800",
                    })}
                  </span>
                  {!collapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <div className="p-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-full p-2 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-600" size={20} />
            )}
            {!collapsed && (
              <span
                className={`ml-3 ${
                  theme === "dark" ? "text-white" : "text-gray-600"
                }`}
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div> */}

        <div
          className={`p-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={
                  user?.user_metadata?.avatar_url ||
                  Owner?.profileImage ||
                  "data:image/jpeg;base64,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"
                }
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.user_metadata?.full_name || Owner?.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {user?.email || Owner?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;