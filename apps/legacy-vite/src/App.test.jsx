import { render, screen } from '@testing-library/react'
import App from './App'

describe('Static Plant Shop app', () => {
  it('renders the new storefront home and public shop navigation', () => {
    render(<App />)

    expect(screen.getByText('Plant', { selector: 'strong' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /Cho trải nghiệm không chỉ là cây cảnh/i })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /Cửa hàng/i }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: /Giỏ hàng/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /Liên hệ/i }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: /Đăng nhập/i })).toBeNull()
  })

  it('renders contact page when navigating to /lien-he', () => {
    window.history.pushState({}, 'Liên hệ', '/lien-he')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Cùng tạo một/i })).toBeTruthy()
    expect(screen.getByText(/Showroom Plant Shop/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Gửi yêu cầu tư vấn miễn phí/i })).toBeTruthy()
  })
})
