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
    expect(screen.getAllByRole('link', { name: /Đăng nhập/i }).length).toBeGreaterThan(0)
  })

  it('renders contact page when navigating to /lien-he', () => {
    window.history.pushState({}, 'Liên hệ', '/lien-he')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Cùng tạo một/i })).toBeTruthy()
    expect(screen.getByText(/Showroom Plant Shop/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Gửi yêu cầu tư vấn miễn phí/i })).toBeTruthy()
  })

  it('renders login page when navigating to /dang-nhap', () => {
    window.history.pushState({}, 'Đăng nhập', '/dang-nhap')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Đăng nhập/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Đăng nhập →/i })).toBeTruthy()
    expect(screen.getByText(/customer@plantshop.vn/i)).toBeTruthy()
  })

  it('renders register page when navigating to /dang-ky', () => {
    window.history.pushState({}, 'Đăng ký', '/dang-ky')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Tạo tài khoản/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Tạo tài khoản →/i })).toBeTruthy()
  })

  it('renders cart page when navigating to /gio-hang', () => {
    window.history.pushState({}, 'Giỏ hàng', '/gio-hang')
    render(<App />)

    expect(screen.getByRole('heading', { name: /Những lựa chọn/i })).toBeTruthy()
  })
})
