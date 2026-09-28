import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the storefront navigation and checkout entry point', () => {
    render(<App />)
    expect(screen.getByText('GreenNest', { selector: 'strong' })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /Sản phẩm/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Xác nhận đặt hàng/i })).toBeTruthy()
  })
})
