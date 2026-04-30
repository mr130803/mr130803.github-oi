// ========================================
// GLOBAL STATE & DATA - MENU LENGKAP
// ========================================
let registeredUsers = JSON.parse(localStorage.getItem('cafeUsers')) || [
    { username: 'admin', password: 'admin123', fullName: 'Admin Cafe' },
    { username: 'cafeuser', password: 'kopi123', fullName: 'Cafe User' },
    { username: 'barista', password: 'espresso', fullName: 'Barista Pro' }
];

// MENU LENGKAP - COFFEE & NON-COFFEE (Rp15k - Rp30k)
const menuItems = [
    // 🔥 COFFEE MENU (15 items)
    { id: 1, name: 'Espresso', price: 18000, image: 'espresso.png', category: 'coffee' },
    { id: 2, name: 'Americano', price: 20000, image: 'americano.png', category: 'coffee' },
    { id: 3, name: 'Cappuccino', price: 24000, image: 'cappuccino.png', category: 'coffee' },
    { id: 4, name: 'Latte', price: 25000, image: 'latte.png', category: 'coffee' },
    { id: 5, name: 'Mocha', price: 26000, image: 'mocha.png', category: 'coffee' },
    { id: 6, name: 'Macchiato', price: 22000, image: 'macchiato.png', category: 'coffee' },
    { id: 7, name: 'Flat White', price: 24000, image: 'flatwhite.png', category: 'coffee' },
    { id: 8, name: 'Long Black', price: 21000, image: 'longblack.png', category: 'coffee' },
    { id: 9, name: 'Affogato', price: 28000, image: 'affogato.png', category: 'coffee' },
    { id: 10, name: 'Irish Coffee', price: 29000, image: 'irishcoffee.png', category: 'coffee' },
    { id: 11, name: 'Vietnamese Coffee', price: 27000, image: 'vietcoffee.png', category: 'coffee' },
    { id: 12, name: 'Cold Brew', price: 26000, image: 'coldbrew.png', category: 'coffee' },
    { id: 13, name: 'Nitro Coffee', price: 30000, image: 'nitro.png', category: 'coffee' },
    { id: 14, name: 'Turkish Coffee', price: 19000, image: 'turkish.png', category: 'coffee' },
    { id: 15, name: 'Kopi Susu', price: 17000, image: 'kopisusu.png', category: 'coffee' },

    // 🍵 NON-COFFEE MENU (15 items)
    { id: 16, name: 'Matcha Latte', price: 27000, image: 'matcha.png', category: 'non-coffee' },
    { id: 17, name: 'Green Tea', price: 18000, image: 'greentea.png', category: 'non-coffee' },
    { id: 18, name: 'Jasmine Tea', price: 17000, image: 'jasminetea.png', category: 'non-coffee' },
    { id: 19, name: 'Lemon Tea', price: 19000, image: 'lemontea.png', category: 'non-coffee' },
    { id: 20, name: 'Thai Tea', price: 25000, image: 'thaitea.png', category: 'non-coffee' },
    { id: 21, name: 'Milk Tea', price: 22000, image: 'milktea.png', category: 'non-coffee' },
    { id: 22, name: 'Winter Melon', price: 21000, image: 'wintermelon.png', category: 'non-coffee' },
    { id: 23, name: 'Rose Tea', price: 23000, image: 'rosetea.png', category: 'non-coffee' },
    { id: 24, name: 'Chamomile', price: 20000, image: 'chamomile.png', category: 'non-coffee' },
    { id: 25, name: 'Peppermint Tea', price: 19000, image: 'peppermint.png', category: 'non-coffee' },
    { id: 26, name: 'Hot Chocolate', price: 24000, image: 'hotchocolate.png', category: 'non-coffee' },
    { id: 27, name: 'Chocolate Milk', price: 20000, image: 'chocomilk.png', category: 'non-coffee' },
    { id: 28, name: 'Strawberry Milk', price: 23000, image: 'strawmilk.png', category: 'non-coffee' },
    { id: 29, name: 'Taro Milk', price: 26000, image: 'taromilk.png', category: 'non-coffee' },
    { id: 30, name: 'Fresh Lemonade', price: 22000, image: 'lemonade.png', category: 'non-coffee' }
];


window.users = registeredUsers;
window.menuItems = menuItems;


// ========================================
// INIT SYSTEM
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.split('/').pop();
    
    // Auto-detect page dan init
    switch(true) {
        case path.includes('register.html'):
            initRegisterPage();
            break;
        case path.includes('dashboard.html'):
            initDashboardPage();
            break;
        default: // login.html atau index.html
            initLoginPage();
            break;
    }
});

function initLoginPage() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', login);
    
    if (sessionStorage.getItem('loggedInUser')) {
        showNotification("Anda sudah login sebelumnya!", "info");
    }
    
    const usernameInput = document.getElementById("username");
    if (usernameInput) usernameInput.focus();
    
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
}

