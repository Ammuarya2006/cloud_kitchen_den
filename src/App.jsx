import { useEffect, useMemo, useState } from 'react';

const menuItems = [
  {
    id: 1,
    name: 'Premium Special Biryani',
    category: 'Main Course',
    tag: 'Veg',
    price: 180,
    rating: 4.9,
    time: '20 min',
    description: 'Aromatic basmati rice layered with fresh vegetables and rich kitchen spices.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    popular: true
  },
  {
    id: 2,
    name: 'Home-style Chicken Curry',
    category: 'Main Course',
    tag: 'Non-Veg',
    price: 220,
    rating: 4.8,
    time: '22 min',
    description: 'Tender chicken simmered in a slow-cooked onion-tomato gravy.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    popular: true
  },
  {
    id: 3,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    tag: 'Veg',
    price: 190,
    rating: 4.7,
    time: '18 min',
    description: 'Creamy tomato gravy with juicy paneer cubes and mild spices.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    popular: false
  },
  {
    id: 4,
    name: 'Crispy Chicken Wrap',
    category: 'Snacks',
    tag: 'Non-Veg',
    price: 150,
    rating: 4.6,
    time: '12 min',
    description: 'Crispy chicken strips wrapped in soft flatbread with crunchy salad.',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
    popular: true
  },
  {
    id: 5,
    name: 'Classic Veg Burger',
    category: 'Snacks',
    tag: 'Veg',
    price: 120,
    rating: 4.5,
    time: '10 min',
    description: 'A tasty grilled patty with melted cheese and house sauces.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    popular: false
  },
  {
    id: 6,
    name: 'Mango Lassi',
    category: 'Beverages',
    tag: 'Veg',
    price: 80,
    rating: 4.8,
    time: '5 min',
    description: 'Refreshing chilled yogurt drink blended with sweet mango.',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80',
    popular: true
  },
  {
    id: 7,
    name: 'Gulab Jamun Sundae',
    category: 'Desserts',
    tag: 'Veg',
    price: 110,
    rating: 4.9,
    time: '8 min',
    description: 'Warm gulab jamun topped with vanilla ice cream and nuts.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    popular: true
  },
  {
    id: 8,
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    tag: 'Veg',
    price: 60,
    rating: 4.6,
    time: '3 min',
    description: 'Sparkling, tangy and perfect with spicy bites.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
    popular: false
  },
  {
    id: 9,
    name: 'Ragi Dosa Combo',
    category: 'Breakfast',
    tag: 'Veg',
    price: 150,
    rating: 4.7,
    time: '15 min',
    description: 'Iron-rich crisp dosa served with coconut chutney and sambar.',
    image: 'https://images.unsplash.com/photo-1663652240177-3a36f0dc90ea?auto=format&fit=crop&w=900&q=80',
    popular: false
  },
  {
    id: 10,
    name: 'Tandoori Platter',
    category: 'Main Course',
    tag: 'Non-Veg',
    price: 260,
    rating: 4.9,
    time: '25 min',
    description: 'A mixed grill of kebabs, smoky veggies, and house marinades.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    popular: true
  }
];

