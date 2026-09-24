const WHATSAPP_NUMBER = "5492645874999";
const WHATSAPP_NUMBER_2 = "5492645063736";
// FASE 2 (producción full): backend online con miembros, puntos, admin y visitas.
const BACKEND_ENABLED = true;
const AUTH_URL_LOCAL = "http://localhost:3001";
const AUTH_URL_PROD = "https://acacia-production-0a93.up.railway.app";
const AUTH_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:") ? AUTH_URL_LOCAL : AUTH_URL_PROD;
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
    desc: "Pollera tiare. Envío gratis."
  },
  {
    id: "vestido-helecho",
    name: "Vestido helecho",
    price: 26690,
    category: "mujer",
    color: "Marrón",
    img: "https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000393704-d052442b0ddbbbf42e17887202792111-480-0.webp",
    desc: "Vestido helecho. Envío gratis."
  },
  {
    id: "musculosa-azalea",
    name: "Musculosa Lycra Azalea",
    price: 18200,
    category: "mujer",
    color: "Negro",
    img: "https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000395703-95f4f1dbec47d2dc0517887028203195-480-0.webp",
    desc: "Microfibra Lycra. Talle 2: 36x53 / Talle 3: 38x59 / Talle 4: 43x67"
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
      PRODUCTS = d.productos.map(p=>({ id:p.id, name:p.nombre, price:Number(p.precio), category:p.categoria||"mujer", color:p.color||"", img:p.img||"", desc:p.descrip||"", stock:p.stock }));
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
  return "https://via.placeholder.com/480x480/E9DCCF/7A4A2E?text=" + encodeURIComponent(name);
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
    if(list[heroIdx]) openModal(list[heroIdx].id);
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
    const st = (p.stock ?? 10) <= 0 ? "Sin stock" : `Stock: ${p.stock ?? 10}`;
    el.innerHTML = `
      <img src="${p.img || placeholderImg(p.name)}" alt="${p.name}" data-view="${p.id}" loading="lazy" />
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="muted">${p.category} · ${p.color||""} · ${st}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="muted small">Hasta <strong>3 sin interés</strong> de ${fmt(c3)} con Plan Z</div>
        <a href="#" class="muted small" data-medios>Ver medios de pago</a>
        <button class="btn primary" data-add="${p.id}">Agregar</button>
      </div>`;
    grid.appendChild(el);
  });
}

