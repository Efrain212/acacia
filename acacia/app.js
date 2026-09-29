const WHATSAPP_NUMBER = "5492645874999";
const WHATSAPP_NUMBER_2 = "5492645063736";
// FASE 2 (producción full): backend online con miembros, puntos, admin y visitas.
const BACKEND_ENABLED = true;
const AUTH_URL_LOCAL = "http://localhost:3001";
const AUTH_URL_PROD = "https://acacia-production-0a93.up.railway.app";
const AUTH_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:") ? AUTH_URL_LOCAL : AUTH_URL_PROD;
// Login social: pegá tus IDs cuando los crees (Google Cloud / Meta). Vacío = botón oculto.
const GOOGLE_CLIENT_ID = "805401039379-bc2u2lcdmulibiec71jfedd0apqtdchr.apps.googleusercontent.com";
const FB_APP_ID = "2508902876263794";
// NARANJA X - datos reales
const NX_ALIAS = "acacia.2026";
const NX_CBU = "4530000800011641761230";
const NX_TITULAR = "Acacia Indumentaria";
// Provincias + localidades principales (para cascading)
const PROV_LOCS = {
"San Juan": ["Capital","Rawson","Chimbas","Rivadavia","Santa Lucía","Pocito","Caucete","Jáchal","Albardón","Sarmiento","25 de Mayo","San Martín","Angaco","Ullum","Zonda","Calingasta","Iglesia","Valle Fértil","9 de Julio","Otra"],
"Mendoza": ["Capital","Godoy Cruz","Guaymallén","Maipú","Luján de Cuyo","Las Heras","San Rafael","San Martín","Tunuyán","Tupungato","Malargüe","Rivadavia","Junín","Lavalle","General Alvear","Otra"],
"Buenos Aires": ["La Plata","Mar del Plata","Bahía Blanca","Quilmes","Lanús","Lomas de Zamora","San Isidro","Vicente López","Morón","Moreno","Pilar","Tigre","Tandil","Olavarría","Junín","San Nicolás","Pergamino","Otra"],
"CABA": ["Palermo","Belgrano","Recoleta","Caballito","Flores","Villa Crespo","San Telmo","La Boca","Puerto Madero","Almagro","Villa Urquiza","Boedo","Otra"],
"Córdoba": ["Córdoba Capital","Villa María","Río Cuarto","Villa Carlos Paz","Alta Gracia","Cosquín","Jesús María","Río Tercero","San Francisco","Bell Ville","Cruz del Eje","Otra"],
"Santa Fe": ["Rosario","Santa Fe Capital","Rafaela","Venado Tuerto","Reconquista","Santo Tomé","Esperanza","Casilda","San Lorenzo","Otra"],
"Tucumán": ["San Miguel de Tucumán","Yerba Buena","Tafí Viejo","Banda del Río Salí","Concepción","Aguilares","Otra"],
"Salta": ["Salta Capital","Orán","Tartagal","General Güemes","Metán","Cafayate","Rosario de Lerma","Otra"],
"Jujuy": ["San Salvador de Jujuy","Palpalá","Perico","San Pedro","Libertador General San Martín","Humahuaca","Otra"],
"Chaco": ["Resistencia","Barranqueras","Sáenz Peña","Villa Ángela","Charata","General San Martín","Otra"],
"Corrientes": ["Corrientes Capital","Goya","Mercedes","Curuzú Cuatiá","Paso de los Libres","Bella Vista","Otra"],
"Entre Ríos": ["Paraná","Concordia","Gualeguaychú","Concepción del Uruguay","La Paz","Villaguay","Otra"],
"Formosa": ["Formosa Capital","Clorinda","Pirané","El Colorado","Otra"],
"Misiones": ["Posadas","Oberá","Eldorado","Puerto Iguazú","Apóstoles","Leandro N. Alem","Otra"],
"La Rioja": ["La Rioja Capital","Chilecito","Aimogasta","Chamical","Chepes","Otra"],
"Catamarca": ["San Fernando del Valle","Valle Viejo","Andalgalá","Belén","Santa María","Recreo","Otra"],
"Santiago del Estero": ["Santiago Capital","La Banda","Termas de Río Hondo","Frías","Añatuya","Otra"],
"San Luis": ["San Luis Capital","Villa Mercedes","Merlo","La Punta","Juana Koslay","Otra"],
"La Pampa": ["Santa Rosa","General Pico","Toay","Realicó","Eduardo Castex","Otra"],
"Neuquén": ["Neuquén Capital","Cutral-Có","Zapala","San Martín de los Andes","Villa La Angostura","Plottier","Otra"],
"Río Negro": ["Viedma","Bariloche","General Roca","Cipolletti","Allen","Villa Regina","Otra"],
"Chubut": ["Rawson","Comodoro Rivadavia","Trelew","Puerto Madryn","Esquel","Otra"],
"Santa Cruz": ["Río Gallegos","Caleta Olivia","Pico Truncado","El Calafate","Río Turbio","Otra"],
"Tierra del Fuego": ["Ushuaia","Río Grande","Tolhuin","Otra"]
};
function initProvLoc(){
  const p = document.getElementById("fProv");
  const c = document.getElementById("fCitySel");
  if(!p || !c) return;
  p.innerHTML = Object.keys(PROV_LOCS).map(k=>`<option ${k==="San Juan"?"selected":""}>${k}</option>`).join("");
  const fill = ()=>{
    const locs = PROV_LOCS[p.value] || ["Otra"];
    const prev = getSavedData().citySel;
    c.innerHTML = locs.map(l=>`<option>${l}</option>`).join("");
    if(prev && locs.includes(prev)) c.value = prev;
  };
  p.onchange = ()=>{ fill(); if(typeof updateSummary==="function") updateSummary(); };
  fill();
}

const PRODUCTS0 = [
  {
    id: "pollera-tiare",
    name: "Pollera tiare",
    price: 21990,
    category: "mujer",
    color: "Beige",
    img: "https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000405382-16a7959d2f2435a85117892384089343-480-0.webp",
    desc: "Pollera tiare. Envío gratis.",
    talles: ["S", "M", "L"]
  },
  {
    id: "vestido-helecho",
    name: "Vestido helecho",
    price: 26690,
    category: "mujer",
    color: "Marrón",
    img: "https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000393704-d052442b0ddbbbf42e17887202792111-480-0.webp",
    desc: "Vestido helecho. Envío gratis.",
    talles: ["S", "M", "L"]
  },
  {
    id: "musculosa-azalea",
    name: "Musculosa Lycra Azalea",
    price: 18200,
    category: "mujer",
    color: "Negro",
    img: "https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000395703-95f4f1dbec47d2dc0517887028203195-480-0.webp",
    desc: "Microfibra Lycra. Talle 2: 36x53 / Talle 3: 38x59 / Talle 4: 43x67",
    talles: ["2", "3", "4"]
  },
  { id: "remera-basica-h", name: "Remera básica Hombre", price: 15990, category: "hombre", color: "Blanco", img: "", desc: "Producto de ejemplo - reemplazá foto y precio." },
  { id: "buzo-hombre", name: "Buzo Hombre", price: 29990, category: "hombre", color: "Negro", img: "", desc: "Producto de ejemplo - reemplazá foto y precio." },
];
let PRODUCTS = PRODUCTS0.slice();
async function syncProducts(){
  if(!BACKEND_ENABLED) return;
  try {
    const r = await fetch(AUTH_URL+"/api/productos");
    const d = await r.json();
    if(r.ok && d.productos?.length){
      PRODUCTS = d.productos.map(p=>({ id:p.id, name:p.nombre, price:Number(p.precio), category:p.categoria||"mujer", color:p.color||"", img:p.img||"", fotos:p.fotos||(p.img?[p.img]:[]), desc:p.descrip||"", stock:p.stock, talles:String(p.talles||"").split(",").map(s=>s.trim()).filter(Boolean) }));
      render();
      heroShow(0);
    }
  } catch {}
}

const fmt = n => "$" + n.toLocaleString("es-AR", {minimumFractionDigits: 2});
const grid = document.getElementById("grid");
const emptyMsg = document.getElementById("emptyMsg");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

let cart = JSON.parse(localStorage.getItem("acacia_cart") || "[]");
let currentModalId = null;

