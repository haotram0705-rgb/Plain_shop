import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'

const defaultProducts = [
  {
    id: 1,
    name: 'Cây Kim Tiền Mini',
    category: 'Cây văn phòng',
    price: 290000,
    stock: 18,
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    size: '25-35 cm',
    badge: 'Bán chạy',
    tags: ['cay-xanh', 'cay-van-phong'],
    accessories: ['Chậu ceramic', 'Phân bón lá', 'Đất trồng'],
  },
  {
    id: 2,
    name: 'Cây Trầu Bà Đế Tháp',
    category: 'Cây trang trí',
    price: 420000,
    stock: 7,
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    size: '40-50 cm',
    badge: 'Mới',
    tags: ['cay-xanh', 'cay-nho-trang-tri'],
    accessories: ['Chậu mix', 'Thuốc kích rễ'],
  },
  {
    id: 3,
    name: 'Cây Lan Hồ Điệp',
    category: 'Hoa quà tặng',
    price: 650000,
    stock: 9,
    image:
      'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=900&q=80',
    size: 'Cây 1-1.2m',
    badge: 'Quà biếu',
    tags: ['cay-mix-qua-bieu', 'lan-ho-diep', 'chau-qua-bieu'],
    accessories: ['Chậu sứ', 'Đế hoa', 'Combo quà'],
  },
  {
    id: 4,
    name: 'Cây Xương Rồng',
    category: 'Cây nhỏ',
    price: 180000,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80',
    size: '15-20 cm',
    badge: 'Tiết kiệm',
    tags: ['cay-xanh', 'cay-nho-trang-tri', 'bonsai'],
    accessories: ['Đất trộn', 'Chậu nhựa'],
  },
  {
    id: 5,
    name: 'Combo 3 Chậu Cây Văn Phòng',
    category: 'Combo',
    price: 990000,
    stock: 12,
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    size: '3 chậu',
    badge: 'Combo',
    tags: ['cay-mix-van-phong', 'combo', 'chau-cay'],
    accessories: ['Phân bón', 'Chậu mix'],
  },
  {
    id: 6,
    name: 'Bộ Phụ Kiện Chăm Sóc Cây',
    category: 'Phụ kiện',
    price: 260000,
    stock: 20,
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    size: 'Set 5 món',
    badge: 'Phụ kiện',
    tags: ['chau-cay', 'dat-trong', 'phan-bon', 'thuoc-cham-soc-cay', 'dung-cu-vat-tu', 'phu-kien-nganh-hoa'],
    accessories: ['Dụng cụ làm vườn', 'Phân chuồng'],
  },
]

const categories = [
  'Tất cả',
  'Cây văn phòng',
  'Cây trang trí',
  'Hoa quà tặng',
  'Cây nhỏ',
  'Combo',
  'Phụ kiện',
]

const catalogNavigation = {
  '/cua-hang': { title: 'Toàn bộ cửa hàng', category: 'Tất cả' },
  '/cay-canh': { title: 'Cây cảnh', category: 'Cây cảnh', tags: ['cay-xanh', 'cay-van-phong', 'cay-nho-trang-tri', 'cay-mix-van-phong', 'cay-mix-qua-bieu', 'bonsai'] },
  '/cay-canh/cay-xanh': { title: 'Cây xanh', category: 'Cây cảnh', tags: ['cay-xanh'] },
  '/cay-canh/cay-van-phong': { title: 'Cây văn phòng', category: 'Cây văn phòng', tags: ['cay-van-phong'] },
  '/cay-canh/cay-nho-trang-tri': { title: 'Cây nhỏ trang trí', category: 'Cây nhỏ', tags: ['cay-nho-trang-tri'] },
  '/cay-canh/cay-mix-van-phong': { title: 'Cây mix văn phòng', category: 'Combo', tags: ['cay-mix-van-phong'] },
  '/cay-canh/cay-mix-qua-bieu': { title: 'Cây mix quà biếu', category: 'Hoa quà tặng', tags: ['cay-mix-qua-bieu'] },
  '/cay-canh/bonsai': { title: 'Bonsai', category: 'Cây cảnh', tags: ['bonsai'] },
  '/chau-vat-tu': { title: 'Chậu & vật tư', category: 'Phụ kiện', tags: ['chau-cay', 'dat-trong', 'phan-bon', 'thuoc-cham-soc-cay', 'dung-cu-vat-tu', 'phu-kien-nganh-hoa', 'combo'] },
  '/chau-vat-tu/chau-cay': { title: 'Chậu cây', category: 'Phụ kiện', tags: ['chau-cay'] },
  '/chau-vat-tu/dat-trong': { title: 'Đất trồng', category: 'Phụ kiện', tags: ['dat-trong'] },
  '/chau-vat-tu/phan-bon': { title: 'Phân bón', category: 'Phụ kiện', tags: ['phan-bon'] },
  '/chau-vat-tu/thuoc-cham-soc-cay': { title: 'Thuốc chăm sóc cây', category: 'Phụ kiện', tags: ['thuoc-cham-soc-cay'] },
  '/chau-vat-tu/dung-cu-vat-tu': { title: 'Dụng cụ & vật tư', category: 'Phụ kiện', tags: ['dung-cu-vat-tu'] },
  '/chau-vat-tu/phu-kien-nganh-hoa': { title: 'Phụ kiện ngành hoa', category: 'Phụ kiện', tags: ['phu-kien-nganh-hoa'] },
  '/chau-vat-tu/combo': { title: 'Combo', category: 'Combo', tags: ['combo'] },
  '/hoa-qua-tang': { title: 'Hoa & quà tặng', category: 'Hoa quà tặng', tags: ['lan-ho-diep', 'chau-qua-bieu', 'cay-mix-qua-bieu'] },
  '/hoa-qua-tang/lan-ho-diep': { title: 'Lan hồ điệp', category: 'Hoa quà tặng', tags: ['lan-ho-diep'] },
  '/hoa-qua-tang/chau-qua-bieu': { title: 'Chậu quà biếu', category: 'Hoa quà tặng', tags: ['chau-qua-bieu'] },
  '/hoa-qua-tang/dien-hoa-tuoi': { title: 'Điện hoa tươi', category: 'Hoa quà tặng', tags: ['dien-hoa-tuoi'] },
}

const contentNavigation = {
  '/dich-vu': ['Dịch vụ cảnh quan', 'Thiết kế, thi công và duy trì không gian xanh cho gia đình, văn phòng và dự án.'],
  '/dich-vu/thiet-ke-canh-quan': ['Thiết kế cảnh quan', 'Tư vấn ý tưởng, phân khu cây xanh và bản thiết kế phù hợp ngân sách.'],
  '/dich-vu/thi-cong-canh-quan': ['Thi công cảnh quan', 'Triển khai sân vườn, biệt thự, văn phòng và công trình thương mại.'],
  '/dich-vu/duy-tri-canh-quan': ['Duy trì cảnh quan', 'Chăm sóc định kỳ, thay cây và giữ không gian luôn xanh đẹp.'],
  '/dich-vu/thu-cay-cu-doi-cay-moi': ['Thu cây cũ - đổi cây mới', 'Đăng ký khảo sát để GreenNest đề xuất phương án thay cây phù hợp.'],
  '/du-an': ['Dự án đã thực hiện', 'Một số hướng triển khai cảnh quan cho sân vườn, biệt thự, trường học và văn phòng.'],
  '/thu-vien': ['Thư viện & kiến thức', 'Album vườn cây, video sản phẩm và hướng dẫn chăm sóc được cập nhật theo từng chủ đề.'],
  '/bai-viet': ['Kiến thức & tin tức', 'Gợi ý chọn cây, chăm cây, đóng hàng và nhận cây khỏe tại nhà.'],
  '/gioi-thieu': ['Về GreenNest', 'GreenNest cung cấp cây cảnh, phụ kiện và dịch vụ cảnh quan theo nhu cầu thực tế.'],
  '/doi-tac': ['Đối tác & hệ sinh thái', 'Kết nối nhà thầu, công ty xây dựng và đối tác thương mại.'],
  '/truyen-thong': ['Truyền thông công ty', 'Nơi tập hợp bài hát, bản hát, karaoke và các nội dung truyền thông của công ty.'],
  '/lien-he': ['Liên hệ', 'Hotline 0909 123 456, email hello@greennest.vn và địa chỉ 42 Đường Cây Xanh, Q7, TP.HCM.'],
}

