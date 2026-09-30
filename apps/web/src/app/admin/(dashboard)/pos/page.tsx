'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { catalogProducts } from '@/features/products/catalog';

type POSProduct = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  sold: number;
  image: string;
  unit: string;
  status: string;
};

type CartItem = {
  id: number;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image: string;
  unit: string;
};

type OrderTab = {
  id: string;
  label: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  couponCode: string;
  discountAmount: number;
  note: string;
  createdAt: string;
};

type POSSavedOrder = {
  id: string;
  date: string;
  total: number;
  status: string;
  customer: string;
  phone: string;
  address: string;
  item: string;
  items: CartItem[];
  payment: string;
  cashier: string;
  cashGiven?: number;
  changeDue?: number;
  history: { time: string; status: string }[];
};

const starterPOSProducts: POSProduct[] = catalogProducts.map((item, index) => ({
  id: index + 1,
  sku: item.sku || `PS-SP-${String(index + 1).padStart(3, '0')}`,
  name: item.name,
  category: item.category || 'Cây cảnh',
  price: item.price,
  costPrice: Math.round(item.price * 0.62),
  stock: typeof item.stock === 'number' ? item.stock : 15,
  sold: typeof item.sold === 'number' ? item.sold : 20,
  image: item.image || '/assets/images/prod-monstera.jpg',
  unit: item.unit || 'Chậu',
  status: item.stock === 0 ? 'Hết hàng' : 'Đang bán',
}));

const money = (val: number) => `${new Intl.NumberFormat('vi-VN').format(val)}đ`;

