// FashionRack POS – Clothing Shop

// Storage keys
const LS_PRODUCTS = "fr_products";
const LS_CUSTOMERS = "fr_customers";
const LS_ORDERS = "fr_orders";

// In-memory arrays
let products = [];
let customers = [];
let orders = [];
let cart = [];

// DOM elements
const tabButtons = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".page-section");

// POS elements
const posProductList = document.getElementById("posProductList");
const posCategoryFilter = document.getElementById("posCategoryFilter");
const cartTableBody = document.querySelector("#cartTable tbody");
const subtotalAmount = document.getElementById("subtotalAmount");
const discountInput = document.getElementById("discountInput");
const discountAmount = document.getElementById("discountAmount");
const totalAmount = document.getElementById("totalAmount");
const posCustomerSelect = document.getElementById("posCustomerSelect");
const btnCheckout = document.getElementById("btnCheckout");
const receiptPreview = document.getElementById("receiptPreview");

// Product elements
const productsTableBody = document.querySelector("#productsTable tbody");
const productFormCard = document.getElementById("productFormCard");
const productFormTitle = document.getElementById("productFormTitle");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productSizeInput = document.getElementById("productSize");
const productColorInput = document.getElementById("productColor");
const productPriceInput = document.getElementById("productPrice");
const productStockInput = document.getElementById("productStock");
const btnNewProduct = document.getElementById("btnNewProduct");
const btnCancelProduct = document.getElementById("btnCancelProduct");

// Customer elements
const customersTableBody = document.querySelector("#customersTable tbody");
const customerFormCard = document.getElementById("customerFormCard");
const customerFormTitle = document.getElementById("customerFormTitle");
const customerForm = document.getElementById("customerForm");
const customerIdInput = document.getElementById("customerId");
const customerNameInput = document.getElementById("customerName");
const customerPhoneInput = document.getElementById("customerPhone");
const customerEmailInput = document.getElementById("customerEmail");
const btnNewCustomer = document.getElementById("btnNewCustomer");
const btnCancelCustomer = document.getElementById("btnCancelCustomer");

// Orders elements
const ordersTableBody = document.querySelector("#ordersTable tbody");

// ---------------- Tab switching ----------------
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    sections.forEach((sec) => sec.classList.remove("active"));

    btn.classList.add("active");
    const targetId = btn.dataset.target;
    document.getElementById(targetId).classList.add("active");
  });
});

// ---------------- LocalStorage helpers ----------------
function saveToLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLS(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

// ---------------- Seed data ----------------
function seedData() {
  if (!loadFromLS(LS_PRODUCTS)) {
    const demoProducts = [
      {
        id: "P-1001",
        name: "Oversized Street Tee",
        category: "Shirts",
        size: "M",
        color: "Black",
        price: 3500,
        stock: 15,
      },
      {
        id: "P-1002",
        name: "Slim Fit Jeans",
        category: "Pants",
        size: "32",
        color: "Dark Blue",
        price: 5200,
        stock: 10,
      },
      {
        id: "P-1003",
        name: "Minimal Cap",
        category: "Accessories",
        size: "Free",
        color: "Beige",
        price: 2100,
        stock: 20,
      },
      {
        id: "P-1004",
        name: "Crop Hoodie",
        category: "Shirts",
        size: "S",
        color: "Lilac",
        price: 4200,
        stock: 8,
      },
    ];
    saveToLS(LS_PRODUCTS, demoProducts);
  }

  if (!loadFromLS(LS_CUSTOMERS)) {
    const demoCustomers = [
      { id: "C-1001", name: "Walk-in Customer", phone: "-", email: "" },
      { id: "C-1002", name: "Nishan", phone: "0770000000", email: "nishan@example.com" },
    ];
    saveToLS(LS_CUSTOMERS, demoCustomers);
  }

  if (!loadFromLS(LS_ORDERS)) {
    saveToLS(LS_ORDERS, []);
  }
}

// ---------------- Load all data ----------------
function loadData() {
  products = loadFromLS(LS_PRODUCTS) || [];
  customers = loadFromLS(LS_CUSTOMERS) || [];
  orders = loadFromLS(LS_ORDERS) || [];
}

// ---------------- Render functions ----------------
function renderProductsPOS() {
  const category = posCategoryFilter.value;
  posProductList.innerHTML = "";

  const filtered = products.filter((p) =>
    category === "all" ? true : p.category === category
  );

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h4>${p.name}</h4>
      <div class="product-meta">
        <span>${p.category} • ${p.size} • ${p.color}</span>
      </div>
      <div class="product-price">Rs. ${p.price.toFixed(2)}</div>
      <div class="product-meta">Stock: ${p.stock}</div>
    `;
    card.addEventListener("click", () => addToCart(p.id));
    posProductList.appendChild(card);
  });
}

function renderProductsTable() {
  productsTableBody.innerHTML = "";
  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.size}</td>
      <td>${p.color}</td>
      <td>${p.price.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn-icon" data-id="${p.id}" data-action="edit">Edit</button>
        <button class="btn-icon btn-icon--danger" data-id="${p.id}" data-action="delete">Del</button>
      </td>
    `;
    productsTableBody.appendChild(tr);
  });
}

