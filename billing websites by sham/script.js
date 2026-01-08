// Data Storage Keys
const STORAGE_KEYS = {
    MENU: 'restaurant_menu',
    CART: 'restaurant_cart',
    TRANSACTIONS: 'restaurant_transactions'
};

// Tax rate constant
const TAX_RATE = 0.05; // 5%

// Initialize default menu items with open source images from Unsplash
const DEFAULT_MENU = [
    { id: 1, name: "Idly", price: 20, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80" },
    { id: 2, name: "Dosa", price: 30, image: "https://images.unsplash.com/photo-1614899269993-e8f60dfd132a?w=400&h=300&fit=crop&q=80" },
    { id: 3, name: "Puttu", price: 25, image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&q=80" },
    { id: 4, name: "Vada", price: 15, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80" },
    { id: 5, name: "Poori", price: 25, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80" },
    { id: 6, name: "Coffee", price: 15, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80" },
    { id: 7, name: "Tea", price: 10, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80" }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    displayMenu();
    updateCart();
    displayManageMenu();
    displaySalesReport();
});

// Initialize menu from localStorage or use defaults
function initMenu() {
    const menu = loadMenuFromStorage();
    if (!menu || menu.length === 0) {
        saveMenuToStorage(DEFAULT_MENU);
    }
}

// Load menu from localStorage
function loadMenuFromStorage() {
    const menuJson = localStorage.getItem(STORAGE_KEYS.MENU);
    return menuJson ? JSON.parse(menuJson) : [];
}

// Save menu to localStorage
function saveMenuToStorage(menu) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
}

// Display menu items
function displayMenu() {
    const menu = loadMenuFromStorage();
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    menu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.onclick = () => addToCart(item.id);
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'150\'%3E%3Crect width=\'200\' height=\'150\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3E${item.name}%3C/text%3E%3C/svg%3E'">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Add item to cart
function addToCart(itemId) {
    const menu = loadMenuFromStorage();
    const item = menu.find(i => i.id === itemId);
    
    if (!item) return;

    let cart = loadCart();
    const existingItem = cart.find(c => c.itemId === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCart();
}

// Load cart from localStorage
function loadCart() {
    const cartJson = localStorage.getItem(STORAGE_KEYS.CART);
    return cartJson ? JSON.parse(cartJson) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

// Update cart display
function updateCart() {
    const cart = loadCart();
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    const taxRow = document.getElementById('tax-row');
    const payNowBtn = document.getElementById('pay-now-btn');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Cart is empty</p>';
        cartSubtotal.textContent = '₹0';
        cartTax.textContent = '₹0';
        cartTotal.textContent = '₹0';
        if (taxRow) taxRow.style.display = 'none';
        payNowBtn.disabled = true;
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.itemId}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.itemId}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.itemId})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();
    
    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartTax.textContent = `₹${tax.toFixed(2)}`;
    cartTotal.textContent = `₹${total.toFixed(2)}`;
    
    if (taxRow) {
        taxRow.style.display = isTaxEnabled() ? 'flex' : 'none';
    }
    
    payNowBtn.disabled = false;
}

// Update item quantity in cart
function updateQuantity(itemId, change) {
    let cart = loadCart();
    const item = cart.find(c => c.itemId === itemId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(c => c.itemId !== itemId);
        }
        saveCart(cart);
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = loadCart();
    cart = cart.filter(c => c.itemId !== itemId);
    saveCart(cart);
    updateCart();
}

// Calculate subtotal
function calculateSubtotal() {
    const cart = loadCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Check if tax is enabled
function isTaxEnabled() {
    const taxToggle = document.getElementById('tax-toggle');
    return taxToggle ? taxToggle.checked : true;
}

// Calculate tax
function calculateTax() {
    if (!isTaxEnabled()) return 0;
    return calculateSubtotal() * TAX_RATE;
}

// Calculate total
function calculateTotal() {
    return calculateSubtotal() + calculateTax();
}

// Toggle tax
function toggleTax() {
    updateCart();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        saveCart([]);
        updateCart();
    }
}

// Show QR Code modal
function showQRCode() {
    const modal = document.getElementById('qr-modal');
    const paymentAmount = document.getElementById('payment-amount');
    const total = calculateTotal();
    
    paymentAmount.textContent = `₹${total}`;
    modal.classList.add('active');
}

// Close QR Code modal
function closeQRCode() {
    const modal = document.getElementById('qr-modal');
    modal.classList.remove('active');
}

// Complete payment
function completePayment() {
    const cart = loadCart();
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const transaction = {
        id: 'txn_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        items: [...cart],
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        taxEnabled: isTaxEnabled(),
        total: calculateTotal()
    };

    saveTransaction(transaction);
    printBill();
    clearCart();
    closeQRCode();
    alert('Payment completed! Bill printed.');
}

// Save transaction
function saveTransaction(transaction) {
    let transactions = loadTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Load transactions
function loadTransactions() {
    const transactionsJson = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
}

// Print bill
function printBill() {
    const cart = loadCart();
    const billItemsBody = document.getElementById('bill-items-body');
    const billSubtotalAmount = document.getElementById('bill-subtotal-amount');
    const billTaxAmount = document.getElementById('bill-tax-amount');
    const billTaxRow = document.getElementById('bill-tax-row');
    const billTotalAmount = document.getElementById('bill-total-amount');
    const billDate = document.getElementById('bill-date');
    const printBillDiv = document.getElementById('print-bill');

    billItemsBody.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        `;
        billItemsBody.appendChild(row);
    });

    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();
    
    billSubtotalAmount.textContent = `₹${subtotal.toFixed(2)}`;
    billTaxAmount.textContent = `₹${tax.toFixed(2)}`;
    billTotalAmount.textContent = `₹${total.toFixed(2)}`;
    
    if (billTaxRow) {
        billTaxRow.style.display = isTaxEnabled() ? 'block' : 'none';
    }
    
    billDate.textContent = new Date().toLocaleString();

    printBillDiv.style.display = 'block';
    window.print();
    printBillDiv.style.display = 'none';
}

// View navigation
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    document.getElementById(viewName + '-view').classList.add('active');

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activate the correct tab based on view name
    const tabMap = {
        'menu': 'Menu & Billing',
        'manage': 'Manage Menu',
        'sales': 'Sales Report'
    };
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        if (tab.textContent.trim() === tabMap[viewName]) {
            tab.classList.add('active');
        }
    });

    // Refresh data if needed
    if (viewName === 'manage') {
        displayManageMenu();
    } else if (viewName === 'sales') {
        displaySalesReport();
    }
}

// Display manage menu
function displayManageMenu() {
    const menu = loadMenuFromStorage();
    const manageMenuGrid = document.getElementById('manage-menu-grid');
    manageMenuGrid.innerHTML = '';

    menu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'manage-menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'150\'%3E%3Crect width=\'200\' height=\'150\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3E${item.name}%3C/text%3E%3C/svg%3E'">
            <h4>${item.name}</h4>
            <span class="price">₹${item.price}</span>
            <div class="manage-item-actions">
                <button class="btn btn-edit" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMenuItem(${item.id})">Delete</button>
            </div>
        `;
        manageMenuGrid.appendChild(menuItem);
    });
}

// Add menu item
function addMenuItem(event) {
    event.preventDefault();
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const image = document.getElementById('item-image').value;

    const menu = loadMenuFromStorage();
    const newId = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;

    menu.push({
        id: newId,
        name: name,
        price: price,
        image: image
    });

    saveMenuToStorage(menu);
    displayMenu();
    displayManageMenu();
    
    // Reset form
    document.getElementById('add-item-form').reset();
    alert('Item added successfully!');
}

// Edit menu item
function editMenuItem(itemId) {
    const menu = loadMenuFromStorage();
    const item = menu.find(i => i.id === itemId);
    
    if (!item) return;

    const newName = prompt('Enter new name:', item.name);
    if (newName === null) return;

    const newPrice = prompt('Enter new price:', item.price);
    if (newPrice === null) return;

    const newImage = prompt('Enter new image path:', item.image);
    if (newImage === null) return;

    item.name = newName;
    item.price = parseFloat(newPrice);
    item.image = newImage;

    saveMenuToStorage(menu);
    displayMenu();
    displayManageMenu();
    alert('Item updated successfully!');
}

// Delete menu item
function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const menu = loadMenuFromStorage();
    const filteredMenu = menu.filter(i => i.id !== itemId);
    
    saveMenuToStorage(filteredMenu);
    displayMenu();
    displayManageMenu();
    alert('Item deleted successfully!');
}

// Display sales report
function displaySalesReport() {
    const transactions = loadTransactions();
    const monthSelect = document.getElementById('month-select');
    const salesReport = document.getElementById('sales-report');

    // Set current month as default
    if (!monthSelect.value) {
        const now = new Date();
        monthSelect.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    const selectedMonth = monthSelect.value;
    const monthlyTransactions = getMonthlySales(selectedMonth);

    if (monthlyTransactions.length === 0) {
        salesReport.innerHTML = '<p style="text-align: center; color: #999;">No sales data for selected month.</p>';
        return;
    }

    const totalSales = monthlyTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalTax = monthlyTransactions.reduce((sum, t) => sum + (t.tax || 0), 0);
    const totalSubtotal = monthlyTransactions.reduce((sum, t) => sum + (t.subtotal || t.total || 0), 0);
    const totalTransactions = monthlyTransactions.length;
    const itemWiseSales = calculateItemWiseSales(monthlyTransactions);

    let html = `
        <div class="sales-summary">
            <div class="summary-card">
                <h3>Total Sales</h3>
                <p>₹${totalSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Subtotal</h3>
                <p>₹${totalSubtotal.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Total Tax</h3>
                <p>₹${totalTax.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Total Transactions</h3>
                <p>${totalTransactions}</p>
            </div>
            <div class="summary-card">
                <h3>Average Order</h3>
                <p>₹${(totalSales / totalTransactions).toFixed(2)}</p>
            </div>
        </div>
        <h3>Item-wise Sales</h3>
        <table class="sales-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(itemWiseSales).forEach(([itemName, data]) => {
        html += `
            <tr>
                <td>${itemName}</td>
                <td>${data.quantity}</td>
                <td>₹${data.revenue.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <h3 style="margin-top: 2rem;">Transaction Details</h3>
        <table class="sales-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    monthlyTransactions.forEach(transaction => {
        const itemsList = transaction.items.map(i => `${i.name} (${i.quantity})`).join(', ');
        html += `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${itemsList}</td>
                <td>₹${transaction.total.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    salesReport.innerHTML = html;
}

// Get monthly sales
function getMonthlySales(monthYear) {
    const transactions = loadTransactions();
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        return transactionMonth === monthYear;
    });
}

// Calculate item-wise sales
function calculateItemWiseSales(transactions) {
    const itemSales = {};

    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            if (!itemSales[item.name]) {
                itemSales[item.name] = {
                    quantity: 0,
                    revenue: 0
                };
            }
            itemSales[item.name].quantity += item.quantity;
            itemSales[item.name].revenue += item.price * item.quantity;
        });
    });

    return itemSales;
}

// Print sales report
function printSalesReport() {
    const salesReport = document.getElementById('sales-report');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Sales Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background-color: #667eea; color: white; }
                    .summary-card { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Monthly Sales Report</h1>
                ${salesReport.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