const deliveryOptions = [
  { label: 'Hỏa tốc', price: 100000 },
  { label: 'Bình thường', price: 150000 },
  { label: 'Nhanh nhất', price: 200000 },
]

const serviceHighlights = [
  'Thiết kế và thi công cảnh quan',
  'Lan hồ điệp, chậu quà biếu và điện hoa',
  'Duy trì cảnh quan định kỳ',
  'Tư vấn trồng và chăm sóc cây',
]

const homeSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=85',
    title: 'Chăm sóc cảnh quan\ntrọn vẹn cho doanh nghiệp',
    description: 'Thiết kế, thi công và duy trì không gian xanh bền đẹp.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1800&q=85',
    title: 'Kiến tạo khu vườn\nđẹp từ hôm nay',
    description: 'Cây xanh phù hợp cho nhà ở, văn phòng và dự án cảnh quan.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1800&q=85',
    title: 'Không gian xanh\ncho nhịp sống hiện đại',
    description: 'Chọn cây, chậu và phụ kiện theo phong cách riêng của bạn.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1800&q=85',
    title: 'Tư vấn cảnh quan\ntận tâm từng góc nhỏ',
    description: 'Đồng hành cùng bạn từ ý tưởng đầu tiên đến ngày bàn giao.',
  },
]

const emptyProductForm = {
  name: '',
  category: 'Cây văn phòng',
  price: '',
  stock: '',
  image: '',
  size: '',
  badge: '',
  accessories: '',
  tags: '',
}

const emptyOrderForm = {
  name: '',
  phone: '',
  address: '',
  paymentMethod: 'Chuyển khoản',
  note: '',
}

