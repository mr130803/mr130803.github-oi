// DATA MENU - LENGKAP DENGAN GAMBAR SESUAI NAMA
const menuData = [
    // COFFEE
    {id: 1, name: "Americano", price: 10000, img: "americano.png", category: "coffee"},
    {id: 2, name: "Latte", price: 20000, img: "latte.png", category: "coffee"},
    {id: 3, name: "Kopi Susu Aren", price: 18000, img: "kopisusuarren.png", category: "coffee"},
    {id: 4, name: "Espresso", price: 15000, img: "espresso.png", category: "coffee"},
    {id: 5, name: "Cappuccino", price: 22000, img: "cappuccino.png", category: "coffee"},
    {id: 6, name: "Mocha", price: 25000, img: "mocha.png", category: "coffee"},

    // NON-COFFEE
    {id: 7, name: "Teh Tarik", price: 12000, img: "tehtarik.png", category: "non-coffee"},
    {id: 8, name: "Matcha Latte", price: 23000, img: "matchalatte.png", category: "non-coffee"},
    {id: 9, name: "Green Tea", price: 18000, img: "greentea.png", category: "non-coffee"},
    {id: 10, name: "Jasmine Tea", price: 17000, img: "jasminetea.png", category: "non-coffee"},
    {id: 11, name: "Lemon Tea", price: 19000, img: "lemontea.png", category: "non-coffee"},
    {id: 12, name: "Thai Tea", price: 25000, img: "thaitea.png", category: "non-coffee"},
    {id: 13, name: "Milk Tea", price: 22000, img: "milktea.png", category: "non-coffee"},
    {id: 14, name: "Winter Melon", price: 21000, img: "wintermelon.png", category: "non-coffee"},
    {id: 15, name: "Rose Tea", price: 23000, img: "rosetea.png", category: "non-coffee"},

    // FOOD
    {id: 16, name: "Sapi Lada Hitam", price: 35000, img: "sapi_ladahitam.png", category: "food"},
    {id: 17, name: "Ayam Bakar", price: 25000, img: "ayambakar.png", category: "food"},
    {id: 18, name: "Ayam Goreng", price: 25000, img: "ayamgoreng.png", category: "food"},
    {id: 19, name: "Nasi Goreng Ayam", price: 28000, img: "nasigorengayam.png", category: "food"},
    {id: 20, name: "Nasi Goreng Sapi", price: 28000, img: "nasigorengsapi.png", category: "food"},
    {id: 21, name: "Mie Indomie Goreng", price: 18000, img: "mieindomiegoreng.png", category: "food"},
    {id: 22, name: "Mie Indomie Kuah", price: 18000, img: "mieindomiekuah.png", category: "food"},
    {id: 23, name: "Sate Ayam", price: 26000, img: "sateayam.png", category: "food"},
    {id: 24, name: "Ikan Bakar", price: 36000, img: "ikanbakar.png", category: "food"},
    {id: 25, name: "Nasi Putih", price: 6000, img: "nasi_putih.png", category: "food"}
];

let cart = [];
let total = 0;
let count = 0;

// DOM Elements
const menuList = document.getElementById("menuList");
const searchInput = document.getElementById("searchInput");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");
const orderFooter = document.getElementById("orderFooter");

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    resetCartIfEmpty();
    loadCartFromStorage();
    loadMenu();
    setupEventListeners();
    loadUserInfo();
    checkAuth();
    updateOrderFooter(); // Initialize footer (hidden)
});

// ===== FOOTER DYNAMIC FUNCTIONS =====
function updateOrderFooter() {
    if (!orderFooter) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update display
    if (countEl) countEl.textContent = totalItems;
    if (totalEl) totalEl.textContent = `Rp ${formatRupiah(totalPrice)}`;
    
    // Show/Hide footer
    if (totalItems > 0) {
        orderFooter.classList.add('show');
    } else {
        orderFooter.classList.remove('show');
    }
}

// ===== CART FUNCTIONS =====
function resetCartIfEmpty() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.length === 0) {
            localStorage.removeItem('cart');
        }
    }
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        updateOrderFooter();
    }
}

