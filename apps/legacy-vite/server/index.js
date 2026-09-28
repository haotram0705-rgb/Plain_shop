import express from 'express'
import cors from 'cors'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

let products = [
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
    accessories: ['Chậu sứ', 'Đế hoa', 'Combo quà'],
  },
]

let orders = []

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id))
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
})

app.post('/api/products', (req, res) => {
  const product = { id: Date.now(), ...req.body }
  products.push(product)
  res.status(201).json(product)
})

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((item) => item.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: 'Product not found' })
  products[index] = { ...products[index], ...req.body }
  res.json(products[index])
})

app.delete('/api/products/:id', (req, res) => {
  const before = products.length
  products = products.filter((item) => item.id !== Number(req.params.id))
  if (products.length === before) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json({ success: true })
})

app.get('/api/orders', (req, res) => {
  res.json(orders)
})

app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body,
  }
  orders.unshift(order)
  res.status(201).json(order)
})

app.listen(port, () => {
  console.log(`Plant shop API running on http://localhost:${port}`)
})
