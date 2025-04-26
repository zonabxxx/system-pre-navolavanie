"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ClientList from "@/components/dashboard/ClientList";
import CallTracker from "@/components/dashboard/CallTracker";
import CallScripts from "@/components/dashboard/CallScripts";
import Stats from "@/components/dashboard/Stats";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("clients");

  // Check if user is authenticated
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={session?.user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            {activeTab === "clients" && <ClientList />}
            {activeTab === "calls" && <CallTracker />}
            {activeTab === "scripts" && <CallScripts />}
            {activeTab === "stats" && <Stats />}
          </div>
        </main>
      </div>
    </div>
  );
} 