export default function AdminPOSPage() {
  const [products, setProducts] = useState<POSProduct[]>(starterPOSProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [notice, setNotice] = useState('');

  // Tabs for managing multiple counter orders
  const [tabs, setTabs] = useState<OrderTab[]>([
    {
      id: 'tab-1',
      label: 'Hóa đơn 1',
      items: [],
      customerName: 'Khách lẻ',
      customerPhone: '',
      couponCode: '',
      discountAmount: 0,
      note: '',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  // Checkout modal state
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Modals for history and shift summary
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [posOrdersHistory, setPosOrdersHistory] = useState<POSSavedOrder[]>([]);

  // Load products & history from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedProducts = window.localStorage.getItem('plant_shop_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch {
        // ignore
      }
    } else {
      window.localStorage.setItem('plant_shop_products', JSON.stringify(starterPOSProducts));
    }

    loadHistory();
  }, []);

  function loadHistory() {
    try {
      const raw = window.localStorage.getItem('plant_shop_orders_admin');
      if (raw) {
        const allOrders = JSON.parse(raw) as POSSavedOrder[];
        const posOrders = allOrders.filter(
          (o) => o.id.startsWith('POS-') || o.payment?.includes('quầy') || o.cashier
        );
        setPosOrdersHistory(posOrders);
      }
    } catch {
      // ignore
    }
  }

  function notify(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2400);
  }

  // Active tab reference
  const currentTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) || tabs[0],
    [tabs, activeTabId]
  );

  // Filtered catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = categoryFilter === 'Tất cả' || p.category === categoryFilter;
      const matchText = `${p.sku} ${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchText;
    });
  }, [products, search, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Tất cả', ...Array.from(set)];
  }, [products]);

  // Calculations for current tab
  const subtotal = useMemo(() => {
    return currentTab.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [currentTab.items]);

  const totalDiscount = useMemo(() => {
    let disc = currentTab.discountAmount;
    if (currentTab.couponCode.toUpperCase() === 'GREEN10') {
      disc += Math.round(subtotal * 0.1);
    }
    return Math.min(subtotal, disc);
  }, [subtotal, currentTab.discountAmount, currentTab.couponCode]);

  const grandTotal = Math.max(0, subtotal - totalDiscount);
  const changeDue = Math.max(0, cashGiven - grandTotal);

  // Cart actions
  function addToCart(product: POSProduct) {
    if (product.stock <= 0) {
      notify(`Sản phẩm "${product.name}" hiện đã hết hàng.`);
      return;
    }

    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== currentTab.id) return t;
        const existingIndex = t.items.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          const item = t.items[existingIndex];
          if (item.quantity >= product.stock) {
            notify(`Đã đạt số lượng tồn kho tối đa (${product.stock}).`);
            return t;
          }
          const nextItems = [...t.items];
          nextItems[existingIndex] = { ...item, quantity: item.quantity + 1 };
          return { ...t, items: nextItems };
        }
        return {
          ...t,
          items: [
            ...t.items,
            {
              id: product.id,
              sku: product.sku,
              name: product.name,
              price: product.price,
              quantity: 1,
              stock: product.stock,
              image: product.image,
              unit: product.unit,
            },
          ],
        };
      })
    );
  }

  function updateQuantity(itemId: number, delta: number) {
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== currentTab.id) return t;
        const nextItems = t.items
          .map((item) => {
            if (item.id === itemId) {
              const newQty = item.quantity + delta;
              if (newQty > item.stock) {
                notify(`Kho chỉ còn ${item.stock} ${item.unit}.`);
                return item;
              }
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
        return { ...t, items: nextItems };
      })
    );
  }

  function removeItem(itemId: number) {
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== currentTab.id) return t;
        return { ...t, items: t.items.filter((item) => item.id !== itemId) };
      })
    );
  }

  function clearCurrentCart() {
    if (currentTab.items.length === 0) return;
    if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong hóa đơn này?')) return;
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== currentTab.id) return t;
        return {
          ...t,
          items: [],
          customerName: 'Khách lẻ',
          customerPhone: '',
          couponCode: '',
          discountAmount: 0,
          note: '',
        };
      })
    );
    notify('Đã xóa giỏ hàng.');
  }

  // Tab management
  function addNewTab() {
    const newId = `tab-${Date.now()}`;
    const newNumber = tabs.length + 1;
    const newTab: OrderTab = {
      id: newId,
      label: `Hóa đơn ${newNumber}`,
      items: [],
      customerName: 'Khách lẻ',
      customerPhone: '',
      couponCode: '',
      discountAmount: 0,
      note: '',
      createdAt: new Date().toISOString(),
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  }

  function closeTab(tabId: string, event: React.MouseEvent) {
    event.stopPropagation();
    if (tabs.length === 1) {
      setTabs([
        {
          id: 'tab-1',
          label: 'Hóa đơn 1',
          items: [],
          customerName: 'Khách lẻ',
          customerPhone: '',
          couponCode: '',
          discountAmount: 0,
          note: '',
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }
    const filtered = tabs.filter((t) => t.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId) {
      setActiveTabId(filtered[0].id);
    }
  }

  // Coupon / Discount
  function applyCoupon(code: string) {
    const clean = code.trim().toUpperCase();
    if (clean === 'GREEN10') {
      setTabs((prev) =>
        prev.map((t) => (t.id === currentTab.id ? { ...t, couponCode: clean } : t))
      );
      notify('Áp dụng thành công mã GREEN10 (Giảm 10%).');
    } else if (clean === '') {
      setTabs((prev) =>
        prev.map((t) => (t.id === currentTab.id ? { ...t, couponCode: '' } : t))
      );
    } else {
      notify(`Mã giảm giá "${code}" không hợp lệ.`);
    }
  }

  // Open checkout modal
  function handleOpenCheckout() {
    if (currentTab.items.length === 0) {
      notify('Vui lòng chọn sản phẩm vào giỏ trước khi thanh toán.');
      return;
    }
    setCashGiven(grandTotal);
    setShowCheckout(true);
  }

  // Complete Order
  function completeOrder() {
    if (paymentMethod === 'cash' && cashGiven < grandTotal) {
      alert(`Khách còn thiếu ${money(grandTotal - cashGiven)}! Vui lòng thu đủ tiền.`);
      return;
    }

    const orderId = `POS-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toLocaleString('vi-VN');
    const paymentLabel =
      paymentMethod === 'cash'
        ? 'Tiền mặt tại quầy'
        : paymentMethod === 'transfer'
        ? 'Chuyển khoản VietQR'
        : 'Thẻ POS ngân hàng';

    const itemsSummary = currentTab.items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(', ');

    const newOrder: POSSavedOrder = {
      id: orderId,
      date: nowStr,
      total: grandTotal,
      status: 'Hoàn tất',
      customer: currentTab.customerName || 'Khách lẻ',
      phone: currentTab.customerPhone || 'Tại quầy',
      address: 'Mua trực tiếp tại showroom (Quầy POS 01)',
      item: itemsSummary,
      items: currentTab.items,
      payment: paymentLabel,
      cashier: 'Lan Nguyễn (Quầy 01)',
      cashGiven: paymentMethod === 'cash' ? cashGiven : grandTotal,
      changeDue: paymentMethod === 'cash' ? changeDue : 0,
      history: [
        { time: nowStr, status: 'Hoàn tất thanh toán tại quầy' },
        { time: nowStr, status: 'Xuất kho và in hóa đơn' },
      ],
    };

    // 1. Deduct Stock in plant_shop_products
    const updatedProducts = products.map((prod) => {
      const purchased = currentTab.items.find((it) => it.id === prod.id);
      if (purchased) {
        const nextStock = Math.max(0, prod.stock - purchased.quantity);
        return {
          ...prod,
          stock: nextStock,
          sold: (prod.sold || 0) + purchased.quantity,
          status: nextStock === 0 ? 'Hết hàng' : prod.status,
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    window.localStorage.setItem('plant_shop_products', JSON.stringify(updatedProducts));

    // 2. Save into plant_shop_orders_admin
    const existingOrdersRaw = window.localStorage.getItem('plant_shop_orders_admin');
    const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
    const nextOrders = [newOrder, ...existingOrders];
    window.localStorage.setItem('plant_shop_orders_admin', JSON.stringify(nextOrders));

    // 3. Save stock movement log
    try {
      const existingMovements = JSON.parse(
        window.localStorage.getItem('plant_shop_stock_movements') || '[]'
      );
      const newMovements = currentTab.items.map((item) => ({
        id: Date.now() + Math.random(),
        product: item.name,
        type: 'Xuất kho',
        quantity: item.quantity,
        note: `Bán tại quầy đơn ${orderId} (${paymentLabel})`,
        supplier: 'Showroom Plant Shop',
        time: nowStr,
      }));
      window.localStorage.setItem(
        'plant_shop_stock_movements',
        JSON.stringify([...newMovements, ...existingMovements].slice(0, 100))
      );
    } catch {
      // ignore
    }

    // 4. Update change log
    try {
      const changeLog = JSON.parse(window.localStorage.getItem('plant_shop_change_log') || '[]');
      changeLog.unshift({
        time: new Date().toISOString(),
        section: 'POS Bán hàng',
        action: `Tạo đơn ${orderId} (${money(grandTotal)})`,
      });
      window.localStorage.setItem('plant_shop_change_log', JSON.stringify(changeLog.slice(0, 100)));
    } catch {
      // ignore
    }

    loadHistory();
    setShowCheckout(false);

    // Reset current tab
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id !== currentTab.id) return t;
        return {
          ...t,
          items: [],
          customerName: 'Khách lẻ',
          customerPhone: '',
          couponCode: '',
          discountAmount: 0,
          note: '',
        };
      })
    );

    notify(`✅ Đã thanh toán đơn hàng ${orderId} thành công!`);

    // Auto-open print receipt
    printReceipt(newOrder);
  }

  // Print Receipt Generator (80mm standard POS style)
  function printReceipt(order: POSSavedOrder) {
    const printWindow = window.open('', '_blank', 'width=420,height=680');
    if (!printWindow) return;

    const itemsHtml = order.items
      .map(
        (it) => `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px dashed #eee;">
            <div style="font-weight: 600;">${it.name}</div>
            <div style="font-size: 11px; color: #666;">${it.quantity} ${it.unit} × ${money(it.price)}</div>
          </td>
          <td style="padding: 6px 0; text-align: right; vertical-align: top; font-weight: 600; border-bottom: 1px dashed #eee;">
            ${money(it.price * it.quantity)}
          </td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Phiếu thanh toán - ${order.id}</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              width: 78mm;
              margin: 0 auto;
              padding: 16px 10px;
              color: #111;
              font-size: 12px;
              line-height: 1.4;
            }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { font-size: 18px; margin: 0; text-transform: uppercase; letter-spacing: 1px; color: #123f32; }
            .header p { margin: 3px 0; font-size: 11px; color: #555; }
            .meta { margin-bottom: 10px; font-size: 11px; }
            .meta div { display: flex; justify-content: space-between; margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            .totals { border-top: 1px solid #111; border-bottom: 2px dashed #333; padding: 8px 0; margin-bottom: 12px; }
            .totals div { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .grand-total { font-size: 15px; font-weight: bold; color: #123f32; margin-top: 6px; }
            .footer { text-align: center; font-size: 11px; color: #555; margin-top: 16px; }
            .footer strong { display: block; margin-bottom: 4px; font-size: 12px; color: #123f32; }
            @media print {
              body { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PLANT SHOP</h1>
            <p>24 Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP. HCM</p>
            <p>Hotline: 0909 123 456 · www.plantshop.vn</p>
            <h2 style="font-size: 14px; margin: 8px 0 0; text-transform: uppercase;">HÓA ĐƠN BÁN LẺ</h2>
          </div>
          <div class="meta">
            <div><span>Mã đơn:</span><strong>${order.id}</strong></div>
            <div><span>Ngày giờ:</span><span>${order.date}</span></div>
            <div><span>Thu ngân:</span><span>${order.cashier}</span></div>
            <div><span>Khách hàng:</span><span>${order.customer}</span></div>
            ${order.phone ? `<div><span>SĐT:</span><span>${order.phone}</span></div>` : ''}
          </div>
          <table>
            <thead>
              <tr style="border-bottom: 1px solid #333; font-size: 11px; text-transform: uppercase;">
                <th style="text-align: left; padding-bottom: 4px;">Sản phẩm</th>
                <th style="text-align: right; padding-bottom: 4px;">T.Tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Tổng cộng:</span><span class="grand-total">${money(order.total)}</span></div>
            <div><span>Phương thức:</span><span>${order.payment}</span></div>
            ${
              order.cashGiven
                ? `<div><span>Khách đưa:</span><span>${money(order.cashGiven)}</span></div>
                   <div><span>Tiền thừa:</span><span>${money(order.changeDue || 0)}</span></div>`
                : ''
            }
          </div>
          <div class="footer">
            <strong>Cảm ơn quý khách!</strong>
            <p>Đổi trả cây & chậu trong vòng 7 ngày nếu lỗi từ nhà vườn.</p>
            <p style="margin-top: 6px; font-size: 10px;">Plant Shop · Đồng hành cùng không gian sống xanh</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 350);
  }

  // Today shift totals
  const shiftStats = useMemo(() => {
    const count = posOrdersHistory.length;
    const rev = posOrdersHistory.reduce((s, o) => s + (o.total || 0), 0);
    const cashTotal = posOrdersHistory
      .filter((o) => o.payment?.toLowerCase().includes('tiền mặt'))
      .reduce((s, o) => s + (o.total || 0), 0);
    const transferTotal = posOrdersHistory
      .filter((o) => o.payment?.toLowerCase().includes('chuyển khoản'))
      .reduce((s, o) => s + (o.total || 0), 0);
    const cardTotal = posOrdersHistory
      .filter((o) => o.payment?.toLowerCase().includes('thẻ'))
      .reduce((s, o) => s + (o.total || 0), 0);

    return { count, rev, cashTotal, transferTotal, cardTotal };
  }, [posOrdersHistory]);

  return (
    <div className="pos-terminal-app">
      {/* Top POS Terminal Navigation Bar */}
      <header className="pos-nav-header">
        <div className="pos-brand-group">
          <Link className="pos-back-link" href="/admin" title="Về Dashboard">
            ← Tổng quan
          </Link>
          <div className="pos-badge">
            <span className="pos-pulse" />
            <strong>QUẦY THU NGÂN 01</strong>
            <small>Thu ngân: Lan Nguyễn</small>
          </div>
        </div>

        {/* Multi-Order Tabs */}
        <div className="pos-tabs-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`pos-tab-button ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.items.length > 0 && <b className="pos-tab-count">{tab.items.length}</b>}
              {tabs.length > 1 && (
                <span
                  className="pos-tab-close"
                  onClick={(e) => closeTab(tab.id, e)}
                  title="Đóng hóa đơn này"
                >
                  ×
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            className="pos-add-tab-btn"
            onClick={addNewTab}
            title="Mở thêm hóa đơn chờ mới"
          >
            + Đơn chờ mới
          </button>
        </div>

        {/* Top actions */}
        <div className="pos-top-actions">
          <button
            type="button"
            className="pos-action-btn"
            onClick={() => setShowHistoryModal(true)}
          >
            📋 Lịch sử bill ({posOrdersHistory.length})
          </button>
          <button
            type="button"
            className="pos-action-btn highlight"
            onClick={() => setShowShiftModal(true)}
          >
            📊 Chốt ca: {money(shiftStats.rev)}
          </button>
        </div>
      </header>

      {/* Main 2-Column POS Workspace */}
      <div className="pos-main-container">
        {/* Left Column: Catalog & Search */}
        <section className="pos-catalog-column">
          <div className="pos-search-bar">
            <label className="pos-search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên cây, chậu, phân bón hoặc mã SKU..."
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  className="pos-clear-search"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              )}
            </label>
          </div>

          {/* Category Filter Pills */}
          <div className="pos-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pos-pill ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="pos-product-grid">
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stock <= 0;
              const cartItem = currentTab.items.find((it) => it.id === prod.id);
              return (
                <div
                  key={prod.id}
                  className={`pos-product-card ${isOutOfStock ? 'is-out' : ''} ${
                    cartItem ? 'in-cart' : ''
                  }`}
                  onClick={() => !isOutOfStock && addToCart(prod)}
                >
                  <div
                    className="pos-card-thumb"
                    style={{ backgroundImage: `url(${prod.image})` }}
                  >
                    <span
                      className={`pos-stock-pill ${
                        isOutOfStock
                          ? 'out'
                          : prod.stock <= 5
                          ? 'low'
                          : 'available'
                      }`}
                    >
                      {isOutOfStock ? 'Hết hàng' : `Còn ${prod.stock}`}
                    </span>
                    {cartItem && (
                      <span className="pos-in-cart-badge">{cartItem.quantity}</span>
                    )}
                  </div>
                  <div className="pos-card-info">
                    <span className="pos-card-sku">{prod.sku}</span>
                    <strong className="pos-card-title">{prod.name}</strong>
                    <div className="pos-card-bottom">
                      <span className="pos-card-price">{money(prod.price)}</span>
                      <small className="pos-card-unit">/{prod.unit}</small>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="pos-empty-catalog">
                <p>Không tìm thấy sản phẩm nào khớp với &quot;{search}&quot;</p>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('Tất cả');
                  }}
                >
                  Xem tất cả
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Active Cart / Order Bill */}
        <section className="pos-bill-column">
          <div className="pos-bill-card">
            {/* Bill Header */}
            <div className="pos-bill-top">
              <div className="pos-bill-title">
                <h3>{currentTab.label}</h3>
                <span className="pos-bill-time">
                  {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                type="button"
                className="pos-bill-clear"
                onClick={clearCurrentCart}
                disabled={currentTab.items.length === 0}
                title="Xóa trắng giỏ"
              >
                Làm rỗng giỏ
              </button>
            </div>

            {/* Customer Selector */}
            <div className="pos-customer-box">
              <div className="pos-customer-row">
                <input
                  type="text"
                  placeholder="Tên khách hàng (Mặc định: Khách lẻ)"
                  value={currentTab.customerName === 'Khách lẻ' ? '' : currentTab.customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTabs((prev) =>
                      prev.map((t) =>
                        t.id === currentTab.id
                          ? { ...t, customerName: val.trim() ? val : 'Khách lẻ' }
                          : t
                      )
                    );
                  }}
                />
                <input
                  type="tel"
                  placeholder="SĐT (tùy chọn)"
                  value={currentTab.customerPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTabs((prev) =>
                      prev.map((t) =>
                        t.id === currentTab.id ? { ...t, customerPhone: val } : t
                      )
                    );
                  }}
                />
              </div>
            </div>

            {/* Bill Items List */}
            <div className="pos-bill-items-area">
              {currentTab.items.length === 0 ? (
                <div className="pos-empty-cart">
                  <span className="empty-icon">🛒</span>
                  <p>Giỏ hàng đang trống</p>
                  <small>Bấm vào sản phẩm bên trái để đưa vào hóa đơn.</small>
                </div>
              ) : (
                <div className="pos-items-table">
                  {currentTab.items.map((item) => (
                    <div className="pos-item-row" key={item.id}>
                      <div
                        className="pos-item-thumb"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="pos-item-details">
                        <strong className="pos-item-name">{item.name}</strong>
                        <span className="pos-item-sku">{item.sku}</span>
                        <div className="pos-item-price-unit">
                          {money(item.price)} × {item.quantity} {item.unit}
                        </div>
                      </div>
                      <div className="pos-item-qty-controls">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          title="Giảm 1"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          title="Tăng 1"
                        >
                          +
                        </button>
                      </div>
                      <strong className="pos-item-line-total">
                        {money(item.price * item.quantity)}
                      </strong>
                      <button
                        type="button"
                        className="pos-item-remove"
                        onClick={() => removeItem(item.id)}
                        title="Xóa món"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Calculations */}
            <div className="pos-bill-calculations">
              <div className="pos-coupon-row">
                <input
                  type="text"
                  placeholder="Mã voucher (ví dụ: GREEN10)"
                  value={currentTab.couponCode}
                  onChange={(e) => applyCoupon(e.target.value)}
                />
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => applyCoupon('GREEN10')}
                >
                  Mã 10%
                </button>
              </div>

              <div className="pos-calc-line">
                <span>Tạm tính ({currentTab.items.reduce((s, it) => s + it.quantity, 0)} món)</span>
                <strong>{money(subtotal)}</strong>
              </div>

              {totalDiscount > 0 && (
                <div className="pos-calc-line discount">
                  <span>Giảm giá khuyến mãi</span>
                  <strong>-{money(totalDiscount)}</strong>
                </div>
              )}

              <div className="pos-calc-line total">
                <span>Khách phải trả</span>
                <strong className="pos-grand-total">{money(grandTotal)}</strong>
              </div>
            </div>

            {/* Bottom Checkout Button */}
            <div className="pos-bill-actions">
              <button
                type="button"
                className="pos-checkout-btn"
                onClick={handleOpenCheckout}
                disabled={currentTab.items.length === 0}
              >
                <span>THANH TOÁN (F9)</span>
                <strong>{money(grandTotal)} →</strong>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout & Payment Modal */}
      {showCheckout && (
        <div className="pos-modal-backdrop" onClick={() => setShowCheckout(false)}>
          <div className="pos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pos-modal-header">
              <div>
                <span className="filter-label">Thanh toán đơn hàng</span>
                <h2>{money(grandTotal)}</h2>
                <p>Khách hàng: <strong>{currentTab.customerName}</strong></p>
              </div>
              <button
                type="button"
                className="pos-modal-close"
                onClick={() => setShowCheckout(false)}
              >
                ×
              </button>
            </div>

            <div className="pos-payment-method-tabs">
              <button
                type="button"
                className={paymentMethod === 'cash' ? 'active' : ''}
                onClick={() => setPaymentMethod('cash')}
              >
                💵 Tiền mặt
              </button>
              <button
                type="button"
                className={paymentMethod === 'transfer' ? 'active' : ''}
                onClick={() => setPaymentMethod('transfer')}
              >
                📱 Chuyển khoản VietQR
              </button>
              <button
                type="button"
                className={paymentMethod === 'card' ? 'active' : ''}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Quẹt thẻ máy POS
              </button>
            </div>

            <div className="pos-payment-body">
              {paymentMethod === 'cash' && (
                <div className="pos-cash-view">
                  <label className="pos-cash-input-label">
                    <span>Tiền khách đưa (VNĐ):</span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={cashGiven}
                      onChange={(e) => setCashGiven(Number(e.target.value))}
                    />
                  </label>

                  <div className="pos-quick-denominations">
                    <button type="button" onClick={() => setCashGiven(grandTotal)}>
                      Đúng số tiền
                    </button>
                    <button type="button" onClick={() => setCashGiven(100000)}>
                      100.000đ
                    </button>
                    <button type="button" onClick={() => setCashGiven(200000)}>
                      200.000đ
                    </button>
                    <button type="button" onClick={() => setCashGiven(500000)}>
                      500.000đ
                    </button>
                    <button type="button" onClick={() => setCashGiven(1000000)}>
                      1.000.000đ
                    </button>
                    <button type="button" onClick={() => setCashGiven(2000000)}>
                      2.000.000đ
                    </button>
                  </div>

                  <div className="pos-change-display">
                    <div>
                      <span>Tổng cần thanh toán:</span>
                      <strong>{money(grandTotal)}</strong>
                    </div>
                    <div>
                      <span>Khách đưa:</span>
                      <strong>{money(cashGiven)}</strong>
                    </div>
                    <div className="change-highlight">
                      <span>Tiền thừa trả khách:</span>
                      <strong>{money(changeDue)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="pos-transfer-view">
                  <div className="pos-qr-box">
                    <div className="pos-qr-mock">
                      <div className="pos-qr-inner">
                        <span className="qr-tag">VIETQR · VIETCOMBANK</span>
                        <strong>PLANT SHOP VN</strong>
                        <div className="pos-qr-code-art">
                          <span>QR CODE</span>
                        </div>
                        <span className="qr-amt">{money(grandTotal)}</span>
                      </div>
                    </div>
                    <div className="pos-transfer-info">
                      <p><strong>Ngân hàng:</strong> Vietcombank (CN TP. Hồ Chí Minh)</p>
                      <p><strong>Số tài khoản:</strong> <code>1029 3847 56</code></p>
                      <p><strong>Chủ tài khoản:</strong> CÔNG TY TNHH PLANT SHOP</p>
                      <p><strong>Số tiền:</strong> <strong style={{ color: '#de7b46' }}>{money(grandTotal)}</strong></p>
                      <p><strong>Nội dung:</strong> <code>POS {currentTab.label}</code></p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="pos-card-view">
                  <div className="pos-card-mock">
                    <span className="card-chip">💳</span>
                    <p>Vui lòng yêu cầu khách chạm hoặc quẹt thẻ trên thiết bị POS ngân hàng đặt tại quầy.</p>
                    <strong>Số tiền thanh toán: {money(grandTotal)}</strong>
                  </div>
                </div>
              )}

              <div className="pos-order-note-input">
                <input
                  type="text"
                  placeholder="Ghi chú đơn hàng nếu có (ví dụ: gói quà kèm nơ đỏ, khách hẹn chiều lấy)..."
                  value={currentTab.note}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTabs((prev) =>
                      prev.map((t) => (t.id === currentTab.id ? { ...t, note: val } : t))
                    );
                  }}
                />
              </div>
            </div>

            <div className="pos-modal-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setShowCheckout(false)}
              >
                Quay lại
              </button>
              <button
                type="button"
                className="button button-primary pos-confirm-pay"
                onClick={completeOrder}
              >
                Xác nhận thanh toán & In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today History Drawer/Modal */}
      {showHistoryModal && (
        <div className="pos-modal-backdrop" onClick={() => setShowHistoryModal(false)}>
          <div className="pos-modal-card history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pos-modal-header">
              <div>
                <span className="filter-label">Hóa đơn POS hôm nay</span>
                <h2>Lịch sử bán hàng tại quầy</h2>
                <p>Tổng cộng {posOrdersHistory.length} hóa đơn đã tạo</p>
              </div>
              <button
                type="button"
                className="pos-modal-close"
                onClick={() => setShowHistoryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="pos-history-list">
              {posOrdersHistory.length === 0 ? (
                <div className="admin-empty-state">Hôm nay chưa có đơn POS nào được tạo.</div>
              ) : (
                posOrdersHistory.map((ord) => (
                  <div className="pos-history-row" key={ord.id}>
                    <div>
                      <strong>{ord.id}</strong>
                      <small>{ord.date} · {ord.payment}</small>
                      <p>{ord.customer} · {ord.item}</p>
                    </div>
                    <div className="pos-history-right">
                      <strong>{money(ord.total)}</strong>
                      <button
                        type="button"
                        className="pos-reprint-btn"
                        onClick={() => printReceipt(ord)}
                      >
                        🖨️ In lại bill
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shift Summary Modal */}
      {showShiftModal && (
        <div className="pos-modal-backdrop" onClick={() => setShowShiftModal(false)}>
          <div className="pos-modal-card shift-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pos-modal-header">
              <div>
                <span className="filter-label">Báo cáo ca thu ngân</span>
                <h2>Chốt ca bán hàng</h2>
                <p>Quầy: 01 · Thu ngân: Lan Nguyễn</p>
              </div>
              <button
                type="button"
                className="pos-modal-close"
                onClick={() => setShowShiftModal(false)}
              >
                ×
              </button>
            </div>

            <div className="pos-shift-grid">
              <div className="shift-card primary">
                <span>Tổng doanh thu POS</span>
                <strong>{money(shiftStats.rev)}</strong>
                <small>{shiftStats.count} hóa đơn thành công</small>
              </div>
              <div className="shift-card">
                <span>Tiền mặt thu được</span>
                <strong>{money(shiftStats.cashTotal)}</strong>
                <small>Khớp két tiền quầy</small>
              </div>
              <div className="shift-card">
                <span>Chuyển khoản VietQR</span>
                <strong>{money(shiftStats.transferTotal)}</strong>
                <small>Kiểm tra app ngân hàng</small>
              </div>
              <div className="shift-card">
                <span>Quẹt thẻ POS</span>
                <strong>{money(shiftStats.cardTotal)}</strong>
                <small>Khớp bill máy quẹt</small>
              </div>
            </div>

            <div className="pos-shift-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setShowShiftModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  window.print();
                }}
              >
                In báo cáo ca
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && <div className="admin-save-notice">✦ {notice}</div>}
    </div>
  );
}

