document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
});

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const details = document.getElementById('orderDetails');
    const itemCount = document.getElementById('itemCount');
    const totalAmount = document.getElementById('totalAmount');
    const qrisAmount = document.getElementById('qrisAmount');
    
    if (cart.length === 0) {
        details.innerHTML = '<p style="text-align:center;color:#666;">Tidak ada pesanan</p>';
        return;
    }
    
    let html = '';
    let total = 0;
    let items = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        items += item.quantity;
        html += `<div>${item.name} x${item.quantity} - Rp ${formatRupiah(subtotal)}</div>`;
            
    totalHarga.innerHTML = `TOTAL : Rp ${formatRupiah(total)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
    });
        
  
    
    details.innerHTML = html;
    itemCount.textContent = `${items} item`;
    totalAmount.textContent = `Rp ${formatRupiah(total)}`;
    if (qrisAmount) qrisAmount.textContent = formatRupiah(total);
}

function formatRupiah(angka) {
    return angka.toLocaleString('id-ID');
}

function selectMethod(method) {
    document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Hide all panels
    document.getElementById('bankPanel').style.display = 'none';
    document.getElementById('qrisPanel').style.display = 'none';
    document.getElementById('cashConfirm').style.display = 'none';
    
    if (method === 'cash') {
        document.getElementById('cashConfirm').style.display = 'block';
    } else if (method === 'debit') {
        document.getElementById('bankPanel').style.display = 'block';
    } else if (method === 'qris') {
        document.getElementById('qrisPanel').style.display = 'block';
    }
}

// DEBIT CONFIRM
function confirmDebit(bank) {
    alert(`💳 Transfer ke ${bank.toUpperCase()} berhasil diterima!`);
    completePayment('debit');
}

// QRIS CONFIRM
function confirmQris() {
    alert('📱 Pembayaran QRIS berhasil masuk!');
    completePayment('qris');
}

// COMPLETE PAYMENT
function completePayment(method) {
    localStorage.removeItem('cart');
    if (method == 'qris'){
    window.location.href = 'sukses.html';}
    else if (method == 'debit'){window.location.href = 'sukses.html';}
    else if (method == 'cash'){window.location.href = 'proses.html';}
}