const emptyConsultForm = {
  name: '',
  phone: '',
  need: '',
  product: '',
}

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`
const formatPrice = (value) => Number(value) > 0 ? formatCurrency(value) : 'Liên hệ tư vấn'

// Integration contract: supply trusted server-backed adapters to <App services={...} />.
// services.auth: login, register, logout, getSession -> user (except logout).
// services.getMyOrders() -> orders scoped by the server to the session user.
// services.submitConsultation(form) -> resolves only after server persistence.
const normalizeText = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const productSlug = (product) => `${normalizeText(product.name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${encodeURIComponent(product.id)}`
const validProduct = (product) => product && ['string', 'number'].includes(typeof product.id) && String(product.id).length > 0 && typeof product.name === 'string' && Number.isFinite(Number(product.price)) && Number(product.price) >= 0 && Number.isInteger(Number(product.stock)) && Number(product.stock) >= 0
const normalizeProduct = (product) => ({ ...product, id: String(product.id), price: Number(product.price), stock: Number(product.stock), category: String(product.category ?? ''), size: String(product.size ?? ''), tags: Array.isArray(product.tags) ? product.tags.filter(x => typeof x === 'string') : [], accessories: Array.isArray(product.accessories) ? product.accessories.filter(x => typeof x === 'string') : [] })
const normalizeProducts = (items) => {
  if (!Array.isArray(items) || !items.every(validProduct)) throw new Error('Dữ liệu sản phẩm không hợp lệ')
  const result = items.map(normalizeProduct)
  if (new Set(result.map(x => x.id)).size !== result.length) throw new Error('Trùng mã sản phẩm')
  return result
}
const validPhone = (phone) => /^(0\d{9}|\+84\d{9})$/.test(phone.replace(/[\s.-]/g, ''))
const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('green-nest-cart') || '[]')
    if (!Array.isArray(saved)) return []
    const seen = new Set()
    return saved.filter(item => {
      if (!item || !validProduct(item.product) || !Number.isInteger(item.quantity) || item.quantity <= 0 || seen.has(String(item.product.id))) return false
      seen.add(String(item.product.id)); return true
    }).map(item => ({ id: String(item.product.id), product: normalizeProduct(item.product), quantity: Math.min(item.quantity, Number(item.product.stock)) })).filter(item => item.quantity > 0 && item.product.price > 0)
  } catch { return [] }
}

function App({ services = {} }) {
  return (
    <BrowserRouter>
      <AppContent services={services} />
    </BrowserRouter>
  )
}

function AppContent({ services }) {
  const busy = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [productsReady, setProductsReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const [products, setProducts] = useState(() => normalizeProducts(defaultProducts))
  const [category, setCategory] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[1])
  const [couponInput, setCouponInput] = useState('')
  const [couponRate, setCouponRate] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [consultForm, setConsultForm] = useState(emptyConsultForm)
  const [cart, setCart] = useState(readCart)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [editingProductId, setEditingProductId] = useState(null)
  const [orderForm, setOrderForm] = useState(emptyOrderForm)
  const [toast, setToast] = useState('')
  const [orders, setOrders] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' })
  const [loggedUser, setLoggedUser] = useState(null)

  useEffect(() => {
    try { localStorage.setItem('green-nest-cart', JSON.stringify(cart)) }
    catch { setToast('Không thể lưu giỏ hàng trên trình duyệt này') }
  }, [cart])

  useEffect(() => {
    let cancelled = false
    if (services.auth?.getSession) {
      Promise.resolve().then(() => services.auth.getSession()).then(user => {
        if (!cancelled) setLoggedUser(user || null)
      }).catch(() => { if (!cancelled) setLoggedUser(null) })
    }
    return () => { cancelled = true }
  }, [services.auth])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Không tải được sản phẩm')
      const data = normalizeProducts(await response.json())
      if (!controller.signal.aborted) { setProducts(data); setProductsReady(true) }
    }).catch(() => {
      if (!controller.signal.aborted) setToast('Không kết nối được cửa hàng. Đang hiển thị sản phẩm mẫu; chưa thể đặt hàng.')
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!productsReady) return
    setCart(current => current.flatMap(item => {
      const product = products.find(p => p.id === item.id)
      return product && product.price > 0 && product.stock > 0
        ? [{ id: product.id, product, quantity: Math.min(item.quantity, product.stock) }] : []
    }))
  }, [products, productsReady])

  useEffect(() => {
    let cancelled = false
    setOrders([])
    if (loggedUser) {
      const request = loggedUser.role === 'admin'
        ? fetch('/api/orders').then(async response => { if (!response.ok) throw new Error(); return response.json() })
        : services.getMyOrders ? Promise.resolve().then(() => services.getMyOrders()) : Promise.resolve([])
      request.then(data => {
        if (!Array.isArray(data)) throw new Error()
        if (!cancelled) setOrders(data.filter(order => order && order.id != null))
      }).catch(() => { if (!cancelled) setToast('Không tải được danh sách đơn hàng') })
    }
    return () => { cancelled = true }
  }, [loggedUser, services.getMyOrders])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim())
    return products.filter((product) => {
      const matchesCategory = category === 'Tất cả' || product.category === category
      const matchesQuery = !normalizedQuery || normalizeText(`${product.name} ${product.category}`).includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, products, searchQuery])

  const subtotal = cart.reduce((sum, item) => sum + Number(item.product.price) * Number(item.quantity), 0)
  const couponDiscount = Math.round(subtotal * couponRate)
  const shippingFee = cart.length ? selectedDelivery.price : 0
  const discountedSubtotal = Math.max(subtotal - couponDiscount, 0)
  const total = discountedSubtotal + shippingFee
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = products.filter((product) => product.stock <= 10).length

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase()
    if (normalized === 'GREEN10') {
      setCouponRate(0.1)
      setToast('Mã giảm giá GREEN10 đã được áp dụng')
      return
    }
    if (normalized === 'SPRING20') {
      setCouponRate(0.2)
      setToast('Mã giảm giá SPRING20 đã được áp dụng')
      return
    }
    setCouponRate(0)
    setToast('Mã giảm giá không hợp lệ')
  }

  const addToCart = (product, amount = 1) => {
    const live = products.find(item => item.id === product.id)
    const existing = cart.find(item => item.id === product.id)
    if (!live || live.stock <= 0) { setToast('Sản phẩm đã hết hàng'); return false }
    if (live.price <= 0) { setToast('Sản phẩm này cần tư vấn trước khi đặt'); return false }
    if (!Number.isInteger(amount) || amount <= 0 || (existing?.quantity || 0) + amount > live.stock) {
      setToast('Số lượng vượt tồn kho'); return false
    }
    setCart(current => {
      const found = current.find(item => item.id === live.id)
      const quantity = Math.min((found?.quantity || 0) + amount, live.stock)
      return found ? current.map(item => item.id === live.id ? { ...item, product: live, quantity } : item) : [...current, { id: live.id, product: live, quantity }]
    })
    setToast('Đã thêm vào giỏ hàng')
    return true
  }

  const updateQuantity = (id, delta) => {
    const product = products.find(item => item.id === id)
    setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.max(0, Math.min(product?.stock || 0, item.quantity + delta)) } : item).filter(item => item.quantity > 0))
  }

  const handleProductChange = (event) => {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  const resetProductForm = () => {
    setProductForm(emptyProductForm)
    setEditingProductId(null)
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()

    if (busy.current) return
    if (loggedUser?.role !== 'admin') { setToast('Bạn cần đăng nhập quản trị'); return }
    if (!productForm.name.trim() || productForm.price === '' || productForm.stock === '' || !Number.isFinite(Number(productForm.price)) || Number(productForm.price) < 0 || !Number.isInteger(Number(productForm.stock)) || Number(productForm.stock) < 0) {
      setToast('Nhập tên, giá không âm và tồn kho là số nguyên không âm'); return
    }
    busy.current = true
    const payload = {
      ...productForm,
      name: productForm.name.trim(),
      tags: productForm.tags.split(',').map(item => item.trim()).filter(Boolean),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      accessories: productForm.accessories
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    const endpoint = editingProductId ? `/api/products/${encodeURIComponent(editingProductId)}` : '/api/products'
    const method = editingProductId ? 'PUT' : 'POST'

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Lỗi cập nhật sản phẩm')

      const saved = normalizeProducts([await response.json()])[0]
      setProducts((current) => {
        if (editingProductId) {
          return current.map((item) => (item.id === editingProductId ? saved : item))
        }
        return [saved, ...current]
      })
      resetProductForm()
      setToast(editingProductId ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công')
    } catch {
      setToast('Chưa lưu được sản phẩm. Kiểm tra kết nối và quyền quản trị.')
    } finally { busy.current = false }
  }

  const handleEdit = (product) => {
    setEditingProductId(product.id)
    setProductForm({
      tags: product.tags.join(', '),
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      size: product.size,
      badge: product.badge,
      accessories: Array.isArray(product.accessories) ? product.accessories.join(', ') : '',
    })
    navigate('/admin.html')
  }

  const handleDelete = async (productId) => {
    if (busy.current || loggedUser?.role !== 'admin') return
    if (!window.confirm('Xóa sản phẩm này?')) return
    busy.current = true
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()
      setProducts(current => current.filter(item => item.id !== productId))
      if (editingProductId === productId) resetProductForm()
      setToast('Đã xóa sản phẩm')
    } catch { setToast('Chưa xóa được sản phẩm. Kiểm tra kết nối và quyền quản trị.') }
    finally { busy.current = false }
  }

  const handleConsultSubmit = async (event) => {
    event.preventDefault()
    if (busy.current) return
    if (!consultForm.name.trim() || !validPhone(consultForm.phone) || !consultForm.need.trim()) {
      setToast('Nhập họ tên, số điện thoại hợp lệ và nhu cầu tư vấn'); return
    }
    if (!services.submitConsultation) { setToast('Chưa kết nối dịch vụ tiếp nhận tư vấn. Vui lòng liên hệ shop.'); return }
    busy.current = true
    try {
      await services.submitConsultation({ ...consultForm, name: consultForm.name.trim(), phone: consultForm.phone.trim(), need: consultForm.need.trim() })
      setToast('Yêu cầu tư vấn đã được ghi nhận'); setConsultForm(emptyConsultForm)
    } catch { setToast('Chưa gửi được yêu cầu. Thông tin đã được giữ lại.') }
    finally { busy.current = false }
  }

  const openAuthModal = () => {
    setAuthMode('login')
    setLoginForm({ name: '', email: '', password: '' })
    setAuthModalOpen(true)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (busy.current) return
    const action = services.auth?.[authMode]
    if (!action) { setToast('Chưa kết nối dịch vụ xác thực tài khoản'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim()) || !loginForm.password || (authMode === 'register' && (!loginForm.name.trim() || loginForm.password.length < 6))) {
      setToast('Vui lòng kiểm tra họ tên, email và mật khẩu'); return
    }
    busy.current = true
    try {
      const user = await action({ ...loginForm, email: loginForm.email.trim().toLowerCase(), name: loginForm.name.trim() })
      if (!user || !['admin', 'customer'].includes(user.role) || typeof user.name !== 'string') throw new Error()
      setLoggedUser(user); setAuthModalOpen(false)
      setLoginForm({ name: '', email: '', password: '' })
      navigate(user.role === 'admin' ? '/admin.html' : '/customer')
      setToast('Xác thực tài khoản thành công')
    } catch { setToast('Không xác thực được tài khoản. Kiểm tra thông tin và kết nối.') }
    finally { busy.current = false }
  }

  const handleLogout = async () => {
    if (!services.auth?.logout) { setToast('Chưa kết nối chức năng đăng xuất'); return }
    try {
      await services.auth.logout()
      setLoggedUser(null); setOrders([]); setLastOrder(null); navigate('/')
      setToast('Đã đăng xuất')
    } catch { setToast('Chưa đăng xuất được. Vui lòng thử lại.') }
  }

  const handleOrderSubmit = async (event) => {
    event.preventDefault()

    if (busy.current) return
    if (!productsReady) { setToast('Chưa tải được sản phẩm từ cửa hàng'); return }
    if (!cart.length) {
      setToast('Giỏ hàng đang trống')
      return
    }

    if (!orderForm.name.trim() || !validPhone(orderForm.phone) || !orderForm.address.trim()) {
      setToast('Vui lòng điền đầy đủ thông tin đặt hàng')
      return
    }

    if (cart.some(item => { const product = products.find(p => p.id === item.id); return !product || item.quantity > product.stock || product.price <= 0 || product.price !== item.product.price })) {
      setToast('Giỏ hàng đã thay đổi. Vui lòng kiểm tra lại sản phẩm.'); return
    }
    busy.current = true
    setSubmitting(true)
    const payload = {
      customer: {
        name: orderForm.name,
        phone: orderForm.phone,
        address: orderForm.address,
      },
      paymentMethod: orderForm.paymentMethod,
      note: orderForm.note,
      shippingFee: selectedDelivery.price,
      subtotal,
      discount: couponDiscount,
      total,
      status: 'Chờ xác nhận',
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Đặt hàng thất bại')

      const savedOrder = await response.json()
      if (!savedOrder || savedOrder.id == null || !Number.isFinite(Number(savedOrder.total))) throw new Error('Phản hồi đơn hàng không hợp lệ')
      setOrders((current) => [savedOrder, ...current])
      setLastOrder(savedOrder)
      setCart([])
      setCouponRate(0)
      setCouponInput('')
      setProducts(current => current.map(product => ({ ...product, stock: Math.max(0, product.stock - (cart.find(item => item.id === product.id)?.quantity || 0)) })))
      setOrderForm(emptyOrderForm)
      navigate('/xac-nhan-don')
      setToast('Đơn hàng đã được tạo thành công')
    } catch {
      setToast('Chưa xác nhận được đơn hàng. Giỏ hàng được giữ lại; kiểm tra với shop trước khi gửi lại.')
    } finally { busy.current = false; setSubmitting(false) }
  }

  useEffect(() => {
    setSelectedProduct(null)
    setAuthModalOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const closeOnEscape = event => {
      if (event.key === 'Escape') { setAuthModalOpen(false); setSelectedProduct(null) }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const currentPath = location.pathname

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">G</div>
          <div>
            <strong>GreenNest</strong>
            <span>Plant Studio</span>
          </div>
        </div>

        <nav className="main-nav">
          <button className={currentPath === '/' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/')}>
            Trang chủ
          </button>
          <button className={currentPath === '/gioi-thieu' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/gioi-thieu')}>
            Giới thiệu
          </button>
          <div className="nav-dropdown">
            <button className={currentPath.startsWith('/cua-hang') || currentPath.startsWith('/cay-canh') || currentPath.startsWith('/chau-vat-tu') || currentPath.startsWith('/hoa-qua-tang') ? 'nav-link nav-trigger active' : 'nav-link nav-trigger'} onClick={() => navigate('/cua-hang')}>
              Sản phẩm <span className="nav-chevron" aria-hidden="true">⌄</span>
            </button>
            <div className="nav-menu product-menu">
              <div className="nav-menu-intro"><strong>Khám phá sản phẩm</strong><span>Xem, tìm kiếm, lọc và mua cây, chậu, vật tư, hoa quà tặng.</span></div>
              <div className="product-menu-column">
                <Link className="product-menu-heading" to="/cay-canh">Cây cảnh</Link>
                <Link to="/cay-canh/cay-xanh">Cây xanh</Link>
                <Link to="/cay-canh/cay-van-phong">Cây văn phòng</Link>
                <Link to="/cay-canh/cay-nho-trang-tri">Cây nhỏ trang trí</Link>
                <Link to="/cay-canh/cay-mix-van-phong">Cây mix văn phòng</Link>
                <Link to="/cay-canh/cay-mix-qua-bieu">Cây mix quà biếu</Link>
                <Link to="/cay-canh/bonsai">Bonsai</Link>
              </div>
              <div className="product-menu-column">
                <Link className="product-menu-heading" to="/chau-vat-tu">Chậu & vật tư</Link>
                <Link to="/chau-vat-tu/chau-cay">Chậu cây</Link>
                <Link to="/chau-vat-tu/dat-trong">Đất trồng</Link>
                <Link to="/chau-vat-tu/phan-bon">Phân bón</Link>
                <Link to="/chau-vat-tu/thuoc-cham-soc-cay">Thuốc chăm sóc cây</Link>
                <Link to="/chau-vat-tu/dung-cu-vat-tu">Dụng cụ & vật tư</Link>
                <Link to="/chau-vat-tu/phu-kien-nganh-hoa">Phụ kiện ngành hoa</Link>
                <Link to="/chau-vat-tu/combo">Combo</Link>
              </div>
              <div className="product-menu-column">
                <Link className="product-menu-heading" to="/hoa-qua-tang">Hoa & quà tặng</Link>
                <Link to="/hoa-qua-tang/lan-ho-diep">Lan hồ điệp</Link>
                <Link to="/hoa-qua-tang/chau-qua-bieu">Chậu quà biếu đặc biệt</Link>
                <Link to="/hoa-qua-tang/dien-hoa-tuoi">Điện hoa tươi</Link>
                <span className="product-menu-note">Mẫu riêng? Gửi yêu cầu tư vấn.</span>
              </div>
              <Link className="nav-menu-all" to="/cua-hang">Xem toàn bộ sản phẩm →</Link>
            </div>
          </div>
          <div className="nav-dropdown">
            <button className={currentPath.startsWith('/dich-vu') ? 'nav-link nav-trigger active' : 'nav-link nav-trigger'} onClick={() => navigate('/dich-vu')}>
              Dịch vụ <span className="nav-chevron" aria-hidden="true">⌄</span>
            </button>
            <div className="nav-menu compact-menu">
              <Link to="/dich-vu/thiet-ke-canh-quan">Thiết kế cảnh quan</Link>
              <Link to="/dich-vu/thi-cong-canh-quan">Thi công cảnh quan</Link>
              <Link to="/dich-vu/duy-tri-canh-quan">Duy trì cảnh quan</Link>
              <Link to="/dich-vu/thu-cay-cu-doi-cay-moi">Thu cây cũ - đổi cây mới</Link>
            </div>
          </div>
          <button className={currentPath.startsWith('/bai-viet') || currentPath.startsWith('/thu-vien') ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/bai-viet')}>
            Tin tức & kiến thức
          </button>
          <button className={currentPath === '/lien-he' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('/lien-he')}>
            Liên hệ
          </button>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm cây, chậu, phụ kiện"
              aria-label="Tìm kiếm sản phẩm"
            />
          </label>
          <button className="btn btn-ghost" onClick={() => loggedUser ? navigate(loggedUser.role === 'admin' ? '/admin.html' : '/customer') : openAuthModal()}>
            {loggedUser ? `Hi, ${loggedUser.name}` : 'Đăng nhập'}
          </button>
          <a className="hotline-pill" href="tel:0909123456">HOTLINE: 0909 123 456</a>
          <button
            className="btn cart-button"
            onClick={() => navigate('/gio-hang')}
            aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
            title="Mở giỏ hàng"
          >
            <span className="cart-icon" aria-hidden="true"><span /></span>
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </button>
          {loggedUser && (
            <button className="btn btn-secondary" onClick={handleLogout}>Đăng xuất</button>
          )}
        </div>
      </header>

      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setAuthModalOpen(false)}>×</button>
            <div className="auth-header">
              <span className="eyebrow">GreenNest</span>
              <h3>{authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h3>
            </div>

            <div className="role-switcher">
              <button
                type="button"
                className={authMode === 'login' ? 'role-tab active' : 'role-tab'}
                onClick={() => setAuthMode('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'role-tab active' : 'role-tab'}
                onClick={() => setAuthMode('register')}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              {authMode === 'register' && (
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={(event) => setLoginForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Họ và tên"
                />
              )}
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="email@example.com"
              />
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Mật khẩu"
              />
              <button type="submit" className="btn btn-primary full">
                {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </form>
            <p className="auth-tip">
              {authMode === 'login'
                ? 'Đăng nhập qua dịch vụ xác thực của cửa hàng.'
                : 'Tạo tài khoản khách hàng với email hợp lệ và mật khẩu từ 6 ký tự.'}
            </p>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              categories={categories}
              products={products}
              category={category}
              setCategory={setCategory}
              filteredProducts={filteredProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
              cart={cart}
              updateQuantity={updateQuantity}
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={setSelectedDelivery}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              couponDiscount={couponDiscount}
              applyCoupon={applyCoupon}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              orderForm={orderForm}
              setOrderForm={setOrderForm}
              handleOrderSubmit={handleOrderSubmit}
              submitting={submitting}
              consultForm={consultForm}
              setConsultForm={setConsultForm}
              handleConsultSubmit={handleConsultSubmit}
              formatCurrency={formatCurrency}
              formatPrice={formatPrice}
            />
          }
        />
        {Object.entries(catalogNavigation).map(([path, config]) => (
          <Route
            key={path}
            path={path}
            element={
              <CatalogPage
                title={config.title}
                category={config.category}
                tags={config.tags}
                products={products}
                searchQuery={searchQuery}
                addToCart={addToCart}
                formatCurrency={formatCurrency}
                formatPrice={formatPrice}
              />
            }
          />
        ))}
        <Route
          path="/san-pham/:slug"
          element={
            <ProductPage
              products={products}
              addToCart={addToCart}
              formatCurrency={formatCurrency}
              formatPrice={formatPrice}
            />
          }
        />
        <Route
          path="/gio-hang"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              navigate={navigate}
              formatCurrency={formatCurrency}
              checkout={false}
              shippingFee={shippingFee}
              couponDiscount={couponDiscount}
            />
          }
        />
        <Route
          path="/dat-hang"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              navigate={navigate}
              formatCurrency={formatCurrency}
              checkout
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={setSelectedDelivery}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              applyCoupon={applyCoupon}
              orderForm={orderForm}
              setOrderForm={setOrderForm}
              handleOrderSubmit={handleOrderSubmit}
              submitting={submitting}
              total={total}
              shippingFee={shippingFee}
              couponDiscount={couponDiscount}
            />
          }
        />
        <Route
          path="/xac-nhan-don"
          element={<OrderConfirmationPage order={lastOrder} navigate={navigate} formatCurrency={formatCurrency} />}
        />
        <Route path="/chinh-sach/:slug" element={<PolicyPage />} />
        {Object.entries(contentNavigation).map(([path, [title, description]]) => (
          <Route key={path} path={path} element={<ContentPage title={title} description={description} navigate={navigate} />} />
        ))}
        <Route
          path="/customer"
          element={
            loggedUser?.role === 'customer' ? (
              <CustomerPage
                loggedUser={loggedUser}
                products={products}
                orders={orders}
                addToCart={addToCart}
                navigate={navigate}
                formatCurrency={formatCurrency}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin.html"
          element={
            loggedUser?.role === 'admin' ? (
              <AdminPage
                products={products}
                orders={orders}
                lowStockItems={lowStockItems}
                productForm={productForm}
                handleProductChange={handleProductChange}
                handleProductSubmit={handleProductSubmit}
                editingProductId={editingProductId}
                resetProductForm={resetProductForm}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                categories={categories}
                formatCurrency={formatCurrency}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin-album.html"
          element={loggedUser?.role === 'admin' ? <AdminAlbumPage /> : <Navigate to="/" replace />}
        />
        <Route path="/admin" element={<Navigate to="/admin.html" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="site-footer" id="contact">
        <div>
          <strong>Plant Studio</strong>
          <p>Địa chỉ: 42 Đường Cây Xanh, Quận 7, TP.HCM</p>
        </div>
        <div>
          <p>Hotline: 0909 123 456</p>
          <p>Zalo / WhatsApp / Email</p>
        </div>
        <div>
          <p>Giờ làm việc: 8:00 - 18:00</p>
          <p><Link to="/lien-he">Liên hệ tư vấn</Link>{loggedUser?.role === 'admin' && <> · <Link to="/admin-album.html">Album ảnh</Link></>}</p>
        </div>
      </footer>

      <nav className="mobile-tabbar" aria-label="Điều hướng di động">
        <button className={currentPath === '/' ? 'mobile-tab active' : 'mobile-tab'} onClick={() => navigate('/')}>
          <span>⌂</span><small>Trang chủ</small>
        </button>
        <button className="mobile-tab" onClick={() => navigate('/cua-hang')}>
          <span>☷</span><small>Danh mục</small>
        </button>
        <button className="mobile-tab" onClick={() => navigate('/gio-hang')}>
          <span>🛒</span><small>Giỏ hàng ({cartCount})</small>
        </button>
        <button className="mobile-tab" onClick={() => navigate('/lien-he')}>
          <span>☎</span><small>Tư vấn</small>
        </button>
        <button className="mobile-tab" onClick={() => navigate('/dich-vu')}>
          <span>☰</span><small>Menu</small>
        </button>
      </nav>
    </div>
  )
}

function HomePage({
  categories,
  products,
  category,
  setCategory,
  filteredProducts,
  selectedProduct,
  setSelectedProduct,
  addToCart,
  cart,
  updateQuantity,
  selectedDelivery,
  setSelectedDelivery,
  couponInput,
  setCouponInput,
  couponDiscount,
  applyCoupon,
  subtotal,
  shippingFee,
  total,
  orderForm,
  setOrderForm,
  handleOrderSubmit,
  submitting,
  consultForm,
  setConsultForm,
  handleConsultSubmit,
  formatCurrency,
}) {
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % homeSlides.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [])

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + homeSlides.length) % homeSlides.length)
  }

  const slide = homeSlides[activeSlide]

  return (
    <main>
      <section className="hero-slider" id="home" aria-label="Dịch vụ cảnh quan nổi bật">
        <div className="hero-slide" key={slide.image}>
          <img src={slide.image} alt={slide.title.replace(/\n/g, ' ')} />
          <div className="hero-slide-shade" />
          <div className="hero-slide-content">
            <span className="eyebrow">GreenNest Plant Studio</span>
            <h1>{slide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
            <p>{slide.description}</p>
            <div className="hero-actions">
              <a href="#shop" className="btn btn-primary large">Khám phá sản phẩm</a>
              <a href="#contact" className="btn btn-secondary large">Nhận tư vấn</a>
            </div>
          </div>
          <button className="slider-arrow slider-arrow-prev" onClick={() => moveSlide(-1)} aria-label="Ảnh trước">‹</button>
          <button className="slider-arrow slider-arrow-next" onClick={() => moveSlide(1)} aria-label="Ảnh tiếp theo">›</button>
          <div className="slider-dots" aria-label="Chọn ảnh trình chiếu">
            {homeSlides.map((item, index) => (
              <button
                key={item.image}
                className={index === activeSlide ? 'slider-dot active' : 'slider-dot'}
                onClick={() => setActiveSlide(index)}
                aria-label={`Chuyển đến ảnh ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="category-strip">
        {categories.map((item) => (
          <button
            key={item}
            className={item === category ? 'category-pill active' : 'category-pill'}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="section-header" id="shop">
        <div>
          <span className="eyebrow">Sản phẩm nổi bật</span>
          <h2>Cây, chậu và phụ kiện chọn lọc</h2>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/cua-hang')}>Xem tất cả</button>
      </section>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img src={product.image} alt={product.name} />
              <span className="product-badge">{product.badge || 'Mới'}</span>
            </div>
            <div className="product-body">
              <div className="product-meta">
                <span>{product.category}</span>
                <span>{product.stock} còn hàng</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.size}</p>
              <ul>
                {(product.accessories || []).map((item) => (
                  <li key={`${product.id}-${item}`}>{item}</li>
                ))}
              </ul>
              <div className="product-bottom">
                <strong>{formatPrice(product.price)}</strong>
                <div className="inline-actions">
                  <button className="btn btn-ghost small" onClick={() => setSelectedProduct(product)}>
                    Chi tiết
                  </button>
                  <button className="btn btn-primary small" disabled={product.stock <= 0 || product.price <= 0} onClick={() => addToCart(product)}>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedProduct(null)}>×</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="modal-content">
              <span className="eyebrow">{selectedProduct.category}</span>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.size}</p>
              <strong>{formatPrice(selectedProduct.price)}</strong>
              <ul>
                {(selectedProduct.accessories || []).map((item) => (
                  <li key={`${selectedProduct.id}-${item}`}>{item}</li>
                ))}
              </ul>
              <div className="inline-actions">
                <button className="btn btn-primary" disabled={selectedProduct.stock <= 0 || selectedProduct.price <= 0} onClick={() => addToCart(selectedProduct)}>
                  Thêm vào giỏ
                </button>
                <button className="btn btn-ghost" onClick={() => setSelectedProduct(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="services" id="services">
        <div className="service-copy">
          <span className="eyebrow">Dịch vụ & hệ sinh thái</span>
          <h2>Thiết kế cảnh quan, chăm sóc và quà tặng riêng.</h2>
          <ul>
            {serviceHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="service-cards">
          <div className="mini-card accent">
            <h3>Thi công cảnh quan</h3>
            <p>Sân vườn, biệt thự, trường học, văn phòng và dự án thương mại.</p>
          </div>
          <div className="mini-card">
            <h3>Lan hồ điệp & quà tặng</h3>
            <p>Chậu quà biếu, điện hoa tươi và combo lễ mừng đặc biệt.</p>
          </div>
          <div className="mini-card dark">
            <h3>Hệ sinh thái đối tác</h3>
            <p>Liên kết nhà thầu, công ty xây dựng và đối tác thương mại.</p>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <div className="section-header compact">
          <div>
            <span className="eyebrow">Thư viện</span>
            <h2>Vườn cây và video chăm sóc</h2>
          </div>
        </div>

        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80" alt="Vườn cây" />
          <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80" alt="Không gian cây" />
          <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80" alt="Cây văn phòng" />
          <img src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80" alt="Trồng cây" />
        </div>
      </section>

      <section className="checkout-panel">
        <div className="checkout-order">
          <h3>Giỏ hàng</h3>
          {cart.length === 0 ? (
            <p>Giỏ hàng trống.</p>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{formatCurrency(item.product.price)}</span>
                  </div>
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Đặt hàng</h3>
          <form onSubmit={handleOrderSubmit} className="checkout-form">
            <div className="field-grid">
              <input
                aria-label="Họ tên" placeholder="Họ tên"
                value={orderForm.name}
                onChange={(event) => setOrderForm((current) => ({ ...current, name: event.target.value }))}
              />
              <input
                aria-label="Số điện thoại" placeholder="Số điện thoại"
                value={orderForm.phone}
                onChange={(event) => setOrderForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </div>
            <textarea
              aria-label="Địa chỉ giao hàng" placeholder="Địa chỉ giao hàng"
              value={orderForm.address}
              onChange={(event) => setOrderForm((current) => ({ ...current, address: event.target.value }))}
            />
            <select
              value={orderForm.paymentMethod}
              onChange={(event) => setOrderForm((current) => ({ ...current, paymentMethod: event.target.value }))}
            >
              <option>Chuyển khoản</option>
              <option>Tiền mặt</option>
            </select>
            <textarea
              aria-label="Ghi chú" placeholder="Ghi chú"
              value={orderForm.note}
              onChange={(event) => setOrderForm((current) => ({ ...current, note: event.target.value }))}
            />

            <div className="coupon-row">
              <input
                value={couponInput}
                aria-label="Nhập mã giảm giá" placeholder="Nhập mã giảm giá"
                onChange={(event) => setCouponInput(event.target.value)}
              />
              <button type="button" className="btn btn-secondary" onClick={applyCoupon}>Áp dụng</button>
            </div>

            <div className="delivery-list">
              {deliveryOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={selectedDelivery.label === option.label ? 'delivery-option active' : 'delivery-option'}
                  onClick={() => setSelectedDelivery(option)}
                >
                  <span>{option.label}</span>
                  <strong>{formatCurrency(option.price)}</strong>
                </button>
              ))}
            </div>

            <div className="totals">
              <div><span>Tổng tạm</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div><span>Giảm giá</span><strong>{formatCurrency(couponDiscount)}</strong></div>
              <div><span>Phí giao</span><strong>{formatCurrency(shippingFee)}</strong></div>
              <div className="grand-total"><span>Tổng thanh toán</span><strong>{formatCurrency(total)}</strong></div>
            </div>

            <button type="submit" className="btn btn-primary full" disabled={!cart.length || submitting}>{submitting ? 'Đang gửi…' : 'Xác nhận đặt hàng'}</button>
          </form>
        </div>
      </section>

      <section className="consult-panel">
        <div className="panel">
          <div className="panel-header">
            <h3>Yêu cầu tư vấn</h3>
          </div>
          <form onSubmit={handleConsultSubmit} className="admin-form">
            <div className="field-grid">
              <input
                value={consultForm.name}
                onChange={(event) => setConsultForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Họ tên"
              />
              <input
                value={consultForm.phone}
                onChange={(event) => setConsultForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Số điện thoại"
              />
            </div>
            <input
              value={consultForm.product}
              onChange={(event) => setConsultForm((current) => ({ ...current, product: event.target.value }))}
              placeholder="Sản phẩm / dịch vụ cần tư vấn"
            />
            <textarea
              value={consultForm.need}
              onChange={(event) => setConsultForm((current) => ({ ...current, need: event.target.value }))}
              placeholder="Nhu cầu của bạn"
            />
            <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
          </form>
        </div>
      </section>
    </main>
  )
}

function CatalogPage({ title, category, tags, products, searchQuery, addToCart, formatCurrency, formatPrice }) {
  const navigate = useNavigate()
  const [stockFilter, setStockFilter] = useState('all')
  const [sizeFilter, setSizeFilter] = useState('all')
  const normalizedQuery = normalizeText(searchQuery.trim())
  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === 'Tất cả' || (!tags?.length && product.category === category) || (tags || []).some((tag) => (product.tags || []).includes(tag))
    const matchesQuery = !normalizedQuery || normalizeText(`${product.name} ${product.category}`).includes(normalizedQuery)
    const matchesStock = stockFilter === 'all' || (stockFilter === 'available' ? product.stock > 0 : product.stock > 0 && product.stock <= 10)
    const matchesSize = sizeFilter === 'all' || product.size.includes(sizeFilter)
    return matchesCategory && matchesQuery && matchesStock && matchesSize
  })

  return (
    <main className="catalog-page">
      <section className="catalog-heading">
        <span className="eyebrow">GreenNest shop</span>
        <h1>{title}</h1>
        <p>{visibleProducts.length} sản phẩm đang hiển thị. Chọn món phù hợp rồi thêm vào giỏ.</p>
      </section>
      <section className="catalog-toolbar">
        <strong>{searchQuery ? `Kết quả cho “${searchQuery}”` : 'Danh sách sản phẩm'}</strong>
        <div className="catalog-filters">
          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} aria-label="Lọc tình trạng hàng">
            <option value="all">Tất cả tình trạng</option><option value="available">Còn hàng</option><option value="low">Sắp hết</option>
          </select>
          <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)} aria-label="Lọc kích thước">
            <option value="all">Tất cả kích thước</option><option value="cm">Theo cm</option><option value="chậu">Theo chậu</option><option value="Set">Theo set</option>
          </select>
        </div>
      </section>
      <section className="product-grid">
        {visibleProducts.length ? visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img src={product.image} alt={product.name} />
              <span className="product-badge">{product.badge || 'Mới'}</span>
            </div>
            <div className="product-body">
              <div className="product-meta"><span>{product.category}</span><span>{product.stock} còn hàng</span></div>
              <button className="product-link" onClick={() => navigate(`/san-pham/${productSlug(product)}`)}>{product.name}</button>
              <p>{product.size}</p>
              <div className="product-bottom">
                <strong>{formatPrice(product.price)}</strong>
                  <button className="btn btn-primary small" disabled={product.stock <= 0 || product.price <= 0} onClick={() => addToCart(product)}>
                    {product.price <= 0 ? 'Liên hệ tư vấn' : product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                </button>
              </div>
            </div>
          </article>
        )) : <div className="empty-state"><h3>Chưa có sản phẩm phù hợp</h3><p>Hãy thử danh mục hoặc từ khóa khác.</p></div>}
      </section>
    </main>
  )
}

