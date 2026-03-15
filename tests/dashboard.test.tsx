import { render, screen } from '@testing-library/react'
import DashboardPage from '../app/dashboard/page'
import { describe, it, expect, vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: '123' } }, error: null })),
    },
  },
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('DashboardPage', () => {
  it('renders the sidebar with navigation items', () => {
    render(<DashboardPage />)
    expect(screen.getByText('All Notes')).toBeInTheDocument()
    expect(screen.getByText('Folders')).toBeInTheDocument()
  })

  it('renders the search bar', () => {
    render(<DashboardPage />)
    expect(screen.getByPlaceholderText(/Search notes/i)).toBeInTheDocument()
  })

  it('renders the "New Note" buttons', () => {
    render(<DashboardPage />)
    const buttons = screen.getAllByRole('button', { name: /New Note/i })
    expect(buttons.length).toBeGreaterThan(0)
  })
})
