import { useEffect, useState } from "react";
import API from "../api/axios";

type Note = { _id: string; title: string };

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);

  const load = async () => {
    try {
      const { data } = await API.get("/notes");
      setNotes(data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load notes");
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const create = async () => {
    const title = prompt("Note title")?.trim();
    if (!title) return;
    try { await API.post("/notes", { title }); load(); } 
    catch (err: any) { console.error(err); alert(err.response?.data?.message); }
  };

  const remove = async (id: string) => {
    try { await API.delete(`/notes/${id}`); load(); } 
    catch (err: any) { console.error(err); alert(err.response?.data?.message); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} className="text-blue-600">Sign Out</button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold mb-1">
            Welcome, {JSON.parse(localStorage.getItem("user")||"{}").name || "User"} !
          </h2>
          <p className="text-sm text-gray-600">
            Email: {JSON.parse(localStorage.getItem("user")||"{}").email || "xxxxx@xxx.com"}
          </p>
        </div>

        <button onClick={create} className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4">Create Note</button>

        <h3 className="mb-2 font-semibold">Notes</h3>
        <div className="space-y-2">
          {notes.map(n => (
            <div key={n._id} className="flex items-center justify-between bg-white p-3 rounded shadow">
              <span>{n.title}</span>
              <button onClick={() => remove(n._id)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
