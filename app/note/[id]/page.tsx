'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function NoteEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [loading, setLoading] = useState(id !== 'new');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      }
    } catch (err) {
      console.error('Error fetching note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const noteData = {
        title,
        content,
        category,
        user_id: userData.user.id,
        updated_at: new Date().toISOString(),
      };

      if (id === 'new') {
        const { data, error } = await supabase
          .from('notes')
          .insert([noteData])
          .select()
          .single();
        if (error) throw error;
        router.push(`/note/${data.id}`);
      } else {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', id);
        if (error) throw error;
      }
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f6f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1337ec] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#f6f6f8] text-slate-900 font-display">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="material-symbols-outlined text-sm">folder</span>
            <span>{category}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-xs">
              {saving ? 'sync' : 'cloud_done'}
            </span>
            {saving ? 'Saving...' : lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved yet'}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1337ec] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#1337ec]/20 hover:bg-[#1337ec]/90 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Now'}
          </button>
          <button className="material-symbols-outlined rounded-lg p-2 text-slate-400 hover:bg-slate-50">more_vert</button>
        </div>
      </header>

      {/* Editor Main */}
      <main className="flex-1 overflow-y-auto pt-12 pb-24">
        <div className="mx-auto max-w-4xl px-8">
          {/* Metadata/Tags Area */}
          <div className="mb-8 flex flex-wrap gap-2">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700 outline-none hover:bg-slate-300 transition-colors cursor-pointer"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work Projects</option>
              <option value="Ideas">Ideas</option>
            </select>
            <button className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400 hover:border-[#1337ec] hover:text-[#1337ec]">
              <span className="material-symbols-outlined text-xs">add</span>
              Add Tags
            </button>
          </div>

          {/* Title Area */}
          <input
            className="mb-6 w-full bg-transparent text-5xl font-black tracking-tight outline-none placeholder:text-slate-300"
            placeholder="Note Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Toolbar */}
          <div className="sticky top-0 z-10 mb-8 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/80 p-1.5 shadow-sm backdrop-blur-md">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">format_bold</span></button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">format_italic</span></button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">format_underlined</span></button>
            <div className="mx-2 h-6 w-[1px] bg-slate-200"></div>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">format_list_bulleted</span></button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">format_list_numbered</span></button>
            <div className="mx-2 h-6 w-[1px] bg-slate-200"></div>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">image</span></button>
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><span className="material-symbols-outlined">link</span></button>
          </div>

          {/* Body Area */}
          <textarea
            aria-label="content"
            className="min-h-[500px] w-full resize-none bg-transparent text-lg leading-relaxed outline-none placeholder:text-slate-300"
            placeholder="Start writing your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </main>

      {/* Floating Action Menu (Optional but good for WOW factor) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 rounded-full bg-slate-900 px-6 py-3 text-white shadow-2xl">
        <div className="flex items-center gap-2 border-r border-white/20 pr-6">
          <span className="text-xs text-slate-400">Word Count</span>
          <span className="text-sm font-bold">{content.trim() === '' ? 0 : content.trim().split(/\s+/).length} words</span>
        </div>
        <div className="flex gap-4">
          <button className="material-symbols-outlined text-slate-400 hover:text-white transition-colors">share</button>
          <button className="material-symbols-outlined text-slate-400 hover:text-white transition-colors">history</button>
          <button className="material-symbols-outlined text-slate-400 hover:text-red-400 transition-colors">delete</button>
        </div>
      </div>
    </div>
  );
}