function getFiltered(){
  let q = searchInput.value.toLowerCase().trim();
  let cat = categoryFilter.value;
  let list = PRODUCTS.filter(p =>
    (cat === "todos" || p.category === cat) &&
    (p.name.toLowerCase().includes(q) || (p.color||"").toLowerCase().includes(q))
  );
  const s = sortFilter.value;
  if(s==="menor") list.sort((a,b)=>a.price-b.price);
  if(s==="mayor") list.sort((a,b)=>b.price-a.price);
  if(s==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

function placeholderImg(name){
  const t = String(name || "Acacia").slice(0, 18);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='480'><rect width='480' height='480' fill='#E9DCCF'/><text x='50%' y='52%' font-family='sans-serif' font-size='34' fill='#7A4A2E' text-anchor='middle'>${t}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

let heroIdx = 0, heroTimer = null;
function heroShow(i){
  const img = document.getElementById("heroImg");
  if(!img) return;
  const list = PRODUCTS.filter(p=>p.img);
  if(!list.length) return;
  heroIdx = (i + list.length) % list.length;
  const p = list[heroIdx];
  img.src = p.img;
  img.alt = p.name;
  const nm = document.getElementById("heroName"), pr = document.getElementById("heroPrice");
  if(nm) nm.textContent = p.name;
  if(pr) pr.textContent = fmt(p.price);
  const dots = document.getElementById("heroDots");
  if(!dots) return;
  dots.innerHTML = list.map((_,k)=>`<button type="button" data-dot="${k}" class="${k===heroIdx?"on":""}" aria-label="Foto ${k+1}"></button>`).join("");
  dots.querySelectorAll("[data-dot]").forEach(b=>b.onclick=()=>{ heroShow(Number(b.dataset.dot)); heroAuto(); });
}
function heroAuto(){
  clearInterval(heroTimer);
  if(!document.getElementById("heroImg")) return;
  heroTimer = setInterval(()=>heroShow(heroIdx+1), 4500);
}
(function(){
  const pv = document.getElementById("heroPrev"), nx = document.getElementById("heroNext"), im = document.getElementById("heroImg");
  if(pv) pv.onclick = ()=>{ heroShow(heroIdx-1); heroAuto(); };
  if(nx) nx.onclick = ()=>{ heroShow(heroIdx+1); heroAuto(); };
  if(im) im.onclick = ()=>{
    const list = PRODUCTS.filter(p=>p.img);
    if(list[heroIdx]) location.hash = "#/producto/" + list[heroIdx].id;
  };
})();

function render(){
  const list = getFiltered();
  grid.innerHTML = "";
  emptyMsg.hidden = list.length !== 0;
  list.forEach(p=>{
    const el = document.createElement("article");
    el.className = "card";
    const c3 = p.price/3;
    const stock = p.stock ?? 10;
    const out = stock <= 0;
    const st = out ? `<span style="color:#c00;font-weight:700">Fuera de stock</span>` : `Stock: ${stock}`;
    const hasTalles = (p.talles || []).length > 0;
    el.innerHTML = `
      <button type="button" class="fav${isFav(p.id) ? " on" : ""}" data-fav="${p.id}" aria-label="Favorito">♥</button>
      <img src="${p.img || placeholderImg(p.name)}" alt="${p.name}" data-view="${p.id}" loading="lazy" />
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="muted">${p.category} · ${p.color||""} · ${st}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="muted small">Hasta <strong>3 sin interés</strong> de ${fmt(c3)} con Plan Z</div>
        <a href="#" class="muted small" data-medios>Ver medios de pago</a>
        ${out ? `<button class="btn ghost" disabled>Fuera de stock</button>`
              : hasTalles ? `<button class="btn primary" data-goto="${p.id}">Elegir talle</button>`
              : `<button class="btn primary" data-add="${p.id}">Agregar</button>`}
      </div>`;
    grid.appendChild(el);
  });
}

function saveCart(){ localStorage.setItem("acacia_cart", JSON.stringify(cart)); updateCartUI(); }
function cartKey(id, talle){ return id + "|" + (talle || ""); }
function addToCartSilent(id, talle){
  const k = cartKey(id, talle);
  const f = cart.find(i=>cartKey(i.id, i.talle)===k);
  if(f) f.qty++;
  else cart.push({id, talle: talle || "", qty:1});
}
function addToCart(id, talle){
  addToCartSilent(id, talle);
  saveCart();
  openCart();
}
function updateCartUI(){
  const count = cart.reduce((a,c)=>a+c.qty,0);
  document.getElementById("cartCount").textContent = count;
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  let total = 0;
  cart.forEach(item=>{
    const p = PRODUCTS.find(x=>x.id===item.id);
    if(!p) return;
    total += p.price * item.qty;
    const k = cartKey(item.id, item.talle);
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${p.img || placeholderImg(p.name)}" />
      <div style="flex:1"><strong>${p.name}</strong>${item.talle ? `<br><span class="muted">Talle ${item.talle}</span>` : ""}<br><span class="muted">${fmt(p.price)}</span>
      <div class="qty"><button data-dec="${k}">-</button> ${item.qty} <button data-inc="${k}">+</button></div></div>
      <button data-del="${k}">🗑</button>`;
    box.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = fmt(total);
  if(cart.length===0) box.innerHTML = "<p class='muted'>El carrito está vacío.</p>";
}

function getTotal(){ return cart.reduce((a,c)=>{ const p=PRODUCTS.find(x=>x.id===c.id); return p ? a+p.price*c.qty : a; },0); }
function buildOrderLines(payMethod){
  const lines = ["Hola Acacia! Quiero comprar:"];
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    if(!p) return;
    lines.push("- " + p.name + (i.talle ? " (talle " + i.talle + ")" : "") + " x" + i.qty + " - " + fmt(p.price*i.qty));
  });
  lines.push("");
  lines.push("Total: " + fmt(getTotal()));
  if(payMethod) lines.push("Pago: " + payMethod);
  return lines.join("\n");
}
function cartToWhatsApp(payMethod){
  if(cart.length===0){ alert("El carrito está vacío"); return; }
  const text = encodeURIComponent(buildOrderLines(payMethod || "WhatsApp"));
  const url = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMBER + "&text=" + text;
  console.log("WhatsApp URL:", url);
  window.open(url, "_blank");
}

// events
document.addEventListener("click", e=>{
  const oa = e.target.closest("[data-open-auth]");
  if(oa){ e.preventDefault(); openAuthModal(); }
  const fav = e.target.closest("[data-fav]");
  if(fav){ e.preventDefault(); toggleFav(fav.dataset.fav); return; }
  const go = e.target.closest("[data-goto]");
  if(go){ location.hash = "#/producto/" + go.dataset.goto; return; }
  const add = e.target.closest("[data-add]");
  if(add) {
    e.preventDefault();
    const p = PRODUCTS.find(x=>x.id===add.dataset.add);
    const inCart = cart.filter(i=>i.id===add.dataset.add).reduce((a,c)=>a+c.qty,0);
    if(p && inCart >= (p.stock ?? 99)){ alert("Fuera de stock: máximo " + (p.stock ?? 0)); return; }
    addToCart(add.dataset.add);
  }
  const med = e.target.closest("[data-medios]");
  if(med){ e.preventDefault(); updateSummary(); document.getElementById("mediosModal").hidden=false; }
  const view = e.target.closest("[data-view]");
  if(view){ location.hash = "#/producto/" + view.dataset.view; }
  if(e.target.closest("[data-inc]")){ const k=e.target.closest("[data-inc]").dataset.inc; const it=cart.find(i=>cartKey(i.id,i.talle)===k); const p=PRODUCTS.find(x=>x.id===it?.id); const max=p?.stock ?? 99; if(it && it.qty < max) it.qty++; saveCart(); }
  if(e.target.closest("[data-dec]")){ const k=e.target.closest("[data-dec]").dataset.dec; const it=cart.find(i=>cartKey(i.id,i.talle)===k); if(it){ it.qty--; if(it.qty<=0) cart=cart.filter(i=>cartKey(i.id,i.talle)!==k); } saveCart(); }
  if(e.target.closest("[data-del]")){ const k=e.target.closest("[data-del]").dataset.del; cart=cart.filter(i=>cartKey(i.id,i.talle)!==k); saveCart(); }
  const catLink = e.target.closest("[data-cat-link]");
  if(catLink){
    e.preventDefault();
    const c = catLink.dataset.catLink;
    if(c === "todos"){ location.hash = "#productos"; document.getElementById("catpage").hidden = true; categoryFilter.value = "todos"; searchInput.value = ""; render(); }
    else if(location.hash === "#/" + c) applyRoute(true);
    else location.hash = "#/" + c;
  }
  const homeLink = e.target.closest('a[href="#inicio"]');
  if(homeLink){
    document.getElementById("catpage").hidden = true;
    categoryFilter.value = "todos"; searchInput.value = ""; sortFilter.value = "relevancia";
    render();
  }
});
[searchInput, categoryFilter, sortFilter].forEach(el=>el.addEventListener("input", render));

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
function openCart(){ drawer.classList.add("open"); overlay.hidden=false; drawer.setAttribute("aria-hidden","false"); }
function closeCartFn(){ drawer.classList.remove("open"); overlay.hidden=true; drawer.setAttribute("aria-hidden","true"); }
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCartFn;
overlay.onclick = closeCartFn;
document.getElementById("checkoutBtn").onclick = ()=>{ if(cart.length===0){ alert("El carrito está vacío"); return; } closeCartFn(); openCheckout(); };
document.getElementById("clearBtn").onclick = ()=>{ cart=[]; saveCart(); };
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
function openMenu(){ sideMenu.classList.add("open"); menuOverlay.hidden = false; sideMenu.setAttribute("aria-hidden","false"); }
function closeMenu(){ sideMenu.classList.remove("open"); menuOverlay.hidden = true; sideMenu.setAttribute("aria-hidden","true"); }
document.getElementById("menuBtn").onclick = openMenu;
document.getElementById("closeMenu").onclick = closeMenu;
menuOverlay.onclick = closeMenu;
sideMenu.addEventListener("click", e=>{ if(e.target.closest("a")) closeMenu(); });
// ===== MENÚ lateral y mega (editable desde Admin > Menú) =====
const SUBS = {
  mujer: ["Polleras", "Vestidos", "Musculosas", "Accesorios"],
  hombre: ["Remeras", "Shorts", "Buzos", "Accesorios"]
};
const SUB_Q = { Polleras: "pollera", Vestidos: "vestido", Musculosas: "musculosa", Remeras: "remera", Shorts: "short", Buzos: "buzo", Accesorios: "accesorio" };
function defaultMenu(){
  const S = cat=>[
    { label: "Ofertas", href: `#/${cat}/ofertas`, q: "", hl: true },
    ...SUBS[cat].map(s=>({ label: s, href: `#/${cat}/${SUB_Q[s]}`, q: SUB_Q[s] })),
    { label: "Ver todo", href: `#/${cat}`, q: "", all: true }
  ];
  return {
    top: [
      { label: "Inicio", href: "#inicio" },
      { label: "Productos", menu: true },
      { label: "Miembros", href: "#/miembros" },
      { label: "Contacto", href: "#/contacto" }
    ],
    cats: {
      mujer: { label: "Mujer", desc: "Polleras, vestidos, musculosas y accesorios.", subs: S("mujer") },
      hombre: { label: "Hombre", desc: "Remeras, shorts, buzos y accesorios.", subs: S("hombre") }
    }
  };
}
let MENU = defaultMenu();
async function loadMenu(){
  try {
    const r = await fetch(AUTH_URL+"/api/ajustes");
    const d = await r.json();
    if(r.ok && d.ajustes.menu) MENU = JSON.parse(d.ajustes.menu);
  } catch {}
  renderMenus();
}
function renderMenus(){
  const nav = document.getElementById("sideNav");
  nav.innerHTML = MENU.top.map(t=>t.menu
    ? `<button type="button" id="prodToggle">Productos <span>›</span></button><div id="prodSub" hidden>` +
      Object.entries(MENU.cats).map(([key,c])=>`<button type="button" data-cat="${key}">${c.label} <span>›</span></button>`).join("") +
      `</div><div id="prodList" hidden><strong id="prodListTitle"></strong><span class="sub-items"></span></div>`
    : `<a href="${t.href}">${t.label}</a>`).join("");
  document.getElementById("megaMenu").innerHTML = Object.entries(MENU.cats)
    .map(([key,c])=>`<div><strong><a href="#/${key}" style="color:#111">${c.label}</a></strong>` + (c.subs||[]).map(s=>`<a href="${s.href}"${s.hl?' class="hl"':""}>${s.all?"<strong>"+s.label+"</strong>":s.label}</a>`).join("") + `</div>`).join("");
  document.getElementById("prodToggle").onclick = ()=>{
    document.getElementById("prodSub").hidden = !document.getElementById("prodSub").hidden;
    document.getElementById("prodList").hidden = true;
  };
  nav.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{
    const cat = b.dataset.cat;
    if(location.hash === "#/" + cat) applyRoute(true);
    else location.hash = "#/" + cat;
  });
}
function findSub(hash){
  for(const [key,c] of Object.entries(MENU.cats)){
    const s = (c.subs||[]).find(x=>x.href === hash);
    if(s) return { cat: key, sub: s };
  }
  return null;
}
// Router tipo Nike: cada categoría es una "página" (#/mujer/pollera) con banner y migas
const CAT_META = {
  mujer: { title: "Mujer", desc: "Polleras, vestidos, musculosas y accesorios." },
  hombre: { title: "Hombre", desc: "Remeras, shorts, buzos y accesorios." }
};
function parseRoute(){
  const h = location.hash;
  let m = h.match(/^#\/(mujer|hombre)(?:\/([a-z]+))?$/);
  if(m) return { type: "cat", cat: m[1], slug: m[2] || null };
  m = h.match(/^#\/producto\/([A-Za-z0-9\-_]+)$/);
  if(m) return { type: "prod", id: m[1] };
  if(h === "#/contacto") return { type: "page", page: "contacto" };
  if(h === "#/miembros") return { type: "page", page: "miembros" };
  if(h === "#/admin") return { type: "page", page: "admin" };
  let m2 = h.match(/^#\/cuenta(?:\/(perfil|ordenes|favoritos|ajustes))?$/);
  if(m2) return { type: "cuenta", tab: m2[1] || "perfil" };
  return null;
}
const VIEW_SECTIONS = ["inicio", "shopBanner", "categorias", "productos", "memberBanner", "pagos", "contacto", "miembros", "catpage", "prodpage", "admin", "cuenta"];
function showView(names){
  VIEW_SECTIONS.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.hidden = !names.includes(id);
  });
}
function slugToSub(cat, slug){
  if(!slug) return "todos";
  if(slug === "ofertas") return "ofertas";
  return (SUBS[cat] || []).find(s=>SUB_Q[s] === slug) || "todos";
}
function applyRoute(scroll){
  const page = document.getElementById("catpage");
  const r = parseRoute();
  if(!r){ page.hidden = true; showView(["inicio", "shopBanner", "categorias", "productos", "memberBanner", "pagos"]); document.title = "Acacia Indumentaria - Tienda Online"; return; }
  if(r.type === "page"){
    page.hidden = true;
    document.getElementById("prodpage").hidden = true;
    if(r.page === "admin" && !isAdmin()){ location.hash = ""; showView(["inicio", "shopBanner", "categorias", "productos", "memberBanner", "pagos"]); document.title = "Acacia Indumentaria - Tienda Online"; return; }
    if(r.page === "admin"){ document.getElementById("adminDash").hidden = false; showATab("resumen"); loadStats(); }
    showView([r.page]);
    document.title = (r.page === "contacto" ? "Contacto" : r.page === "miembros" ? "Miembros" : "Administración") + " | Acacia Indumentaria";
    if(scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if(r.type === "cuenta"){
    page.hidden = true;
    document.getElementById("prodpage").hidden = true;
    showView(["cuenta"]);
    document.title = "Mi cuenta | Acacia Indumentaria";
    renderCuenta(r.tab || "perfil");
    if(scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if(r.type === "prod"){
    page.hidden = true;
    const p = PRODUCTS.find(x=>x.id === r.id);
    if(!p){ showView(["inicio", "categorias", "productos", "pagos"]); return; }
    document.getElementById("ppCrumbCat").textContent = CAT_META[p.category] ? CAT_META[p.category].title : p.category;
    document.getElementById("ppCrumbCat").href = "#/" + p.category;
    document.getElementById("ppCrumbName").textContent = p.name;
    document.getElementById("ppImg").src = p.img || placeholderImg(p.name);
    document.getElementById("ppImg").alt = p.name;
    const gal = p.fotos && p.fotos.length ? p.fotos : (p.img ? [p.img] : []);
    document.getElementById("ppThumbs").innerHTML = gal.map((u,k)=>`<span class="g"><img src="${u}" alt="Foto ${k+1}" style="width:64px;height:64px" onerror="this.style.visibility='hidden'" /></span>`).join("");
    document.querySelectorAll("#ppThumbs .g").forEach((s,k)=>s.onclick=()=>{ document.getElementById("ppImg").src = gal[k]; });
    document.getElementById("ppName").textContent = p.name;
    document.getElementById("ppPrice").textContent = fmt(p.price);
    document.getElementById("ppCuotas").textContent = "Hasta 3 cuotas sin interés de " + fmt(p.price / 3) + " con Plan Z";
    document.getElementById("ppMeta").textContent = p.category + (p.color ? " · " + p.color : "");
    document.getElementById("ppDesc").textContent = p.desc || "";
    const stock = p.stock ?? 10;
    const talles = p.talles || [];
    const tw = document.getElementById("ppTallesWrap");
    tw.hidden = talles.length === 0;
    let talleSel = "";
    if(talles.length){
      document.getElementById("ppTalles").innerHTML = talles.map(t=>`<span class="chip talle-opt" data-talle="${t}">${t}</span>`).join("");
      document.querySelectorAll("#ppTalles .talle-opt").forEach(s=>s.onclick=()=>{
        document.querySelectorAll("#ppTalles .talle-opt").forEach(x=>x.classList.remove("sel"));
        s.classList.add("sel");
        talleSel = s.dataset.talle;
        document.getElementById("ppTalleErr").hidden = true;
      });
    }
    document.getElementById("ppTalleErr").hidden = true;
    const qtyInput = document.getElementById("ppQty");
    qtyInput.value = 1;
    qtyInput.max = stock;
    const stockErr = document.getElementById("ppStockErr");
    const addBtn = document.getElementById("ppAdd");
    if(stock <= 0){
      document.getElementById("ppStock").textContent = "Stock: 0";
      stockErr.hidden = false;
      stockErr.textContent = "✕ Fuera de stock";
      addBtn.disabled = true;
    } else {
      document.getElementById("ppStock").textContent = "Stock: " + stock;
      stockErr.hidden = true;
      addBtn.disabled = false;
    }
    qtyInput.onchange = ()=>{
      let q = Math.max(1, Number(qtyInput.value) || 1);
      if(q > stock){ q = stock; stockErr.hidden = false; stockErr.textContent = "✕ Fuera de stock: máximo " + stock; }
      else stockErr.hidden = true;
      qtyInput.value = q;
    };
    const ppFav = document.getElementById("ppFav");
    ppFav.classList.toggle("on", isFav(p.id));
    ppFav.onclick = ()=>toggleFav(p.id);
    document.getElementById("ppAdd").onclick = ()=>{
      if(talles.length && !talleSel){ document.getElementById("ppTalleErr").hidden = false; return; }
      const q = Math.min(Math.max(1, Number(document.getElementById("ppQty").value) || 1), stock);
      for(let k = 0; k < q; k++) addToCartSilent(p.id, talleSel);
      saveCart();
      openCart();
    };
    showView(["prodpage"]);
    document.title = p.name + " | Acacia Indumentaria";
    if(scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const found = findSub(location.hash);
  const cat = found ? found.cat : r.cat;
  const cfg = MENU.cats[cat] || { label: CAT_META[cat].title, desc: CAT_META[cat].desc, subs: [] };
  let sub = "todos", q = "", sort = "relevancia", title = null;
  if(found && !found.sub.all){
    const isOf = found.sub.href.endsWith("/ofertas");
    if(isOf){ sub = "ofertas"; sort = "menor"; title = found.sub.label; }
    else { sub = found.sub.label; q = found.sub.q || ""; title = found.sub.label; }
  } else if(!found){
    sub = slugToSub(r.cat, r.slug);
    q = (sub === "todos" || sub === "ofertas") ? "" : (SUB_Q[sub] || "");
    sort = sub === "ofertas" ? "menor" : "relevancia";
    title = sub === "todos" ? null : (sub === "ofertas" ? "Ofertas" : sub);
  }
  categoryFilter.value = cat;
  searchInput.value = q;
  sortFilter.value = sort;
  render();
  const t = found && found.sub.all ? null : title;
  document.getElementById("crumbCat").textContent = cfg.label;
  document.getElementById("crumbSubWrap").hidden = !t;
  if(t) document.getElementById("crumbSub").textContent = t;
  document.getElementById("catTitle").textContent = t || cfg.label;
  document.getElementById("catDesc").textContent = cfg.desc || "";
  document.getElementById("catSubs").innerHTML = (cfg.subs || []).map(s=>`<a class="chip" style="text-decoration:none;color:var(--brand)" href="${s.href}">${s.label}</a>`).join("");
  document.getElementById("catCount").textContent = document.getElementById("grid").children.length + " productos";
  page.hidden = false;
  showView(["catpage", "productos"]);
  document.title = document.getElementById("catTitle").textContent + " | Acacia Indumentaria";
  if(scroll) page.scrollIntoView({ behavior: "smooth" });
}
window.addEventListener("hashchange", ()=>{ applyRoute(true); closeMenu(); });

// FINANCIACIÓN por banco/tarjeta - refs 2026 (editables, verificar promos vigentes)
// Interés lo pone el BANCO emisor, no la marca. Marcas: Visa/MC/Amex/Cabal.
// Galicia: TNA 80.28% TEA 117.59% CFT 154.61% (financiación). Promo 3-12 sin interés CFT 0% en adheridos ago-sep 2026.
// Nación: promo 3-20 sin interés CFT 0% hasta 31/08/2026. Resto: TNA ~82.5% ref.
// Naranja X Plan Z: 1-3 CFT 0%, 6+ TNA 84.11% CFT 165.62%.
const TASAS = {
  nx: { sin: [1,2,3], con: [{n:6,tna:84.11,cft:165.62},{n:9,tna:84.11,cft:165.62},{n:12,tna:84.11,cft:165.62}], nota: "Plan Z NX" },
  galicia: { sin: [1,3,6,9,12], con: [{n:18,tna:80.28,cft:154.61}], promo: "Galicia Visa/MC/Amex 3-12 sin interés CFT 0% (promo ago-sep 2026 adheridos)" },
  nacion: { sin: [1,3,6,9,12,18], con: [], promo: "Nación Visa/MC 3-20 sin interés CFT 0% (hasta 31/08/2026)" },
  general: { sin: [1], con: [{n:3,tna:82.5,cft:160},{n:6,tna:82.5,cft:160},{n:9,tna:82.5,cft:160},{n:12,tna:82.5,cft:160}], nota: "Otros bancos: 1 pago sin interés, resto con interés ref TNA 82.5%" }
};
const FIN = {
  sinInteres: [1, 2, 3],
  conInteres: [
    { n: 6, tna: 84.11, cftTea: 165.62 },
    { n: 9, tna: 84.11, cftTea: 165.62 },
    { n: 12, tna: 84.11, cftTea: 165.62 }
  ]
};
function getFinParaTarjeta(){
  const brand = (document.getElementById("cardBrand")?.value || "").toLowerCase();
  const bank = (document.getElementById("cardBank")?.value || "").toLowerCase();
  if(brand.includes("naranja")) return TASAS.nx;
  if(bank.includes("galicia") && (brand.includes("visa")||brand.includes("master")||brand.includes("amex"))) return TASAS.galicia;
  if(bank.includes("naci") && (brand.includes("visa")||brand.includes("master"))) return TASAS.nacion;
  return TASAS.general;
}
let cuotaNxSel = "1 pago";
let cuotaCardSel = "1 pago";
function cuotaFrancesa(total, n, tna){
  if(!tna) return total / n;
  const i = tna/100/12;
  return total * i / (1 - Math.pow(1+i, -n));
}
function renderCuotas(containerId, total, onSelect){
  const box = document.getElementById(containerId);
  if(!box) return;
  box.innerHTML = "";
  const opts = [
    ...FIN.sinInteres.map(n=>({ n, tna:0, sin:true })),
    ...FIN.conInteres.map(o=>({ n:o.n, tna:o.tna, cftTea:o.cftTea, sin:false }))
  ];
  opts.forEach((o, idx)=>{
    const cuota = cuotaFrancesa(total, o.n, o.tna);
    const totalFin = cuota * o.n;
    const label = o.sin
      ? (o.n===1 ? `1 pago de ${fmt(total)} sin interés` : `${o.n} cuotas sin interés de ${fmt(cuota)}`)
      : `${o.n} cuotas con interés de ${fmt(cuota)} (total ${fmt(totalFin)} · CFT ${o.cftTea}% )`;
    const lab = document.createElement("label");
    lab.className = "cuota-opt" + (idx===0 ? " sel" : "");
    lab.innerHTML = `<input type="radio" name="${containerId}" ${idx===0?"checked":""} /> <span>${label}</span>`;
    lab.querySelector("input").onchange = ()=>{ 
      box.querySelectorAll(".cuota-opt").forEach(x=>x.classList.remove("sel"));
      lab.classList.add("sel");
      onSelect(label);
    };
    if(idx===0) onSelect(label);
    box.appendChild(lab);
  });
}
function renderCuotasBanco(total){
  const fin = getFinParaTarjeta();
  const box = document.getElementById("cuotasCard");
  if(!box) return;
  box.innerHTML = "";
  const opts = [
    ...fin.sin.map(n=>({ n, tna:0, sin:true, cft:0 })),
    ...fin.con.map(o=>({ n:o.n, tna:o.tna, sin:false, cft:o.cft }))
  ];
  opts.forEach((o, idx)=>{
    const cuota = cuotaFrancesa(total, o.n, o.tna);
    const totalFin = cuota * o.n;
    const label = o.sin
      ? (o.n===1 ? `1 pago de ${fmt(total)} sin interés` : `${o.n} cuotas sin interés de ${fmt(cuota)} CFT 0%`)
      : `${o.n} cuotas CON interés de ${fmt(cuota)} (total ${fmt(totalFin)} · TNA ${o.tna}% CFT ${o.cft}%)`;
    const lab = document.createElement("label");
    lab.className = "cuota-opt" + (idx===0 ? " sel" : "");
    lab.innerHTML = `<input type="radio" name="cuotasCard" ${idx===0?"checked":""} /> <span>${label}</span>`;
    lab.querySelector("input").onchange = ()=>{
      box.querySelectorAll(".cuota-opt").forEach(x=>x.classList.remove("sel"));
      lab.classList.add("sel");
      cuotaCardSel = label;
      document.getElementById("ckCuotaLine").textContent = label;
    };
    if(idx===0){ cuotaCardSel = label; }
    box.appendChild(lab);
  });
  const promo = fin.promo || fin.nota || "";
  if(promo){
    const p = document.createElement("p");
    p.className = "muted small";
    p.textContent = promo + ". Tasas ref 2026, verificar promo vigente de tu banco.";
    box.appendChild(p);
  }
}
// Entrega estilo captura pero con colores Acacia: domicilio vs retiro
const checkoutModal = document.getElementById("checkoutModal");
let payTab = "card";
let couponDisc = 0;
let couponCode = "";
const SHIP = { retiro: 0, provincia: 2500, pais: 4900 };
let shipMode = "dom";
function getShipCost(){
  if(shipMode === "ret") return 0;
  const cp = (document.getElementById("fCp")?.value || "").trim();
  const prov = document.getElementById("fProv")?.value || "San Juan";
  if(cp.startsWith("54") || prov === "San Juan") return SHIP.provincia;
  return SHIP.pais;
}
function getShipLabel(){
  if(shipMode === "ret") return "Retiro gratis en tienda";
  const cp = (document.getElementById("fCp")?.value || "").trim();
  const prov = document.getElementById("fProv")?.value || "";
  return `Envío a domicilio CP ${cp||"-"} ${prov}`;
}
function updateNxQrDyn(){
  const img = document.getElementById("nxQrDyn");
  const txt = document.getElementById("nxQrDynTxt");
  if(!img) return;
  const grand = getTotal() - Math.round(getTotal()*couponDisc) + getShipCost();
  const info = `ACACIA ${fmt(grand)} | ${cuotaNxSel} | alias ${NX_ALIAS}`;
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(info);
  if(txt) txt.textContent = cuotaNxSel;
}
function updateSummary(){
  const sub = getTotal();
  const disc = Math.round(sub * couponDisc);
  const ship = getShipCost();
  const grand = sub - disc + ship;
  document.getElementById("ckTotal").textContent = fmt(grand);
  document.getElementById("ckSub").textContent = fmt(sub);
  const dr = document.getElementById("ckDiscRow");
  if(dr){ dr.hidden = disc<=0; document.getElementById("ckDisc").textContent = "-"+fmt(disc)+(couponCode?" ("+couponCode+")":""); }
  document.getElementById("ckShip").textContent = ship===0 ? "Gratis" : fmt(ship);
  document.getElementById("ckGrand").textContent = fmt(grand);
  document.getElementById("ckItems").innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    return p ? `${p.name}${i.talle ? " (talle "+i.talle+")" : ""} x${i.qty} — ${fmt(p.price*i.qty)}<br>` : "";
  }).join("") || "Vacío";
  const cuotaTxt = payTab==="card" ? cuotaCardSel : (payTab==="alias" ? "Alias-CBU" : (payTab==="debit" ? "Débito 1 pago" : "Efectivo"));
  document.getElementById("ckCuotaLine").textContent = cuotaTxt;
  // Tarjeta crédito según banco seleccionado. Sin QR.
  renderCuotasBanco(grand);
  if(payTab==="card") document.getElementById("ckCuotaLine").textContent = cuotaCardSel;
  renderMedios(grand);
  return grand;
}
function gotoStep(n){
  ["1","2","3"].forEach(k=>{
    document.getElementById("ck-step"+k).hidden = (k!==String(n));
  });
  document.querySelectorAll(".steps span[data-step]").forEach(s=>s.classList.toggle("active", s.dataset.step==String(n)));
  updateSummary();
}
function getSavedData(){
  try { return JSON.parse(localStorage.getItem("acacia_user") || "{}"); } catch { return {}; }
}
function fillCheckoutForm(d){
  if(!d) return;
  const set = (id, v)=>{ const el=document.getElementById(id); if(el && v) el.value=v; };
  set("fName", d.name); set("fEmail", d.email); set("fDni", d.dni); set("fPhone", d.phone);
  set("fCp", d.cp); set("fCalle", d.calle); set("fNum", d.num); set("fExtra", d.extra);
  set("fDest", d.dest); set("fFecha", d.fecha);
  if(d.prov){ set("fProv", d.prov); const p=document.getElementById("fProv"); if(p) p.dispatchEvent(new Event("change")); }
  set("fCitySel", d.citySel);
  set("fAddr", d.addr); set("fCity", d.city);
  if(typeof validCP==="function") validCP();
}
function openCheckout(){
  document.getElementById("nxAlias").textContent = NX_ALIAS;
  document.getElementById("nxCbu").textContent = NX_CBU;
  const saved = getSavedData();
  const hasSaved = saved && (saved.name || saved.email || saved.phone || saved.dni);
  document.getElementById("savedBar").hidden = !hasSaved;
  // si no hay nada escrito, pre-rellenar silencioso con lo guardado (incluye DNI y teléfono)
  if(hasSaved && !document.getElementById("fName").value && !document.getElementById("fDni").value) fillCheckoutForm(saved);
  gotoStep(1);
  checkoutModal.hidden = false;
  switchPayTab("card");
}
function switchPayTab(tab){
  payTab = tab;
  // acordeón: solo uno abierto (tarjetas + alias, sin QR)
  document.querySelectorAll(".acc-head[data-acc]").forEach(b=>b.classList.toggle("active", b.dataset.acc===tab));
  ["card","alias","debit","cash","coupon"].forEach(k=>{
    const el = document.getElementById("acc-"+k);
    if(el) el.hidden = (k!==tab && !(k==="coupon" && tab==="coupon"));
  });
  updateSummary();
}
document.querySelectorAll(".acc-head[data-acc]").forEach(b=>b.onclick=(e)=>{ e.preventDefault(); const t=b.dataset.acc; if(t==="coupon"){ const el=document.getElementById("acc-coupon"); el.hidden=!el.hidden; return; } switchPayTab(t); });
document.getElementById("closeCheckout").onclick = ()=>checkoutModal.hidden=true;
checkoutModal.addEventListener("click", e=>{ if(e.target===checkoutModal) checkoutModal.hidden=true; });
document.getElementById("ckForm").addEventListener("submit", e=>e.preventDefault());
function ckErr(wrap, valid){
  const w = document.getElementById(wrap);
  if(w){ w.classList.toggle("bad", !valid); const e = w.querySelector(".err"); if(e) e.hidden = !!valid; }
  return !!valid;
}
function validStep1(){
  let ok = true, first = null;
  const need = (wrap, valid)=>{ if(!ckErr(wrap, valid) && !first) first = wrap; ok = ok && valid; };
  need("w-fName", document.getElementById("fName").value.trim().length >= 4);
  need("w-fEmail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("fEmail").value.trim()));
  need("w-fDni", /^\d{7,8}$/.test(document.getElementById("fDni").value.trim()));
  need("w-fPhone", document.getElementById("fPhone").value.replace(/\D/g,"").length >= 8);
  if(first) document.querySelector("#"+first+" input")?.focus();
  return ok;
}
function validStep2(){
  if(shipMode === "ret") return true;
  let ok = true, first = null;
  const need = (wrap, valid)=>{ if(!ckErr(wrap, valid) && !first) first = wrap; ok = ok && valid; };
  need("w-fCalle", document.getElementById("fCalle").value.trim().length >= 3);
  need("w-fNum", document.getElementById("fNum").value.trim().length >= 1);
  need("w-fDest", document.getElementById("fDest").value.trim().length >= 3);
  need("w-fFecha", !!document.getElementById("fFecha").value);
  if(!validCP()) ok = false;
  if(first) document.querySelector("#"+first+" input")?.focus();
  return ok;
}
document.getElementById("toStep2").onclick = ()=>{ if(validStep1()) gotoStep(2); };
document.getElementById("backStep1").onclick = ()=>gotoStep(1);
document.getElementById("toStep3").onclick = ()=>{ if(validStep2()) gotoStep(3); };
document.getElementById("backStep2").onclick = ()=>gotoStep(2);
document.getElementById("fillSaved").onclick = ()=>{ fillCheckoutForm(getSavedData()); };
function setShipMode(m){
  shipMode = m;
  document.getElementById("shipDom").classList.toggle("active", m==="dom");
  document.getElementById("shipRet").classList.toggle("active", m==="ret");
  document.getElementById("shipForm").hidden = (m!=="dom");
  document.getElementById("retiroBox").hidden = (m!=="ret");
  updateSummary();
}
document.getElementById("shipDom").onclick = ()=>setShipMode("dom");
document.getElementById("shipRet").onclick = ()=>setShipMode("ret");
document.getElementById("cpWarnX").onclick = ()=>{ document.getElementById("cpWarn").style.display="none"; };
function validCP(){
  const cp = (document.getElementById("fCp").value||"").trim();
  const ok = /^\d{4}$/.test(cp);
  document.getElementById("cpOk").textContent = ok ? "✅" : "🔴";
  return ok;
}
document.getElementById("fCp").addEventListener("input", ()=>{ validCP(); updateSummary(); });
document.getElementById("fProv").addEventListener("change", updateSummary);
document.getElementById("fCalle").addEventListener("input", e=>{ document.getElementById("vCalle").textContent = e.target.value.trim().length>=3 ? "✅" : "🔴"; });
document.getElementById("fDest").addEventListener("input", e=>{ document.getElementById("vDest").textContent = e.target.value.trim().length>=3 ? "✅" : "🔴"; });
(function(){ const f=document.getElementById("fFecha"); if(f){ const t=new Date(); t.setDate(t.getDate()+1); f.min=t.toISOString().slice(0,10); } })();
function clearPayErrs(){
  document.querySelectorAll(".field.bad").forEach(f=>f.classList.remove("bad"));
  document.querySelectorAll(".field .err").forEach(e=>e.hidden=true);
}
function setErr(base, key, bad){
  const w = document.getElementById("w-"+base+key);
  if(!w) return;
  w.classList.toggle("bad", !!bad);
  const e = w.querySelector(".err");
  if(e) e.hidden = !bad;
}
function validCardFull(base){
  // base: card, db. Solo datos de contacto/factura (NO se piden ni guardan tarjetas). Sin alert, con ✕ inline.
  clearPayErrs();
  const g = s => (document.getElementById(base+s)?.value || "").trim();
  let firstBad = null;
  const need = (key, ok)=>{ setErr(base==="db"?"db":base, key, !ok); if(!ok && !firstBad) firstBad = (base==="db"?"db":base)+key; return ok; };
  const cName = g("Name");
  const cDni = (document.getElementById(base==="db"?"dbDni":"cardDni")?.value||"").trim();
  const cEmail = (document.getElementById(base==="db"?"dbEmail":"cardEmail")?.value||"").trim();
  const cBill = (document.getElementById(base==="db"?"dbBill":"cardBill")?.value||"").trim();
  let ok = true;
  const short = base==="db"?"db":base;
  ok = need("Name", cName.length>=3) && ok;
  const dniOk = /^\d{7,8}$/.test(cDni);
  setErr(short, "Dni", !dniOk); if(!dniOk && !firstBad) firstBad = short+"Dni"; ok = ok && dniOk;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail);
  setErr(short, "Email", !emailOk); if(!emailOk && !firstBad) firstBad = short+"Email"; ok = ok && emailOk;
  const billOk = cBill.length>=5;
  setErr(short, "Bill", !billOk); if(!billOk && !firstBad) firstBad = short+"Bill"; ok = ok && billOk;
  return {ok, last4: "", focus: firstBad, dni: cDni, email: cEmail, bill: cBill};
}
function validCard(base){
  // compat vieja: delega a full pero sin DNI extra para no romper
  const r = validCardFull(base==="db"?"db":base);
  return r.ok ? {ok:true, last4:r.last4} : {ok:false, msg:"Revisá los campos marcados con ✕", focus:r.focus};
}
function fmtCardNum(el){ el.value = el.value.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 "); }
function fmtExp(el){ let v=el.value.replace(/\D/g,"").slice(0,4); if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); el.value=v; }
// Comprime fotos del celu antes de subir (máx 1600px, JPG 82%)
function compressImg(file){
  return new Promise((res, rej)=>{
    if(!file.type.startsWith("image/")) return rej(new Error("img"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{
      const max = 1600;
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * sc), h = Math.round(img.height * sc);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob(b=>b ? res(new File([b], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })) : rej(new Error("img")), "image/jpeg", 0.82);
    };
    img.onerror = ()=>rej(new Error("img"));
    img.src = url;
  });
}
["cardNumber","nxCardNumber","dbNumber"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("input", ()=>fmtCardNum(el)); });
["cardDni","nxDni","dbDni","fDni"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("input", ()=>{ el.value=el.value.replace(/\D/g,"").slice(0,8); }); });
document.querySelectorAll(".field input").forEach(inp=>inp.addEventListener("input", ()=>{ const w=inp.closest(".field"); if(w){ w.classList.remove("bad"); const e=w.querySelector(".err"); if(e) e.hidden=true; } }));
["cardExp","nxCardExp","dbExp"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("input", ()=>fmtExp(el)); });
["dbCvv","nxCardCvv","cardCvv"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("input", ()=>{ el.value=el.value.replace(/\D/g,"").slice(0,4); }); });
document.getElementById("applyCoupon").onclick = async ()=>{
  const c = (document.getElementById("couponCode").value||"").trim().toUpperCase();
  let email = "";
  try { email = JSON.parse(localStorage.getItem("acacia_member")||"null")?.email || ""; } catch {}
  // fallback backend, si no hay backend usa local
  try {
    const r = await fetch(AUTH_URL+"/api/promos/validate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:c,email})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    couponDisc = d.desc; couponCode = d.code;
    alert(`Cupón ${d.code} aplicado (${Math.round(d.desc*100)}% off)`);
  } catch(err) {
    if(c==="ACACIA10"){ couponDisc=0.10; couponCode=c; alert("Cupón 10% aplicado (local)"); }
    else if(c==="MIEMBRO15" && email){ couponDisc=0.15; couponCode=c; alert("Cupón miembro 15% aplicado (local)"); }
    else { couponDisc=0; couponCode=""; alert("✕ "+err.message); }
  }
  updateSummary();
};
function doConfirm(){
  // Obligatorio tarjeta en crédito y débito. Alias y efectivo no piden tarjeta.
  let last4 = "", payExtra = "";
  if(payTab === "card"){
    const v = validCardFull("card");
    if(!v.ok){ switchPayTab("card"); document.getElementById(v.focus)?.scrollIntoView({block:"center"}); document.getElementById(v.focus)?.focus(); return; }
    last4 = v.last4; payExtra = ` DNI pagador ${v.dni} Factura ${v.bill} Email ${v.email}`;
  }
  if(payTab === "debit"){
    const v = validCardFull("db");
    if(!v.ok){ switchPayTab("debit"); document.getElementById(v.focus)?.scrollIntoView({block:"center"}); document.getElementById(v.focus)?.focus(); return; }
    last4 = v.last4; payExtra = ` DNI pagador ${v.dni} Factura ${v.bill} Email ${v.email}`;
  }
  const data = {
    name: document.getElementById("fName").value.trim(),
    email: document.getElementById("fEmail").value.trim(),
    dni: document.getElementById("fDni").value.trim(),
    phone: document.getElementById("fPhone").value.trim(),
    cp: document.getElementById("fCp")?.value.trim() || "",
    calle: document.getElementById("fCalle")?.value.trim() || "",
    num: document.getElementById("fNum")?.value.trim() || "",
    extra: document.getElementById("fExtra")?.value.trim() || "",
    dest: document.getElementById("fDest")?.value.trim() || "",
    prov: document.getElementById("fProv")?.value || "",
    citySel: document.getElementById("fCitySel")?.value || "",
    fecha: document.getElementById("fFecha")?.value || "",
    addr: "",
    city: ""
  };
  data.addr = [data.calle, data.num, data.extra].filter(Boolean).join(" ") || "-";
  data.city = [data.citySel, data.prov, data.cp].filter(Boolean).join(" ") || "-";
  // guardar siempre DNI y teléfono si hay algo (para rellenar rápido la próxima)
  if(document.getElementById("saveData").checked && (data.name || data.email || data.phone || data.dni)) {
    localStorage.setItem("acacia_user", JSON.stringify(data));
  }
  const sub = getTotal();
  const disc = Math.round(sub * couponDisc);
  const grand = sub - disc + getShipCost();
  const name = data.name || "-";
  const email = data.email || "-";
  const dni = data.dni || "-";
  const phone = data.phone || "-";
  const addr = data.addr || "-";
  const city = data.city || "-";
  const brand = (document.getElementById("cardBrand")||{}).value || "";
  const cuotaTxt = payTab==="card" ? (brand+" "+cuotaCardSel) : (payTab==="alias" ? "Alias-CBU acacia.2026" : (payTab==="debit" ? "Débito 1 pago" : "Efectivo"));
  const lines = [
    "NUEVO PEDIDO ACACIA:",
    ...cart.map(i=>{ const p=PRODUCTS.find(x=>x.id===i.id); return p ? `- ${p.name}${i.talle ? " (talle "+i.talle+")" : ""} x${i.qty} = ${fmt(p.price*i.qty)}` : ""; }),
    `Subtotal: ${fmt(sub)}`,
    ...(disc>0 ? [`Descuento ${couponCode}: -${fmt(disc)}`] : []),
    `Entrega: ${getShipLabel()} ${fmt(getShipCost())}`,
    `Dirección: ${addr} - ${city} Dest: ${data.dest||"-"} Fecha: ${data.fecha||"-"}`,
    `Cliente: ${name} DNI ${dni} Tel ${phone} Email ${email}`,
    `Pago: ${cuotaTxt}${last4 ? " (terminada "+last4+")" : ""}${payExtra ? " |"+payExtra : ""}`,
    `Total: ${fmt(grand)}`,
    payTab==="alias" ? `Destino alias ${NX_ALIAS} CBU ${NX_CBU}. Mando comprobante.` : ""
  ];
  window.open("https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMBER + "&text=" + encodeURIComponent(lines.join("\n")), "_blank");
  // Puntos + pedido guardado (solo con backend). No bloquea si falla.
  if(!BACKEND_ENABLED) { /* fase 1 estática: solo WhatsApp */ }
  else try {
    const em = memberEmail() || data.email;
    if(em) fetch(AUTH_URL+"/api/pedido/cerrar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em.toLowerCase(),total:grand,cupon:couponCode,provincia:data.prov||"",items:cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return p?{id:p.id,n:i.qty,t:i.talle||"",pr:p.price}:null})})}).then(()=>refreshMemberZone()).catch(()=>{});
  } catch {}
  // Pantalla gracias + resumen (sin datos sensibles de tarjeta)
  document.getElementById("thanksDetail").innerHTML =
    lines.slice(1).map(l=>l.replace(/</g,"&lt;")).join("<br>");
  document.getElementById("thanksDetail").hidden = true;
  document.getElementById("viewSummary").textContent = "Ver tu Resumen de Pago";
  checkoutModal.hidden = true;
  document.getElementById("thanksModal").hidden = false;
  cart = []; saveCart();
};
document.getElementById("confirmOrder").onclick = ()=>doConfirm();
document.getElementById("confirmOrderSide").onclick = ()=>doConfirm();
document.getElementById("viewSummary").onclick = ()=>{
  const d = document.getElementById("thanksDetail");
  d.hidden = !d.hidden;
  document.getElementById("viewSummary").textContent = d.hidden ? "Ver tu Resumen de Pago" : "Ocultar Resumen";
};
document.getElementById("keepBuying").onclick = ()=>{
  document.getElementById("thanksModal").hidden = true;
  document.getElementById("overlay").hidden = true;
  document.getElementById("checkoutModal").hidden = true;
  document.getElementById("productos")?.scrollIntoView({behavior:"smooth"});
};
// Textos editables del sitio (principal + contacto). Se aplican al cargar.
const TEXTOS_INICIO = [
  ["topbar", "Cartel superior", "tTopbar", "topbar"],
  ["heroEyebrow", "Ojo (arriba del título)", "tHeroEyebrow", "eyebrow"],
  ["heroTitle", "Título principal", "tHeroTitle", "title"],
  ["heroSub", "Subtítulo", "tHeroSub", "sub"],
  ["membTitle", "Título banner miembros", "tMembTitle", "darktitle"],
  ["membPerks", "Beneficios miembros", "tMembPerks", "dark"],
  ["promoTitle", "Cartel registro (título)", "tPromoTitle", "plain"],
  ["promoSub", "Cartel registro (texto)", "tPromoSub", "plain"]
];
const TEXTOS_CONTACTO = [
  ["contTitle", "Título", "tContTitle", "title"],
  ["contSub", "Subtítulo", "tContSub", "sub"],
  ["contEmail", "Email mostrado", "tContEmail", "plain"],
  ["contInsta", "Instagram mostrado", "tContInsta", "plain"]
];
async function loadTextos(){
  try {
    const r = await fetch(AUTH_URL+"/api/ajustes");
    const d = await r.json();
    if(!r.ok) return;
    const all = [...TEXTOS_INICIO, ...TEXTOS_CONTACTO];
    all.forEach(([clave,, elId])=>{
      if(d.ajustes[clave] !== undefined){
        const el = document.getElementById(elId);
        if(el) el.innerHTML = d.ajustes[clave];
      }
    });
  } catch {}
}
function paintTextEditor(boxId, defs){
  const box = document.getElementById(boxId);
  box.innerHTML = defs.map(([clave, label, elId, kind])=>{
    const cur = (document.getElementById(elId)?.innerText || "").trim();
    const rows = cur.length > 60 ? 3 : 1;
    return `<div class="adm-prod"><div class="adm-fields">
      <strong>${label}</strong>
      <span class="muted small">Así se ve ahora:</span>
      <div class="pv pv-${kind || "plain"}">${cur.replace(/</g,"&lt;").replace(/\n/g,"<br>")}</div>
      <textarea data-tkey="${clave}" rows="${rows}">${cur.replace(/</g,"&lt;")}</textarea>
    </div></div>`;
  }).join("");
}
function escHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
async function saveTextos(boxId, msgId){
  const data = {};
  document.querySelectorAll(`#${boxId} [data-tkey]`).forEach(i=>data[i.dataset.tkey] = escHtml(i.value).replace(/\n/g,"<br>"));
  const m = document.getElementById(msgId);
  m.textContent = "Guardando...";
  try {
    const r = await fetch(AUTH_URL+"/api/admin/ajustes",{method:"PUT",headers:admHeaders(),body:JSON.stringify(data)});
    if(!r.ok) throw new Error();
    Object.entries(data).forEach(([k,v])=>{
      const def = [...TEXTOS_INICIO, ...TEXTOS_CONTACTO].find(d=>d[0]===k);
      if(def){ const el = document.getElementById(def[2]); if(el) el.innerHTML = v; }
    });
    m.textContent = "Guardado ✓ ya se ve en la tienda";
  } catch { m.textContent = "Error (¿sesión vencida?)"; }
}
document.getElementById("saveInicio").onclick = ()=>saveTextos("editInicioFields","saveInicioMsg");
document.getElementById("saveContacto").onclick = ()=>saveTextos("editContactoFields","saveContactoMsg");
// Editor del menú lateral (apartados)
function paintMenuEditor(){
  const box = document.getElementById("menuEditor");
  const tops = MENU.top.filter(t=>!t.menu);
  box.innerHTML =
    `<div class="adm-prod"><div class="adm-fields">
      <strong>Apartados de arriba</strong>
      ${tops.map((t,i)=>`<div class="row2"><label>Nombre<input data-mtop="${i}" value="${t.label.replace(/"/g,"&quot;")}" /></label><div style="display:flex;gap:6px;align-items:end"><label style="flex:1">Link<input data-mhref="${i}" value="${t.href}" /></label><button type="button" class="btn ghost" data-mdel="${i}" title="Eliminar">✕</button></div></div>`).join("")}
      <div class="row2"><input id="mNewLabel" placeholder="Nuevo apartado..." /><input id="mNewHref" placeholder="Link ej #/ofertas" /></div>
      <div><button type="button" id="mAddTop" class="btn ghost">+ Agregar apartado</button></div>
    </div></div>` +
    Object.entries(MENU.cats).map(([key,c])=>`
      <div class="adm-prod"><div class="adm-fields">
        <label>Nombre de la sección<input data-mcat="${key}" value="${c.label.replace(/"/g,"&quot;")}" /></label>
        <span class="muted small">Apartados de ${c.label}:</span>
        ${(c.subs||[]).map((s,j)=>`<div class="row2"><label>Apartado<input data-msub="${key}:${j}" value="${s.label.replace(/"/g,"&quot;")}" /></label><div style="display:flex;gap:6px;align-items:end"><label style="flex:1">Filtro<input data-msubq="${key}:${j}" value="${s.q||""}" placeholder="ej pollera (vacío = ver todo)" /></label><button type="button" class="btn ghost" data-msubdel="${key}:${j}" title="Eliminar">✕</button></div></div>`).join("")}
        <div class="row2"><input id="mNewSub-${key}" placeholder="Nuevo apartado..." /><button type="button" class="btn ghost" data-msubadd="${key}">+ Agregar</button></div>
      </div></div>`).join("");
  document.getElementById("mAddTop").onclick = ()=>{
    const l = document.getElementById("mNewLabel").value.trim(), h = document.getElementById("mNewHref").value.trim() || "#inicio";
    if(l){ MENU.top.push({ label: l, href: h }); paintMenuEditor(); }
  };
  box.querySelectorAll("[data-mdel]").forEach(b=>b.onclick=()=>{
    const items = MENU.top.filter(t=>!t.menu);
    items.splice(Number(b.dataset.mdel), 1);
    const prod = MENU.top.find(t=>t.menu) || defaultMenu().top.find(t=>t.menu);
    MENU.top = [items[0] || { label: "Inicio", href: "#inicio" }, prod, ...items.slice(1)];
    paintMenuEditor();
  });
  Object.keys(MENU.cats).forEach(key=>{
    const add = document.querySelector(`[data-msubadd="${key}"]`);
    if(add) add.onclick = ()=>{
      const v = document.getElementById(`mNewSub-${key}`).value.trim();
      if(!v) return;
      MENU.cats[key].subs.push({ label: v, href: `#/${key}/` + v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]+/g,""), q: "" });
      paintMenuEditor();
    };
  });
  box.querySelectorAll("[data-msubdel]").forEach(b=>b.onclick=()=>{
    const [key, j] = b.dataset.msubdel.split(":");
    MENU.cats[key].subs.splice(Number(j), 1);
    paintMenuEditor();
  });
}
document.getElementById("saveMenu").onclick = async ()=>{
  const msg = document.getElementById("saveMenuMsg");
  // leer apartados de arriba (Productos queda fijo segundo)
  const items = [];
  document.querySelectorAll("#menuEditor [data-mtop]").forEach(inp=>{
    const i = Number(inp.dataset.mtop);
    items[i] = { label: inp.value.trim(), href: document.querySelector(`[data-mhref="${i}"]`).value.trim() || "#inicio" };
  });
  const clean = items.filter(t=>t && t.label);
  const prod = MENU.top.find(t=>t.menu) || defaultMenu().top.find(t=>t.menu);
  MENU.top = [clean[0] || { label: "Inicio", href: "#inicio" }, prod, ...clean.slice(1)];
  // leer secciones y apartados
  Object.keys(MENU.cats).forEach(key=>{
    const lab = document.querySelector(`[data-mcat="${key}"]`);
    if(lab && lab.value.trim()) MENU.cats[key].label = lab.value.trim();
    MENU.cats[key].subs.forEach((s,j)=>{
      const li = document.querySelector(`[data-msub="${key}:${j}"]`);
      const qi = document.querySelector(`[data-msubq="${key}:${j}"]`);
      if(li && li.value.trim()){
        s.label = li.value.trim();
        s.href = s.all ? `#/${key}` : (s.href.endsWith("/ofertas") ? s.href : `#/${key}/` + s.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]+/g,""));
        if(qi) s.q = qi.value.trim();
      }
    });
  });
  msg.textContent = "Guardando...";
  try {
    const r = await fetch(AUTH_URL+"/api/admin/ajustes",{method:"PUT",headers:admHeaders(),body:JSON.stringify({ menu: JSON.stringify(MENU) })});
    if(!r.ok) throw new Error();
    renderMenus();
    msg.textContent = "Menú guardado ✓ ya se ve en la tienda";
  } catch { msg.textContent = "Error (¿sesión vencida?)"; }
};
function renderMedios(total){
  const box = document.getElementById("mediosTable");
  if(!box) return;
  const c3 = cuotaFrancesa(total, 3, 0);
  const c6nx = cuotaFrancesa(total, 6, 84.11);
  box.innerHTML =
   `<div class="cuota-opt"><span><strong>Naranja X Plan Z</strong><br>1-3 sin interés de ${fmt(c3)} CFT 0% · 6 con interés de ${fmt(c6nx)} TNA 84.11% CFT 165.62%</span></div>` +
   `<div class="cuota-opt"><span><strong>Galicia Visa / Master / Amex</strong><br>3,6,9,12 sin interés CFT 0% en promo adheridos (ago-sep 2026) · 18 con TNA 80.28% CFT 154.61%. Financiación saldos TNA 80.28% TEA 117.59%.</span></div>` +
   `<div class="cuota-opt"><span><strong>Nación Visa / Master</strong><br>3,6,9,12,18 sin interés CFT 0% (hasta 31/08/2026) · resto con interés del banco.</span></div>` +
   `<div class="cuota-opt"><span><strong>Otras Visa / Master / Amex / Cabal crédito</strong><br>1 pago sin interés · 3-12 con interés ref TNA 82.5% (Santander TNA 77.9-82.5%). Cabal débito solo 1 pago.</span></div>` +
   `<p class="muted small">El interés lo define tu banco emisor, no la marca. Verificá promos vigentes en tu banco. Efectivo: Pago Fácil / Rapipago / retiro. QR NX alias ${NX_ALIAS}.</p>`;
}
document.getElementById("verMedios").onclick = (e)=>{ e.preventDefault(); updateSummary(); document.getElementById("mediosModal").hidden=false; };
document.getElementById("closeMedios").onclick = ()=>document.getElementById("mediosModal").hidden=true;
function copyText(t, msg){
  navigator.clipboard?.writeText(t).then(()=>alert(msg || ("Copiado: "+t))).catch(()=>prompt("Copiá:", t));
}
document.getElementById("copyAlias").onclick = ()=>copyText(NX_ALIAS, "Alias copiado: "+NX_ALIAS);
document.getElementById("copyCbu").onclick = ()=>copyText(NX_CBU, "CBU copiado");