function saveCart(){ localStorage.setItem("acacia_cart", JSON.stringify(cart)); updateCartUI(); }
function addToCart(id){
  const f = cart.find(i=>i.id===id);
  if(f) f.qty++;
  else cart.push({id, qty:1});
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
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${p.img || placeholderImg(p.name)}" />
      <div style="flex:1"><strong>${p.name}</strong><br><span class="muted">${fmt(p.price)}</span>
      <div class="qty"><button data-dec="${p.id}">-</button> ${item.qty} <button data-inc="${p.id}">+</button></div></div>
      <button data-del="${p.id}">🗑</button>`;
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
    lines.push("- " + p.name + " x" + i.qty + " - " + fmt(p.price*i.qty));
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
  const add = e.target.closest("[data-add]");
  if(add) { e.preventDefault(); addToCart(add.dataset.add); }
  const med = e.target.closest("[data-medios]");
  if(med){ e.preventDefault(); updateSummary(); document.getElementById("mediosModal").hidden=false; }
  const view = e.target.closest("[data-view]");
  if(view) openModal(view.dataset.view);
  if(e.target.closest("[data-inc]")){ cart.find(i=>i.id===e.target.closest("[data-inc]").dataset.inc).qty++; saveCart(); }
  if(e.target.closest("[data-dec]")){ const id=e.target.closest("[data-dec]").dataset.dec; const it=cart.find(i=>i.id===id); it.qty--; if(it.qty<=0) cart=cart.filter(i=>i.id!==id); saveCart(); }
  if(e.target.closest("[data-del]")){ cart=cart.filter(i=>i.id!==e.target.closest("[data-del]").dataset.del); saveCart(); }
  const catLink = e.target.closest("[data-cat-link]");
  if(catLink){ categoryFilter.value = catLink.dataset.catLink; render(); }
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
document.getElementById("menuBtn").onclick = ()=>document.getElementById("nav").classList.toggle("open");

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
    return p ? `${p.name} x${i.qty} — ${fmt(p.price*i.qty)}<br>` : "";
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
document.getElementById("toStep2").onclick = ()=>gotoStep(2);
document.getElementById("backStep1").onclick = ()=>gotoStep(1);
document.getElementById("toStep3").onclick = ()=>gotoStep(3);
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
  // base: card, nxCard, db. Campos extra: Dni, Email, Bill (factura). Sin alert, con ✕ inline.
  clearPayErrs();
  const g = s => (document.getElementById(base+s)?.value || "").trim();
  let firstBad = null;
  const need = (key, ok)=>{ setErr(base==="db"?"db":base, key, !ok); if(!ok && !firstBad) firstBad = (base==="db"?"db":base)+key; return ok; };
  const cName = g("Name"), cNum = g("Number").replace(/\s/g,""), cExp = g("Exp"), cCvv = g("Cvv");
  const cDni = (document.getElementById(base==="db"?"dbDni":base==="nxCard"?"nxDni":"cardDni")?.value||"").trim();
  const cEmail = (document.getElementById(base==="db"?"dbEmail":base==="nxCard"?"nxEmail":"cardEmail")?.value||"").trim();
  const cBill = (document.getElementById(base==="db"?"dbBill":base==="nxCard"?"nxBill":"cardBill")?.value||"").trim();
  let ok = true;
  const short = base==="db"?"db":base;
  ok = need("Name", cName.length>=3) && ok;
  ok = need("Number", /^\d{15,16}$/.test(cNum)) && ok;
  const m = cExp.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  let expOk = !!m;
  if(m){ const yy=2000+parseInt(m[2],10), mm=parseInt(m[1],10); const now=new Date(); if(new Date(yy,mm,0) < new Date(now.getFullYear(),now.getMonth(),1)) expOk=false; }
  // mapear Exp/Cvv a keys reales
  setErr(short, "Exp", !expOk); if(!expOk && !firstBad) firstBad = short+"Exp"; ok = ok && expOk;
  const cvvOk = /^\d{3,4}$/.test(cCvv);
  setErr(short, "Cvv", !cvvOk); if(!cvvOk && !firstBad) firstBad = short+"Cvv"; ok = ok && cvvOk;
  const dniOk = /^\d{7,8}$/.test(cDni);
  setErr(short, "Dni", !dniOk); if(!dniOk && !firstBad) firstBad = short+"Dni"; ok = ok && dniOk;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail);
  setErr(short, "Email", !emailOk); if(!emailOk && !firstBad) firstBad = short+"Email"; ok = ok && emailOk;
  const billOk = cBill.length>=5;
  setErr(short, "Bill", !billOk); if(!billOk && !firstBad) firstBad = short+"Bill"; ok = ok && billOk;
  return {ok, last4: cNum.slice(-4), focus: firstBad, dni: cDni, email: cEmail, bill: cBill};
}
function validCard(base){
  // compat vieja: delega a full pero sin DNI extra para no romper
  const r = validCardFull(base==="db"?"db":base);
  return r.ok ? {ok:true, last4:r.last4} : {ok:false, msg:"Revisá los campos marcados con ✕", focus:r.focus};
}
function fmtCardNum(el){ el.value = el.value.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 "); }
function fmtExp(el){ let v=el.value.replace(/\D/g,"").slice(0,4); if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); el.value=v; }
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
    ...cart.map(i=>{ const p=PRODUCTS.find(x=>x.id===i.id); return p ? `- ${p.name} x${i.qty} = ${fmt(p.price*i.qty)}` : ""; }),
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
    if(em) fetch(AUTH_URL+"/api/pedido/cerrar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em.toLowerCase(),total:grand,cupon:couponCode,provincia:data.prov||"",items:cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);return p?{id:p.id,n:i.qty,pr:p.price}:null})})}).then(()=>refreshMemberZone()).catch(()=>{});
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
document.getElementById("accountBtn").onclick = ()=>{
  if(isAdmin()){
    if(confirm("Sesión admin activa. ¿Ir al panel? (Cancelar = cerrar sesión admin)")){ showAdmin(true); return; }
    sessionStorage.removeItem("acacia_admin");
    showAdmin(false);
    return;
  }
  try {
    const m = JSON.parse(localStorage.getItem("acacia_member")||"null");
    if(m?.nombre && confirm(`Sesión: ${m.nombre} (${m.email})\n¿Cerrar sesión?`)){
      localStorage.removeItem("acacia_member");
      document.getElementById("authState").textContent = "";
      paintMember();
      return;
    }
  } catch {}
  openAuthModal();
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
document.getElementById("loginForm").addEventListener("submit", async e=>{
  e.preventDefault();
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

document.querySelectorAll(".eye[data-eye]").forEach(b=>b.onclick=()=>{
  const inp = document.getElementById(b.dataset.eye);
  if(!inp) return;
  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  b.textContent = show ? "🙈" : "👁";
  b.setAttribute("aria-label", show ? "Ocultar contraseña" : "Ver contraseña");
});

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
  document.getElementById("admin").hidden = !on;
  document.getElementById("adminDash").hidden = !on;
  if(on){ showATab("resumen"); loadStats(); document.getElementById("admin").scrollIntoView({behavior:"smooth"}); }
}
document.querySelectorAll("[data-atab]").forEach(b=>b.onclick=()=>showATab(b.dataset.atab));
function showATab(t){
  ["resumen","prods","peds","users","cupones"].forEach(k=>document.getElementById("atab-"+k).hidden = k!==t);
  if(t==="prods") loadAdmProds();
  if(t==="peds") loadAdmPeds();
  if(t==="users") loadAdmUsers();
  if(t==="cupones") loadCupones();
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
          <label>Foto (URL)<input data-pimg="${p.id}" value="${String(p.img||"").replace(/"/g,"&quot;")}" placeholder="https://... o subí un archivo" /></label>
          <div class="adm-photo-row">
            <label class="btn ghost" style="cursor:pointer">📤 Subir foto<input type="file" data-pfile="${p.id}" accept="image/*" hidden /></label>
            <button type="button" class="btn ghost" data-pdelimg="${p.id}">🗑 Quitar foto</button>
            <button type="button" class="btn primary" data-psave="${p.id}">Guardar</button>
          </div>
          <span class="muted small" data-pmsg="${p.id}"></span>
        </div>
      </div>`;
    }).join("");
    const q = (s,id) => box.querySelector(`[data-p${s}="${id}"]`);
    const getColors = id => [...box.querySelectorAll(`[data-rmchip="${id}"]`)].map(b=>b.dataset.c).join(", ");
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
    box.querySelectorAll("[data-pimg]").forEach(inp=>inp.addEventListener("input", ()=>{
      const id = inp.dataset.pimg;
      const th = box.querySelector(`[data-thumb="${id}"]`);
      if(th) th.src = fullImg(inp.value) || placeholderImg("?");
    }));
    box.querySelectorAll("[data-pfile]").forEach(fi=>fi.onchange=async ()=>{
      const id = fi.dataset.pfile;
      if(!fi.files[0]) return;
      const fd = new FormData();
      fd.append("foto", fi.files[0]);
      const m = box.querySelector(`[data-pmsg="${id}"]`);
      m.textContent = "Subiendo...";
      try {
        const rr = await fetch(AUTH_URL+"/api/admin/upload",{method:"POST",headers:{"x-admin-token":sessionStorage.getItem("acacia_admin")||""},body:fd});
        const dd = await rr.json();
        if(!rr.ok) throw new Error(dd.error||"Error");
        q("img",id).value = dd.full || (AUTH_URL + dd.url);
        box.querySelector(`[data-thumb="${id}"]`).src = dd.full || (AUTH_URL + dd.url);
        m.textContent = "Foto subida ✓ (apretá Guardar)";
      } catch(err) { m.textContent = "✕ "+err.message; }
    });
    box.querySelectorAll("[data-pdelimg]").forEach(b=>b.onclick=()=>{
      const id = b.dataset.pdelimg;
      q("img",id).value = "";
      box.querySelector(`[data-thumb="${id}"]`).src = placeholderImg("?");
      box.querySelector(`[data-pmsg="${id}"]`).textContent = "Foto quitada (apretá Guardar)";
    });
    box.querySelectorAll("[data-psave]").forEach(b=>b.onclick=async ()=>{
      const id = b.dataset.psave;
      const m = box.querySelector(`[data-pmsg="${id}"]`);
      m.textContent = "Guardando...";
      const rr = await fetch(AUTH_URL+"/api/admin/productos/"+id,{method:"PUT",headers:admHeaders(),body:JSON.stringify({nombre:q("name",id).value.trim(),stock:Number(q("stock",id).value),precio:Number(q("price",id).value),img:q("img",id).value.trim(),color:getColors(id)})});
      m.textContent = rr.ok ? "Guardado ✓" : "Error";
      if(rr.ok) syncProducts();
    });
  } catch { box.textContent = "Sin datos"; }
}
document.getElementById("npFile").onchange = async e=>{
  const f = e.target.files[0];
  if(!f) return;
  const fd = new FormData();
  fd.append("foto", f);
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
function paintNpChips(){
  document.getElementById("npChips").innerHTML = [...npColors].map(c=>`<span class="chip">${c}<button type="button" data-nprm="${c}">✕</button></span>`).join("");
  document.querySelectorAll("[data-nprm]").forEach(b=>b.onclick=()=>{ npColors.delete(b.dataset.nprm); paintNpChips(); });
}
document.getElementById("npColorAdd").onclick = ()=>{
  const v = document.getElementById("npColorIn").value.trim().toLowerCase();
  if(v){ npColors.add(v); document.getElementById("npColorIn").value = ""; paintNpChips(); }
};
document.getElementById("npNombre").addEventListener("input", e=>{
  const slug = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60);
  document.getElementById("npId").value = slug;
});
document.getElementById("npSave").onclick = async ()=>{
  const body = { id: document.getElementById("npId").value.trim(), nombre: document.getElementById("npNombre").value.trim(), precio: Number(document.getElementById("npPrecio").value), stock: Number(document.getElementById("npStock").value), categoria: document.getElementById("npCat").value||"mujer", color: [...npColors].join(", "), img: document.getElementById("npImg").value.trim(), descrip: document.getElementById("npDesc").value.trim() };
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
heroShow(0);
heroAuto();
updateCartUI();
syncProducts();
if(BACKEND_ENABLED){ try { fetch(AUTH_URL+"/api/visita",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pagina:location.pathname})}).catch(()=>{}); } catch {} }
if(BACKEND_ENABLED && sessionStorage.getItem("acacia_admin")) showAdmin(true);
