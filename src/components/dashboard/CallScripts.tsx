"use client";

import React, { useState, useEffect } from "react";

interface Script {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export default function CallScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewScriptForm, setShowNewScriptForm] = useState(false);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [newScript, setNewScript] = useState({
    title: "",
    content: "",
    isActive: true,
  });

  // Mock data for demonstration
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setScripts([
        {
          id: "1",
          title: "Initial Contact Script",
          content:
            "Hello, my name is [Your Name] from [Company Name]. We help businesses like yours to [value proposition]. Is this a good time to talk?\n\nIf yes: Great! I'd like to ask you a few questions to see if our solutions might be a good fit for your needs.\n\nIf no: No problem. When would be a better time for us to connect?",
          isActive: true,
          createdAt: "2025-04-20T10:00:00",
        },
        {
          id: "2",
          title: "Follow-up Call Script",
          content:
            "Hello [Client Name], this is [Your Name] from [Company Name]. We spoke last week about [topic], and I'm calling to follow up as promised. Have you had a chance to think about what we discussed?\n\nIf yes: Great! What are your thoughts? [Listen and respond accordingly]\n\nIf no: No problem. Would you like me to go over the key points again, or would you prefer if I reach out at a later time?",
          isActive: true,
          createdAt: "2025-04-22T14:30:00",
        },
        {
          id: "3",
          title: "Objection Handling Script",
          content:
            "I understand your concern about [objection]. Many of our current clients initially had the same question.\n\nWhat we've found is that [address objection with facts/proof points].\n\nFurthermore, [provide additional value proposition].\n\nDoes that help address your concern?",
          isActive: false,
          createdAt: "2025-04-24T09:15:00",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleNewScript = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be an API call in a real application
    const scriptWithDetails = {
      ...newScript,
      id: `${scripts.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setScripts([...scripts, scriptWithDetails]);
    setNewScript({
      title: "",
      content: "",
      isActive: true,
    });
    setShowNewScriptForm(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewScript({ ...newScript, [name]: checked });
    } else {
      setNewScript({ ...newScript, [name]: value });
    }
  };

  const toggleScriptStatus = (id: string) => {
    setScripts(
      scripts.map((script) =>
        script.id === id ? { ...script, isActive: !script.isActive } : script
      )
    );
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
        <h1 className="text-2xl font-semibold text-gray-900">Call Scripts</h1>
        <button
          onClick={() => setShowNewScriptForm(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Script
        </button>
      </div>

      {showNewScriptForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Create New Script</h2>
          <form onSubmit={handleNewScript}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={newScript.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Script Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  required
                  value={newScript.content}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your script content here..."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={newScript.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Script
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewScriptForm(false)}
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

      {selectedScript && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-medium">{selectedScript.title}</h2>
            <button
              onClick={() => setSelectedScript(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap mb-4">
            {selectedScript.content}
          </div>
          <div className="text-sm text-gray-500">
            Created on {new Date(selectedScript.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className={`bg-white overflow-hidden shadow rounded-lg border ${
              script.isActive ? "border-green-200" : "border-gray-200"
            }`}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900 truncate">{script.title}</h3>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    script.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {script.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">{script.content}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setSelectedScript(script)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View Full Script
                </button>
                <button
                  onClick={() => toggleScriptStatus(script.id)}
                  className={`text-sm font-medium ${
                    script.isActive
                      ? "text-red-600 hover:text-red-900"
                      : "text-green-600 hover:text-green-900"
                  }`}
                >
                  {script.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 