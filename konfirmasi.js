// KONFIRMASI.JS - FIX DATA LOADING
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DEBUG - Cek data
console.log("=== DEBUG KONFIRMASI ===");
console.log("Raw localStorage:", localStorage.getItem("cart"));
console.log("Parsed cart:", cart);
console.log("Cart length:", cart.length);

const orderList = document.getElementById("orderList");
const totalHarga = document.getElementById("totalHarga");

function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderCart() {
    console.log("Rendering cart:", cart); // Debug
    
    orderList.innerHTML = '';
    let total = 0;
    
    // VALIDASI CART KOSONG
    if (!cart || cart.length === 0) {
        orderList.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#666;">
                <div style="font-size:64px; margin-bottom:20px;">🛒</div>
                <h3 style="color:#333; margin-bottom:10px;">Keranjang Kosong</h3>
                <p>Tambahkan pesanan dari Dashboard</p>
            </div>
        `;
        totalHarga.innerHTML = "TOTAL : Rp 0";
        return;
    }
    
    cart.forEach((item, index) => {
        // VALIDASI SETIAP ITEM
        if (!item || !item.name || !item.price || !item.quantity) {
            console.warn("Invalid item skipped:", item);
            return;
        }
        
        const hargaPerItem = item.price * item.quantity;
        total += hargaPerItem;
        
        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        itemDiv.innerHTML = `
            <div class="item-left">
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-price">Rp ${formatRupiah(item.price)} x ${item.quantity}</div>
            </div>
            <div class="item-right">
                <div class="quantity-controls">
                    <button class="qty-minus" onclick="updateQuantity(${index}, -1)">−</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-plus" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-total">Rp ${formatRupiah(hargaPerItem)}</div>
            </div>
        `;
        orderList.appendChild(itemDiv);
    });
    
    totalHarga.innerHTML = `TOTAL : Rp ${formatRupiah(total)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function updateQuantity(index, change) {
    if (cart[index]) {
        const newQuantity = cart[index].quantity + change;
        if (newQuantity <= 0) {
            if (confirm(`Hapus "${cart[index].name}"?`)) {
                cart.splice(index, 1);
            }
        } else {
            cart[index].quantity = newQuantity;
        }
        renderCart();
    }
}

function tambahPesanan() {
    window.location.href = "../html/dashboard.html";
}

function bayar() {
    console.log('Bayar clicked!');
    if (cart.length === 0) return alert('Kosong!');
    
    // SIMPAN ULANG
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'payment.html';
}

// INIT
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, rendering...");
    renderCart();
});