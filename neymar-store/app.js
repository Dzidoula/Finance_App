'use strict';

// ==============================
// PRODUCT DATA
// ==============================
const PRODUCTS = [
  {
    id: 1,
    name: 'Maillot Brésil Domicile 2024',
    team: 'Seleção',
    price: 89.99,
    mainColor: '#FEDD00',
    accentColor: '#009C3B',
    badge: 'Nouveau',
    badgeType: '',
    description: 'Maillot officiel de la Seleção Brasileira',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'Maillot Brésil Extérieur 2024',
    team: 'Seleção',
    price: 89.99,
    mainColor: '#009C3B',
    accentColor: '#FEDD00',
    badge: null,
    badgeType: '',
    description: 'Version extérieur de la Seleção',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Maillot PSG Domicile 2023',
    team: 'PSG',
    price: 94.99,
    mainColor: '#003087',
    accentColor: '#DA291C',
    badge: 'Populaire',
    badgeType: '',
    description: 'Édition spéciale Paris Saint-Germain',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 4,
    name: 'Maillot PSG Extérieur 2023',
    team: 'PSG',
    price: 94.99,
    mainColor: '#FFFFFF',
    accentColor: '#003087',
    badge: null,
    badgeType: '',
    description: 'Version extérieur du PSG',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 5,
    name: 'Maillot Al-Hilal Domicile 2024',
    team: 'Al-Hilal',
    price: 99.99,
    mainColor: '#0E4DA4',
    accentColor: '#FFFFFF',
    badge: 'Nouveau',
    badgeType: '',
    description: 'Maillot officiel Al-Hilal SFC',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'Maillot Al-Hilal Extérieur 2024',
    team: 'Al-Hilal',
    price: 99.99,
    mainColor: '#FFFFFF',
    accentColor: '#0E4DA4',
    badge: null,
    badgeType: '',
    description: 'Version extérieur Al-Hilal SFC',
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
  {
    id: 7,
    name: 'Édition Collector Or #10',
    team: 'Édition Limitée',
    price: 149.99,
    mainColor: '#FFD700',
    accentColor: '#1a1a00',
    badge: 'Limité',
    badgeType: 'limited',
    description: 'Édition collector dorée numérotée, coffret premium',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 8,
    name: 'Maillot Rétro Brésil 2002',
    team: 'Seleção',
    price: 79.99,
    mainColor: '#FEDD00',
    accentColor: '#003087',
    badge: 'Vintage',
    badgeType: '',
    description: 'Réplique du Mondial 2002 — Édition vintage',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
];

// ==============================
// STATE
// ==============================
let cart = [];
let pendingProduct = null;
let selectedSize = null;

// ==============================
// UTILITIES
// ==============================
function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) + percent * 2.55) | 0));
  const g = Math.min(255, Math.max(0, (((num >> 8) & 0x00FF) + percent * 2.55) | 0));
  const b = Math.min(255, Math.max(0, ((num & 0x0000FF) + percent * 2.55) | 0));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isLightColor(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

// ==============================
// JERSEY SVG GENERATOR
// ==============================
function jerseysvg(main, accent, size) {
  const s = size || 140;
  const h = Math.round(s * 1.17);
  const gradId = 'jg' + main.replace('#', '');
  const numColor = isLightColor(main) ? accent : (isLightColor(accent) ? accent : '#FFFFFF');
  return `
    <svg width="${s}" height="${h}" viewBox="0 0 200 234" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${main};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${shadeColor(main, -20)};stop-opacity:1"/>
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="228" rx="60" ry="6" fill="rgba(0,0,0,0.25)"/>
      <path d="M 62 22 L 18 70 L 44 82 L 44 218 L 156 218 L 156 82 L 182 70 L 138 22 L 122 34 C 113 46 87 46 78 34 Z"
            fill="url(#${gradId})" stroke="${shadeColor(main, -30)}" stroke-width="1.5"/>
      <path d="M 78 34 C 83 50 117 50 122 34 L 112 28 C 107 38 93 38 88 28 Z"
            fill="${shadeColor(main, -25)}"/>
      <line x1="18" y1="70" x2="44" y2="82" stroke="${accent}" stroke-width="2" opacity="0.6"/>
      <line x1="182" y1="70" x2="156" y2="82" stroke="${accent}" stroke-width="2" opacity="0.6"/>
      <rect x="44" y="104" width="112" height="6" fill="${accent}" opacity="0.25" rx="2"/>
      <text x="100" y="175" text-anchor="middle"
            font-family="'Arial Black', Impact, sans-serif"
            font-weight="900" font-size="62" fill="${numColor}" opacity="0.95"
            letter-spacing="-2">10</text>
      <text x="100" y="200" text-anchor="middle"
            font-family="'Arial Black', sans-serif"
            font-weight="700" font-size="13" fill="${numColor}" opacity="0.8"
            letter-spacing="3">NEYMAR</text>
    </svg>`;
}

// ==============================
// RENDER PRODUCTS
// ==============================
function renderProducts(filter) {
  const activeFilter = filter || 'all';
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const list = activeFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(function(p) { return p.team === activeFilter; });

  list.forEach(function(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.team = p.team;

    const badgeHtml = p.badge
      ? '<span class="product-badge ' + (p.badgeType || '') + '">' + p.badge + '</span>'
      : '';

    card.innerHTML =
      '<div class="product-img">' +
        jerseysvg(p.mainColor, p.accentColor) +
        badgeHtml +
      '</div>' +
      '<div class="product-info">' +
        '<p class="product-team">' + p.team + '</p>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-desc">' + p.description + '</p>' +
        '<div class="product-footer">' +
          '<span class="product-price">' + formatPrice(p.price) + '</span>' +
          '<button class="add-btn" onclick="openSizeModal(' + p.id + ')">Choisir la taille</button>' +
        '</div>' +
      '</div>';

    grid.appendChild(card);
  });
}

// ==============================
// FILTER BUTTONS
// ==============================
document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderProducts(btn.dataset.team);
  });
});