function initRegisterPage() {
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) registerBtn.addEventListener('click', registerUser);
    
    ['fullName', 'username', 'password', 'confirmPassword'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') registerUser();
            });
        }
    });
    
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.addEventListener('blur', checkUsername);
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.addEventListener('input', checkPasswordStrength);
}

function initDashboardPage() {
    checkAuth();
    loadUserInfo();
    renderMenu();
    updateCartSummary();
    
}
function filterMenu(category, el) {
    currentFilter = category;

    // update tombol aktif
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (el) el.classList.add('active');

    const items = document.querySelectorAll('.menu-card');

    items.forEach(item => {
        const itemCategory = item.dataset.category;

        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========================================
// LOGIN & REGISTER
// ========================================
function login() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value;
    const loginBtn = document.getElementById("loginBtn");
    
    if (!username || !password) return showNotification("Username dan Password harus diisi!", "error");
    if (username.length < 3) return showNotification("Username minimal 3 karakter!", "error");
    if (password.length < 4) return showNotification("Password minimal 4 karakter!", "error");
    
    if (loginBtn) {
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = '';
        loginBtn.disabled = true;
    }
    
    setTimeout(() => {
        const user = registeredUsers.find(u => u.username === username && u.password === password);
        
        if (loginBtn) {
            loginBtn.classList.remove('loading');
            loginBtn.innerHTML = 'MASUK';
            loginBtn.disabled = false;
        }
        
        if (user) {
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());
            sessionStorage.setItem('userFullName', user.fullName);
            showNotification(`Login berhasil! Selamat datang ${user.fullName || username}! ☕✨`, "success");
            setTimeout(() => window.location.href = 'dashboard.html?user=' + username, 2000);
        } else {
            showNotification("Username atau Password salah!", "error");
            if (document.getElementById("password")) document.getElementById("password").value = '';
            if (document.getElementById("username")) document.getElementById("username").focus();
        }
    }, 1500);
}

function registerUser() {
    const fullName = document.getElementById("fullName")?.value.trim();
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const registerBtn = document.getElementById("registerBtn");
    
    hideAllNotifications();
    
    if (!fullName || !username || !password || !confirmPassword) return showNotification("Semua field harus diisi!", "error");
    if (fullName.length < 2) return showNotification("Nama minimal 2 karakter!", "error");
    if (username.length < 3) return showNotification("Username minimal 3 karakter!", "error");
    if (password.length < 6) return showNotification("Password minimal 6 karakter!", "error");
    if (password !== confirmPassword) {
        showNotification("Konfirmasi password tidak cocok!", "error");
        if (document.getElementById("confirmPassword")) {
            document.getElementById("confirmPassword").value = '';
            document.getElementById("confirmPassword").focus();
        }
        return;
    }
    
    if (registeredUsers.find(user => user.username === username)) {
        showNotification("Username sudah terdaftar!", "error");
        if (document.getElementById("username")) {
            document.getElementById("username").value = '';
            document.getElementById("username").focus();
        }
        return;
    }
    
    if (registerBtn) {
        registerBtn.classList.add('loading');
        registerBtn.innerHTML = '';
        registerBtn.disabled = true;
    }
    
    setTimeout(() => {
        const newUser = { username, password, fullName, registeredAt: new Date().toISOString() };
        registeredUsers.push(newUser);
        localStorage.setItem('cafeUsers', JSON.stringify(registeredUsers));
        window.users = registeredUsers;
        
        if (registerBtn) {
            registerBtn.classList.remove('loading');
            registerBtn.innerHTML = '✅ TERDAFTAR';
            registerBtn.style.background = '#4CAF50';
        }
        
        showNotification(`Pendaftaran berhasil! Selamat datang ${fullName}! ☕✨`, "success");
        setTimeout(() => window.location.href = '../html/index.html', 3000);
    }, 2000);
}

// ========================================
// DASHBOARD FUNCTIONS
// ========================================
function checkAuth() {
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = '../html/index.html';
    }
}

function loadUserInfo() {
    const user = sessionStorage.getItem('loggedInUser');
    const userName = sessionStorage.getItem('userFullName') || user;
    
    const userNameEl = document.getElementById('userName');
    const welcomeEl = document.getElementById('welcomeUser');
    if (userNameEl) userNameEl.textContent = userName;
    if (welcomeEl) welcomeEl.textContent = userName;
}

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    let html = '';
    menuItems.forEach(item => {
        html += `
            <div class="menu-card" onclick="openOrderPopup(${item.id})">
                <div class="menu-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200/5a3b1e/ffffff?text=${item.name[0]}'">
                </div>
                <div class="menu-info">
                    <h4>${item.name}</h4>
                    <p class="price">Rp ${formatPrice(item.price)}</p>
                </div>
            </div>
        `;
    });
    menuGrid.innerHTML = html;
}

