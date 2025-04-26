"use client";

import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "clients", name: "Clients", icon: "👥" },
    { id: "calls", name: "Call Tracker", icon: "📞" },
    { id: "scripts", name: "Call Scripts", icon: "📝" },
    { id: "stats", name: "Statistics", icon: "📊" },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <span className="text-xl font-semibold">Dashboard</span>
        </div>
        <div className="mt-5 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${
                  activeTab === item.id
                    ? "bg-indigo-100 text-indigo-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
              >
                <span className="mr-3 h-6 w-6 flex-shrink-0 text-center">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 