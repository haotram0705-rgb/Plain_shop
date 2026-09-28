import { render, screen } from '@testing-library/react'
import App from './App'

describe('Static Plant Shop app', () => {
  it('renders the new storefront home and public shop navigation', () => {
    render(<App />)

    expect(screen.getByText('Plant', { selector: 'strong' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /Cho trải nghiệm không chỉ là cây cảnh/i })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /Cửa hàng/i }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: /Giỏ hàng/i }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: /Đăng nhập/i })).toBeNull()
  })
})
