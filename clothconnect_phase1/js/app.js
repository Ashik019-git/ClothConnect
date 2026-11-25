const categories = ["Men's Wear", "Women's Wear", "Kids' Wear", "Ethnic Wear"];
const seedProducts = [
  {id:1,brand:"North Thread",name:"Relaxed Cotton Shirt",category:"Men's Wear",price:1299,size:"S, M, L, XL",color:"Olive",image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80"},
  {id:2,brand:"Studio June",name:"Everyday Midi Dress",category:"Women's Wear",price:1899,size:"XS, S, M, L",color:"Beige",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80"},
  {id:3,brand:"Little Loom",name:"Kids Printed Co-ord",category:"Kids' Wear",price:899,size:"2Y, 4Y, 6Y",color:"Multi",image:"https://images.unsplash.com/photo-1519238263530-99f5f2b2c8c8?auto=format&fit=crop&w=700&q=80"},
  {id:4,brand:"Aarohi Label",name:"Handloom Kurta Set",category:"Ethnic Wear",price:2499,size:"S, M, L, XL",color:"Rust",image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"},
  {id:5,brand:"North Thread",name:"Classic Denim",category:"Men's Wear",price:1599,size:"30, 32, 34, 36",color:"Blue",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80"},
  {id:6,brand:"Studio June",name:"Linen Summer Top",category:"Women's Wear",price:1099,size:"XS, S, M, L",color:"White",image:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=80"},
  {id:7,brand:"Little Loom",name:"Soft Cotton Hoodie",category:"Kids' Wear",price:799,size:"2Y, 4Y, 6Y",color:"Yellow",image:"https://images.unsplash.com/photo-1519238263530-99f5f2b2c8c8?auto=format&fit=crop&w=700&q=80"},
  {id:8,brand:"Aarohi Label",name:"Festive Anarkali",category:"Ethnic Wear",price:3299,size:"S, M, L",color:"Pink",image:"https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=700&q=80"}
];

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let products = read("cc_products", seedProducts);
let cart = read("cc_cart", []);
let wishlist = read("cc_wishlist", []);
let applications = read("cc_applications", []);
let commissions = read("cc_commissions", {"Men's Wear":10,"Women's Wear":12,"Kids' Wear":8,"Ethnic Wear":15});
let currentRole = "customer";
const app = document.getElementById("app");

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2300);
}
function updateCounts() {
  document.getElementById("cartCount").textContent = cart.reduce((n,x)=>n+x.qty,0);
  document.getElementById("wishlistCount").textContent = wishlist.length;
}
function money(value) { return "₹" + Number(value).toLocaleString("en-IN"); }

function productCard(p) {
  const liked = wishlist.includes(p.id);
  return `<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">
      <button class="wish ${liked?"active":""}" data-wish="${p.id}" aria-label="Add to wishlist">${liked?"♥":"♡"}</button>
    </div>
    <div class="product-info"><p class="product-brand">${p.brand}</p><p class="product-name">${p.name}</p>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">ADD TO BAG</button></div>
    </div></article>`;
}
function renderHome() {
  app.innerHTML = `
    <section class="hero"><div class="hero-copy"><p class="eyebrow">A marketplace for independent clothing brands</p>
      <h1>Wear your style.<br><em>Support real brands.</em></h1>
      <p class="hero-description">Discover clothing from emerging brands, all in one place. Find your next favourite look.</p>
      <button class="primary-button" data-view="shop">Explore collection <span>→</span></button></div>
      <div class="hero-image" role="img" aria-label="Fashion editorial clothing collection"></div></section>
    <section class="section category-section"><div class="section-heading"><div><p class="eyebrow">Find your fit</p><h2>Shop by category</h2></div><a href="#" data-view="shop" class="text-link">View all products →</a></div>
      <div class="category-grid"><button class="category-tile men" data-category="Men's Wear"><span>Men's Wear</span></button><button class="category-tile women" data-category="Women's Wear"><span>Women's Wear</span></button><button class="category-tile kids" data-category="Kids' Wear"><span>Kids' Wear</span></button><button class="category-tile ethnic" data-category="Ethnic Wear"><span>Ethnic Wear</span></button></div></section>
    <section class="section featured-section"><div class="section-heading"><div><p class="eyebrow">Selected for you</p><h2>Featured pieces</h2></div><a href="#" data-view="shop" class="text-link">Shop collection →</a></div>
      <div class="product-grid">${products.slice(0,4).map(productCard).join("")}</div></section>
    <section class="brand-cta"><div><p class="eyebrow">Have a clothing brand?</p><h2>Bring your brand to ClothConnect.</h2><p>Apply to become a seller and reach customers looking for something different.</p></div><button class="light-button" id="applyBrandButton">Apply as a brand →</button></section>`;
}
function renderShop(category = "") {
  app.innerHTML = `<section class="page-shell"><div class="page-top"><div><p class="eyebrow">The collection</p><h1 class="page-title">Shop clothing</h1><p class="muted">Discover pieces from independent clothing brands.</p></div></div>
    <div class="shop-layout"><aside class="filters"><h3>FILTER & SORT</h3>
      <div class="field"><label for="searchInput">Search product or brand</label><input id="searchInput" placeholder="e.g. cotton shirt"></div>
      <div class="field"><label for="categoryFilter">Category</label><select id="categoryFilter"><option value="">All categories</option>${categories.map(c=>`<option ${c===category?"selected":""}>${c}</option>`).join("")}</select></div>
      <div class="field"><label for="brandFilter">Brand</label><select id="brandFilter"><option value="">All brands</option>${[...new Set(products.map(p=>p.brand))].map(b=>`<option>${b}</option>`).join("")}</select></div>
      <div class="field"><label for="sortFilter">Sort by</label><select id="sortFilter"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></div>
      <div class="filter-actions"><button class="secondary-button" id="clearFilters">Clear</button></div>
    </aside><div><p class="muted" id="resultCount"></p><div class="product-grid" id="shopProducts"></div></div></div></section>`;
  const update = () => {
    let list = [...products];
    const q = document.getElementById("searchInput").value.toLowerCase();
    const c = document.getElementById("categoryFilter").value;
    const b = document.getElementById("brandFilter").value;
    const sort = document.getElementById("sortFilter").value;
    list = list.filter(p=>(!q || (p.name+" "+p.brand).toLowerCase().includes(q)) && (!c || p.category===c) && (!b || p.brand===b));
    if(sort==="low") list.sort((a,b)=>a.price-b.price);
    if(sort==="high") list.sort((a,b)=>b.price-a.price);
    if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    document.getElementById("resultCount").textContent = `${list.length} products`;
    document.getElementById("shopProducts").innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty-state">No clothing found. Try changing your filters.</div>`;
  };
  ["searchInput","categoryFilter","brandFilter","sortFilter"].forEach(id=>document.getElementById(id).addEventListener("input",update));
  document.getElementById("clearFilters").addEventListener("click",()=>{document.getElementById("searchInput").value="";document.getElementById("categoryFilter").value="";document.getElementById("brandFilter").value="";document.getElementById("sortFilter").value="featured";update();});
  update();
}
function renderWishlist() {
  const items = products.filter(p=>wishlist.includes(p.id));
  app.innerHTML = `<section class="page-shell"><p class="eyebrow">Saved pieces</p><h1 class="page-title">Your wishlist</h1><p class="muted">Clothing you have saved for later.</p><div class="product-grid" style="margin-top:28px">${items.length?items.map(productCard).join(""):`<div class="empty-state">Your wishlist is empty.</div>`}</div></section>`;
}
function renderCart() {
  const rows = cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?{...p,qty:item.qty}:null;}).filter(Boolean);
  const total = rows.reduce((s,p)=>s+p.price*p.qty,0);
  app.innerHTML = `<section class="page-shell"><p class="eyebrow">Your selections</p><h1 class="page-title">Shopping bag</h1><div class="panel" style="margin-top:25px">${rows.length?`<div class="table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr></thead><tbody>${rows.map(p=>`<tr><td>${p.name}<br><small>${p.brand}</small></td><td>${money(p.price)}</td><td><button class="secondary-button" data-qty="${p.id}" data-change="-1">−</button> ${p.qty} <button class="secondary-button" data-qty="${p.id}" data-change="1">+</button></td><td>${money(p.price*p.qty)}</td><td><button class="action-button reject" data-remove="${p.id}">Remove</button></td></tr>`).join("")}</tbody></table></div><div style="text-align:right;padding-top:20px"><p>Total: <strong>${money(total)}</strong></p><button class="primary-button" id="checkoutButton">Continue to checkout →</button></div>`:`<div class="empty-state">Your shopping bag is empty. <br><br><button class="primary-button" data-view="shop">Start shopping</button></div>`}</div></section>`;
}
function renderProducer() {
  const mine = products.filter(p=>p.owner==="demo-brand");
  const myApp = applications.find(a=>a.email==="brand@example.com");
  app.innerHTML = `<section class="page-shell"><p class="eyebrow">Seller workspace</p><h1 class="page-title">Brand portal</h1><p class="muted">Apply to sell your own clothing brand and manage your catalogue.</p>
    <div class="role-note">Demo mode: producer access is a frontend simulation. In the final application, only admin-approved brands will be able to publish products.</div>
    <div class="dashboard-grid"><div class="stat-card"><span>Your listed products</span><strong>${mine.length}</strong></div><div class="stat-card"><span>Application status</span><strong style="font-size:19px">${myApp?myApp.status:"Not applied"}</strong></div><div class="stat-card"><span>Commission model</span><strong style="font-size:19px">By category</strong></div></div>
    <div class="panel"><h3>Apply as a clothing brand</h3><form id="brandForm"><div class="form-grid">
      <div class="field"><label>Brand name *</label><input name="brand" required placeholder="Your clothing brand"></div>
      <div class="field"><label>Owner name *</label><input name="owner" required placeholder="Full name"></div>
      <div class="field"><label>Email *</label><input name="email" type="email" required placeholder="brand@example.com"></div>
      <div class="field"><label>Phone *</label><input name="phone" required placeholder="Phone number"></div>
      <div class="field full"><label>Brand description *</label><textarea name="description" required placeholder="Tell us about your clothing brand"></textarea></div>
      <div class="field full"><label>Website or social media link (optional)</label><input name="link" placeholder="https://"></div>
    </div><button class="primary-button" type="submit">Submit brand application →</button></form>${myApp?`<p class="muted">Latest application: ${myApp.status}</p>`:""}</div>
    <div class="panel"><h3>Add a clothing product</h3><p class="muted">Demo form. Final publishing will require an approved producer account.</p><form id="productForm"><div class="form-grid">
      <div class="field"><label>Product name *</label><input name="name" required></div><div class="field"><label>Category *</label><select name="category" required>${categories.map(c=>`<option>${c}</option>`).join("")}</select></div>
      <div class="field"><label>Price (₹) *</label><input name="price" type="number" min="1" required></div><div class="field"><label>Sizes available</label><input name="size" placeholder="S, M, L, XL"></div>
      <div class="field"><label>Colour</label><input name="color" placeholder="Black"></div><div class="field"><label>Product image URL</label><input name="image" type="url" placeholder="https://..."></div>
      <div class="field full"><label>Brand name *</label><input name="brand" required placeholder="Your brand name"></div>
    </div><button class="primary-button" type="submit">Add product →</button></form></div></section>`;
  document.getElementById("brandForm").addEventListener("submit",e=>{
    e.preventDefault();const d=Object.fromEntries(new FormData(e.target));applications.push({...d,status:"Pending",createdAt:new Date().toISOString()});save("cc_applications",applications);toast("Brand application submitted for admin review.");renderProducer();
  });
  document.getElementById("productForm").addEventListener("submit",e=>{
    e.preventDefault();const d=Object.fromEntries(new FormData(e.target));products.push({id:Date.now(),...d,price:Number(d.price),image:d.image||"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",owner:"demo-brand"});save("cc_products",products);toast("Demo product added to catalogue.");renderProducer();
  });
}
function renderAdmin() {
  app.innerHTML = `<section class="page-shell"><p class="eyebrow">Marketplace control centre</p><h1 class="page-title">Admin dashboard</h1><p class="muted">Review clothing brands and configure commission by category.</p>
    <div class="dashboard-grid"><div class="stat-card"><span>Products in catalogue</span><strong>${products.length}</strong></div><div class="stat-card"><span>Brand applications</span><strong>${applications.length}</strong></div><div class="stat-card"><span>Categories</span><strong>${categories.length}</strong></div></div>
    <div class="panel"><h3>Brand applications</h3>${applications.length?`<div class="table-wrap"><table><thead><tr><th>Brand</th><th>Owner</th><th>Email</th><th>Status</th><th>Action</th></tr></thead><tbody>${applications.map((a,i)=>`<tr><td>${a.brand}</td><td>${a.owner}</td><td>${a.email}</td><td><span class="status ${a.status==="Approved"?"approved":""}">${a.status}</span></td><td>${a.status==="Pending"?`<button class="action-button" data-approve="${i}">Approve</button><button class="action-button reject" data-reject="${i}">Reject</button>`:"—"}</td></tr>`).join("")}</tbody></table></div>`:`<p class="muted">No brand applications yet. Submit one from the Brand portal to test this workflow.</p>`}</div>
    <div class="panel"><h3>Category commission settings</h3><p class="muted">Set the marketplace commission percentage for each clothing category. Example rates are pre-filled for this prototype.</p>
      <form id="commissionForm"><div class="form-grid">${categories.map(c=>`<div class="field"><label>${c} commission (%)</label><input type="number" name="${c}" min="0" max="100" step="0.5" value="${commissions[c]??0}" required></div>`).join("")}</div><button class="primary-button" type="submit">Save commission rates →</button></form>
    </div>
    <div class="panel"><h3>Product catalogue</h3><div class="table-wrap"><table><thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th></tr></thead><tbody>${products.map(p=>`<tr><td>${p.name}</td><td>${p.brand}</td><td>${p.category}</td><td>${money(p.price)}</td></tr>`).join("")}</tbody></table></div></div></section>`;
  document.getElementById("commissionForm").addEventListener("submit",e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));categories.forEach(c=>commissions[c]=Number(d[c]));save("cc_commissions",commissions);toast("Category commission rates saved.");});
}
function renderAbout(){app.innerHTML=`<section class="page-shell"><p class="eyebrow">Our marketplace</p><h1 class="page-title">About ClothConnect</h1><div class="panel" style="margin-top:25px;max-width:760px"><p class="muted">ClothConnect is a clothing-only multi-vendor marketplace concept. Independent clothing brands can apply to join, list their collections after approval, and reach customers through one shopping destination.</p><p class="muted">This is a B.Tech project prototype. The current Phase 1 interface uses browser local storage for demonstration. Secure accounts, real approvals, payments and commission settlement will be implemented in the Java and MySQL backend.</p></div></section>`;}
function render() {
  updateCounts();
  if(currentRole==="producer") return renderProducer();
  if(currentRole==="admin") return renderAdmin();
  renderHome();
}
function addToCart(id) {
  const found=cart.find(x=>x.id===id); if(found)found.qty++;else cart.push({id,qty:1});
  save("cc_cart",cart);updateCounts();toast("Added to your shopping bag.");
}
function toggleWish(id) {
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  save("cc_wishlist",wishlist);updateCounts();
  if(document.getElementById("shopProducts"))renderShop(document.getElementById("categoryFilter")?.value||"");
  else if(currentRole==="customer")renderHome();
  toast(wishlist.includes(id)?"Added to wishlist.":"Removed from wishlist.");
}

