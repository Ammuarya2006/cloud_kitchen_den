import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'quickbites-secret';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./server/data.db');

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        tag TEXT NOT NULL,
        price INTEGER NOT NULL,
        rating REAL NOT NULL,
        time TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        popular INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        items TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) return;
      if (row.count === 0) {
        const products = [
          {
            name: 'Premium Special Biryani',
            category: 'Main Course',
            tag: 'Veg',
            price: 180,
            rating: 4.9,
            time: '20 min',
            description: 'Aromatic basmati rice layered with fresh vegetables and rich kitchen spices.',
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
            popular: 1
          },
          {
            name: 'Home-style Chicken Curry',
            category: 'Main Course',
            tag: 'Non-Veg',
            price: 220,
            rating: 4.8,
            time: '22 min',
            description: 'Tender chicken simmered in a slow-cooked onion-tomato gravy.',
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
            popular: 1
          },
          {
            name: 'Paneer Butter Masala',
            category: 'Main Course',
            tag: 'Veg',
            price: 190,
            rating: 4.7,
            time: '18 min',
            description: 'Creamy tomato gravy with juicy paneer cubes and mild spices.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
            popular: 0
          },
          {
            name: 'Crispy Chicken Wrap',
            category: 'Snacks',
            tag: 'Non-Veg',
            price: 150,
            rating: 4.6,
            time: '12 min',
            description: 'Crispy chicken strips wrapped in soft flatbread with crunchy salad.',
            image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
            popular: 1
          },
          {
            name: 'Classic Veg Burger',
            category: 'Snacks',
            tag: 'Veg',
            price: 120,
            rating: 4.5,
            time: '10 min',
            description: 'A tasty grilled patty with melted cheese and house sauces.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
            popular: 0
          },
          {
            name: 'Mango Lassi',
            category: 'Beverages',
            tag: 'Veg',
            price: 80,
            rating: 4.8,
            time: '5 min',
            description: 'Refreshing chilled yogurt drink blended with sweet mango.',
            image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80',
            popular: 1
          },
          {
            name: 'Gulab Jamun Sundae',
            category: 'Desserts',
            tag: 'Veg',
            price: 110,
            rating: 4.9,
            time: '8 min',
            description: 'Warm gulab jamun topped with vanilla ice cream and nuts.',
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
            popular: 1
          },
          {
            name: 'Fresh Lime Soda',
            category: 'Beverages',
            tag: 'Veg',
            price: 60,
            rating: 4.6,
            time: '3 min',
            description: 'Sparkling, tangy and perfect with spicy bites.',
            image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
            popular: 0
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO products (name, category, tag, price, rating, time, description, image, popular)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        products.forEach((product) => {
          stmt.run(
            product.name,
            product.category,
            product.tag,
            product.price,
            product.rating,
            product.time,
            product.description,
            product.image,
            product.popular
          );
        });

        stmt.finalize();
      }
    });
  });
};

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Unauthorized' });

  const token = header.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'quickbites-api' });
});

app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id ASC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to load menu' });
    res.json(rows.map((row) => ({ ...row, popular: Boolean(row.popular) })));
  });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const hash = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hash, 'customer'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        return res.status(500).json({ message: 'Registration failed' });
      }

      const token = jwt.sign({ id: this.lastID, role: 'customer', email }, jwtSecret, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: this.lastID, name, email, role: 'customer' } });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
});

app.get('/api/admin/metrics', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }

  db.get('SELECT COUNT(*) AS users FROM users', (err1, userRow) => {
    db.get('SELECT COUNT(*) AS orders FROM orders', (err2, orderRow) => {
      db.get('SELECT SUM(total) AS revenue FROM orders', (err3, revenueRow) => {
        res.json({
          users: userRow?.users || 0,
          orders: orderRow?.orders || 0,
          revenue: revenueRow?.revenue || 0
        });
      });
    });
  });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Unable to load orders' });
      res.json(rows);
    }
  );
});

app.post('/api/orders', authMiddleware, (req, res) => {
  const { items, total } = req.body;

  if (!Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({ message: 'Invalid order payload' });
  }

  db.run(
    'INSERT INTO orders (user_id, total, status, items) VALUES (?, ?, ?, ?)',
    [req.user.id, total, 'pending', JSON.stringify(items)],
    function (err) {
      if (err) return res.status(500).json({ message: 'Order creation failed' });
      res.status(201).json({ id: this.lastID, status: 'pending', total, items });
    }
  );
});

initDb();

app.listen(port, () => {
  console.log(`QuickBites API running on http://localhost:${port}`);
});
