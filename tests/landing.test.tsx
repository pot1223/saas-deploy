import { render, screen } from '@testing-library/react'
import LandingPage from '../app/page'
import { describe, it, expect } from 'vitest'

describe('LandingPage', () => {
  it('renders the hero section with correct title', () => {
    render(<LandingPage />)
    const title = screen.getByText(/Your Thoughts, Organized/i)
    expect(title).toBeInTheDocument()
    expect(screen.getByText(/Everywhere/i)).toBeInTheDocument()
  })

  it('renders the "Start for Free" button', () => {
    render(<LandingPage />)
    const button = screen.getByRole('button', { name: /Start for Free/i })
    expect(button).toBeInTheDocument()
  })

  it('renders the navigation links', () => {
    render(<LandingPage />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Testimonials')).toBeInTheDocument()
  })
})