// ==============================
// SIZE MODAL
// ==============================
function openSizeModal(productId) {
  pendingProduct = PRODUCTS.find(function(p) { return p.id === productId; });
  selectedSize = null;

  document.getElementById('modalProductName').textContent = pendingProduct.name;

  var addBtn = document.getElementById('addToCartBtn');
  addBtn.disabled = true;
  addBtn.style.opacity = '0.5';

  var grid = document.getElementById('sizeGrid');
  grid.innerHTML = '';

  pendingProduct.sizes.forEach(function(size) {
    var btn = document.createElement('button');
    btn.className = 'size-option';
    btn.textContent = size;
    btn.onclick = function() { selectSize(size, btn); };
    grid.appendChild(btn);
  });

  document.getElementById('modalOverlay').classList.add('active');
}

function selectSize(size, btn) {
  document.querySelectorAll('.size-option').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  selectedSize = size;

  var addBtn = document.getElementById('addToCartBtn');
  addBtn.disabled = false;
  addBtn.style.opacity = '1';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  pendingProduct = null;
  selectedSize = null;
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

function confirmAddToCart() {
  if (!pendingProduct || !selectedSize) return;
  addToCart(pendingProduct, selectedSize);
  closeModal();
}

// ==============================
// CART LOGIC
// ==============================
function addToCart(product, size) {
  var key = product.id + '-' + size;
  var existing = cart.find(function(item) { return item.key === key; });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ key: key, product: product, size: size, qty: 1 });
  }

  updateCartUI();
  showToast('"' + product.name + '" ajouté au panier !');

  var badge = document.getElementById('cartCount');
  badge.classList.add('bump');
  setTimeout(function() { badge.classList.remove('bump'); }, 300);
}

function removeFromCart(key) {
  cart = cart.filter(function(item) { return item.key !== key; });
  updateCartUI();
}

function changeQty(key, delta) {
  var item = cart.find(function(i) { return i.key === key; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartUI();
}

function updateCartUI() {
  var total = cart.reduce(function(sum, i) { return sum + i.product.price * i.qty; }, 0);
  var count = cart.reduce(function(sum, i) { return sum + i.qty; }, 0);

  document.getElementById('cartCount').textContent = count;

  var body = document.getElementById('cartItems');
  var foot = document.getElementById('cartFoot');

  if (cart.length === 0) {
    body.innerHTML =
      '<div class="cart-empty">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5">' +
          '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
          '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' +
        '</svg>' +
        '<p>Votre panier est vide</p>' +
      '</div>';
    foot.style.display = 'none';
  } else {
    body.innerHTML = cart.map(function(item) {
      return '<div class="cart-item">' +
        '<div class="cart-item-img">' + jerseysvg(item.product.mainColor, item.product.accentColor, 44) + '</div>' +
        '<div class="cart-item-details">' +
          '<p class="cart-item-name">' + item.product.name + '</p>' +
          '<p class="cart-item-meta">Taille : ' + item.size + '</p>' +
          '<div class="cart-item-actions">' +
            '<button class="qty-btn" onclick="changeQty(\'' + item.key + '\',-1)">−</button>' +
            '<span class="qty-count">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(\'' + item.key + '\',1)">+</button>' +
            '<button class="remove-btn" onclick="removeFromCart(\'' + item.key + '\')" title="Supprimer">✕</button>' +
          '</div>' +
        '</div>' +
        '<span class="cart-item-price">' + formatPrice(item.product.price * item.qty) + '</span>' +
      '</div>';
    }).join('');

    foot.style.display = 'block';
    document.getElementById('cartSubtotal').textContent = formatPrice(total);
    document.getElementById('cartTotal').textContent = formatPrice(total);
  }
}

// ==============================
// CART SIDEBAR TOGGLE
// ==============================
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

// ==============================
// CHECKOUT
// ==============================
function checkout() {
  if (cart.length === 0) return;
  alert('Merci pour votre commande !\n\nCette démo ne traite pas de paiements réels.\nDans la version complète, vous seriez redirigé vers notre processeur de paiement sécurisé.');
  cart = [];
  updateCartUI();
  toggleCart();
}

// ==============================
// CONTACT FORM
// ==============================
function handleContact(e) {
  e.preventDefault();
  showToast('Message envoyé ! Nous vous répondrons sous 2h.');
  e.target.reset();
}

// ==============================
// TOAST
// ==============================
function showToast(msg) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 3200);
}

// ==============================
// HEADER SCROLL EFFECT
// ==============================
window.addEventListener('scroll', function() {
  var header = document.getElementById('header');
  header.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.4)' : 'none';
});

// ==============================
// INIT
// ==============================
renderProducts();
