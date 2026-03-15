import { render, screen, fireEvent } from '@testing-library/react'
import AuthPage from '../app/auth/page'
import { describe, it, expect, vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('AuthPage', () => {
  it('renders login form by default', () => {
    render(<AuthPage />)
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })

  it('shows password visibility toggle', () => {
    render(<AuthPage />)
    const toggleButton = screen.getByText('visibility')
    expect(toggleButton).toBeInTheDocument()
  })

  it('renders social login buttons', () => {
    render(<AuthPage />)
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
