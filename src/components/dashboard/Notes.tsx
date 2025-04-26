"use client";

import React, { useState, useEffect } from "react";

interface Note {
  id: string;
  clientName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  
  const [newNote, setNewNote] = useState({
    clientName: "",
    content: "",
    tags: ""
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to fetch notes
    setTimeout(() => {
      const mockNotes: Note[] = [
        {
          id: "1",
          clientName: "ESET",
          content: "Client expressed interest in our premium plan. Follow up next week to discuss pricing options.",
          createdAt: "2023-11-10T09:30:00Z",
          updatedAt: "2023-11-10T09:30:00Z",
          tags: ["follow-up", "sales"]
        },
        {
          id: "2",
          clientName: "Slovak Telekom",
          content: "Client reported issues with current service. Technical team has been notified. Need to schedule maintenance visit.",
          createdAt: "2023-11-09T14:15:00Z",
          updatedAt: "2023-11-09T15:45:00Z",
          tags: ["support", "technical", "urgent"]
        },
        {
          id: "3",
          clientName: "Orange Slovensko",
          content: "Annual contract review scheduled for Dec 15. Prepare renewal options with 10% discount incentive.",
          createdAt: "2023-11-08T11:00:00Z",
          updatedAt: "2023-11-08T11:00:00Z",
          tags: ["contract", "renewal"]
        },
        {
          id: "4",
          clientName: "Lidl Slovensko",
          content: "Met with new procurement manager. They're looking to expand services in Q1 next year. Send proposal by end of month.",
          createdAt: "2023-11-07T16:30:00Z",
          updatedAt: "2023-11-07T16:30:00Z",
          tags: ["opportunity", "proposal"]
        },
        {
          id: "5",
          clientName: "Alza.sk",
          content: "Client complained about response times. Escalated to senior support team. Need to improve SLA adherence.",
          createdAt: "2023-11-06T10:20:00Z",
          updatedAt: "2023-11-06T13:45:00Z",
          tags: ["complaint", "support", "urgent"]
        }
      ];
      
      setNotes(mockNotes);
      setFilteredNotes(mockNotes);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter notes based on search term
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = notes.filter(note => 
        note.clientName.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term) || 
        note.tags.some(tag => tag.toLowerCase().includes(term))
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.clientName.trim() || !newNote.content.trim()) {
      alert("Client name and note content are required.");
      return;
    }
    
    const now = new Date().toISOString();
    const tagsArray = newNote.tags
      ? newNote.tags.split(",").map(tag => tag.trim().toLowerCase())
      : [];
    
    const newNoteObj: Note = {
      id: Date.now().toString(),
      clientName: newNote.clientName,
      content: newNote.content,
      createdAt: now,
      updatedAt: now,
      tags: tagsArray
    };
    
    setNotes(prev => [newNoteObj, ...prev]);
    setShowAddForm(false);
    setNewNote({
      clientName: "",
      content: "",
      tags: ""
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Call Notes</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? "Cancel" : "Add New Note"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Note</h2>
          <form onSubmit={handleAddNote}>
            <div className="mb-4">
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={newNote.clientName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Note Content
              </label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newNote.tags}
                onChange={handleChange}
                placeholder="e.g. follow-up, important, sales"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search notes by client, content, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {selectedNote ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{selectedNote.clientName}</h2>
              <p className="text-sm text-gray-500">
                Created: {formatDate(selectedNote.createdAt)}
                {selectedNote.createdAt !== selectedNote.updatedAt && 
                  ` | Updated: ${formatDate(selectedNote.updatedAt)}`}
              </p>
            </div>
            <button
              onClick={() => setSelectedNote(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.content}</p>
          </div>
          {selectedNote.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedNote.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{note.clientName}</h3>
                  <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                </div>
                <p className="text-gray-700 mb-2 line-clamp-2">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No notes found. Try adjusting your search or add a new note.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 