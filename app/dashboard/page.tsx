'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f6f6f8] text-slate-900 font-display">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/" className="flex items-center gap-2 text-[#1337ec]">
            <span className="material-symbols-outlined font-bold">cloud_done</span>
            <span className="text-xl font-bold text-slate-900">CloudNote</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <nav className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-[#1337ec]">
              <span className="material-symbols-outlined text-xl">description</span>
              All Notes
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-xl">star</span>
              Favorites
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-xl">archive</span>
              Archived
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-xl">delete</span>
              Trash
            </button>
          </nav>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Folders</h3>
            <div className="mt-2 space-y-1">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <span className="material-symbols-outlined text-xl text-amber-500">folder</span>
                Work Projects
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <span className="material-symbols-outlined text-xl text-[#1337ec]">folder</span>
                Personal
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
            <div className="h-8 w-8 rounded-full bg-slate-300"></div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-bold">User Name</p>
              <p className="truncate text-[10px] text-slate-500">user@example.com</p>
            </div>
            <button className="material-symbols-outlined text-slate-400">settings</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full rounded-lg border-0 bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1337ec]"
              placeholder="Search notes..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold shadow-sm hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Sort
            </button>
            <Link href="/note/new">
              <button className="flex items-center gap-2 rounded-lg bg-[#1337ec] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#1337ec]/20 hover:bg-[#1337ec]/90 transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">add</span>
                New Note
              </button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">All Notes ({filteredNotes.length})</h1>
            <div className="flex gap-2">
              <button className="material-symbols-outlined rounded p-1 text-slate-400 hover:bg-white hover:text-[#1337ec] shadow-sm">grid_view</button>
              <button className="material-symbols-outlined rounded p-1 text-slate-400 hover:bg-white hover:text-[#1337ec]">view_list</button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1337ec] border-t-transparent"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-slate-200 p-6 text-slate-400">
                <span className="material-symbols-outlined !text-6xl">note_stack</span>
              </div>
              <h3 className="text-xl font-bold">No notes found</h3>
              <p className="mt-2 text-slate-500">Start capturing your thoughts by creating your first note.</p>
              <Link href="/note/new">
                <button className="mt-6 font-bold text-[#1337ec] hover:underline">Create a new note →</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNotes.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`}>
                  <div className="group flex h-48 flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#1337ec]/30 hover:shadow-md">
                    <div>
                      <div className="mb-4 flex items-start justify-between">
                        <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#1337ec]">
                          {note.category || 'Draft'}
                        </span>
                        <button className="material-symbols-outlined text-slate-300 hover:text-amber-500">star</button>
                      </div>
                      <h3 className="mb-2 line-clamp-1 font-bold">{note.title || 'Untitled'}</h3>
                      <p className="line-clamp-3 text-xs leading-relaxed text-slate-500">
                        {note.content || 'No content yet...'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="material-symbols-outlined text-sm text-slate-400 hover:text-red-500">delete</button>
                        <button className="material-symbols-outlined text-sm text-slate-400 hover:text-[#1337ec]">share</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