function ProductPage({ products, addToCart, formatCurrency, formatPrice }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const product = products.find((item) => productSlug(item) === slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)

  useEffect(() => { setQuantity(1) }, [slug])

  if (!product) {
    return <ContentPage title="Không tìm thấy sản phẩm" description="Sản phẩm này có thể đã được ẩn hoặc đường dẫn không còn tồn tại." />
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-image"><img src={product.image} alt={product.name} /></div>
      <div className="product-detail-copy">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-detail-size">Kích thước: {product.size}</p>
        <strong className="product-detail-price">{formatPrice(product.price)}</strong>
        <p>Cây được chọn và đóng gói cẩn thận. Bạn có thể mua thêm chậu, đất hoặc phụ kiện phù hợp khi tư vấn.</p>
        <ul>{(product.accessories || []).map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="product-detail-actions">
          <div className="quantity-box"><button onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button><span>{quantity}</span><button onClick={() => setQuantity((current) => Math.max(1, Math.min(product.stock, current + 1)))}>+</button></div>
          <button className="btn btn-primary large" disabled={product.stock <= 0 || product.price <= 0} onClick={() => addToCart(product, quantity)}>
            {product.price <= 0 ? 'Liên hệ tư vấn' : product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
          <button className="btn btn-secondary large" disabled={product.stock <= 0 || product.price <= 0} onClick={() => { if (addToCart(product, quantity)) navigate('/dat-hang') }}>Mua ngay</button>
        </div>
        <div className="related-accessories"><strong>Mua thêm cùng cây</strong><span>{(product.accessories || []).join(' · ')}</span></div>
      </div>
    </main>
  )
}

function OrderConfirmationPage({ order, navigate, formatCurrency }) {
  return (
    <main className="content-page">
      <section className="content-hero">
        <span className="eyebrow">{order ? 'Đặt hàng thành công' : 'Thông tin đơn hàng'}</span>
        <h1>{order ? 'Cảm ơn bạn đã mua hàng.' : 'Chưa có đơn hàng để hiển thị.'}</h1>
        <p>{order ? `Mã đơn #${order.id}. Tổng thanh toán ${formatCurrency(order.total)}.` : 'Chưa có đơn hàng mới trong phiên này.'}</p>
        <button className="btn btn-primary large" onClick={() => navigate('/cua-hang')}>Tiếp tục mua sắm</button>
      </section>
    </main>
  )
}

function PolicyPage() {
  const { slug } = useParams()
  const labels = { 'giao-nhan': 'Giao nhận', 'thanh-toan': 'Thanh toán', 'doi-tra': 'Đổi trả', 'bao-mat': 'Bảo mật', 'dieu-khoan-mua-hang': 'Điều khoản mua hàng' }
  return <ContentPage title={labels[slug] || 'Chính sách GreenNest'} description="Thông tin chính sách sẽ được shop xác nhận và cập nhật theo quy trình vận hành thực tế." />
}

function CartPage({ cart, updateQuantity, navigate, formatCurrency, checkout, orderForm, setOrderForm, handleOrderSubmit, total, shippingFee = 0, couponDiscount = 0, submitting = false, selectedDelivery, setSelectedDelivery, couponInput, setCouponInput, applyCoupon }) {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  return (
    <main className="cart-page">
      <section className="catalog-heading">
        <span className="eyebrow">Mua sắm</span>
        <h1>{checkout ? 'Đặt hàng' : 'Giỏ hàng'}</h1>
        <p>{cart.length ? 'Kiểm tra sản phẩm trước khi gửi yêu cầu đặt hàng.' : 'Giỏ hàng của bạn đang trống.'}</p>
      </section>
      <section className="cart-layout">
        <div className="panel cart-items-panel">
          {cart.length ? cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div><strong>{item.product.name}</strong><span>{formatCurrency(item.product.price)}</span></div>
              <div className="quantity-box"><button onClick={() => updateQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}>+</button></div>
            </div>
          )) : <div className="empty-state"><h3>Chưa có sản phẩm</h3><button className="btn btn-primary" onClick={() => navigate('/cua-hang')}>Đi đến cửa hàng</button></div>}
        </div>
        <div className="panel cart-summary">
          <h3>Thông tin thanh toán</h3>
          {checkout ? (
            <form className="checkout-form" onSubmit={handleOrderSubmit}>
              <label>Phương thức giao hàng
                <select value={selectedDelivery.label} onChange={event => setSelectedDelivery(deliveryOptions.find(option => option.label === event.target.value))}>
                  {deliveryOptions.map(option => <option key={option.label} value={option.label}>{option.label} — {formatCurrency(option.price)}</option>)}
                </select>
              </label>
              <label>Mã giảm giá<input value={couponInput} onChange={event => setCouponInput(event.target.value)} /></label>
              <button type="button" className="btn btn-secondary" onClick={applyCoupon}>Áp dụng mã</button>
              <label>Phương thức thanh toán
                <select value={orderForm.paymentMethod} onChange={event => setOrderForm(current => ({ ...current, paymentMethod: event.target.value }))}>
                  <option>Chuyển khoản</option><option>Tiền mặt</option>
                </select>
              </label>
              <label>Ghi chú<textarea value={orderForm.note} onChange={event => setOrderForm(current => ({ ...current, note: event.target.value }))} /></label>
              <input required aria-label="Họ tên người nhận" placeholder="Họ tên người nhận" value={orderForm.name} onChange={(event) => setOrderForm((current) => ({ ...current, name: event.target.value }))} />
              <input required aria-label="Số điện thoại" placeholder="Số điện thoại" value={orderForm.phone} onChange={(event) => setOrderForm((current) => ({ ...current, phone: event.target.value }))} />
              <textarea required aria-label="Địa chỉ giao hàng" placeholder="Địa chỉ giao hàng" value={orderForm.address} onChange={(event) => setOrderForm((current) => ({ ...current, address: event.target.value }))} />
              <button className="btn btn-primary full" type="submit" disabled={!cart.length || submitting}>{submitting ? 'Đang gửi…' : 'Xác nhận đặt hàng'}</button>
            </form>
          ) : <button className="btn btn-primary full" disabled={!cart.length} onClick={() => navigate('/dat-hang')}>Tiến hành đặt hàng</button>}
          <div className="totals"><div><span>Tạm tính</span><strong>{formatCurrency(subtotal)}</strong></div><div><span>Giảm giá</span><strong>{formatCurrency(couponDiscount)}</strong></div><div><span>Phí giao hàng</span><strong>{formatCurrency(shippingFee)}</strong></div><div className="grand-total"><span>Tổng dự kiến</span><strong>{formatCurrency(subtotal - couponDiscount + shippingFee)}</strong></div></div>
        </div>
      </section>
    </main>
  )
}