function openOrderPopup(id) {
    currentOrder = menuItems.find(item => item.id === id);
    currentQuantity = 1;
    
    document.getElementById('popupTitle').textContent = `Tambah ${currentOrder.name}`;
    document.getElementById('popupName').textContent = currentOrder.name;
    document.getElementById('popupPrice').textContent = `Rp ${formatPrice(currentOrder.price)}`;
    document.getElementById('popupImage').src = currentOrder.image;
    document.getElementById('quantity').textContent = currentQuantity;
    updateTotalPrice();
    
    document.getElementById('orderPopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('orderPopup').style.display = 'none';
    currentOrder = null;
}

function changeQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('quantity').textContent = currentQuantity;
    updateTotalPrice();
}

function updateTotalPrice() {
    const total = currentOrder.price * currentQuantity;
    document.getElementById('totalPrice').textContent = `Total: Rp ${formatPrice(total)}`;
}

function confirmOrder() {
    if (!currentOrder) return;

    const cartItem = {
        id: currentOrder.id,
        name: currentOrder.name,
        price: currentOrder.price,
        quantity: currentQuantity,
        image: currentOrder.image,
        subtotal: currentOrder.price * currentQuantity
    };

    const index = cart.findIndex(item => item.id === cartItem.id);

    if (index > -1) {
        cart[index].quantity += cartItem.quantity;
        cart[index].subtotal += cartItem.subtotal;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cafeCart', JSON.stringify(cart));

    updateCartSummary();

    showNotification(`${currentOrder.name} ditambahkan ke keranjang!`, "success");

    closePopup();
}

function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(totalPrice);
    
    const confirmBtn = document.querySelector('.confirm-order-btn');
    if (confirmBtn && totalItems > 0) {
        confirmBtn.style.display = 'inline-block';
    }
}

function showOrderSummary() {
    if (cart.length === 0) return showNotification("Keranjang kosong!", "error");
    
    let summary = "📋 RINGKASAN PESANAN:\n\n";
    cart.forEach(item => {
        summary += `• ${item.name} x${item.quantity}\n  Rp ${formatPrice(item.subtotal)}\n`;
    });
    summary += `\n💰 TOTAL: Rp ${formatPrice(cart.reduce((sum, item) => sum + item.subtotal, 0))}`;
    
    if (confirm(summary)) {
        showNotification("Pesanan berhasil dikonfirmasi! Terima kasih ☕✨", "success");
        cart = [];
        localStorage.removeItem('cafeCart');
        updateCartSummary();
    }
}

function showProfile() {
    const user = sessionStorage.getItem('loggedInUser');
    const userName = sessionStorage.getItem('userFullName') || user;
    showNotification(`👤 ${userName}\n⏰ Login: ${new Date(sessionStorage.getItem('loginTime')).toLocaleString()}`, "info");
}

function logout() {
    if (confirm('Yakin logout?')) {
        sessionStorage.clear();
        window.location.href = '../html/index.html';
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function checkUsername() {
    const username = document.getElementById("username")?.value.trim();
    if (username && registeredUsers.find(user => user.username === username)) {
        showNotification("Username sudah terdaftar!", "error");
    }
}

function checkPasswordStrength() {
    const password = document.getElementById("password")?.value;
    if (password && password.length >= 8) {
        if (document.getElementById("password")) {
            document.getElementById("password").style.borderColor = "#4CAF50";
        }
    }
}

function showNotification(message, type = "info") {
    const isRegisterPage = window.location.pathname.includes('../html/register.html');
    let notification = document.getElementById("successMsg");
    let errorNotification = document.getElementById("errorMsg");
    
    if (type === "success") {
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 4000);
        }
    } else if (type === "error") {
        if (isRegisterPage && errorNotification) {
            errorNotification.textContent = message;
            errorNotification.classList.add('show');
            setTimeout(() => errorNotification.classList.remove('show'), 4000);
        } else if (notification) {
            notification.style.background = "#f44336";
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                notification.style.background = "#4CAF50";
            }, 4000);
        }
    } else {
        if (notification) {
            notification.style.background = "#2196F3";
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                notification.style.background = "#4CAF50";
            }, 4000);
        }
    }
}

function hideAllNotifications() {
    document.querySelectorAll('.success, .error').forEach(n => n.classList.remove('show'));
}

