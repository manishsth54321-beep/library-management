import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, RefreshCw, LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/books", icon: BookOpen, label: "Books" },
    { path: "/members", icon: Users, label: "Members" },
    { path: "/issues", icon: RefreshCw, label: "Issue / Return" },
  ];

  const handleLogout = () => {
    // Clear any auth data here
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Library System</h1>
        <p className="text-gray-400 text-sm mt-1">Management Portal</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;