function ContentPage({ title, description }) {
  const navigate = useNavigate()
  return (
    <main className="content-page">
      <section className="content-hero">
        <span className="eyebrow">GreenNest Plant Studio</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="btn btn-primary large" onClick={() => navigate('/lien-he')}>Liên hệ tư vấn</button>
      </section>
      <section className="content-columns">
        <div><h2>Nội dung đang được cập nhật</h2><p>GreenNest đang hoàn thiện hình ảnh, video và thông tin chi tiết cho khu vực này. Bạn có thể xem sản phẩm hoặc gửi yêu cầu tư vấn ngay hôm nay.</p></div>
        <div className="content-note"><strong>Cần tư vấn nhanh?</strong><span>Hotline 0909 123 456</span><span>hello@greennest.vn</span></div>
      </section>
    </main>
  )
}

function AdminAlbumPage() {
  const [images, setImages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('greennest-album-images') || '[]')
      return Array.isArray(saved) ? saved.filter(item => item && typeof item.name === 'string' && typeof item.data === 'string' && /^data:image\/(png|jpeg|webp|gif);base64,/.test(item.data)) : []
    } catch { return [] }
  })
  const [uploading, setUploading] = useState(false)
  const [albumMessage, setAlbumMessage] = useState('')
  const uploadLock = useRef(false)

  const handleUpload = async (event) => {
    const input = event.currentTarget
    const files = Array.from(input.files || [])
    if (!files.length || uploadLock.current) return
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 1024 * 1024)) {
      setAlbumMessage('Chọn ảnh JPG, PNG, WebP hoặc GIF; tối đa 1 MB mỗi ảnh.'); input.value = ''; return
    }
    uploadLock.current = true; setUploading(true)
    try {
      const newImages = await Promise.all(files.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve({ name: file.name, data: reader.result })
        reader.onerror = () => reject(new Error('Không đọc được ảnh'))
        reader.onabort = () => reject(new Error('Đã hủy đọc ảnh'))
        reader.readAsDataURL(file)
      })))
      const nextImages = [...images, ...newImages]
      const serialized = JSON.stringify(nextImages)
      if (serialized.length > 1800000) throw new Error('Album quá lớn. Vui lòng giảm số ảnh hoặc dung lượng ảnh.')
      localStorage.setItem('greennest-album-images', serialized)
      setImages(nextImages); setAlbumMessage('Đã lưu ảnh trên trình duyệt này.')
    } catch (error) { setAlbumMessage(error.message || 'Không đủ dung lượng lưu ảnh.') }
    finally { uploadLock.current = false; setUploading(false); input.value = '' }
  }

  const clearAlbum = () => {
    if (uploadLock.current || !window.confirm('Xóa toàn bộ album trên trình duyệt này?')) return
    try {
      localStorage.removeItem('greennest-album-images'); setImages([]); setAlbumMessage('Đã xóa album.')
    } catch { setAlbumMessage('Không thể xóa album trên trình duyệt này.') }
  }

  return (
    <main className="admin-album-page">
      <section className="panel album-admin-header">
        <div>
          <span className="eyebrow">Quản trị media</span>
          <h1>Album ảnh thư viện</h1>
          <p>Ảnh chỉ lưu trên trình duyệt hiện tại, chưa đồng bộ lên website công khai.</p>
        </div>
        <div className="album-admin-actions">
          <label className="btn btn-primary" htmlFor="admin-image-upload">+ Thêm ảnh</label>
          <input id="admin-image-upload" type="file" accept="image/*" multiple disabled={uploading} onChange={handleUpload} />
          <button className="btn btn-ghost" disabled={uploading} onClick={clearAlbum}>Xóa album</button>
        </div>
      </section>
      <p role="status">{albumMessage}</p>
      <section className="admin-album-grid">
        {images.length ? images.map((image, index) => (
          <figure className="admin-album-item" key={`${image.name}-${index}`}>
            <img src={image.data} alt={image.name} />
            <figcaption>{image.name}</figcaption>
          </figure>
        )) : <div className="panel empty-state"><h3>Album đang trống</h3><p>Thêm ảnh dự án, sản phẩm hoặc thư viện cảnh quan.</p></div>}
      </section>
    </main>
  )
}

