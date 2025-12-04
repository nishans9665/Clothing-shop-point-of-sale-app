// ------------------ Data ------------------ //

const TAX_RATE = 0.08;

let products = [
  // 1. Shirts
  { id: 1, name: "Classic White Shirt", category: "Shirts", price: 2500, image: "assets/img/shirt-1.jpg" },
  { id: 2, name: "Slim Fit Office Shirt", category: "Shirts", price: 2800, image: "assets/img/shirt-2.jpg" },

  // 2. T-Shirts
  { id: 3, name: "Round Neck T-Shirt", category: "T-Shirts", price: 1800, image: "assets/img/tshirt-1.jpg" },
  { id: 4, name: "Printed T-Shirt", category: "T-Shirts", price: 1900, image: "assets/img/tshirt-2.jpg" },

  // 3. Pants
  { id: 5, name: "Chino Pants – Beige", category: "Pants", price: 3300, image: "assets/img/pants-1.jpg" },
  { id: 6, name: "Chino Pants – Black", category: "Pants", price: 3400, image: "assets/img/pants-2.jpg" },

  // 4. Jeans
  { id: 7, name: "Slim Fit Blue Jeans", category: "Jeans", price: 3500, image: "assets/img/jeans-1.jpg" },
  { id: 8, name: "Ripped Denim Jeans", category: "Jeans", price: 3700, image: "assets/img/jeans-2.jpg" },

  // 5. Shorts
  { id: 9, name: "Casual Shorts – Grey", category: "Shorts", price: 2100, image: "assets/img/shorts-1.jpg" },
  { id: 10, name: "Cotton Shorts – Black", category: "Shorts", price: 2000, image: "assets/img/shorts-2.jpg" },

  // 6. Hoodies
  { id: 11, name: "Black Hoodie", category: "Hoodies", price: 3800, image: "assets/img/hoodie-1.jpg" },
  { id: 12, name: "Navy Blue Hoodie", category: "Hoodies", price: 3600, image: "assets/img/hoodie-2.jpg" },

  // 7. Jackets
  { id: 13, name: "Denim Jacket", category: "Jackets", price: 5200, image: "assets/img/jacket-1.jpg" },
  { id: 14, name: "Puffer Jacket", category: "Jackets", price: 8800, image: "assets/img/jacket-2.jpg" },

  // 8. Blazers
  { id: 15, name: "Classic Fit Blazer", category: "Blazers", price: 7500, image: "assets/img/blazer-1.jpg" },
  { id: 16, name: "Slim Fit Blazer", category: "Blazers", price: 7900, image: "assets/img/blazer-2.jpg" },

  // 9. Sweaters
  { id: 17, name: "Winter Knit Sweater", category: "Sweaters", price: 4200, image: "assets/img/sweater-1.jpg" },
  { id: 18, name: "Casual Cotton Sweater", category: "Sweaters", price: 3900, image: "assets/img/sweater-2.jpg" },

  // 10. Shoes
  { id: 19, name: "White Sneakers", category: "Shoes", price: 4800, image: "assets/img/shoes-1.jpg" },
  { id: 20, name: "Running Shoes", category: "Shoes", price: 5400, image: "assets/img/shoes-2.jpg" },

  // 11. Sandals
  { id: 21, name: "Brown Sandals", category: "Sandals", price: 2000, image: "assets/img/sandals-1.jpg" },
  { id: 22, name: "Casual Flip Flops", category: "Sandals", price: 1300, image: "assets/img/sandals-2.jpg" },

  // 12. Bags
  { id: 23, name: "Leather Messenger Bag", category: "Bags", price: 5500, image: "assets/img/bag-1.jpg" },
  { id: 24, name: "Backpack – Black", category: "Bags", price: 3900, image: "assets/img/bag-2.jpg" },

  // 13. Watches
  { id: 25, name: "Classic Wrist Watch", category: "Watches", price: 6500, image: "assets/img/watch-1.jpg" },
  { id: 26, name: "Metal Strap Watch", category: "Watches", price: 7200, image: "assets/img/watch-2.jpg" },

  // 14. Wallets
  { id: 27, name: "Leather Wallet – Brown", category: "Wallets", price: 2400, image: "assets/img/wallet-1.jpg" },
  { id: 28, name: "Leather Wallet – Black", category: "Wallets", price: 2300, image: "assets/img/wallet-2.jpg" },

  // 15. Belts
  { id: 29, name: "Men's Leather Belt", category: "Belts", price: 1800, image: "assets/img/belt-1.jpg" },
  { id: 30, name: "Classic Buckle Belt", category: "Belts", price: 1900, image: "assets/img/belt-2.jpg" }
];


let customers = [];
let orders = [];
let cart = [];

// ------------------ Helpers ------------------ //

const formatMoney = (amount) => `Rs ${amount.toFixed(2)}`;

// ------------------ POS Rendering ------------------ //