// ========================================
// GLOBAL EXPORTS (untuk onclick HTML)
// ========================================
window.login = login;
window.registerUser = registerUser;
window.showRegister = () => window.location.href = '../html/register.html';
window.showForgotPassword = () => showNotification("Hubungi admin 📞", "info");
window.showProfile = showProfile;
window.logout = logout;
window.closePopup = closePopup;
window.changeQuantity = changeQuantity;
window.confirmOrder = confirmOrder;
window.showOrderSummary = showOrderSummary;
window.openOrderPopup = openOrderPopup;
// Global variables
let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
let currentModalItem = null;
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateCartDisplay();
    filterMenu('all');
});

// Load user data
function loadUserData() {
    const userName = localStorage.getItem('userName') || 'Guest';
    document.getElementById('userName').textContent = userName;
    document.getElementById('welcomeUser').textContent = userName;
}

// Filter menu
function filterMenu(category) {
    currentFilter = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}



// Show order summary
function showOrderSummary() {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    let summary = '📋 RINGKASAN PESANAN\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        summary += `• ${item.name}\n  ${item.qty}x Rp ${formatRupiah(item.price).replace('Rp', '')} = ${formatRupiah(subtotal)}\n\n`;
    });
    
    summary += `TOTAL: ${formatRupiah(total)}\n\nApakah Anda ingin melanjutkan ke pembayaran?`;
    
    if (confirm(summary)) {
        // Clear cart after confirmation
        cart = [];
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Pesanan berhasil dikonfirmasi! Terima kasih 🙏');
    }
}



// Show profile
function showProfile() {
    const userName = document.getElementById('userName').textContent;
    alert(`Profil:\nNama: ${userName}\nTotal Pesanan: ${cart.reduce((sum, item) => sum + item.qty, 0)} item`);
}

// Close modal on overlay click
document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Prevent modal close when clicking inside modal
document.querySelector('.modal').addEventListener('click', function(e) {
    e.stopPropagation();
});
// Data pengguna
const users = {
    'admin123': {
        password: 'admin123',
        role: 'admin',
        redirect: '../html/admin.html' // PATH LENGKAP
    },
    'bardapur123': {
        password: 'bardapur123', 
        role: 'bardapur',
        redirect: '../html/bardapur.html' // PATH LENGKAP
    }
};

// DOM Elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const successMsg = document.getElementById('successMsg');

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleLogin();
});
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleLogin();
});

// Handle Login
function handleLogin() {
    console.log('Login attempt...'); // DEBUG
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log(`Username: ${username}, Password: ${password}`); // DEBUG
    
    if (!username || !password) {
        showError('Username dan password harus diisi!');
        return;
    }
    
    if (users[username] && users[username].password === password) {
        console.log('Credentials valid!'); // DEBUG
        
        const userData = users[username];
        console.log('Redirect to:', userData.redirect); // DEBUG
        
        // Simpan session
        sessionStorage.setItem('loggedInUser', username);
        sessionStorage.setItem('userRole', userData.role);
        sessionStorage.setItem('userFullName', username.toUpperCase());
        
        // Animasi success
        document.querySelector('.container').style.opacity = '0';
        document.querySelector('.container').style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            successMsg.style.display = 'block';
            successMsg.innerHTML = `Login berhasil sebagai <strong>${username.toUpperCase()}</strong>!`;
            
            // TEST REDIRECT - 3 VARIASI
            setTimeout(() => {
                console.log('Attempting redirect...');
                
                // Coba 3 cara redirect
                try {
                    // Cara 1: window.location.href
                    window.location.href = userData.redirect;
                } catch (e) {
                    console.error('Redirect 1 failed:', e);
                    try {
                        // Cara 2: window.location.assign
                        window.location.assign(userData.redirect);
                    } catch (e2) {
                        console.error('Redirect 2 failed:', e2);
                        // Cara 3: window.location.replace
                        window.location.replace(userData.redirect);
                    }
                }
            }, 1500);
            
        }, 300);
        
    } else {
        console.log('Invalid credentials');
        showError('Username atau password salah!');
    }
}

// Show Error
function showError(message) {
    const existingError = document.querySelector('.error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        margin: 15px 0;
        font-weight: 600;
        animation: shake 0.5s ease-in-out;
        box-shadow: 0 4px 15px rgba(220,53,69,0.4);
    `;
    
    document.querySelector('.form-box').insertBefore(errorDiv, loginBtn);
    setTimeout(() => errorDiv.remove(), 4000);
}

function showRegister() {
    alert('Fitur registrasi akan segera hadir!\n\nGunakan:\n👨‍💼 admin123 / admin123\n👨‍🍳 bardapur123 / bardapur123');
}

// Auto focus & check login
document.addEventListener('DOMContentLoaded', function() {
    usernameInput.focus();
    
    // Cek sudah login
    if (sessionStorage.getItem('loggedInUser')) {
        console.log('Already logged in, redirecting...');
        const role = sessionStorage.getItem('userRole');
        const redirect = role === 'admin' ? './admin.html' : './bardapur.html';
        window.location.href = redirect;
    }
});

// Shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);