function renderCustomersTable() {
  customersTableBody.innerHTML = "";
  customers.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email || "-"}</td>
      <td>
        <button class="btn-icon" data-id="${c.id}" data-action="edit">Edit</button>
        <button class="btn-icon btn-icon--danger" data-id="${c.id}" data-action="delete">Del</button>
      </td>
    `;
    customersTableBody.appendChild(tr);
  });
}

function renderOrdersTable() {
  ordersTableBody.innerHTML = "";
  orders.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.date}</td>
      <td>${o.customerName}</td>
      <td>${o.items.length}</td>
      <td>${o.total.toFixed(2)}</td>
    `;
    ordersTableBody.appendChild(tr);
  });
}

function renderCustomerSelect() {
  posCustomerSelect.innerHTML = "";
  customers.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name}`;
    posCustomerSelect.appendChild(opt);
  });
}

function renderCart() {
  cartTableBody.innerHTML = "";
  cart.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.size}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty-input" />
      </td>
      <td>${item.price.toFixed(2)}</td>
      <td>${(item.price * item.qty).toFixed(2)}</td>
      <td>
        <button class="btn-icon btn-icon--danger" data-id="${item.id}" data-action="remove">x</button>
      </td>
    `;
    cartTableBody.appendChild(tr);
  });

  updateTotals();
}

// ---------------- Cart functions ----------------
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1;
    } else {
      alert("Not enough stock.");
    }
  } else {
    if (product.stock < 1) {
      alert("Out of stock.");
      return;
    }
    cart.push({
      id: product.id,
      name: product.name,
      size: product.size,
      price: product.price,
      qty: 1,
    });
  }
  renderCart();
}

function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPct = Number(discountInput.value) || 0;
  const discountVal = (subtotal * discountPct) / 100;
  const total = subtotal - discountVal;

  subtotalAmount.textContent = subtotal.toFixed(2);
  discountAmount.textContent = discountVal.toFixed(2);
  totalAmount.textContent = total.toFixed(2);

  buildReceipt(subtotal, discountPct, discountVal, total);
}

function buildReceipt(subtotal, discountPct, discountVal, total) {
  if (cart.length === 0) {
    receiptPreview.textContent = "No items in cart.";
    return;
  }

  const customer = customers.find((c) => c.id === posCustomerSelect.value);
  const customerName = customer ? customer.name : "Walk-in";

  let lines = [];
  lines.push("     FashionRack Clothing");
  lines.push("   Urban Street • POS Bill");
  lines.push("--------------------------------");
  lines.push(`Customer: ${customerName}`);
  lines.push(`Date   : ${new Date().toLocaleString()}`);
  lines.push("--------------------------------");
  cart.forEach((item) => {
    lines.push(
      `${item.name} (${item.size}) x ${item.qty}  - Rs. ${(item.price * item.qty).toFixed(2)}`
    );
  });
  lines.push("--------------------------------");
  lines.push(`Subtotal : Rs. ${subtotal.toFixed(2)}`);
  lines.push(`Discount : ${discountPct}% (Rs. ${discountVal.toFixed(2)})`);
  lines.push(`TOTAL    : Rs. ${total.toFixed(2)}`);
  lines.push("--------------------------------");
  lines.push("Thank you for shopping with us!");

  receiptPreview.textContent = lines.join("\n");
}

// ---------------- Checkout / Orders ----------------
function generateOrderId() {
  const num = orders.length + 1;
  return "O-" + String(num).padStart(4, "0");
}

function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }
  const customer = customers.find((c) => c.id === posCustomerSelect.value);
  const customerName = customer ? customer.name : "Walk-in Customer";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPct = Number(discountInput.value) || 0;
  const discountVal = (subtotal * discountPct) / 100;
  const total = subtotal - discountVal;

  // Reduce stock
  cart.forEach((item) => {
    const p = products.find((p) => p.id === item.id);
    if (p) {
      p.stock -= item.qty;
    }
  });

  const order = {
    id: generateOrderId(),
    date: new Date().toLocaleString(),
    customerId: customer ? customer.id : null,
    customerName,
    items: [...cart],
    subtotal,
    discountPct,
    discountVal,
    total,
  };

  orders.push(order);
  saveToLS(LS_ORDERS, orders);
  saveToLS(LS_PRODUCTS, products);

  renderProductsPOS();
  renderProductsTable();
  renderOrdersTable();

  alert("Order saved successfully!");
  cart = [];
  discountInput.value = 0;
  renderCart();
}

// ---------------- Products CRUD ----------------
function generateProductId() {
  let maxNum = 1000;
  products.forEach((p) => {
    const num = Number(p.id.split("-")[1]);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });
  return "P-" + (maxNum + 1);
}

