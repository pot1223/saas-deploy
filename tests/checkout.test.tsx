import { render, screen } from '@testing-library/react'
import CheckoutPage from '../app/checkout/page'
import { describe, it, expect } from 'vitest'

describe('CheckoutPage', () => {
  it('renders progress tracker at 100%', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/100%/i)).toBeInTheDocument()
  })

  it('renders success message', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Payment Successful/i)).toBeInTheDocument()
    expect(screen.getByText(/Subscription Activated/i)).toBeInTheDocument()
  })

  it('renders order summary', () => {
    render(<CheckoutPage />)
    expect(screen.getByText(/Order Details/i)).toBeInTheDocument()
    expect(screen.getByText(/CloudNote Professional/i)).toBeInTheDocument()
  })
})
