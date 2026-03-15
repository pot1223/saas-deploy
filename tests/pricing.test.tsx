import { render, screen } from '@testing-library/react'
import PricingPage from '../app/pricing/page'
import { describe, it, expect, vi } from 'vitest'

// Mock the Toss Payments SDK
vi.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: vi.fn().mockResolvedValue({
    widgets: vi.fn().mockReturnValue({
      setAmount: vi.fn().mockResolvedValue(undefined),
      renderPaymentMethods: vi.fn().mockResolvedValue(undefined),
      renderAgreement: vi.fn().mockResolvedValue(undefined),
      requestPayment: vi.fn().mockResolvedValue(undefined),
    }),
  }),
  ANONYMOUS: 'ANONYMOUS',
}))

describe('PricingPage', () => {
  it('renders all pricing tiers', () => {
    render(<PricingPage />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('renders the checkout buttons', () => {
    render(<PricingPage />)
    const buttons = screen.getAllByRole('button', { name: /Choose Plan|Get Started|Start Free Trial/i })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('renders the payment method widget container', () => {
    render(<PricingPage />)
    const container = document.getElementById('payment-method')
    expect(container).toBeInTheDocument()
  })

  it('renders the agreement widget container', () => {
    render(<PricingPage />)
    const container = document.getElementById('agreement')
    expect(container).toBeInTheDocument()
  })
})