function resetProductForm() {
  productIdInput.value = "";
  productNameInput.value = "";
  productCategoryInput.value = "";
  productSizeInput.value = "";
  productColorInput.value = "";
  productPriceInput.value = "";
  productStockInput.value = "";
  productFormTitle.textContent = "Add Product";
}

btnNewProduct.addEventListener("click", () => {
  resetProductForm();
  productFormCard.scrollIntoView({ behavior: "smooth" });
});

btnCancelProduct.addEventListener("click", () => {
  resetProductForm();
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = productIdInput.value || generateProductId();
  const name = productNameInput.value.trim();
  const category = productCategoryInput.value;
  const size = productSizeInput.value.trim();
  const color = productColorInput.value.trim();
  const price = Number(productPriceInput.value);
  const stock = Number(productStockInput.value);

  if (!name || !category || !size || !color || isNaN(price) || isNaN(stock)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const existingIndex = products.findIndex((p) => p.id === id);
  const productData = { id, name, category, size, color, price, stock };

  if (existingIndex >= 0) {
    products[existingIndex] = productData;
  } else {
    products.push(productData);
  }

  saveToLS(LS_PRODUCTS, products);
  renderProductsTable();
  renderProductsPOS();
  resetProductForm();
});

productsTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "edit") {
    const p = products.find((p) => p.id === id);
    if (!p) return;
    productIdInput.value = p.id;
    productNameInput.value = p.name;
    productCategoryInput.value = p.category;
    productSizeInput.value = p.size;
    productColorInput.value = p.color;
    productPriceInput.value = p.price;
    productStockInput.value = p.stock;
    productFormTitle.textContent = "Edit Product";
    productFormCard.scrollIntoView({ behavior: "smooth" });
  } else if (action === "delete") {
    if (!confirm("Delete this product?")) return;
    products = products.filter((p) => p.id !== id);
    saveToLS(LS_PRODUCTS, products);
    renderProductsTable();
    renderProductsPOS();
  }
});

// ---------------- Customers CRUD ----------------
function generateCustomerId() {
  let maxNum = 1000;
  customers.forEach((c) => {
    const num = Number(c.id.split("-")[1]);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });
  return "C-" + (maxNum + 1);
}

function resetCustomerForm() {
  customerIdInput.value = "";
  customerNameInput.value = "";
  customerPhoneInput.value = "";
  customerEmailInput.value = "";
  customerFormTitle.textContent = "Add Customer";
}

btnNewCustomer.addEventListener("click", () => {
  resetCustomerForm();
  customerFormCard.scrollIntoView({ behavior: "smooth" });
});

btnCancelCustomer.addEventListener("click", () => {
  resetCustomerForm();
});

customerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = customerIdInput.value || generateCustomerId();
  const name = customerNameInput.value.trim();
  const phone = customerPhoneInput.value.trim();
  const email = customerEmailInput.value.trim();

  if (!name || !phone) {
    alert("Name & phone are required.");
    return;
  }

  const existingIndex = customers.findIndex((c) => c.id === id);
  const data = { id, name, phone, email };

  if (existingIndex >= 0) {
    customers[existingIndex] = data;
  } else {
    customers.push(data);
  }

  saveToLS(LS_CUSTOMERS, customers);
  renderCustomersTable();
  renderCustomerSelect();
  resetCustomerForm();
});

customersTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "edit") {
    const c = customers.find((c) => c.id === id);
    if (!c) return;
    customerIdInput.value = c.id;
    customerNameInput.value = c.name;
    customerPhoneInput.value = c.phone;
    customerEmailInput.value = c.email;
    customerFormTitle.textContent = "Edit Customer";
    customerFormCard.scrollIntoView({ behavior: "smooth" });
  } else if (action === "delete") {
    if (!confirm("Delete this customer?")) return;
    customers = customers.filter((c) => c.id !== id);
    saveToLS(LS_CUSTOMERS, customers);
    renderCustomersTable();
    renderCustomerSelect();
  }
});

// ---------------- Cart events ----------------
cartTableBody.addEventListener("input", (e) => {
  if (e.target.classList.contains("cart-qty-input")) {
    const id = e.target.dataset.id;
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    const item = cart.find((i) => i.id === id);
    const product = products.find((p) => p.id === id);
    if (!item || !product) return;

    if (val > product.stock) {
      alert("Not enough stock.");
      val = product.stock;
    }
    item.qty = val;
    e.target.value = val;
    renderCart();
  }
});

cartTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.action === "remove") {
    const id = btn.dataset.id;
    cart = cart.filter((i) => i.id !== id);
    renderCart();
  }
});

discountInput.addEventListener("input", () => {
  updateTotals();
});

// ---------------- Checkout event ----------------
btnCheckout.addEventListener("click", () => {
  checkout();
});

// ---------------- Init ----------------
(function init() {
  seedData();
  loadData();
  renderProductsPOS();
  renderProductsTable();
  renderCustomersTable();
  renderOrdersTable();
  renderCustomerSelect();
  renderCart();
})();
