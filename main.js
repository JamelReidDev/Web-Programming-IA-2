/* ============================================
    Name: Jamel Reid
    Student ID: 2404251
    Course: Web Programming (S1AY25/26)
    Module: CIT2011
    Assignment: IA#2 - Dry Cleaning Service Web Application
    Filename: main.js
   IA#2 REQUIREMENT: DATA STRUCTURES (ICONS ADDED)
   Using arrays and objects to store data
   ============================================ */
    
    // Services data - Array of objects (Using Material Icons now)
    const services = [
        { id: 1, name: 'Shirts', price: 1000, icon: 'checkroom' }, 
        { id: 2, name: 'Pants/Trousers', price: 1500, icon: 'local_mall' }, 
        { id: 3, name: 'Dresses', price: 2000, icon: 'nightlife' }, 
        { id: 4, name: 'Suits', price: 2500, icon: 'business_center' }, 
        { id: 5, name: 'Coats/Jackets', price: 3000, icon: 'ac_unit' }, 
        { id: 6, name: 'Blankets', price: 3500, icon: 'king_bed' }, 
        { id: 7, name: 'Curtains', price: 4000, icon: 'dry_cleaning' }, 
        { id: 8, name: 'Comforters', price: 4500, icon: 'weekend' }  
    ];

    // Shopping cart - Array to store items (NO localStorage!)
    let cart = [];

    // Registered users - Array to store registrations
    let users = [
        { username: 'demo', password: 'demo123', name: 'Demo User' }
    ];

    /* ============================================
                    TAB SWITCHING
       ============================================ */

    function switchAuthMode(mode) {
        const loginContainer = document.getElementById('loginFormContainer');
        const registerContainer = document.getElementById('registerFormContainer');
        const loginTab = document.querySelector('.auth-tab-btn:first-child');
        const registerTab = document.querySelector('.auth-tab-btn:last-child');

        if (mode === 'login') {
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
        } else {
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
        }
    }
    
    function switchTab(tabName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active from all nav buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(tabName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        //  Add active to the corresponding button using a precise selector
        const navButton = document.querySelector(`.tab-btn[onclick*="'${tabName}'"]`);
        if (navButton) {
            navButton.classList.add('active');
        }

        // Update displays when switching to cart or checkout
        if (tabName === 'cart') {
            displayCart();
        } else if (tabName === 'checkout') {
            displayCheckoutSummary();
        } else if (tabName === 'auth') {
            switchAuthMode('login');
        }
    }

    /* ============================================
                LOGOUT FUNCTIONALITY 🚪
       ============================================ */
    function logoutUser() {
        const loginSuccess = document.getElementById('loginSuccess');
        if (loginSuccess) {
            loginSuccess.style.display = 'none';
        }

        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        if (loginUsername) loginUsername.value = '';
        if (loginPassword) loginPassword.value = '';
        
        switchTab('auth');
        
        alert('You have been logged out successfully.');
    }


    /* ============================================
       AUTO-SWITCH TO SERVICES ON LOGIN/REGISTRATION
       ============================================ */
    
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault(); 

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const usernameError = document.getElementById('loginUsernameError');
        const passwordError = document.getElementById('loginPasswordError');
        const loginSuccess = document.getElementById('loginSuccess');

        usernameError.textContent = '';
        passwordError.textContent = '';
        if (loginSuccess) loginSuccess.style.display = 'none';

        let isValid = true;

        if (username === '') {
            usernameError.textContent = '❌ Username is required';
            isValid = false;
        }

        if (password === '') {
            passwordError.textContent = '❌ Password is required';
            isValid = false;
        }

        if (!isValid) return;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Automatically proceeds to the services section (products)
            loginSuccess.style.display = 'none';
            alert(`Welcome back, ${user.name}! You are now logged in.`);
            switchTab('products');
        } else {
            passwordError.textContent = '❌ Invalid username or password';
        }        
    });

    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('regFullName').value.trim();
        const dob = document.getElementById('regDOB').value;
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        document.querySelectorAll('#registerFormContainer .error-message').forEach(el => el.textContent = '');

        let isValid = true;
        
        if (fullName === '') {
            document.getElementById('regFullNameError').textContent = '❌ Name is required'; isValid = false;
        } else if (fullName.length < 2) {
            document.getElementById('regFullNameError').textContent = '❌ Name must be at least 2 characters'; isValid = false;
        }

        if (dob === '') {
            document.getElementById('regDOBError').textContent = '❌ Date of birth is required'; isValid = false;
        } else {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                document.getElementById('regDOBError').textContent = '❌ You must be at least 18 years old'; isValid = false;
            }
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('regEmailError').textContent = '❌ Email is required'; isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('regEmailError').textContent = '❌ Invalid email format'; isValid = false;
        }

        if (username === '') {
            document.getElementById('regUsernameError').textContent = '❌ Username is required'; isValid = false;
        } else if (username.length < 4) {
            document.getElementById('regUsernameError').textContent = '❌ Username must be at least 4 characters'; isValid = false;
        }

        if (password === '') {
            document.getElementById('regPasswordError').textContent = '❌ Password is required'; isValid = false;
        } else if (password.length < 6) {
            document.getElementById('regPasswordError').textContent = '❌ Password must be at least 6 characters'; isValid = false;
        }

        if (confirmPassword === '') {
            document.getElementById('regConfirmPasswordError').textContent = '❌ Please confirm password'; isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('regConfirmPasswordError').textContent = '❌ Passwords do not match'; isValid = false;
        }

        if (!isValid) return;

        // Save user
        users.push({ username, password, name: fullName, email });

        // Automatically proceeds to the services section (products)
        document.getElementById('registerSuccess').style.display = 'none';
        alert('Account created successfully! You are now logged in.');

        // Reset form
        document.getElementById('registerForm').reset();

        // Automatically proceed to services
        switchTab('products');
    });

    /* ============================================
            AUTO-SWITCH TO CART ON ADD TO CART 
       ============================================ */
    
    function displayProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return; 

        grid.innerHTML = '';

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <span class="material-icons product-icon">${service.icon}</span>
                </div>
                <h3>${service.name}</h3>
                <div class="product-price">$${service.price.toFixed(2)}</div>
                <button class="btn-add" onclick="addToCart(${service.id})">
                    <span class="material-icons">add_shopping_cart</span>
                    Add to Cart
                </button>
            `;
            grid.appendChild(card);
        });
    }

    function addToCart(serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const existing = cart.find(item => item.id === serviceId);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: service.id,
                name: service.name,
                price: service.price,
                quantity: 1
            });
        }

        updateCartBadge();
        
        // Providing user feedback via alert
        alert(`${service.name} added to cart!`); 
    }

    /* ============================================
         CONFIRMATION BEFORE PROCEEDING TO CHECKOUT
       ============================================ */
    
    function proceedToCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Ask for confirmation before proceeding to checkout
        if (confirm('You are about to finalize your order. Are you sure you want to proceed to the checkout form?')) {
            switchTab('checkout');
        }
    }
    


    function calculateTotals() {
        let subtotal = 0;
        for (let i = 0; i < cart.length; i++) {
            subtotal += cart[i].price * cart[i].quantity;
        }

        let discount = 0;
        if (subtotal > 50) { 
            discount = subtotal * 0.10;
        }

        let taxableAmount = subtotal - discount;
        let tax = taxableAmount * 0.15;
        let total = taxableAmount + tax;

        let deliveryText = 'Calculated at checkout';
        if (total >= 30) { 
            deliveryText = 'FREE ✓';
        }

        return {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            deliveryText: deliveryText,
            hasDiscount: discount > 0
        };
    }

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    function displayCart() {
        const emptyMessage = document.getElementById('emptyCartMessage');
        const cartContent = document.getElementById('cartContent');
        const cartItems = document.getElementById('cartItems');

        if (!emptyMessage || !cartContent || !cartItems) return;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            cartContent.style.display = 'none';
            return;
        }

        emptyMessage.style.display = 'none';
        cartContent.style.display = 'block';
        cartItems.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">${item.price.toFixed(2)} each</p>
                </div>
                <div class="item-controls">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">
                            <span class="material-icons">remove</span>
                        </button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">
                            <span class="material-icons">add</span>
                        </button>
                    </div>
                    <div class="item-total">${itemTotal}</div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemDiv);
        });

        const totals = calculateTotals();
        document.getElementById('cartSubtotal').textContent = '$' + totals.subtotal;
        document.getElementById('cartDiscount').textContent = '-$' + totals.discount;
        document.getElementById('cartTax').textContent = '$' + totals.tax;
        document.getElementById('cartDelivery').textContent = totals.deliveryText;
        document.getElementById('cartTotal').textContent = '$' + totals.total;

        const discountRow = document.getElementById('discountRow');
        if (discountRow) {
            discountRow.style.display = totals.hasDiscount ? 'flex' : 'none';
        }
    }

    function changeQuantity(itemId, change) {
        const item = cart.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            displayCart();
            updateCartBadge();
        }
    }

    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        displayCart();
        updateCartBadge();
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            displayCart();
            updateCartBadge();
        }
    }
    
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const name = document.getElementById('checkoutName').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const address = document.getElementById('checkoutAddress').value.trim();
        const date = document.getElementById('checkoutDate').value;
        const time = document.getElementById('checkoutTime').value;
        const payment = document.querySelector('input[name="payment"]:checked').value;

        document.querySelectorAll('#checkout .error-message').forEach(el => el.textContent = '');

        let isValid = true;

        if (name === '') {
            document.getElementById('checkoutNameError').textContent = '❌ Name is required'; isValid = false;
        }
        if (phone === '') {
            document.getElementById('checkoutPhoneError').textContent = '❌ Phone is required'; isValid = false;
        } else if (phone.length < 10) {
            document.getElementById('checkoutPhoneError').textContent = '❌ Invalid phone number'; isValid = false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('checkoutEmailError').textContent = '❌ Email is required'; isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('checkoutEmailError').textContent = '❌ Invalid email'; isValid = false;
        }
        if (address === '') {
            document.getElementById('checkoutAddressError').textContent = '❌ Address is required'; isValid = false;
        } else if (address.length < 10) {
            document.getElementById('checkoutAddressError').textContent = '❌ Please enter complete address'; isValid = false;
        }
        if (date === '') {
            document.getElementById('checkoutDateError').textContent = '❌ Date is required'; isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                document.getElementById('checkoutDateError').textContent = '❌ Date cannot be in the past'; isValid = false;
            }
        }
        if (time === '') {
            document.getElementById('checkoutTimeError').textContent = '❌ Time is required'; isValid = false;
        }

        if (!isValid) return;

        const orderId = 'SC' + Math.floor(Math.random() * 900000 + 100000);
        const totals = calculateTotals();

        document.getElementById('checkoutSuccess').style.display = 'block';
        document.getElementById('checkoutSuccess').innerHTML = `
            <div style="text-align: center;">
                <span class="material-icons" style="font-size: 4rem; color: #28a745;">check_circle</span>
                <h3 style="color: #28a745;">Order Confirmed!</h3>
                <p>Your order has been successfully placed.</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total:</strong> $${totals.total}</p>
                <p>Confirmation email sent to: ${email}</p>
                <button class="btn" onclick="completePurchase()" style="margin-top: 1rem;">Continue Shopping</button>
            </div>
        `;

        document.getElementById('checkoutSuccess').scrollIntoView({ behavior: 'smooth' });
    });

    function completePurchase() {
        cart = [];
        updateCartBadge();
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.reset();
        }
        document.getElementById('checkoutSuccess').style.display = 'none';
        switchTab('products');
    }

    function displayCheckoutSummary() {
        const summaryItems = document.getElementById('checkoutSummaryItems');
        if (!summaryItems) return;
        
        summaryItems.innerHTML = '';

        if (cart.length === 0) {
            summaryItems.innerHTML = '<p style="text-align: center; color: #999;">No items in cart</p>';
            return;
        }

        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <span>${item.quantity}x ${item.name}</span>
                <span>$${itemTotal}</span>
            `;
            summaryItems.appendChild(div);
        });

        const totals = calculateTotals();
        document.getElementById('checkoutSubtotal').textContent = '$' + totals.subtotal;
        document.getElementById('checkoutDiscount').textContent = '-$' + totals.discount;
        document.getElementById('checkoutTax').textContent = '$' + totals.tax;
        document.getElementById('checkoutDelivery').textContent = totals.deliveryText;
        document.getElementById('checkoutTotal').textContent = '$' + totals.total;

        const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
        if (checkoutDiscountRow) {
            checkoutDiscountRow.style.display = totals.hasDiscount ? 'flex' : 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        displayProducts();
        updateCartBadge();
        
        const checkoutDateInput = document.getElementById('checkoutDate');
        if (checkoutDateInput) {
            const today = new Date().toISOString().split('T')[0];
            checkoutDateInput.setAttribute('min', today);
        }
        
    const initialTab = document.querySelector('.nav-tabs .tab-btn.active');
    if (!initialTab) {
        switchTab('auth');
    }
});