const categories = ['All', 'Main Course', 'Snacks', 'Beverages', 'Desserts', 'Breakfast'];
const cartKey = 'quickbites-cart';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const cartEntries = Object.values(cart);
  const totalItems = cartEntries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...item, quantity: 1 }
      };
    });
    setToast(`${item.name} added to cart`);
  };

  const updateQuantity = (itemId, change) => {
    setCart((prev) => {
      const item = prev[itemId];
      if (!item) return prev;

      const nextQty = item.quantity + change;
      if (nextQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemId]: { ...item, quantity: nextQty }
      };
    });
  };

  const checkout = () => {
    if (!cartEntries.length) {
      setToast('Please add at least one item before checkout.');
      return;
    }

    setToast(`Order placed! Total: ₹${total}`);
    setCart({});
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-800 antialiased">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-6 lg:px-8">
        <header className="sticky top-4 z-30 rounded-[24px] border border-slate-200 bg-white/80 px-5 py-4 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-300 text-lg font-black text-orange-700">
                Q
              </div>
              <div className="text-2xl font-black tracking-[-0.06em]">
                <span className="text-orange-500">Quick</span>Bites
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 md:block">
                📍 Vizianagaram, AP
              </div>
              <div className="flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-600">
                <span>Cart</span>
                <span className="ml-2 grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-1 text-[11px] text-white">
                  {totalItems}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-soft md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-600">
              Fresh • Fast • Homemade
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.07em] text-slate-900 md:text-6xl">
              Delicious meals from <span className="text-orange-500">home kitchens</span> to your door.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 md:text-lg">
              Discover chef-curated plates, quick bites, and comforting favorites prepared with care,
              delivered fresh and fast in your neighborhood.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                Order now
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:-translate-y-0.5">
                Explore menu
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-2xl font-black tracking-[-0.06em] text-slate-900">1200+</div>
                <div className="mt-1 text-xs text-slate-500">Happy orders</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-2xl font-black tracking-[-0.06em] text-slate-900">4.9/5</div>
                <div className="mt-1 text-xs text-slate-500">Customer rating</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-2xl font-black tracking-[-0.06em] text-slate-900">18 min</div>
                <div className="mt-1 text-xs text-slate-500">Avg. delivery</div>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-soft">
            <div className="rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">Today’s offer</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                  Save 20%
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-3 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Free delivery</span>
                  <strong className="text-slate-800">Above ₹399</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Combo deal</span>
                  <strong className="text-slate-800">₹299</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pickup time</span>
                  <strong className="text-slate-800">15-20 min</strong>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <main className="mt-8 grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-soft md:p-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, cravings, or ingredients"
                className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3.5 text-base text-slate-700 outline-none ring-0 placeholder:text-slate-400"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">⌕</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-bold transition',
                    selectedCategory === category
                      ? 'border-orange-200 bg-orange-50 text-orange-600'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
                  ].join(' ')}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredMenu.length ? (
                filteredMenu.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-[22px] border border-slate-200 bg-gradient-to-b from-white to-orange-50/40">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="h-52 w-full object-cover" />
                      <span
                        className={[
                          'absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]',
                          item.tag === 'Veg'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        ].join(' ')}
                      >
                        {item.tag}
                      </span>
                      {item.popular && (
                        <span className="absolute right-4 top-4 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-700">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        <span>{item.category}</span>
                        <span>⭐ {item.rating}</span>
                      </div>

                      <h3 className="mt-3 text-xl font-black tracking-[-0.05em] text-slate-900">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <div className="text-2xl font-black tracking-[-0.05em] text-slate-900">₹{item.price}</div>
                          <div className="text-xs text-slate-400">{item.time}</div>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="md:col-span-2 rounded-[22px] border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                  <div className="text-xl font-bold text-slate-700">No dishes match your search.</div>
                  <div className="mt-1 text-sm">Try another keyword or category.</div>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-[-0.05em] text-slate-900">Your Order</h2>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {totalItems} item{totalItems === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-3">
              {cartEntries.length ? (
                cartEntries.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{item.name}</div>
                        <div className="mt-1 text-xs text-slate-400">₹{item.price} each</div>
                      </div>
                      <div className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</div>
                    </div>

                    <div className="mt-3 inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 text-lg font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        −
                      </button>
                      <span className="min-w-[28px] text-center text-sm font-extrabold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 text-lg font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
                  <div className="text-base font-bold text-slate-700">Your cart is empty.</div>
                  <div className="mt-1 text-sm">Add a dish to start your order.</div>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <strong className="text-slate-800">₹{subtotal}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <strong className="text-slate-800">₹{deliveryFee}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service fee</span>
                  <strong className="text-slate-800">₹{serviceFee}</strong>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-base font-black text-slate-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={checkout}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5"
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