const productsGrid = document.getElementById("productsGrid");
const cartItemsEl = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotalAmount");
const taxEl = document.getElementById("taxAmount");
const totalEl = document.getElementById("totalAmount");
const discountInput = document.getElementById("discountInput");
const noItemsText = document.getElementById("noItemsText");

// Render product cards
function renderProducts() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const activeBtn = document.querySelector(".category-btn-active");
  const currentCategory = activeBtn ? activeBtn.dataset.category : "All";

  productsGrid.innerHTML = "";

  const filtered = products.filter((p) => {
    const matchesCategory =
      currentCategory === "All" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.cursor = "pointer"; // show pointer on hover

    card.innerHTML = `
    <div class="product-image-wrapper">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-body">
      <div class="product-name">${product.name}</div>
      <div class="product-category">${product.category}</div>
      <div class="product-price">${formatMoney(product.price)}</div>
    </div>
  `;

    // Add click event to entire card
    card.addEventListener("click", () => addToCart(product.id));

    productsGrid.appendChild(card);
  });
}

// Render cart items
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    noItemsText.textContent = "No items yet";
  } else {
    noItemsText.textContent = "";
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item-main gap-1">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-meta">
          ${formatMoney(item.price)} x ${item.qty}
        </span>
        <div class="qty-buttons">
          <button class="qty-btn" data-action="dec">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        
        <span class="qty-price">${formatMoney(item.price * item.qty)}</span>
        <button class="remove-item-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg></button>
      </div>
    `;

    // events
    const [decBtn, incBtn] = row.querySelectorAll(".qty-btn");
    const removeBtn = row.querySelector(".remove-item-btn");

    incBtn.addEventListener("click", () => changeQty(item.id, 1));
    decBtn.addEventListener("click", () => changeQty(item.id, -1));
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    cartItemsEl.appendChild(row);
  });

  updateTotals();
}

// Totals
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPercent = Number(discountInput.value) || 0;
  const discountValue = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountValue;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;

  subtotalEl.textContent = formatMoney(subtotal);
  taxEl.textContent = formatMoney(tax);
  totalEl.textContent = formatMoney(total < 0 ? 0 : total);
}

// ------------------ POS logic ------------------ //

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }

  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find((c) => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((c) => c.id !== productId);
  renderCart();
}

function clearOrder() {
  cart = [];
  discountInput.value = 0;
  renderCart();
}

// Complete order: creates receipt in memory
function completeOrder() {
  if (cart.length === 0) {
    alert("Add items to the order first.");
    return;
  }

  const customerNameInput = document.getElementById("customerName");
  const customerName = customerNameInput.value.trim() || "Walk-in Customer";
  const paymentMethod = document.getElementById("paymentMethod").value;

  // Ensure customer exists or create
  let customer = customers.find(
    (c) => c.name.toLowerCase() === customerName.toLowerCase()
  );

  if (!customer) {
    customer = {
      id: Date.now(),
      name: customerName,
      phone: "",
      email: "",
    };
    customers.push(customer);
  }

  // Calculate totals again
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPercent = Number(discountInput.value) || 0;
  const discountValue = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountValue;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;

  const order = {
    id: "ORD-" + Date.now(),
    customerId: customer.id,
    customerName: customer.name,
    items: JSON.parse(JSON.stringify(cart)),
    subtotal,
    discountPercent,
    tax,
    total,
    paymentMethod,
    createdAt: new Date(),
  };

  orders.push(order);

  // Refresh admin tables
  renderCustomersTable();
  renderOrdersTable();

  alert(
    `Order Completed!\nCustomer: ${order.customerName}\nTotal: ${formatMoney(
      total
    )}`
  );

  // Clear POS
  customerNameInput.value = "";
  clearOrder();
}

// ------------------ Admin: Products ------------------ //

const productsTableBody = document.getElementById("productsTableBody");

function renderProductsTable() {
  productsTableBody.innerHTML = "";
  products.forEach((p, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${formatMoney(p.price)}</td>
      <td>
        <button class="btn secondary btn-sm" data-action="edit">Edit</button>
        <button class="btn primary btn-sm" data-action="delete">Delete</button>
      </td>
    `;

    const [editBtn, deleteBtn] = tr.querySelectorAll("button");
    editBtn.addEventListener("click", () => loadProductToForm(p.id));
    deleteBtn.addEventListener("click", () => deleteProduct(p.id));

    productsTableBody.appendChild(tr);
  });
}

