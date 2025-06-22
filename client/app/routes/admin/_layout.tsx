import React, { useState } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  Home,
  Package,
  MapPin,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  Newspaper,
  Megaphone,
  Star,
  Compass,
  BarChart,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "~/hooks/auth";

function AdminLayoutInner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin/" },
    {
      id: "tours and itineraries",
      label: "Tours and Itineraries",
      icon: Package,
      href: "/admin/itineraries",
    },
    {
      id: "destinations",
      label: "Destinations",
      icon: MapPin,
      href: "/admin/destinations",
    },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    {
      id: "bookings",
      label: "Bookings and Payments",
      icon: CreditCard,
      href: "/admin/bookings",
    },
    { id: "cms", label: "CMS", icon: FileText, href: "/admin/cms" },
    { id: "blog", label: "Blog", icon: Newspaper, href: "/admin/blog" },
    {
      id: "marketing",
      label: "Marketing",
      icon: Megaphone,
      href: "/admin/marketing",
    },
    { id: "reviews", label: "Reviews", icon: Star, href: "/admin/reviews" },
    { id: "guides", label: "Guides", icon: Compass, href: "/admin/guides" },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart,
      href: "/admin/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      logout();
      // The logout function should handle navigation, but we can add a fallback
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if logout fails
      window.location.href = "/login";
    }
  };

  // Get current route information
  const getCurrentRouteInfo = () => {
    const currentPath = location.pathname;
    // Find the most specific match by sorting by path length in descending order
    const currentItem = [...navigationItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => currentPath.startsWith(item.href));

    if (currentItem) {
      return {
        title: currentItem.label,
        icon: currentItem.icon,
        description: `Manage and configure ${currentItem.label.toLowerCase()}`,
      };
    }

    // Default fallback
    return {
      title: "Dashboard",
      icon: Home,
      description: "Welcome back to your admin panel",
    };
  };

  const currentRoute = getCurrentRouteInfo();

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        ${sidebarCollapsed ? "w-20" : "w-72"} 
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200 
        transition-all duration-300 ease-in-out flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div
            className={`flex items-center ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-md md:text-xl font-bold text-gray-800">
                  Achyuta Admin
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Travel Management
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  end={item.href === "/admin/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    w-full flex items-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
                    }
                    ${sidebarCollapsed ? "justify-center" : ""}
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent
                        className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"} flex-shrink-0`}
                      />
                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left">{item.label}</span>
                      )}
                      {!sidebarCollapsed && isActive && (
                        <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentRoute.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentRoute.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name || ""}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "Admin"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

// Export the protected admin layout
export default function AdminLayout() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayoutInner />
    </ProtectedRoute>
  );
}
