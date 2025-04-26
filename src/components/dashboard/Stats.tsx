"use client";

import React, { useState, useEffect } from "react";

interface DailyStats {
  date: string;
  callsMade: number;
  conversions: number;
}

interface AgentStats {
  name: string;
  callsMade: number;
  conversions: number;
  successRate: number;
}

export default function Stats() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      // Generate 30 days of mock data
      const mockDailyStats: DailyStats[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const callsMade = Math.floor(Math.random() * 30) + 20; // 20-50 calls per day
        const conversions = Math.floor(Math.random() * (callsMade * 0.4)); // 0-40% conversion rate
        
        mockDailyStats.push({
          date: date.toISOString().split("T")[0],
          callsMade,
          conversions,
        });
      }
      
      setDailyStats(mockDailyStats);
      
      // Mock agent statistics
      setAgentStats([
        {
          name: "John Doe",
          callsMade: 342,
          conversions: 47,
          successRate: 13.7,
        },
        {
          name: "Jane Smith",
          callsMade: 289,
          conversions: 62,
          successRate: 21.5,
        },
        {
          name: "Michael Brown",
          callsMade: 218,
          conversions: 28,
          successRate: 12.8,
        },
        {
          name: "Emily Johnson",
          callsMade: 401,
          conversions: 84,
          successRate: 20.9,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected timeframe
  const getFilteredData = () => {
    if (dailyStats.length === 0) return [];
    
    let filteredStats: DailyStats[] = [];
    
    if (timeframe === "daily") {
      // Last 7 days
      filteredStats = dailyStats.slice(-7);
    } else if (timeframe === "weekly") {
      // Last 14 days
      filteredStats = dailyStats.slice(-14);
    } else {
      // Monthly - all 30 days
      filteredStats = dailyStats;
    }
    
    return filteredStats;
  };

  const filteredStats = getFilteredData();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalCalls = dailyStats.reduce((sum, stat) => sum + stat.callsMade, 0);
  const totalConversions = dailyStats.reduce((sum, stat) => sum + stat.conversions, 0);
  const conversionRate = totalCalls > 0 ? ((totalConversions / totalCalls) * 100).toFixed(1) : "0";
  const averageCallsPerDay = (totalCalls / dailyStats.length).toFixed(1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Performance Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalCalls}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Conversions</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalConversions}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{conversionRate}%</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Average Calls/Day</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{averageCallsPerDay}</dd>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Call Activity</h2>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeframe === "daily"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setTimeframe("daily")}
                >
                  7 Days
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeframe === "weekly"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setTimeframe("weekly")}
                >
                  14 Days
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeframe === "monthly"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setTimeframe("monthly")}
                >
                  30 Days
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calls Made
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStats.map((stat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stat.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stat.callsMade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stat.conversions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {((stat.conversions / stat.callsMade) * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Agent
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Calls Made
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Conversions
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Success Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agentStats.map((agent, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.callsMade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.conversions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.successRate}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 