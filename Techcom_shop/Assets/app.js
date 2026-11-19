// app.js - works with index.html (keep both files in the same folder)

const coupons = { SAVE10: 0.10, SAVE20: 0.20 };
const VAT_RATE = 0.10;
const RIEL_RATE = 4100;

let cart = [];
let discountRate = 0;

const money = n => "$" + n.toFixed(2);

// ---------- FOOTER YEAR ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- SEARCH (hide/show the cards written in HTML) ----------
document.getElementById("searchInput").addEventListener("input", e => {
  const text = e.target.value.toLowerCase().trim();
  let found = 0;

  document.querySelectorAll(".product-col").forEach(col => {
    const name = col.querySelector(".card-title").textContent.toLowerCase();
    const show = name.includes(text);
    col.classList.toggle("d-none", !show);
    if (show) found++;
  });

  document.getElementById("noResult").classList.toggle("d-none", found > 0);
});

// ---------- ADD TO CART BUTTONS ----------
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    addToCart({
      id: Number(btn.dataset.id),
      name: btn.dataset.name,
      price: Number(btn.dataset.price)
    });
  });
});

// ---------- CART ACTIONS ----------
function addToCart(product) {
  const item = cart.find(i => i.id === product.id);
  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });
  render();
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  item.qty += change;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  render();
}

function applyCoupon() {
  const code = document.getElementById("couponInput").value.trim().toUpperCase();
  const msg = document.getElementById("couponMsg");
  if (coupons[code]) {
    discountRate = coupons[code];
    msg.className = "small mb-3 text-success";
    msg.textContent = "Coupon applied!";
  } else {
    discountRate = 0;
    msg.className = "small mb-3 text-danger";
    msg.textContent = "Invalid coupon.";
  }
  render();
}

// ---------- CHECKOUT ----------
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const total = document.getElementById("total").textContent;
  const riel = document.getElementById("riel").textContent;
  alert("Thank you for your order!\nTotal: " + total + " (" + riel + ")");
  cart = [];
  discountRate = 0;
  document.getElementById("couponInput").value = "";
  document.getElementById("couponMsg").textContent = "";
  render();
});

// ---------- DRAW CART + TOTALS ----------
function render() {
  const box = document.getElementById("cartItems");
  if (cart.length === 0) {
    box.innerHTML = `<div class="text-center text-secondary py-5">
      <i class="bi bi-cart3 fs-1"></i><p>Your cart is empty</p></div>`;
  } else {
    box.innerHTML = cart.map(i => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>${i.name}<br><small class="text-secondary">${money(i.price)}</small></div>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" onclick="changeQty(${i.id}, -1)">−</button>
          <span class="btn btn-light disabled">${i.qty}</span>
          <button class="btn btn-outline-secondary" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>`).join("");
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal * discountRate;
  const vat = (subtotal - discount) * VAT_RATE;
  const delivery = cart.length ? Number(document.getElementById("delivery").value) : 0;
  const total = subtotal - discount + vat + delivery;

  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("discount").textContent = "-" + money(discount);
  document.getElementById("vat").textContent = money(vat);
  document.getElementById("deliveryFee").textContent = money(delivery);
  document.getElementById("total").textContent = money(total);
  document.getElementById("riel").textContent = Math.round(total * RIEL_RATE).toLocaleString() + " ៛";
  document.getElementById("cartBadge").textContent = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("checkoutBtn").disabled = cart.length === 0;
}

render();