function CustomerPage({ loggedUser, products, orders, addToCart, navigate, formatCurrency }) {
  return (
    <main className="customer-layout">
      <section className="customer-welcome panel">
        <div>
          <span className="eyebrow">Khu vực khách hàng</span>
          <h2>Xin chào, {loggedUser?.name || 'Khách hàng'}</h2>
          <p>Quản lý tài khoản, shop yêu thích và đơn hàng của bạn trong một nơi.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
      </section>

      <section className="customer-grid">
        <div className="panel customer-card">
          <div className="panel-header">
            <h3>Thông tin tài khoản</h3>
          </div>
          <div className="customer-info">
            <p><strong>Email:</strong> {loggedUser?.email || 'customer@greennest.vn'}</p>
            <p><strong>Vai trò:</strong> Khách hàng thân thiết</p>
            <p><strong>Điểm tích lũy:</strong> Chưa có dữ liệu</p>
            <p><strong>Địa chỉ:</strong> {loggedUser?.address || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="panel customer-card">
          <div className="panel-header">
            <h3>Đơn hàng của tôi</h3>
          </div>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} className="order-row">
                  <div>
                    <strong>#{order.id}</strong>
                    <span>{order.status || 'Chờ xác nhận'}</span>
                  </div>
                  <div className="order-status">
                    <strong>{formatCurrency(order.total || 0)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Gợi ý cho bạn</h3>
        </div>
        <div className="product-grid compact-grid">
          {products.slice(0, 3).map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />
                <span className="product-badge">Mới</span>
              </div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <div className="product-bottom">
                  <strong>{formatPrice(product.price)}</strong>
                  <button className="btn btn-primary small" disabled={product.stock <= 0 || product.price <= 0} onClick={() => addToCart(product)}>
                    {product.price <= 0 ? 'Tư vấn' : 'Thêm'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function AdminPage({
  products,
  orders,
  lowStockItems,
  productForm,
  handleProductChange,
  handleProductSubmit,
  editingProductId,
  resetProductForm,
  handleEdit,
  handleDelete,
  categories,
  formatCurrency,
}) {
  const navigate = useNavigate()

  return (
    <main className="admin-layout">
      <section className="admin-toolbar panel">
        <div>
          <span className="eyebrow">Khu vực quản trị</span>
          <h2>Quản lý GreenNest</h2>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin-album.html')}>Quản lý album ảnh</button>
      </section>
      <section className="admin-summary">
        <div className="summary-card primary">
          <span>Tổng sản phẩm</span>
          <strong>{products.length}</strong>
        </div>
        <div className="summary-card">
          <span>Đơn hàng</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="summary-card warning">
          <span>Sắp hết hàng</span>
          <strong>{lowStockItems}</strong>
        </div>
        <div className="summary-card success">
          <span>Tổng giá trị đơn hàng</span>
          <strong>{formatCurrency(orders.reduce((sum, order) => sum + Number(order.total || 0), 0))}</strong>
        </div>
      </section>

      <section className="admin-content">
        <div className="panel">
          <div className="panel-header">
            <h3>{editingProductId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          </div>

          <form onSubmit={handleProductSubmit} className="admin-form">
            <div className="field-grid">
              <input required name="name" value={productForm.name} onChange={handleProductChange} aria-label="Tên sản phẩm" placeholder="Tên sản phẩm" />
              <select name="category" value={productForm.category} onChange={handleProductChange}>
                {categories.filter((item) => item !== 'Tất cả').map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-grid">
              <input name="price" value={productForm.price} onChange={handleProductChange} aria-label="Giá bán" placeholder="Giá bán" type="number" min="0" required />
              <input name="stock" value={productForm.stock} onChange={handleProductChange} aria-label="Tồn kho" placeholder="Tồn kho" type="number" min="0" step="1" required />
            </div>

            <div className="field-grid">
              <input name="image" value={productForm.image} onChange={handleProductChange} aria-label="URL ảnh" placeholder="URL ảnh" />
              <input name="size" value={productForm.size} onChange={handleProductChange} aria-label="Kích thước" placeholder="Kích thước" />
            </div>

            <div className="field-grid">
              <input name="badge" value={productForm.badge} onChange={handleProductChange} aria-label="Badge" placeholder="Badge" />
              <input name="accessories" value={productForm.accessories} onChange={handleProductChange} aria-label="Phụ kiện (ngăn cách bằng dấu phẩy)" placeholder="Phụ kiện (ngăn cách bằng dấu phẩy)" />
            </div>

            <input name="tags" value={productForm.tags} onChange={handleProductChange} aria-label="Tags danh mục, ngăn cách bằng dấu phẩy" placeholder="Tags danh mục, ngăn cách bằng dấu phẩy" />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editingProductId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
              {editingProductId && (
                <button type="button" className="btn btn-ghost" onClick={resetProductForm}>Hủy</button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Đơn hàng gần đây</h3>
          </div>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p>Chưa có đơn hàng nào.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="order-row">
                  <div>
                    <strong>#{order.id}</strong>
                    <span>{order.customer?.name || 'Khách hàng'}</span>
                  </div>
                  <div className="order-status">
                    <span>{order.status || 'Chờ xác nhận'}</span>
                    <strong>{formatCurrency(order.total || 0)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel product-table-panel">
        <div className="panel-header">
          <h3>Quản lý sản phẩm</h3>
        </div>
        <div className="product-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.stock}</td>
                  <td className="admin-actions">
                    <button className="btn btn-ghost small" onClick={() => handleEdit(product)}>Sửa</button>
                    <button className="btn btn-primary small" onClick={() => handleDelete(product.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
