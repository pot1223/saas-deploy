import { render, screen, fireEvent } from '@testing-library/react'
import NoteEditorPage from '../app/note/[id]/page'
import { describe, it, expect, vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1', title: 'Test Note', content: 'Test Content' }, error: null })),
        })),
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  useParams: vi.fn(() => ({ id: '1' })),
}))

describe('NoteEditorPage', () => {
  it('renders the editor with note content', async () => {
    render(<NoteEditorPage />)
    const titleInput = await screen.findByPlaceholderText(/Note Title/i)
    expect(titleInput).toHaveValue('Test Note')
  })

  it('updates note content on change', async () => {
    render(<NoteEditorPage />)
    const editor = await screen.findByRole('textbox', { name: /content/i })
    fireEvent.change(editor, { target: { value: 'Updated Content' } })
    expect(editor).toHaveValue('Updated Content')
  })

  it('renders the toolbar', async () => {
    render(<NoteEditorPage />)
    expect(await screen.findByText('format_bold')).toBeInTheDocument()
    expect(await screen.findByText('format_italic')).toBeInTheDocument()
  })
})