document.addEventListener("click",e=>{
  const view=e.target.closest("[data-view]")?.dataset.view;
  if(view){e.preventDefault();if(view==="shop")renderShop();else if(view==="about")renderAbout();else renderHome();return;}
  const category=e.target.closest("[data-category]")?.dataset.category;if(category){renderShop(category);return;}
  const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return;}
  const wish=e.target.closest("[data-wish]");if(wish){toggleWish(Number(wish.dataset.wish));return;}
  const approve=e.target.closest("[data-approve]");if(approve){applications[Number(approve.dataset.approve)].status="Approved";save("cc_applications",applications);renderAdmin();toast("Brand approved in demo.");return;}
  const reject=e.target.closest("[data-reject]");if(reject){applications[Number(reject.dataset.reject)].status="Rejected";save("cc_applications",applications);renderAdmin();toast("Brand rejected in demo.");return;}
  const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(x=>x!==item);save("cc_cart",cart);renderCart();updateCounts();}return;}
  const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));save("cc_cart",cart);renderCart();updateCounts();return;}
});
document.getElementById("roleSwitcher").addEventListener("change",e=>{currentRole=e.target.value;render();});
document.getElementById("cartButton").addEventListener("click",()=>{currentRole="customer";document.getElementById("roleSwitcher").value="customer";renderCart();});
document.getElementById("wishlistButton").addEventListener("click",()=>{currentRole="customer";document.getElementById("roleSwitcher").value="customer";renderWishlist();});
document.getElementById("applyBrandButton")?.addEventListener("click",()=>{currentRole="producer";document.getElementById("roleSwitcher").value="producer";renderProducer();});
document.addEventListener("click",e=>{if(e.target.id==="applyBrandButton"){currentRole="producer";document.getElementById("roleSwitcher").value="producer";renderProducer();}});
document.addEventListener("click",e=>{if(e.target.id==="checkoutButton")toast("Checkout will be connected to the backend and payment gateway in a later phase.");});
render();
