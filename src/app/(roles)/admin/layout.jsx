'use client';

// Basic layout for Admin routes within the (roles) group
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar Placeholder (if needed later) */}
      {/* <div className="w-64 bg-gray-700 text-white">Admin Sidebar</div> */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 