import { Link } from "react-router";
import { FileText, Image, Settings, ListChecks } from "lucide-react";

export default function CMS() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Management System (CMS)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage website content, pages, and media
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="#"
          className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
          <p className="mt-1 text-sm text-gray-500">Edit and organize website pages</p>
        </Link>

        <Link
          to="#"
          className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Image className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
          <p className="mt-1 text-sm text-gray-500">Manage images, videos, and other assets</p>
        </Link>

        <Link
          to="#"
          className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
            <ListChecks className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Forms</h2>
          <p className="mt-1 text-sm text-gray-500">Create and manage website forms</p>
        </Link>

        <Link
          to="#"
          className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 mb-4">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <p className="mt-1 text-sm text-gray-500">Configure CMS general settings</p>
        </Link>
      </div>
    </div>
  );
} 