function addItem(id, price, name) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({id, name, price, quantity: 1});
    }
    
    updateCart();
    updateOrderFooter(); // Update footer
}

function updateCart() {
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    count = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ===== MENU FUNCTIONS =====
function loadMenu(category = 'all') {
    menuList.innerHTML = '';
    let filteredMenu = menuData;
    
    if (category !== 'all') {
        filteredMenu = menuData.filter(item => item.category === category);
    }
    
    filteredMenu.forEach(item => {
        const imageUrl = item.img || item.image || '';
        menuList.innerHTML += `
            <div class="card">
                <img src="${imageUrl}" alt="${item.name}">
                <div class="card-body">
                    <h4>${item.name}</h4>
                    <div class="price">Rp ${formatRupiah(item.price)}</div>
                    <div class="add" onclick="addItem(${item.id}, ${item.price}, '${item.name}')">+</div>
                </div>
            </div>
        `;
    });
}

function renderMenu(items) {
    menuList.innerHTML = '';
    items.forEach(item => {
        const imageUrl = item.img || item.image || '';
        menuList.innerHTML += `
            <div class="card">
                <img src="${imageUrl}" alt="${item.name}">
                <div class="card-body">
                    <h4>${item.name}</h4>
                    <div class="price">Rp ${formatRupiah(item.price)}</div>
                    <div class="add" onclick="addItem(${item.id}, ${item.price}, '${item.name}')">+</div>
                </div>
            </div>
        `;
    });
}

// ===== UTILITY FUNCTIONS =====
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.querySelectorAll('.cat').forEach(cat => {
        cat.addEventListener('click', function() {
            document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadMenu(this.dataset.category);
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filtered = menuData.filter(item => 
                item.name.toLowerCase().includes(query)
            );
            renderMenu(filtered);
        });
    }
}

// ===== NAVIGATION =====
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

function logout() {
    console.log("Logout button clicked!"); // Debug
    
    // Tutup sidebar
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.remove("active");
    }
    
    // Tutup order footer
    const orderFooter = document.getElementById("orderFooter");
    if (orderFooter) {
        orderFooter.classList.remove("show");
    }
    
    // Clear data
    localStorage.removeItem('cart');
    sessionStorage.clear();
    
    console.log("Data cleared, confirming logout...");
    
    // Konfirmasi dengan delay biar animasi kelar
    setTimeout(() => {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            console.log("Logout confirmed, redirecting...");
            window.location.href = 'index.html';
        }
    }, 200);
}
function confirmOrder() {
    if (count === 0) {
        alert('Belum ada pesanan!');
        return;
    }
    
    // Validasi cart
    const validCart = cart.filter(item => item.quantity > 0);
    if (validCart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }
    
    // Simpan ke localStorage
    localStorage.setItem('cart', JSON.stringify(validCart));
    
 
    // Redirect
    window.location.href = 'konfirmasi.html';
}

function goToProfile() {
    alert('Fitur Profil - Coming Soon!');
    toggleSidebar();
}

function goToOrders() {
    alert('Riwayat Pesanan - Coming Soon!');
    toggleSidebar();
}

function goToSupport() {
    alert('Customer Service - Coming Soon!\n📞 0812-3456-7890');
    toggleSidebar();
}

function checkAuth() {
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = 'index.html';
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
// Footer Functions
function subscribeNewsletter() {
    const email = document.getElementById("emailInput").value;
    
    if (email.trim() === "") {
        alert("Masukkan email untuk mendapatkan promo terbaru!");
        return;
    }
    
    // Simulasi subscribe
    alert("✅ Terima kasih sudah berlangganan!\nPromo spesial akan dikirim ke " + email);
    document.getElementById("emailInput").value = "";
}

function openSocial(platform) {
    const links = {
        'instagram': 'https://instagram.com/cafeinaja',
        'facebook': 'https://facebook.com/cafeinaja',
        'tiktok': 'https://tiktok.com/@cafeinaja',
        'whatsapp': 'https://wa.me/6281234567890'
    };
    
    if (links[platform]) {
        window.open(links[platform], '_blank');
    }
}
