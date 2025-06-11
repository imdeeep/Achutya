import { Outlet, NavLink } from "react-router";
import { Home, Package, MapPin, Users, BookOpen, CreditCard, FileText, Newspaper, Megaphone, Star, Compass, BarChart, Settings } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/itineraries"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Itineraries
          </NavLink>
          <NavLink
            to="/admin/destinations"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <MapPin className="w-5 h-5 mr-3" />
            Destinations
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Bookings
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Payments
          </NavLink>
          <NavLink
            to="/admin/cms"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <FileText className="w-5 h-5 mr-3" />
            CMS
          </NavLink>
          <NavLink
            to="/admin/blog"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Newspaper className="w-5 h-5 mr-3" />
            Blog
          </NavLink>
          <NavLink
            to="/admin/marketing"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Megaphone className="w-5 h-5 mr-3" />
            Marketing
          </NavLink>
          <NavLink
            to="/admin/reviews"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Star className="w-5 h-5 mr-3" />
            Reviews
          </NavLink>
          <NavLink
            to="/admin/guides"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Compass className="w-5 h-5 mr-3" />
            Guides
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <BarChart className="w-5 h-5 mr-3" />
            Analytics
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center px-6 py-2.5 text-sm font-medium ${isActive ? "bg-gray-700 text-emerald-300" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
