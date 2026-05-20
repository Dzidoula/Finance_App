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
// STRIPE PAYMENT LINKS CONFIG
// Une fois votre compte Stripe créé (stripe.com), créez un Payment Link
// par produit dans le dashboard et remplacez chaque URL ci-dessous.
// ==============================
const STRIPE_LINKS = {
  1: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_1',
  2: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_2',
  3: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_3',
  4: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_4',
  5: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_5',
  6: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_6',
  7: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_7',
  8: 'https://buy.stripe.com/REMPLACEZ_PRODUIT_8',
};

function stripeConfigured(productId) {
  var link = STRIPE_LINKS[productId];
  return link && link.indexOf('REMPLACEZ') === -1;
}

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

  // Adapter le bouton selon la configuration Stripe
  if (stripeConfigured(pendingProduct.id)) {
    addBtn.className = 'btn-stripe full-width';
    addBtn.innerHTML = stripeLogo() + ' Payer maintenant';
  } else {
    addBtn.className = 'btn-primary full-width';
    addBtn.innerHTML = 'Ajouter au panier';
  }

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

function stripeLogo() {
  return '<svg width="38" height="16" viewBox="0 0 62 26" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline;vertical-align:middle;margin-right:6px"><path fill="#fff" d="M5.4 10.2c0-.7.6-1 1.5-1 1.4 0 3.1.4 4.5 1.1V6.4A12 12 0 0 0 6.9 6C3 6 .4 8 .4 10.5c0 3.9 5.4 3.3 5.4 5 0 .8-.7 1-1.7 1-1.5 0-3.4-.6-4.9-1.4v3.9c1.7.7 3.4 1 4.9 1C7.3 20 10 18.1 10 15.4c0-4.2-4.6-3.4-4.6-5.2zm11.5-7.8L12.5 3l-.1 13.3c0 2.4 1.8 4.2 4.2 4.2 1.3 0 2.3-.3 2.8-.5v-3.3c-.5.2-3 .9-3-1.4V9.3h3V6H16.4l.1-3.6zM26.5 7.3l-.3-1.3h-3.5V20H27V11c.8-1.1 2.2-.9 2.6-.7V6c-.5-.2-2.2-.5-3.1 1.3zM31 6h4.4v14H31zm2.2-1.6c1.4 0 2.5-1.1 2.5-2.4C35.7 .7 34.6 0 33.2 0s-2.4 1.1-2.4 2.4c0 1.3 1 1.9 2.4 2zm15-1L43.5 14 40 3.4h-4.7l5.5 16.6H45l5.5-16.6H48zM62 13c0-4-2-7-5.8-7-3.8 0-6.1 3-6.1 7 0 4.6 2.6 7 6.4 7 1.9 0 3.3-.4 4.3-1v-3.2c-1 .5-2.2.8-3.7.8-1.5 0-2.8-.5-3-2.2H62V13zm-7.9-1.5c0-1.6.9-2.3 2-2.3 1.1 0 2 .7 2 2.3h-4z"/></svg>';
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

  if (stripeConfigured(pendingProduct.id)) {
    // Redirection vers Stripe Payment Link avec la taille en paramètre
    var link = STRIPE_LINKS[pendingProduct.id];
    // Stripe Payment Links acceptent prefilled_custom_field si activé dans le dashboard
    var url = link + '?prefilled_custom_field_1=' + encodeURIComponent('Taille: ' + selectedSize) + '&locale=fr';
    window.open(url, '_blank', 'noopener');
    showToast('Redirection vers le paiement sécurisé Stripe...');
    closeModal();
  } else {
    // Stripe non configuré : ajout au panier classique
    addToCart(pendingProduct, selectedSize);
    closeModal();
  }
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

  var configured = cart.filter(function(item) { return stripeConfigured(item.product.id); });
  var notConfigured = cart.filter(function(item) { return !stripeConfigured(item.product.id); });

  if (configured.length > 0) {
    // Ouvrir le Payment Link Stripe pour chaque article configuré
    configured.forEach(function(item) {
      var link = STRIPE_LINKS[item.product.id];
      var url = link + '?prefilled_custom_field_1=' + encodeURIComponent('Taille: ' + item.size) + '&locale=fr';
      window.open(url, '_blank', 'noopener');
    });
    showToast('Paiement Stripe ouvert pour ' + configured.length + ' article(s).');
  }

  if (notConfigured.length > 0) {
    showToast('Certains articles n\'ont pas encore de lien Stripe configuré.');
  }
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
