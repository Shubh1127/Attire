import React, { useState } from "react";
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
} from "lucide-react";

const Sidebar = () => {
  const storedOwner = localStorage.getItem("user");
  const Owner = storedOwner ? JSON.parse(storedOwner) : null;
  const session = useSession();
  const user = session?.user;
  // console.log(user?.user_metadata?.avatar_url);
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
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
      className={`bg-white h-screen border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? "w-[78px]" : "w-[240px]"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {!collapsed && (
            <div className="font-semibold text-xl tracking-tight text-gray-800">
              ATTIRE
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
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
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!collapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div></div>

        <div className="p-4 border-t border-gray-200">
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
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || Owner?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
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
