// Sistem User Management
let currentUser = null;
let allUsers = [];

// Data users terdaftar (simulasi database)
const registeredUsers = [
    {
        id: 1,
        name: "Rizky Pratama",
        email: "rizky@example.com",
        phone: "0812-3456-7890",
        address: "Jl. Merdeka No. 45, Pangkalpinang",
        avatar: "https://ui-avatars.com/api/?name=Rizky+Pratama&size=120&background=FF6B35&color=fff",
        role: "user",
        points: 245,
        joinDate: "2024-08-15",
        ordersCount: 12
    },
    {
        id: 2,
        name: "Sari Indah",
        email: "sari@example.com",
        phone: "0857-1234-5678",
        address: "Jl. Sudirman No. 78, Pangkalpinang",
        avatar: "https://ui-avatars.com/api/?name=Sari+Indah&size=120&background=4CAF50&color=fff",
        role: "user",
        points: 156,
        joinDate: "2024-09-01",
        ordersCount: 8
    },
    {
        id: 3,
        name: "Admin Cafe",
        email: "admin@cafeinaja.com",
        phone: "0831-4186-9561",
        address: "Cafe In Aja, Pangkalpinang",
        avatar: "https://ui-avatars.com/api/?name=Admin+Cafe&size=120&background=2196F3&color=fff",
        role: "admin",
        points: 0,
        joinDate: "2024-01-01",
        ordersCount: 0
    }
];

// Cek login saat halaman load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    showPage('dashboard');
});

// Fungsi check login
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateProfileDisplay();
        console.log('User logged in:', currentUser.name);
    } else {
        // Auto login user pertama (demo)
        loginUser(registeredUsers[0]);
    }
}

// Fungsi login
function loginUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateProfileDisplay();
}

// Update tampilan profil di header/sidebar
function updateProfileDisplay() {
    if (currentUser) {
        // Update header profile (jika ada)
        const profileNameElement = document.querySelector('.profile-name');
        if (profileNameElement) {
            profileNameElement.textContent = currentUser.name;
        }
    }
}

// Load profil lengkap
function loadProfile() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu!');
        return;
    }

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    document.getElementById('profileAddress').textContent = currentUser.address;
    document.getElementById('profileAvatar').src = currentUser.avatar;
    document.getElementById('profileJoinDate').textContent = new Date(currentUser.joinDate).toLocaleDateString('id-ID');
    document.getElementById('profilePoints').textContent = currentUser.points;
    document.getElementById('profileOrdersCount').textContent = currentUser.ordersCount;
}

// Fungsi edit profil
function editProfile() {
    if (!currentUser) return;
    
    const newName = prompt('Nama lengkap:', currentUser.name);
    const newPhone = prompt('No. HP:', currentUser.phone);
    const newAddress = prompt('Alamat:', currentUser.address);
    
    if (newName && newPhone && newAddress) {
        currentUser.name = newName;
        currentUser.phone = newPhone;
        currentUser.address = newAddress;
        currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&size=120&background=FF6B35&color=fff`;
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadProfile(); // Refresh tampilan
        alert('✅ Profil berhasil diupdate!');
    }
}

// Fungsi logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    alert('👋 Terima kasih sudah mengunjungi Cafe In Aja!');
    // Redirect ke login atau reload
    window.location.reload();
}

// Integrasi dengan fungsi navigasi sebelumnya
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar li').forEach(li => {
        li.classList.remove('active');
    });
    
    document.getElementById(pageName + 'Page').classList.add('active');
    event.target.classList.add('active');
    
    if (pageName !== 'dashboard') {
        document.getElementById('orderFooterContainer').style.display = 'none';
    } else {
        document.getElementById('orderFooterContainer').style.display = 'block';
    }
    
    if (pageName === 'profile') {
        loadProfile();
    } else if (pageName === 'orders') {
        loadOrders('all');
    }
}