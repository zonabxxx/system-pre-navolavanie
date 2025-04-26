"use client";

import React, { useState, useEffect } from "react";

interface Call {
  id: string;
  date: string;
  clientName: string;
  clientId: string;
  duration: number;
  outcome: string;
  notes: string;
}

export default function CallTracker() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCallForm, setShowNewCallForm] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [newCall, setNewCall] = useState({
    clientId: "",
    duration: 0,
    outcome: "SUCCESSFUL",
    notes: "",
  });

  // Mock data for demonstration
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setClients([
        { id: "1", name: "John Smith" },
        { id: "2", name: "Jane Doe" },
        { id: "3", name: "Michael Johnson" },
      ]);

      setCalls([
        {
          id: "1",
          date: "2025-04-26T10:30:00",
          clientName: "John Smith",
          clientId: "1",
          duration: 180,
          outcome: "SUCCESSFUL",
          notes: "Client is interested in our premium package",
        },
        {
          id: "2",
          date: "2025-04-25T14:15:00",
          clientName: "Jane Doe",
          clientId: "2",
          duration: 90,
          outcome: "FOLLOW_UP",
          notes: "Will call back next week after internal discussion",
        },
        {
          id: "3",
          date: "2025-04-24T11:00:00",
          clientName: "Michael Johnson",
          clientId: "3",
          duration: 120,
          outcome: "VOICEMAIL",
          notes: "Left a detailed message",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleNewCall = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be an API call in a real application
    const clientName = clients.find((c) => c.id === newCall.clientId)?.name || "";
    const callWithDetails = {
      ...newCall,
      id: `${calls.length + 1}`,
      date: new Date().toISOString(),
      clientName,
    };
    setCalls([callWithDetails, ...calls]);
    setNewCall({
      clientId: "",
      duration: 0,
      outcome: "SUCCESSFUL",
      notes: "",
    });
    setShowNewCallForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCall({ ...newCall, [name]: name === "duration" ? parseInt(value) || 0 : value });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getOutcomeBadgeColor = (outcome: string) => {
    const colors = {
      SUCCESSFUL: "bg-green-100 text-green-800",
      UNSUCCESSFUL: "bg-red-100 text-red-800",
      VOICEMAIL: "bg-yellow-100 text-yellow-800",
      NO_ANSWER: "bg-gray-100 text-gray-800",
      WRONG_NUMBER: "bg-orange-100 text-orange-800",
      FOLLOW_UP: "bg-blue-100 text-blue-800",
    };
    return colors[outcome as keyof typeof colors] || colors.SUCCESSFUL;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Call Tracker</h1>
        <button
          onClick={() => setShowNewCallForm(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Log New Call
        </button>
      </div>

      {showNewCallForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Log New Call</h2>
          <form onSubmit={handleNewCall}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  value={newCall.clientId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  name="duration"
                  id="duration"
                  required
                  value={newCall.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">
                  Outcome
                </label>
                <select
                  id="outcome"
                  name="outcome"
                  required
                  value={newCall.outcome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="SUCCESSFUL">Successful</option>
                  <option value="UNSUCCESSFUL">Unsuccessful</option>
                  <option value="VOICEMAIL">Voicemail</option>
                  <option value="NO_ANSWER">No Answer</option>
                  <option value="WRONG_NUMBER">Wrong Number</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={newCall.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewCallForm(false)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outcome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calls.map((call) => (
              <tr key={call.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(call.date).toLocaleDateString()} {new Date(call.date).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{call.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDuration(call.duration)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOutcomeBadgeColor(
                      call.outcome
                    )}`}
                  >
                    {call.outcome.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{call.notes}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 