// modal
const modal = document.getElementById("productModal");
function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  currentModalId = id;
  document.getElementById("mImg").src = p.img || placeholderImg(p.name);
  document.getElementById("mName").textContent = p.name;
  document.getElementById("mDesc").textContent = p.desc;
  document.getElementById("mPrice").textContent = fmt(p.price);
  modal.hidden = false;
}
document.getElementById("closeModal").onclick = ()=>modal.hidden=true;
modal.addEventListener("click", e=>{ if(e.target===modal) modal.hidden=true; });
document.getElementById("mAdd").onclick = ()=>{ if(currentModalId){ addToCart(currentModalId); modal.hidden=true; } };

// contacto -> whatsapp
document.getElementById("contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  const n = document.getElementById("cName").value;
  const m = document.getElementById("cMsg").value;
  window.open("https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMBER + "&text=" + encodeURIComponent("Hola, soy "+n+": "+m),"_blank");
});
document.getElementById("waNumberText").textContent = "+549 264 587 4999 / +549 264 506 3736";

// --- Auth estilo Nike + MySQL ---
let authEmail = "", authTimerInt = null;
function setAuthErr(inputId, wrapId, bad){
  const w = document.getElementById(wrapId);
  if(w){ w.classList.toggle("bad", !!bad); const e=w.querySelector(".err"); if(e) e.hidden=!bad; }
}
function paintMember(){
  try {
    const m = JSON.parse(localStorage.getItem("acacia_member")||"null");
    if(m?.nombre){
      document.getElementById("authState").textContent = `Hola, ${m.nombre} ✓ Miembro -15% con MIEMBRO15`;
      document.getElementById("accountName").textContent = m.nombre.split(" ")[0];
      document.getElementById("accountBtn").title = `${m.nombre} ${m.apellido||""} - ${m.email||""} (clic para salir)`;
    } else {
      document.getElementById("authState").textContent = "";
      document.getElementById("accountName").textContent = "";
      document.getElementById("accountBtn").title = "Registrate / Login";
    }
  } catch {}
  refreshMemberZone();
}
function memberEmail(){ try { return JSON.parse(localStorage.getItem("acacia_member")||"null")?.email || ""; } catch { return ""; } }
async function refreshMemberZone(){
  if(!BACKEND_ENABLED) return;
  const em = memberEmail();
  document.getElementById("guestBox").hidden = !!em;
  document.getElementById("memberBox").hidden = !em;
  if(!em) return;
  try {
    const r = await fetch(AUTH_URL+"/api/miembro/resumen?email="+encodeURIComponent(em));
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    document.getElementById("myPoints").textContent = d.puntos;
    document.getElementById("myCoupons").innerHTML = d.cupones.length
      ? d.cupones.map(c=>`<div class="cuota-opt"><span><strong>${c.codigo}</strong> ${Math.round(c.descuento*100)}% off ${c.usado?"(usado)":""} ${c.usado?"":`<button type="button" class="btn ghost" data-usecoupon="${c.codigo}">Usar</button>`}</span></div>`).join("")
      : "Todavía no tenés cupones. Te avisamos por acá cuando te demos uno.";
    document.querySelectorAll("[data-usecoupon]").forEach(b=>b.onclick=()=>{
      document.getElementById("couponCode").value = b.dataset.usecoupon;
      document.getElementById("checkoutModal").hidden = false;
      gotoStep(3);
      document.getElementById("applyCoupon").click();
      document.getElementById("miembros").scrollIntoView({behavior:"smooth"});
    });
  } catch { document.getElementById("myCoupons").textContent = "Backend no disponible."; }
}
document.getElementById("refreshPoints").onclick = refreshMemberZone;
document.getElementById("logoutBtn").onclick = ()=>{
  localStorage.removeItem("acacia_member");
  sessionStorage.removeItem("acacia_admin");
  document.getElementById("authState").textContent = "";
  showAdmin(false);
  paintMember();
  document.getElementById("inicio")?.scrollIntoView({behavior:"smooth"});
};
document.getElementById("cpGive").onclick = async ()=>{
  const msg = document.getElementById("cpMsg");
  try {
    const scope = document.getElementById("cpScope").value;
    const email = scope === "email" ? document.getElementById("cpEmail").value.trim().toLowerCase() : "";
    if(scope === "email" && !email){ msg.textContent = "✕ Poné el email"; return; }
    const r = await fetch(AUTH_URL+"/api/admin/cupon",{method:"POST",headers:admHeaders(),body:JSON.stringify({email,codigo:document.getElementById("cpCode").value.trim().toUpperCase(),descuento:Number(document.getElementById("cpDesc").value),soloMiembros:scope==="miembros"})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    msg.textContent = "Cupón creado ✓";
    loadCupones();
  } catch(err) { msg.textContent = "✕ "+err.message; }
};
async function loadCupones(){
  const act = document.getElementById("cpActive"), ina = document.getElementById("cpInactive");
  try {
    const r = await fetch(AUTH_URL+"/api/admin/cupones",{headers:admHeaders()});
    const d = await r.json();
    if(r.status === 401){
      act.innerHTML = "<p class='muted'>Sesión vencida (se reinició el servidor). Salí con Cerrar sesión y volvé a entrar como admin.</p>";
      ina.innerHTML = "";
      return;
    }
    if(!r.ok) throw new Error(d.error||"Error");
    const badge = c => c.usado ? "<span class='chip'>Usado</span>" : (c.activo ? "<span class='chip' style='background:#e6f4ea;border-color:#b7e0c2'>Activo</span>" : "<span class='chip'>Inactivo</span>");
    const dest = c => c.email ? `Solo ${c.email}` : (c.solo_miembros ? "Solo miembros" : "Para todos");
    const card = c=>`<div class="adm-prod"><div class="adm-fields">
      <div style="display:flex;gap:8px;align-items:center"><strong style="font-size:1.1rem">${c.codigo}</strong>${badge(c)}<span class="muted small">${Math.round(c.descuento*100)}% · ${dest(c)}</span></div>
      <div class="row2"><label>Código<input data-ccode="${c.id}" value="${c.codigo}" /></label>
      <label>Descuento (0-1)<input data-cdesc="${c.id}" value="${c.descuento}" /></label></div>
      <div class="row2"><label>Para (email o vacío)<input data-cmail="${c.id}" value="${c.email||""}" placeholder="vacío = general" /></label>
      <label>Alcance<select data-csolo="${c.id}"><option value="0">Para todos</option><option value="1" ${c.solo_miembros?"selected":""}>Solo miembros</option></select></label></div>
      <div class="row2"><label>Estado<select data-cact="${c.id}"><option value="1">Activo</option><option value="0" ${!c.activo?"selected":""}>Inactivo</option></select></label>
      <label>&nbsp;<span class="muted small">${c.usado?"Ya usado por un cliente":"Sin usar"}</span></label></div>
      <div class="adm-photo-row"><button type="button" class="btn primary" data-csave="${c.id}">Guardar cambios</button>
      <button type="button" class="btn ghost" data-cdel="${c.id}">Borrar cupón</button></div>
      <span class="muted small" data-cmsg="${c.id}"></span></div></div>`;
    act.innerHTML = d.cupones.filter(c=>c.activo && !c.usado).map(card).join("") || "<p class='muted'>No hay activos.</p>";
    ina.innerHTML = d.cupones.filter(c=>!c.activo || c.usado).map(card).join("") || "<p class='muted'>No hay inactivos.</p>";
    const q = (s,id)=>document.querySelector(`[data-c${s}="${id}"]`);
    document.querySelectorAll("[data-csave]").forEach(b=>b.onclick=async ()=>{
      const id = b.dataset.csave;
      const m = document.querySelector(`[data-cmsg="${id}"]`);
      const rr = await fetch(AUTH_URL+"/api/admin/cupones/"+id,{method:"PUT",headers:admHeaders(),body:JSON.stringify({codigo:q("code",id).value.trim().toUpperCase(),descuento:Number(q("desc",id).value),email:q("mail",id).value.trim().toLowerCase(),solo_miembros:Number(q("solo",id).value),activo:Number(q("act",id).value)})});
      m.textContent = rr.ok ? "Guardado ✓" : "Error";
      if(rr.ok) loadCupones();
    });
    document.querySelectorAll("[data-cdel]").forEach(b=>b.onclick=async ()=>{
      if(!confirm("¿Borrar cupón?")) return;
      await fetch(AUTH_URL+"/api/admin/cupones/"+b.dataset.cdel,{method:"DELETE",headers:admHeaders()});
      loadCupones();
    });
  } catch { if(act){ act.innerHTML = "<p class='muted'>No se pudo cargar. Revisá que el backend esté corriendo.</p>"; ina.innerHTML = ""; } }
}
document.querySelectorAll("[data-disc]").forEach(b=>b.onclick=()=>{ document.getElementById("cpDesc").value = b.dataset.disc; });
function getSavedEmail(){
  try {
    const m = JSON.parse(localStorage.getItem("acacia_member")||"null");
    if(m?.email) return m.email;
  } catch {}
  try {
    const u = JSON.parse(localStorage.getItem("acacia_user")||"{}");
    if(u?.email) return u.email;
  } catch {}
  return "";
}
function openAuthModal(){
  document.getElementById("authModal").hidden = false;
  showAuthTab("reg");
  clearAuthErrs();
  const saved = getSavedEmail();
  if(saved && !document.getElementById("rEmail").value) document.getElementById("rEmail").value = saved;
}
function showAuthTab(t){
  document.getElementById("regForm").hidden = t!=="reg";
  document.getElementById("loginForm").hidden = t!=="login";
  document.getElementById("forgotForm").hidden = t!=="forgot";
}
document.getElementById("tabReg").onclick = ()=>showAuthTab("reg");
document.getElementById("tabLogin").onclick = ()=>showAuthTab("login");
document.getElementById("forgotLink").onclick = e=>{ e.preventDefault(); showAuthTab("forgot"); const m=getSavedEmail(); if(m) document.getElementById("fRecEmail").value=m; };
document.getElementById("forgotBack").onclick = e=>{ e.preventDefault(); showAuthTab("login"); };
document.getElementById("forgotSend").onclick = async ()=>{
  const em = document.getElementById("fRecEmail").value.trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  setRegErr("w-fEmail", ok);
  if(!ok) return;
  const msg = document.getElementById("forgotMsg");
  msg.textContent = "Enviando código a tu Gmail...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/forgot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    msg.textContent = "Código enviado. Revisá tu Gmail (y spam).";
  } catch(err) { msg.textContent = "✕ " + err.message; }
};
document.getElementById("forgotSave").onclick = async ()=>{
  const em = document.getElementById("fRecEmail").value.trim().toLowerCase();
  const code = document.getElementById("fRecCode").value.trim();
  const np = document.getElementById("fRecPass").value;
  let ok = true;
  ok = setRegErr("w-fCode", /^\d{6}$/.test(code)) && ok;
  ok = setRegErr("w-fPass", np.length>=6) && ok;
  if(!ok) return;
  const msg = document.getElementById("forgotMsg");
  msg.textContent = "Guardando...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,codigo:code,password:np})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    msg.textContent = "Contraseña cambiada. Entrá con la nueva.";
    showAuthTab("login");
    document.getElementById("lUser").value = em;
  } catch(err) { msg.textContent = "✕ " + err.message; }
};
document.getElementById("openAuth").onclick = openAuthModal;
document.getElementById("accountBtn").onclick = e=>{
  e.stopPropagation();
  let logged = isAdmin();
  if(!logged){
    try { logged = !!JSON.parse(localStorage.getItem("acacia_member")||"null")?.email; } catch {}
  }
  if(!logged){ openAuthModal(); return; }
  const menu = document.getElementById("accountMenu");
  menu.hidden = !menu.hidden;
};
document.addEventListener("click", e=>{
  const menu = document.getElementById("accountMenu");
  if(menu && !menu.hidden && !e.target.closest("#accountMenu") && !e.target.closest("#accountBtn")) menu.hidden = true;
});
document.getElementById("menuLogout").onclick = ()=>{
  localStorage.removeItem("acacia_member");
  sessionStorage.removeItem("acacia_admin");
  document.getElementById("accountMenu").hidden = true;
  document.getElementById("authState").textContent = "";
  showAdmin(false);
  paintMember();
  location.hash = "";
  showView(["inicio", "shopBanner", "categorias", "productos", "memberBanner", "pagos"]);
};
document.getElementById("closeAuth").onclick = ()=>document.getElementById("authModal").hidden=true;
function setRegErr(wrap, valid){ const w=document.getElementById(wrap); if(w){ w.classList.toggle("bad",!valid); const e=w.querySelector(".err"); if(e) e.hidden=!!valid; } return !!valid; }
function clearAuthErrs(){ document.querySelectorAll("#authModal .field.bad").forEach(f=>f.classList.remove("bad")); document.querySelectorAll("#authModal .field .err").forEach(e=>e.hidden=true); document.getElementById("regMsg").textContent=""; document.getElementById("loginMsg").textContent=""; }
// disponibilidad de usuario al escribir
let userTimer = null;
document.getElementById("rUser").addEventListener("input", ()=>{
  clearTimeout(userTimer);
  const u = document.getElementById("rUser").value.trim().toLowerCase();
  const avail = document.getElementById("userAvail");
  if(!/^[a-z0-9_.]{4,30}$/.test(u)){ avail.textContent = ""; return; }
  userTimer = setTimeout(async ()=>{
    try {
      const r = await fetch(AUTH_URL+"/api/auth/check-user?u="+encodeURIComponent(u));
      const d = await r.json();
      avail.textContent = d.disponible ? "✓ Usuario disponible" : "✕ Usuario ocupado";
    } catch { avail.textContent = ""; }
  }, 400);
});
["rDni"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("input",()=>{ el.value=el.value.replace(/\D/g,"").slice(0,8); }); });
document.getElementById("regForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  let ok = true;
  ok = setRegErr("w-rNombre", v("rNombre").length>=2) && ok;
  ok = setRegErr("w-rApellido", v("rApellido").length>=2) && ok;
  ok = setRegErr("w-rDni", /^\d{7,8}$/.test(v("rDni"))) && ok;
  ok = setRegErr("w-rTel", v("rTel").replace(/\D/g,"").length>=8) && ok;
  ok = setRegErr("w-rEmail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("rEmail").toLowerCase())) && ok;
  ok = setRegErr("w-rUser", /^[a-z0-9_.]{4,30}$/.test(v("rUser").toLowerCase())) && ok;
  ok = setRegErr("w-rPass", v("rPass").length>=6) && ok;
  ok = setRegErr("w-rPass2", v("rPass2")===v("rPass") && v("rPass2").length>=6) && ok;
  const msg = document.getElementById("regMsg");
  if(!document.getElementById("rTerms").checked){ msg.textContent = "✕ Aceptá la política y términos"; return; }
  if(!ok) return;
  msg.textContent = "Creando cuenta...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:v("rNombre"),apellido:v("rApellido"),dni:v("rDni"),telefono:v("rTel"),email:v("rEmail").toLowerCase(),usuario:v("rUser").toLowerCase(),password:v("rPass")})});
    const data = await r.json();
    if(!r.ok) throw new Error(data.error||"Error");
    localStorage.setItem("acacia_member", JSON.stringify(data.user));
    msg.textContent = "Cuenta creada. ¡Bienvenidx!";
    paintMember();
    if(!document.getElementById("fName").value) document.getElementById("fName").value = data.user.nombre+" "+data.user.apellido;
    if(!document.getElementById("fEmail").value) document.getElementById("fEmail").value = data.user.email;
    setTimeout(()=>document.getElementById("authModal").hidden=true, 900);
  } catch(err) {
    const m = String(err.message||"");
    msg.textContent = "✕ " + (m.includes("Failed to fetch") ? "Backend no responde en "+AUTH_URL+" (npm run dev)" : m);
  }
});
document.getElementById("loginForm").addEventListener("submit", async e=>{  e.preventDefault();
  const l = document.getElementById("lUser").value.trim().toLowerCase();
  const p = document.getElementById("lPass").value;
  const msg = document.getElementById("loginMsg");
  if(!l || !p){ msg.textContent = "✕ Completá usuario y contraseña"; return; }
  msg.textContent = "Entrando...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({login:l,password:p})});
    const data = await r.json();
    if(!r.ok) throw new Error(data.error||"Error");
    localStorage.setItem("acacia_member", JSON.stringify(data.user));
    msg.textContent = "¡Hola de nuevo!";
    if(data.admin && data.token){
      sessionStorage.setItem("acacia_admin", data.token);
      document.getElementById("authModal").hidden = true;
      showAdmin(true);
      return;
    }
    paintMember();
    setTimeout(()=>document.getElementById("authModal").hidden=true, 700);
  } catch(err) { msg.textContent = "✕ " + err.message; }
});
// Entrada rápida: código por email + Google + Facebook
function socialOk(user){
  localStorage.setItem("acacia_member", JSON.stringify(user));
  document.getElementById("loginMsg").textContent = "¡Hola de nuevo!";
  paintMember();
  setTimeout(()=>document.getElementById("authModal").hidden = true, 700);
}
document.getElementById("codeBtn").onclick = ()=>{
  const b = document.getElementById("codeBox");
  b.hidden = !b.hidden;
};
document.getElementById("cSend").onclick = async ()=>{
  const em = document.getElementById("cLoginEmail").value.trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  const w = document.getElementById("w-cEmail");
  w.classList.toggle("bad", !ok);
  w.querySelector(".err").hidden = ok;
  if(!ok) return;
  document.getElementById("loginMsg").textContent = "Enviando código a tu Gmail...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/codigo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    document.getElementById("loginMsg").textContent = "Código enviado. Revisá tu Gmail.";
  } catch(err) { document.getElementById("loginMsg").textContent = "✕ " + err.message; }
};
document.getElementById("cEnter").onclick = async ()=>{
  const em = document.getElementById("cLoginEmail").value.trim().toLowerCase();
  const code = document.getElementById("cLoginCode").value.trim();
  if(!/^\d{6}$/.test(code)){ const w=document.getElementById("w-cCode"); w.classList.add("bad"); w.querySelector(".err").hidden=false; return; }
  document.getElementById("loginMsg").textContent = "Entrando...";
  try {
    const r = await fetch(AUTH_URL+"/api/auth/entrar-codigo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,codigo:code})});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    socialOk(d.user);
  } catch(err) { document.getElementById("loginMsg").textContent = "✕ " + err.message; }
};
if(GOOGLE_CLIENT_ID){
  document.getElementById("googleBtnCustom").style.display = "none";
  const s = document.createElement("script");
  s.src = "https://accounts.google.com/gsi/client";
  s.onload = ()=>{
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: async resp=>{
      try {
        const r = await fetch(AUTH_URL+"/api/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:resp.credential})});
        const d = await r.json();
        if(!r.ok) throw new Error(d.error||"Error");
        socialOk(d.user);
      } catch(err) { document.getElementById("loginMsg").textContent = "✕ " + err.message; }
    }});
    google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "outline", size: "large", width: 280 });
  };
  document.head.appendChild(s);
}
document.getElementById("googleBtnCustom").onclick = ()=>{
  document.getElementById("loginMsg").textContent = "Login con Google en configuración: hay que crear el ID de cliente en Google Cloud (10 min, gratis) y pegarlo en el código.";
};
if(FB_APP_ID){
  window.fbAsyncInit = ()=>FB.init({ appId: FB_APP_ID, cookie: true, xfbml: false, version: "v20.0" });
  const s = document.createElement("script");
  s.src = "https://connect.facebook.net/es_LA/sdk.js";
  document.head.appendChild(s);
  document.getElementById("fbBtn").onclick = ()=>FB.login(function(resp){
    (async ()=>{
      if(resp.status !== "connected"){ document.getElementById("loginMsg").textContent = "✕ No se pudo conectar"; return; }
      try {
        const r = await fetch(AUTH_URL+"/api/auth/facebook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessToken:resp.authResponse.accessToken})});
        const d = await r.json();
        if(!r.ok) throw new Error(d.error||"Error");
        socialOk(d.user);
      } catch(err) { document.getElementById("loginMsg").textContent = "✕ " + err.message; }
    })();
  });
} else {
  document.getElementById("fbBtn").onclick = ()=>{
    document.getElementById("loginMsg").textContent = "Login con Facebook en configuración: requiere crear la app en Meta y su revisión (unos días). Por ahora usá Google o código por email.";
  };
}

// Términos y privacidad (lectura obligatoria antes de crear cuenta)
function openTerms(tab){
  document.getElementById("terms-terms").hidden = tab !== "terms";
  document.getElementById("terms-priv").hidden = tab !== "priv";
  document.getElementById("termsModal").hidden = false;
}
document.addEventListener("click", e=>{
  const t = e.target.closest("[data-terms]");
  if(t){ e.preventDefault(); openTerms(t.dataset.terms); }
});
document.getElementById("closeTerms").onclick = ()=>document.getElementById("termsModal").hidden = true;
document.getElementById("tabTerms").onclick = ()=>openTerms("terms");
document.getElementById("tabPriv").onclick = ()=>openTerms("priv");
document.getElementById("acceptTerms").onclick = ()=>{
  document.getElementById("rTerms").checked = true;
  document.getElementById("termsModal").hidden = true;
};
document.querySelectorAll(".eye[data-eye]").forEach(b=>b.onclick=()=>{
  const inp = document.getElementById(b.dataset.eye);
  if(!inp) return;
  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  b.textContent = show ? "🙈" : "👁";
  b.setAttribute("aria-label", show ? "Ocultar contraseña" : "Ver contraseña");
});

// ===== MI CUENTA estilo Nike =====
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
let cuentaSide = "perfil";
function getFavs(){ try { return JSON.parse(localStorage.getItem("acacia_favs") || "[]"); } catch { return []; } }
function isFav(id){ return getFavs().includes(id); }
function toggleFav(id){
  let f = getFavs();
  f = f.includes(id) ? f.filter(x=>x !== id) : [...f, id];
  localStorage.setItem("acacia_favs", JSON.stringify(f));
  render();
  if(parseRoute()?.type === "cuenta") renderCuenta("favoritos");
  const pp = document.getElementById("ppFav");
  if(pp) pp.classList.toggle("on", f.includes(id));
}
async function renderCuenta(tab){
  const em = memberEmail();
  const loginBox = document.getElementById("cuentaLogin");
  const body = document.getElementById("cuentaBody");
  if(!em){
    loginBox.hidden = false;
    body.hidden = true;
    return;
  }
  loginBox.hidden = true;
  body.hidden = false;
  document.querySelectorAll("[data-ctab]").forEach(b=>b.classList.toggle("on", b.dataset.ctab === tab));
  let perf = null;
  try {
    const r = await fetch(AUTH_URL+"/api/auth/perfil?email="+encodeURIComponent(em));
    const d = await r.json();
    if(r.ok) perf = d.perfil;
  } catch {}
  const m = (()=>{ try { return JSON.parse(localStorage.getItem("acacia_member")||"{}"); } catch { return {}; } })();
  const nombre = perf?.nombre || m.nombre || "", apellido = perf?.apellido || m.apellido || "";
  document.getElementById("cuAvatar").textContent = (nombre[0] || "?").toUpperCase();
  document.getElementById("cuName").textContent = (nombre + " " + apellido).trim() || em;
  let desde = "";
  if(perf?.created_at){
    const f = new Date(perf.created_at);
    desde = `Miembro Acacia desde ${MESES[f.getMonth()]} ${f.getFullYear()}`;
  }
  document.getElementById("cuSince").textContent = desde;
  const side = document.getElementById("cuentaSide");
  const main = document.getElementById("cuentaMain");
  if(tab === "perfil"){
    side.innerHTML = ["perfil|Perfil", "prefs|Preferencias de comunicación", "dir|Direcciones", "salir|Salir"].map(s=>{
      const [k, l] = s.split("|");
      return `<button type="button" data-cside="${k}" class="${cuentaSide===k?"on":""}">${l}</button>`;
    }).join("");
    side.querySelectorAll("[data-cside]").forEach(b=>b.onclick=()=>{
      if(b.dataset.cside === "salir"){ document.getElementById("menuLogout").click(); return; }
      cuentaSide = b.dataset.cside;
      renderCuenta("perfil");
    });
    if(cuentaSide === "perfil") renderDetalles(main, perf, em);
    else if(cuentaSide === "prefs") renderPrefs(main, perf, em);
    else if(cuentaSide === "dir") renderDirecciones(main, em);
  } else if(tab === "ordenes"){
    side.innerHTML = "";
    main.innerHTML = "<h3>Mis órdenes</h3><div id='ordList' class='cuotas'><p class='muted'>Cargando...</p></div>";
    try {
      const r = await fetch(AUTH_URL+"/api/auth/ordenes?email="+encodeURIComponent(em));
      const d = await r.json();
      document.getElementById("ordList").innerHTML = (d.ordenes||[]).map(o=>{
        let items = [];
        try { items = JSON.parse(o.items || "[]"); } catch {}
        const f = new Date(o.created_at);
        return `<div class="cuota-opt"><span><strong>Pedido #${o.id}</strong> — ${fmt(o.total)} — ${o.provincia||""}<br><span class="muted small">${f.toLocaleDateString("es-AR")} · ${(items||[]).map(i=>i.n+"× "+(PRODUCTS.find(p=>p.id===i.id)?.name||i.id)+(i.t?" (talle "+i.t+")":"")).join(", ")}</span></span></div>`;
      }).join("") || "<p class='muted'>Todavía no tenés compras.</p>";
    } catch { document.getElementById("ordList").innerHTML = "<p class='muted'>Sin conexión.</p>"; }
  } else if(tab === "favoritos"){
    side.innerHTML = "";
    const favs = getFavs().map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
    main.innerHTML = "<h3>Mis favoritos</h3>" + (favs.length
      ? `<div class="grid" style="grid-template-columns:repeat(2,1fr)">` + favs.map(p=>`
        <article class="card"><button type="button" class="fav on" data-unfav="${p.id}">♥</button>
        <img src="${p.img||placeholderImg(p.name)}" alt="${p.name}" data-view="${p.id}" loading="lazy" />
        <div class="card-body"><h3>${p.name}</h3><div class="price">${fmt(p.price)}</div>
        ${(p.stock ?? 10) <= 0 ? `<button class="btn ghost" disabled>Fuera de stock</button>`
          : (p.talles||[]).length ? `<button class="btn primary" data-goto="${p.id}">Elegir talle</button>`
          : `<button class="btn primary" data-add="${p.id}">Agregar</button>`}</div></article>`).join("") + `</div>`
      : "<p class='muted'>Tocá el ♥ en los productos para guardarlos acá.</p>");
    main.querySelectorAll("[data-unfav]").forEach(b=>b.onclick=()=>toggleFav(b.dataset.unfav));
  } else if(tab === "ajustes"){
    side.innerHTML = "";
    main.innerHTML = `<h3>Configuración de la cuenta</h3>
      <div class="adm-prod"><div class="adm-fields">
        <strong>Borrar membresía</strong>
        <p class="muted small">Se borra tu cuenta, tus datos y direcciones. Tus pedidos quedan como registro de la tienda.</p>
        <label>Confirmá con tu contraseña<input id="delPass" type="password" autocomplete="current-password" placeholder="Contraseña *" /></label>
        <div><button type="button" id="delAccount" class="btn ghost">Borrar</button></div>
        <p class="muted small" id="delMsg"></p>
      </div></div>
      <div class="adm-prod"><div class="adm-fields">
        <strong>Desconectar membresía</strong>
        <p class="muted small">Si desconectás tu membresía, no vas a poder acceder a esta plataforma de la marca Acacia como usuario registrado: se cierran tus puntos, cupones y beneficios hasta que vuelvas a entrar.</p>
        <div><button type="button" id="disAccount" class="btn ghost">Desconectar</button></div>
      </div></div>`;
    document.getElementById("disAccount").onclick = ()=>document.getElementById("menuLogout").click();
    document.getElementById("delAccount").onclick = async ()=>{
      const pw = document.getElementById("delPass").value;
      if(!pw){ document.getElementById("delMsg").textContent = "✕ Poné tu contraseña"; return; }
      if(!confirm("¿Segura? Se borra tu cuenta de Acacia.")) return;
      try {
        const r = await fetch(AUTH_URL+"/api/auth/cuenta",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,password:pw})});
        const d = await r.json();
        if(!r.ok) throw new Error(d.error||"Error");
        document.getElementById("menuLogout").click();
        alert("Cuenta borrada. ¡Te vamos a extrañar!");
      } catch(err) { document.getElementById("delMsg").textContent = "✕ "+err.message; }
    };
  }
}
function renderDetalles(main, perf, em){
  const f = v => (v ?? "");
  main.innerHTML = `<h3>Detalles de Cuenta</h3>
    <div class="adm-prod"><div class="adm-fields">
      <label>Email<input value="${perf?.email||em}" disabled style="background:#f3ece3" /></label>
      <label>Nombre<input id="dNom" value="${f(perf?.nombre)}" disabled /></label>
      <label>Apellido<input id="dApe" value="${f(perf?.apellido)}" disabled /></label>
      <label>Teléfono<input id="dTel" value="${f(perf?.telefono)}" disabled /></label>
      <label>DNI<input id="dDni" value="${f(perf?.dni)}" disabled /></label>
      <label>Fecha de nacimiento<input id="dNac" type="date" value="${perf?.nacimiento ? String(perf.nacimiento).slice(0,10) : ""}" disabled /></label>
      <label>País<input id="dPais" value="${f(perf?.pais)||"Argentina"}" disabled /></label>
      <div class="adm-photo-row"><button type="button" id="dEdit" class="btn ghost">Editar</button>
      <button type="button" id="dSave" class="btn primary" hidden>Guardar</button></div>
      <p class="muted small" id="dMsg"></p>
    </div></div>`;
  const inputs = ["dNom","dApe","dTel","dDni","dNac","dPais"];
  document.getElementById("dEdit").onclick = ()=>{
    inputs.forEach(id=>document.getElementById(id).disabled = false);
    document.getElementById("dEdit").hidden = true;
    document.getElementById("dSave").hidden = false;
  };
  document.getElementById("dSave").onclick = async ()=>{
    const body = { email: em, nombre: document.getElementById("dNom").value.trim(), apellido: document.getElementById("dApe").value.trim(), telefono: document.getElementById("dTel").value.trim(), dni: document.getElementById("dDni").value.trim(), nacimiento: document.getElementById("dNac").value || null, pais: document.getElementById("dPais").value.trim() };
    const m = document.getElementById("dMsg");
    try {
      const r = await fetch(AUTH_URL+"/api/auth/perfil",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      if(!r.ok) throw new Error("Error");
      const d = await r.json();
      if(d.user) localStorage.setItem("acacia_member", JSON.stringify(d.user));
      paintMember();
      renderCuenta("perfil");
    } catch { m.textContent = "✕ No se pudo guardar"; }
  };
}
function renderPrefs(main, perf, em){
  main.innerHTML = `<h3>Preferencias de comunicación</h3>
    <div class="adm-prod"><div class="adm-fields">
      <label style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="pfMail" ${perf?.promo_mail ? "checked" : ""} style="width:auto" /> Recibir promos por email</label>
      <label style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="pfWa" ${perf?.promo_wa ? "checked" : ""} style="width:auto" /> Recibir avisos por WhatsApp</label>
      <div><button type="button" id="pfSave" class="btn primary">Guardar</button></div>
      <p class="muted small" id="pfMsg"></p>
    </div></div>`;
  document.getElementById("pfSave").onclick = async ()=>{
    try {
      await fetch(AUTH_URL+"/api/auth/perfil",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,promo_mail:document.getElementById("pfMail").checked?1:0,promo_wa:document.getElementById("pfWa").checked?1:0})});
      document.getElementById("pfMsg").textContent = "Guardado ✓";
    } catch { document.getElementById("pfMsg").textContent = "✕ Error"; }
  };
}
async function renderDirecciones(main, em){
  main.innerHTML = `<h3>Direcciones</h3><div id="dirList" class="cuotas"><p class="muted">Cargando...</p></div>
    <div class="adm-prod"><div class="adm-fields">
      <strong>Agregar dirección</strong>
      <div class="row2"><input id="aAlias" placeholder="Alias ej Casa" /><input id="aCalle" placeholder="Calle *" /></div>
      <div class="row2"><input id="aNum" placeholder="Número" /><input id="aCp" placeholder="CP" /></div>
      <div class="row2"><input id="aCiudad" placeholder="Localidad" /><input id="aProv" placeholder="Provincia" /></div>
      <div><button type="button" id="aAdd" class="btn primary">Agregar</button></div>
      <p class="muted small" id="aMsg"></p>
    </div></div>`;
  const load = async ()=>{
    try {
      const r = await fetch(AUTH_URL+"/api/auth/direcciones?email="+encodeURIComponent(em));
      const d = await r.json();
      document.getElementById("dirList").innerHTML = (d.direcciones||[]).map(x=>`<div class="cuota-opt"><span><strong>${x.alias||"Dirección"}</strong> — ${x.calle} ${x.numero||""}, ${x.ciudad||""} ${x.prov||""} (${x.cp||""})<br><button type="button" class="btn ghost" data-dirdel="${x.id}">Borrar</button></span></div>`).join("") || "<p class='muted'>Sin direcciones.</p>";
      document.querySelectorAll("[data-dirdel]").forEach(b=>b.onclick=async ()=>{
        await fetch(AUTH_URL+"/api/auth/direcciones/"+b.dataset.dirdel,{method:"DELETE"});
        load();
      });
    } catch { document.getElementById("dirList").innerHTML = "<p class='muted'>Sin conexión.</p>"; }
  };
  await load();
  document.getElementById("aAdd").onclick = async ()=>{
    const body = { email: em, alias: document.getElementById("aAlias").value.trim(), calle: document.getElementById("aCalle").value.trim(), numero: document.getElementById("aNum").value.trim(), extra: "", ciudad: document.getElementById("aCiudad").value.trim(), prov: document.getElementById("aProv").value.trim(), cp: document.getElementById("aCp").value.trim() };
    if(!body.calle){ document.getElementById("aMsg").textContent = "✕ Poné al menos la calle"; return; }
    await fetch(AUTH_URL+"/api/auth/direcciones",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    document.getElementById("aMsg").textContent = "Agregada ✓";
    load();
  };
}
document.querySelectorAll("[data-ctab]").forEach(b=>b.onclick=()=>{ location.hash = "#/cuenta/" + b.dataset.ctab; });

// ===== ADMIN (oculto: se entra con usuario admin en el login de miembros) =====
function admHeaders(){ return {"Content-Type":"application/json","x-admin-token":sessionStorage.getItem("acacia_admin")||""}; }
function isAdmin(){ return !!sessionStorage.getItem("acacia_admin"); }
document.getElementById("admExit").onclick = ()=>{ sessionStorage.removeItem("acacia_admin"); localStorage.removeItem("acacia_member"); document.getElementById("authState").textContent = ""; showAdmin(false); paintMember(); };
document.getElementById("admLogoutBtn").onclick = ()=>{
  sessionStorage.removeItem("acacia_admin");
  localStorage.removeItem("acacia_member");
  document.getElementById("authState").textContent = "";
  showAdmin(false);
  paintMember();
  document.getElementById("inicio")?.scrollIntoView({behavior:"smooth"});
};
function showAdmin(on){
  if(on){
    if(location.hash !== "#/admin") location.hash = "#/admin";
    else { showView(["admin"]); showATab("resumen"); loadStats(); }
  } else {
    document.getElementById("admin").hidden = true;
    document.getElementById("adminDash").hidden = true;
    if(location.hash === "#/admin") location.hash = "";
  }
}
document.querySelectorAll("[data-atab]").forEach(b=>b.onclick=()=>showATab(b.dataset.atab));
function showATab(t){
  ["resumen","prods","peds","users","cupones","inicio","contacto","menu"].forEach(k=>document.getElementById("atab-"+k).hidden = k!==t);
  document.querySelectorAll("[data-atab]").forEach(b=>b.classList.toggle("active", b.dataset.atab===t));
  if(t==="prods") loadAdmProds();
  if(t==="peds") loadAdmPeds();
  if(t==="users") loadAdmUsers();
  if(t==="cupones") loadCupones();
  if(t==="inicio") paintTextEditor("editInicioFields", TEXTOS_INICIO);
  if(t==="contacto") paintTextEditor("editContactoFields", TEXTOS_CONTACTO);
  if(t==="menu") paintMenuEditor();
}
function barChart(id, labels, vals){
  const c = document.getElementById(id);
  if(!c) return;
  const x = c.getContext("2d");
  x.clearRect(0,0,c.width,c.height);
  const max = Math.max(1,...vals);
  const bw = c.width / Math.max(1,labels.length);
  vals.forEach((v,i)=>{
    const h = (v/max)*(c.height-40);
    x.fillStyle = "#7A4A2E";
    x.fillRect(i*bw+8, c.height-20-h, bw-16, h);
    x.fillStyle = "#2B2B2B";
    x.font = "11px sans-serif";
    x.fillText(String(labels[i]).slice(0,10), i*bw+8, c.height-6);
    x.fillText(String(v), i*bw+8, c.height-24-h);
  });
}
async function loadStats(){
  try {
    const r = await fetch(AUTH_URL+"/api/admin/stats",{headers:admHeaders()});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    document.getElementById("stUsers").textContent = d.usuarios;
    document.getElementById("stSales").textContent = d.ventas;
    document.getElementById("stTotal").textContent = Number(d.totalVentas).toLocaleString("es-AR");
    document.getElementById("stViews").textContent = d.visitas;
    barChart("chProv", d.porProvincia.map(p=>p.provincia||"—"), d.porProvincia.map(p=>p.n));
    barChart("chStock", d.stock.map(p=>p.nombre), d.stock.map(p=>p.stock));
  } catch(err) { alert("Stats: "+err.message); }
}
function fullImg(u){
  if(!u) return "";
  if(/^https?:\/\//.test(u)) return u;
  return AUTH_URL + (u.startsWith("/") ? u : "/" + u);
}
async function loadAdmProds(){
  const box = document.getElementById("admProds");
  try {
    const r = await fetch(AUTH_URL+"/api/admin/stats",{headers:admHeaders()});
    const d = await r.json();
    if(!r.ok) throw new Error(d.error||"Error");
    box.innerHTML = d.stock.map(p=>{
      const cols = String(p.color||"").split(",").map(s=>s.trim()).filter(Boolean);
      return `
      <div class="adm-prod" data-card="${p.id}">
        <img class="adm-thumb" data-thumb="${p.id}" src="${fullImg(p.img)||placeholderImg(p.nombre)}" alt="${p.nombre}" onerror="this.src='${placeholderImg(p.nombre)}'" />
        <div class="adm-fields">
          <label>Nombre<input data-pname="${p.id}" value="${String(p.nombre||"").replace(/"/g,"&quot;")}" /></label>
          <div class="row2">
            <label>Stock<input data-pstock="${p.id}" type="number" min="0" step="1" value="${p.stock}" /></label>
            <label>Precio<input data-pprice="${p.id}" type="number" min="0" step="100" value="${p.precio}" /></label>
          </div>
          <label>Colores<div class="chips" data-chips="${p.id}">${cols.map(c=>`<span class="chip">${c}<button type="button" data-rmchip="${p.id}" data-c="${c}">✕</button></span>`).join("")}</div>
          <div style="display:flex;gap:6px"><input data-pcolorin="${p.id}" placeholder="Agregar color..." /><button type="button" class="btn ghost" data-addchip="${p.id}">+</button></div></label>
          <label>Talles (los que el cliente puede elegir)<div class="chips" data-tchips="${p.id}">${String(p.talles||"").split(",").map(s=>s.trim()).filter(Boolean).map(t=>`<span class="chip">${t}<button type="button" data-rmtalle="${p.id}" data-t="${t}">✕</button></span>`).join("")}</div>
          <div style="display:flex;gap:6px"><input data-ptallein="${p.id}" placeholder="Agregar talle ej 40..." /><button type="button" class="btn ghost" data-addtalle="${p.id}">+</button></div></label>
          <label>Fotos (<span data-gcount="${p.id}">0</span>) — la primera es la principal</label>
          <div class="gal" data-gal="${p.id}"></div>
          <div style="display:flex;gap:6px"><input data-pimg="${p.id}" placeholder="Pegar URL y Añadir" /><button type="button" class="btn ghost" data-addurl="${p.id}">+ Añadir</button></div>
          <div class="adm-photo-row">
            <label class="btn ghost" style="cursor:pointer">📤 Subir más fotos<input type="file" data-pfile="${p.id}" accept="image/*" multiple hidden /></label>
            <button type="button" class="btn primary" data-psave="${p.id}">Guardar</button>
          </div>
          <span class="muted small" data-pmsg="${p.id}"></span>
        </div>
      </div>`;
    }).join("");
    const q = (s,id) => box.querySelector(`[data-p${s}="${id}"]`);
    const getColors = id => [...box.querySelectorAll(`[data-rmchip="${id}"]`)].map(b=>b.dataset.c).join(", ");
    const getTalles = id => [...box.querySelectorAll(`[data-rmtalle="${id}"]`)].map(b=>b.dataset.t).join(", ");
    box.querySelectorAll("[data-addchip]").forEach(b=>b.onclick=()=>{
      const id = b.dataset.addchip;
      const inp = q("colorin",id);
      const v = inp.value.trim().toLowerCase();
      if(!v) return;
      if(getColors(id).split(", ").includes(v)){ inp.value=""; return; }
      const chips = box.querySelector(`[data-chips="${id}"]`);
      const s = document.createElement("span");
      s.className = "chip";
      s.innerHTML = `${v}<button type="button" data-rmchip="${id}" data-c="${v}">✕</button>`;
      s.querySelector("button").onclick = ev=>{ ev.target.closest(".chip").remove(); };
      chips.appendChild(s);
      inp.value = "";
    });
    box.querySelectorAll("[data-rmchip]").forEach(b=>b.onclick=()=>b.closest(".chip").remove());
    box.querySelectorAll("[data-addtalle]").forEach(b=>b.onclick=()=>{
      const id = b.dataset.addtalle;
      const inp = q("tallein",id);
      const v = inp.value.trim();
      if(!v) return;
      const chips = box.querySelector(`[data-tchips="${id}"]`);
      const s = document.createElement("span");
      s.className = "chip";
      s.innerHTML = `${v}<button type="button" data-rmtalle="${id}" data-t="${v}">✕</button>`;
      s.querySelector("button").onclick = ev=>{ ev.target.closest(".chip").remove(); };
      chips.appendChild(s);
      inp.value = "";
    });
    box.querySelectorAll("[data-rmtalle]").forEach(b=>b.onclick=()=>b.closest(".chip").remove());
    box.querySelectorAll("[data-pimg]").forEach(inp=>inp.addEventListener("input", ()=>{
      const id = inp.dataset.pimg;
      const th = box.querySelector(`[data-thumb="${id}"]`);
      if(th && inp.value.trim()) th.src = fullImg(inp.value.trim());
    }));
    async function paintGal(id){
      const gal = box.querySelector(`[data-gal="${id}"]`);
      const cnt = box.querySelector(`[data-gcount="${id}"]`);
      const th = box.querySelector(`[data-thumb="${id}"]`);
      try {
        const r = await fetch(AUTH_URL+"/api/admin/fotos/"+id,{headers:admHeaders()});
        const d = await r.json();
        if(!r.ok) throw new Error();
        const fotos = d.fotos || [];
        if(cnt) cnt.textContent = fotos.length;
        gal.innerHTML = fotos.map(f=>`<span class="g"><img src="${fullImg(f.url)}" alt="" onerror="this.style.visibility='hidden'" /><button type="button" data-gdel="${f.id}" data-gpid="${id}" title="Borrar">✕</button></span>`).join("") || "<span class='muted small'>Sin fotos todavía.</span>";
        if(th) th.src = fotos.length ? fullImg(fotos[0].url) : placeholderImg("?");
        const card = box.querySelector(`[data-card="${id}"]`);
        if(card) card.dataset.main = fotos.length ? fotos[0].url : "";
        gal.querySelectorAll("[data-gdel]").forEach(b=>b.onclick=async ()=>{
          if(!confirm("¿Borrar esta foto?")) return;
          await fetch(AUTH_URL+"/api/admin/fotos/"+b.dataset.gdel,{method:"DELETE",headers:admHeaders()});
          paintGal(id);
          syncProducts();
        });
      } catch { gal.innerHTML = "<span class='muted small'>No se pudo cargar.</span>"; }
    }
    d.stock.forEach(p=>paintGal(p.id));
    async function addUrlFoto(id, url){
      url = (url||"").trim();
      if(!url) return;
      const m = box.querySelector(`[data-pmsg="${id}"]`);
      m.textContent = "Añadiendo...";
      const rr = await fetch(AUTH_URL+"/api/admin/fotos",{method:"POST",headers:admHeaders(),body:JSON.stringify({producto_id:id,url})});
      m.textContent = rr.ok ? "Foto añadida ✓" : "Error";
      if(rr.ok){ box.querySelector(`[data-pimg="${id}"]`).value = ""; paintGal(id); syncProducts(); }
    }
    box.querySelectorAll("[data-addurl]").forEach(b=>b.onclick=()=>{
      const id = b.dataset.addurl;
      addUrlFoto(id, box.querySelector(`[data-pimg="${id}"]`).value);
    });
    box.querySelectorAll("[data-pfile]").forEach(fi=>fi.onchange=async ()=>{
      const id = fi.dataset.pfile;
      if(!fi.files.length) return;
      const m = box.querySelector(`[data-pmsg="${id}"]`);
      m.textContent = `Subiendo ${fi.files.length}...`;
      let ok = 0, lastErr = "";
      for(const f of fi.files){
        const fd = new FormData();
        let file = f;
        try { file = await compressImg(f); } catch(err) { lastErr = "No pude leer la imagen"; }
        fd.append("foto", file);
        try {
          const rr = await fetch(AUTH_URL+"/api/admin/upload",{method:"POST",headers:{"x-admin-token":sessionStorage.getItem("acacia_admin")||""},body:fd});
          if(rr.status === 401){ lastErr = "Sesión vencida: salí y entrá de nuevo como admin"; break; }
          const dd = await rr.json().catch(()=>({}));
          if(!rr.ok) throw new Error(dd.error || ("Error " + rr.status));
          const url = dd.full || (AUTH_URL + dd.url);
          const r2 = await fetch(AUTH_URL+"/api/admin/fotos",{method:"POST",headers:admHeaders(),body:JSON.stringify({producto_id:id,url})});
          if(r2.status === 401){ lastErr = "Sesión vencida: salí y entrá de nuevo como admin"; break; }
          if(!r2.ok){ const dd2 = await r2.json().catch(()=>({})); throw new Error(dd2.error || "No se pudo guardar"); }
          ok++;
        } catch(err) { lastErr = err.message; }
      }
      m.textContent = ok ? `${ok} foto(s) añadidas ✓` : ("✕ " + (lastErr || "Error subiendo"));
      fi.value = "";
      paintGal(id);
      syncProducts();
    });
    box.querySelectorAll("[data-psave]").forEach(b=>b.onclick=async ()=>{
      const id = b.dataset.psave;
      const m = box.querySelector(`[data-pmsg="${id}"]`);
      m.textContent = "Guardando...";
      const main = box.querySelector(`[data-card="${id}"]`)?.dataset.main || "";
      const rr = await fetch(AUTH_URL+"/api/admin/productos/"+id,{method:"PUT",headers:admHeaders(),body:JSON.stringify({nombre:q("name",id).value.trim(),stock:Number(q("stock",id).value),precio:Number(q("price",id).value),img:main,color:getColors(id),talles:getTalles(id)})});
      m.textContent = rr.ok ? "Guardado ✓" : "Error";
      if(rr.ok) syncProducts();
    });
  } catch { box.textContent = "Sin datos"; }
}
document.getElementById("npFile").onchange = async e=>{
  const f = e.target.files[0];
  if(!f) return;
  const fd = new FormData();
  let file = f;
  try { file = await compressImg(f); } catch {}
  fd.append("foto", file);
  document.getElementById("npMsg").textContent = "Subiendo foto...";
  try {
    const rr = await fetch(AUTH_URL+"/api/admin/upload",{method:"POST",headers:{"x-admin-token":sessionStorage.getItem("acacia_admin")||""},body:fd});
    const dd = await rr.json();
    if(!rr.ok) throw new Error(dd.error||"Error");
    document.getElementById("npImg").value = dd.full || (AUTH_URL + dd.url);
    document.getElementById("npPrev").style.visibility = "visible";
    document.getElementById("npPrev").src = dd.full || (AUTH_URL + dd.url);
    document.getElementById("npMsg").textContent = "Foto subida ✓";
  } catch(err) { document.getElementById("npMsg").textContent = "✕ "+err.message; }
};
document.getElementById("npImg").addEventListener("input", e=>{
  const p = document.getElementById("npPrev");
  p.style.visibility = "visible";
  p.src = e.target.value;
});
const npColors = new Set();
const npTalles = new Set();
function paintNpChips(){
  document.getElementById("npChips").innerHTML = [...npColors].map(c=>`<span class="chip">${c}<button type="button" data-nprm="${c}">✕</button></span>`).join("");
  document.querySelectorAll("[data-nprm]").forEach(b=>b.onclick=()=>{ npColors.delete(b.dataset.nprm); paintNpChips(); });
}
document.getElementById("npColorAdd").onclick = ()=>{
  const v = document.getElementById("npColorIn").value.trim().toLowerCase();
  if(v){ npColors.add(v); document.getElementById("npColorIn").value = ""; paintNpChips(); }
};
function paintNpTalles(){
  document.getElementById("npTalles").innerHTML = [...npTalles].map(t=>`<span class="chip">${t}<button type="button" data-nptrm="${t}">✕</button></span>`).join("");
  document.querySelectorAll("[data-nptrm]").forEach(b=>b.onclick=()=>{ npTalles.delete(b.dataset.nptrm); paintNpTalles(); });
}
document.getElementById("npTalleAdd").onclick = ()=>{
  const v = document.getElementById("npTalleIn").value.trim();
  if(v){ npTalles.add(v); document.getElementById("npTalleIn").value = ""; paintNpTalles(); }
};
document.getElementById("npNombre").addEventListener("input", e=>{
  const slug = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60);
  document.getElementById("npId").value = slug;
});
document.getElementById("npSave").onclick = async ()=>{
  const body = { id: document.getElementById("npId").value.trim(), nombre: document.getElementById("npNombre").value.trim(), precio: Number(document.getElementById("npPrecio").value), stock: Number(document.getElementById("npStock").value), categoria: document.getElementById("npCat").value||"mujer", color: [...npColors].join(", "), talles: [...npTalles].join(", "), img: document.getElementById("npImg").value.trim(), descrip: document.getElementById("npDesc").value.trim() };
  const r = await fetch(AUTH_URL+"/api/admin/productos",{method:"POST",headers:admHeaders(),body:JSON.stringify(body)});
  document.getElementById("npMsg").textContent = r.ok ? "Guardado ✓" : "Error (falta id/nombre)";
  if(r.ok){ loadAdmProds(); syncProducts(); }
};
async function loadAdmPeds(){
  const box = document.getElementById("admPeds");
  try {
    const r = await fetch(AUTH_URL+"/api/admin/pedidos",{headers:admHeaders()});
    const d = await r.json();
    box.innerHTML = d.pedidos.map(p=>`<div class="cuota-opt"><span>#${p.id} ${p.email} — $${p.total} — ${p.provincia||""}<br><span class="muted small">${p.created_at} · ${String(p.items||"").slice(0,120)}</span></span></div>`).join("") || "Sin compras";
  } catch { box.textContent = "Error"; }
}
async function loadAdmUsers(){
  const box = document.getElementById("admUsers");
  try {
    const r = await fetch(AUTH_URL+"/api/admin/usuarios",{headers:admHeaders()});
    const d = await r.json();
    box.innerHTML = `<p class="muted">Total: ${d.usuarios.length}</p>` + d.usuarios.map(u=>`<div class="cuota-opt"><span>${u.nombre} ${u.apellido} (@${u.usuario})<br><span class="muted small">${u.email} · ${u.puntos||0} pts</span></span></div>`).join("");
  } catch { box.textContent = "Error"; }
}

initProvLoc();
document.getElementById("cardBrand").addEventListener("change", updateSummary);
document.getElementById("cardBank").addEventListener("change", updateSummary);
if(!BACKEND_ENABLED){
  // Fase 1: ocultar todo lo que necesita servidor
  document.querySelector('.promo-banner').style.display = 'none';
  document.getElementById('accountBtn').style.display = 'none';
  document.querySelector('a[href="#miembros"]')?.remove();
  document.getElementById('miembros').style.display = 'none';
}
paintMember();
render();
loadTextos();
loadMenu();
applyRoute(false);
heroShow(0);
heroAuto();
updateCartUI();
syncProducts();
if(BACKEND_ENABLED){ try { fetch(AUTH_URL+"/api/visita",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina:location.pathname})}).catch(()=>{}); } catch {} }
if(BACKEND_ENABLED && sessionStorage.getItem("acacia_admin")) showAdmin(true);
