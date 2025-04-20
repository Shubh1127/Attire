import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  LogOut,
  Settings,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

const Sidebar = () => {
  const storedOwner = localStorage.getItem("user");
  const Owner = storedOwner ? JSON.parse(storedOwner) : null;
  const session = useSession();
  const user=session?.user;
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: 'products/add', icon: <ShoppingBag size={20} /> },
    { name: 'Orders', href: '/orders', icon: <Package size={20} /> },
    { name: 'Customers', href: '/customers', icon: <Users size={20} /> },
    { name: 'Settings', href: 'settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`bg-white h-screen border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[78px]' : 'w-[240px]'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {!collapsed && (
            <div className="font-semibold text-xl tracking-tight text-gray-800">ATTIRE</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
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
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!collapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={user?.user_metadata?.avatar_url || Owner?.profileImage || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.full_name || Owner?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || Owner?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
