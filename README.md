# cloud_kitchen_den
food ordering platform
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBites | Local Food Delivery</title>
    <!-- Tailwind CSS Engine for Modern UI styling -->
    <script src="https://tailwindcss.com"></script>
    <style>
        .custom-shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 font-sans">

    <!-- Sticky Navigation Header Area -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center space-x-6">
                <span class="text-2xl font-black text-orange-500 tracking-tight">QuickBites</span>
                <div class="hidden md:flex items-center text-sm font-medium text-gray-500">
                    <span>Vizianagaram, AP</span>
                </div>
            </div>
            <div class="flex items-center space-x-6 font-medium text-gray-600">
                <button class="relative bg-orange-100 text-orange-600 px-4 py-2 rounded-full flex items-center space-x-2">
                    <span>Cart</span>
                    <span id="cart-count" class="bg-orange-500 text-white rounded-full text-xs px-2 py-0.5 font-bold">0</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Grid Dashboard layout -->
    <main class="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Menu Items Listing -->
        <div class="lg:col-span-2 space-y-6">
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Homemade Delicacies</h1>
            <p class="text-gray-500 -mt-4">Fresh, hygienic, home-cooked meals delivered commission-free.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Food Item Card 1 -->
                <div class="bg-white rounded-2xl p-4 custom-shadow border border-gray-100 flex flex-col justify-between">
                    <div>
                        <span class="inline-block text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">Veg</span>
                        <h3 class="text-lg font-bold text-gray-900">Premium Special Biryani</h3>
                        <p class="text-sm text-gray-500 mt-1">Aromatic basmati rice cooked with fresh kitchen spices, layered with soft paneer.</p>
                    </div>
                    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <span class="text-xl font-black text-gray-900">₹180</span>
                        <button onclick="addToCart('Premium Special Biryani', 180)" class="bg-white text-orange-500 border border-orange-200 font-bold px-6 py-2 rounded-xl text-sm uppercase tracking-wide hover:bg-orange-50 transition">Add</button>
                    </div>
                </div>

                <!-- Food Item Card 2 -->
                <div class="bg-white rounded-2xl p-4 custom-shadow border border-gray-100 flex flex-col justify-between">
                    <div>
                        <span class="inline-block text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">Non-Veg</span>
                        <h3 class="text-lg font-bold text-gray-900">Home-style Chicken Curry</h3>
                        <p class="text-sm text-gray-500 mt-1">Tender chicken pieces simmered in a rich, slow-cooked onion-tomato gravy.</p>
                    </div>
                    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <span class="text-xl font-black text-gray-900">₹220</span>
                        <button onclick="addToCart('Home-style Chicken Curry', 220)" class="bg-white text-orange-500 border border-orange-200 font-bold px-6 py-2 rounded-xl text-sm uppercase tracking-wide hover:bg-orange-50 transition">Add</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Interactive Real-time Cart Sidebar -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 custom-shadow h-fit sticky top-24">
            <h2 class="text-xl font-extrabold text-gray-900 mb-4">Your Order</h2>
            
            <div id="cart-items" class="divide-y divide-gray-100 max-h-60 overflow-y-auto mb-4">
                <p class="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
            </div>

            <div class="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                    <span>Item Total</span>
                    <span id="subtotal">₹0</span>
                </div>
                <div class="flex justify-between text-green-600 font-medium">
                    <span>Swiggy/Zomato Commissions</span>
                    <span>₹0 (Saved!)</span>
                </div>
                <div class="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span id="delivery-fee">₹0</span>
                </div>
                <div class="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-dashed border-gray-200">
                    <span>To Pay</span>
                    <span id="total-payable">₹0</span>
                </div>
            </div>

            <button onclick="placeMockOrder()" class="w-full mt-6 bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-orange-600 transition text-sm uppercase tracking-wide">
                Proceed to Checkout
            </button>
        </div>
    </main>

    <!-- Client-Side State Engine & Calculations -->
    <script>
        let cart = {};

        function addToCart(name, price) {
            if (cart[name]) { cart[name].qty++; } 
            else { cart[name] = { price: price, qty: 1 }; }
            updateCartUI();
        }

        function removeFromCart(name) {
            if (cart[name]) {
                cart[name].qty--;
                if (cart[name].qty <= 0) delete cart[name];
            }
            updateCartUI();
        }

        function updateCartUI() {
            const container = document.getElementById('cart-items');
            const countBadge = document.getElementById('cart-count');
            container.innerHTML = '';
            let subtotal = 0; let totalItems = 0;

            const itemsArray = Object.keys(cart);
            if (itemsArray.length === 0) {
                container.innerHTML = '<p class="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>';
                document.getElementById('subtotal').innerText = '₹0';
                document.getElementById('delivery-fee').innerText = '₹0';
                document.getElementById('total-payable').innerText = '₹0';
                countBadge.innerText = '0';
                return;
            }

            itemsArray.forEach(name => {
                const item = cart[name];
                subtotal += item.price * item.qty;
                totalItems += item.qty;

                const itemRow = document.createElement('div');
                itemRow.className = 'flex items-center justify-between py-3 text-sm';
                itemRow.innerHTML = `
                    <div class="flex-1 font-medium text-gray-800">${name}</div>
                    <div class="flex items-center space-x-2 mx-4">
                        <button onclick="removeFromCart('${name}')" class="w-6 h-6 border rounded bg-gray-50 flex items-center justify-center font-bold">-</button>
                        <span class="font-bold">${item.qty}</span>
                        <button onclick="addToCart('${name}', ${item.price})" class="w-6 h-6 border rounded bg-gray-50 flex items-center justify-center font-bold text-orange-500">+</button>
                    </div>
                    <div class="font-bold text-gray-900">₹${item.price * item.qty}</div>
                `;
                container.appendChild(itemRow);
            });

            let deliveryFee = subtotal > 0 ? 40 : 0;
            countBadge.innerText = totalItems;
            document.getElementById('subtotal').innerText = '₹' + subtotal;
            document.getElementById('delivery-fee').innerText = '₹' + deliveryFee;
            document.getElementById('total-payable').innerText = '₹' + (subtotal + deliveryFee);
        }

        function placeMockOrder() {
            if (Object.keys(cart).length === 0) { alert('Please add items to your cart first.'); return; }
            alert('🎉 Order Received! This mock order logs into the localized state successfully.');
        }
    </script>
</body>
</html>