function loadProductToForm(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productImage").value = product.image;
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  products = products.filter((p) => p.id !== id);
  renderProducts();
  renderProductsTable();
}

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const idField = document.getElementById("productId");
  const nameField = document.getElementById("productName");
  const categoryField = document.getElementById("productCategory");
  const priceField = document.getElementById("productPrice");
  const imageField = document.getElementById("productImage");

  const name = nameField.value.trim();
  const category = categoryField.value;
  const price = Number(priceField.value);
  const image = imageField.value.trim() || "assets/img/shirt-1.jpg";

  if (!name || isNaN(price)) return;

  if (idField.value) {
    // Update
    const id = Number(idField.value);
    const product = products.find((p) => p.id === id);
    if (product) {
      product.name = name;
      product.category = category;
      product.price = price;
      product.image = image;
    }
  } else {
    // Create
    const newProduct = {
      id: Date.now(),
      name,
      category,
      price,
      image,
    };
    products.push(newProduct);
  }

  productForm.reset();
  document.getElementById("productId").value = "";

  renderProducts();
  renderProductsTable();
});

document
  .getElementById("resetProductForm")
  .addEventListener("click", () => productForm.reset());

// ------------------ Admin: Customers ------------------ //

const customersTableBody = document.getElementById("customersTableBody");

function renderCustomersTable() {
  customersTableBody.innerHTML = "";
  customers.forEach((c, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>${c.phone || "-"}</td>
      <td>${c.email || "-"}</td>
      <td>
        <button class="btn secondary btn-sm" data-action="edit">Edit</button>
        <button class="btn primary btn-sm" data-action="delete">Delete</button>
      </td>
    `;
    const [editBtn, deleteBtn] = tr.querySelectorAll("button");

    editBtn.addEventListener("click", () => loadCustomerToForm(c.id));
    deleteBtn.addEventListener("click", () => deleteCustomer(c.id));

    customersTableBody.appendChild(tr);
  });
}

function loadCustomerToForm(id) {
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;

  document.getElementById("customerId").value = customer.id;
  document.getElementById("customerFullName").value = customer.name;
  document.getElementById("customerPhone").value = customer.phone;
  document.getElementById("customerEmail").value = customer.email;
}

function deleteCustomer(id) {
  if (!confirm("Delete this customer?")) return;

  customers = customers.filter((c) => c.id !== id);
  renderCustomersTable();
}

const customerForm = document.getElementById("customerForm");
customerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const idField = document.getElementById("customerId");
  const nameField = document.getElementById("customerFullName");
  const phoneField = document.getElementById("customerPhone");
  const emailField = document.getElementById("customerEmail");

  const name = nameField.value.trim();

  if (!name) return;

  if (idField.value) {
    const customer = customers.find((c) => c.id === Number(idField.value));
    if (customer) {
      customer.name = name;
      customer.phone = phoneField.value.trim();
      customer.email = emailField.value.trim();
    }
  } else {
    customers.push({
      id: Date.now(),
      name,
      phone: phoneField.value.trim(),
      email: emailField.value.trim(),
    });
  }

  customerForm.reset();
  document.getElementById("customerId").value = "";
  renderCustomersTable();
});

document
  .getElementById("resetCustomerForm")
  .addEventListener("click", () => customerForm.reset());

// ------------------ Admin: Orders ------------------ //

const ordersTableBody = document.getElementById("ordersTableBody");

function renderOrdersTable() {
  ordersTableBody.innerHTML = "";
  orders.forEach((o, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${o.id}</td>
      <td>${o.customerName}</td>
      <td>${o.createdAt.toLocaleString()}</td>
      <td>${formatMoney(o.total)}</td>
      <td>${o.paymentMethod}</td>
      <td>
        <button class="btn primary btn-sm" data-index="${index}">
          Delete
        </button>
      </td>
    `;
    const deleteBtn = tr.querySelector("button");
    deleteBtn.addEventListener("click", () => deleteOrder(index));
    ordersTableBody.appendChild(tr);
  });
}

function deleteOrder(index) {
  if (!confirm("Delete this order?")) return;
  orders.splice(index, 1);
  renderOrdersTable();
}

// ------------------ Navigation between views ------------------ //

const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("nav-btn-active"));
    btn.classList.add("nav-btn-active");

    const viewId = btn.dataset.view;
    views.forEach((v) => {
      v.classList.toggle("active-view", v.id === viewId);
    });
  });
});

// Admin tab switching
const adminTabs = document.querySelectorAll(".admin-tab");
const adminSections = document.querySelectorAll(".admin-section");

adminTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    adminTabs.forEach((t) => t.classList.remove("admin-tab-active"));
    tab.classList.add("admin-tab-active");

    const target = tab.dataset.admin;
    adminSections.forEach((section) => {
      section.classList.toggle(
        "admin-section-active",
        section.id === target
      );
    });
  });
});

// ------------------ Event bindings ------------------ //

document.getElementById("searchInput").addEventListener("input", renderProducts);

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("category-btn-active"));
    btn.classList.add("category-btn-active");
    renderProducts();
  });
});

discountInput.addEventListener("input", updateTotals);
document
  .getElementById("clearOrderBtn")
  .addEventListener("click", clearOrder);
document
  .getElementById("completeOrderBtn")
  .addEventListener("click", completeOrder);

// ------------------ Initial render ------------------ //

renderProducts();
renderCart();
renderProductsTable();
renderCustomersTable();
renderOrdersTable();
