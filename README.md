<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QuickBites | Local Food Delivery</title>
    <meta
      name="description"
      content="QuickBites is a polished local food ordering app for home-cooked meals and fast delivery."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">Q</div>
          <div class="brand-name"><span>Quick</span>Bites</div>
        </div>

        <div class="topbar-right">
          <div class="location-pill">📍 Vizianagaram, AP</div>
          <div class="cart-pill">
            <span>Cart</span>
            <span id="cart-count">0</span>
          </div>
        </div>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <div class="hero-kicker">Fresh • Fast • Homemade</div>
          <h1>Delicious meals from <span>home kitchens</span> to your door.</h1>
          <p>
            Discover chef-curated plates, quick bites, and comforting favorites prepared with care,
            delivered fresh and fast in your neighborhood.
          </p>

          <div class="hero-actions">
            <button class="primary-btn">Order now</button>
            <button class="secondary-btn">Explore menu</button>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <strong>1200+</strong>
              <span>Happy orders</span>
            </div>
            <div class="stat">
              <strong>4.9/5</strong>
              <span>Customer rating</span>
            </div>
            <div class="stat">
              <strong>18 min</strong>
              <span>Avg. delivery</span>
            </div>
          </div>
        </div>

        <aside class="hero-summary">
          <div class="summary-card">
            <div class="summary-header">
              <strong>Today’s offer</strong>
              <span class="badge">Save 20%</span>
            </div>

            <div class="summary-row">
              <span>Free delivery</span>
              <strong>Above ₹399</strong>
            </div>
            <div class="summary-row">
              <span>Combo deal</span>
              <strong>₹299</strong>
            </div>
            <div class="summary-row">
              <span>Pickup time</span>
              <strong>15-20 min</strong>
            </div>
          </div>
        </aside>
      </section>

      <main class="content">
        <section class="menu-panel">
          <div class="search-wrap">
            <input id="search-input" type="text" placeholder="Search dishes, cravings, or ingredients" />
          </div>

          <div id="category-bar" class="category-bar"></div>
          <div id="menu-grid" class="menu-grid"></div>
        </section>

        <aside class="cart-panel">
          <div class="cart-header">
            <h2>Your Order</h2>
            <span id="total-items">0 items</span>
          </div>

          <div id="cart-items" class="cart-items"></div>

          <div class="order-summary">
            <div class="summary-list">
              <div class="summary-row-inline">
                <span>Subtotal</span>
                <strong id="subtotal">₹0</strong>
              </div>
              <div class="summary-row-inline">
                <span>Delivery fee</span>
                <strong id="delivery-fee">₹0</strong>
              </div>
              <div class="summary-row-inline">
                <span>Service fee</span>
                <strong id="service-fee">₹0</strong>
              </div>
            </div>

            <div class="total-row">
              <span>Total</span>
              <span id="total-payable">₹0</span>
            </div>

            <button id="checkout-button" class="checkout-btn">Proceed to Checkout</button>
          </div>
        </aside>
      </main>
    </div>

    <div id="toast" class="toast" aria-live="polite"></div>

    <script type="module" src="./app.js"></script>
  </body>
</html>
