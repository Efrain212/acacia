require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || '';

app.use(cors()); // dev: acepta file://, localhost y 127.0.0.1
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ ok: true, gmail: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASS && !process.env.GMAIL_APP_PASS.includes('xxxx')) }));

// --- MySQL clientes (XAMPP por defecto: host 127.0.0.1 user root sin pass, db acacia) ---
const dbConf = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'acacia'
};
let pool = null;
async function db(){
  if(!pool) pool = mysql.createPool({ ...dbConf, waitForConnections: true, connectionLimit: 5 });
  return pool;
}
function genCode(){ return String(Math.floor(100000 + Math.random()*900000)); }
async function sendCodeByGmail(to, code){
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASS;
  if(!user || !pass || pass.includes('xxxx')) throw new Error('Falta GMAIL_USER / GMAIL_APP_PASS en .env');
  const nodemailer = require('nodemailer');
  const tr = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
  await tr.sendMail({
    from: `"Acacia Indumentaria" <${user}>`,
    to,
    subject: 'Tu código Acacia',
    text: `Tu código Acacia es ${code}. Vence en 10 minutos.`,
    html: `<h2>Tu código Acacia es ${code}</h2><p>Vence en 10 minutos. No lo compartas.</p>`
  });
}

// POST /api/auth/check-user ?u=  -> {disponible:true/false}
app.get('/api/auth/check-user', async (req, res) => {
  try {
    const u = String(req.query.u || '').trim().toLowerCase();
    if(!/^[a-z0-9_.]{4,30}$/.test(u)) return res.json({ disponible: false, error: 'Mín 4 letras/números' });
    const p = await db();
    const [rows] = await p.query('SELECT id FROM clientes WHERE usuario=? OR email=?', [u, u]);
    res.json({ disponible: rows.length === 0 });
  } catch(e) { res.json({ disponible: true, demo: true }); }
});

// POST /api/auth/register {nombre,apellido,dni,telefono,email,usuario,password}
app.post('/api/auth/register', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    let { nombre, apellido, dni, telefono, email, usuario, password } = req.body || {};
    nombre = String(nombre||'').trim(); apellido = String(apellido||'').trim();
    dni = String(dni||'').trim(); telefono = String(telefono||'').trim();
    email = String(email||'').trim().toLowerCase(); usuario = String(usuario||'').trim().toLowerCase();
    password = String(password||'');
    if(nombre.length<2 || apellido.length<2) return res.status(400).json({ error: 'Nombre y apellido obligatorios' });
    if(!/^\d{7,8}$/.test(dni)) return res.status(400).json({ error: 'DNI 7-8 dígitos' });
    if(telefono.replace(/\D/g,'').length < 8) return res.status(400).json({ error: 'Teléfono inválido' });
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
    if(!/^[a-z0-9_.]{4,30}$/.test(usuario)) return res.status(400).json({ error: 'Usuario mín 4 letras/números' });
    if(password.length < 6) return res.status(400).json({ error: 'Contraseña mín 6' });
    const p = await db();
    const [ex] = await p.query('SELECT id FROM clientes WHERE usuario=? OR email=?', [usuario, email]);
    if(ex.length) return res.status(400).json({ error: 'Usuario o email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    await p.query('INSERT INTO clientes (email,usuario,pass_hash,nombre,apellido,dni,telefono) VALUES (?,?,?,?,?,?,?)', [email, usuario, hash, nombre, apellido, dni, telefono]);
    res.json({ ok: true, user: { email, usuario, nombre, apellido } });
  } catch(e) {
    console.log('register:', e.message);
    if(e.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ error: 'Falta importar acacia.sql nuevo en phpMyAdmin' });
    res.status(500).json({ error: 'No pude registrar. Revisá MySQL.' });
  }
});

// POST /api/auth/login {login, password} (si es admin, devuelve token admin sin MySQL)
app.post('/api/auth/login', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const login = String(req.body?.login || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if(login === (process.env.ADMIN_USER || 'admin-acacia') && password === (process.env.ADMIN_PASS || 'aca.admin98')){
      const tok = Math.random().toString(36).slice(2) + Date.now().toString(36);
      adminTokens.set(tok, Date.now());
      return res.json({ ok: true, admin: true, token: tok, user: { usuario: login, nombre: 'Admin' } });
    }
    const p = await db();
    const [rows] = await p.query('SELECT * FROM clientes WHERE usuario=? OR email=? LIMIT 1', [login, login]);
    if(!rows.length) return res.status(400).json({ error: 'Usuario no encontrado' });
    const ok = await bcrypt.compare(password, rows[0].pass_hash);
    if(!ok) return res.status(400).json({ error: 'Contraseña incorrecta' });
    const u = rows[0];
    res.json({ ok: true, user: { email: u.email, usuario: u.usuario, nombre: u.nombre, apellido: u.apellido } });
  } catch(e) { console.log('login:', e.message); res.status(500).json({ error: 'No pude entrar. Revisá MySQL.' }); }
});

// POST /api/auth/forgot {email} -> envía código de recuperación al Gmail registrado
app.post('/api/auth/forgot', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
    const p = await db();
    await p.query(`CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL,
      codigo CHAR(6) NOT NULL, expira DATETIME NOT NULL, usado TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX(email))`);
    const [cli] = await p.query('SELECT id FROM clientes WHERE email=?', [email]);
    if(!cli.length) return res.status(400).json({ error: 'Ese email no está registrado' });
    const code = genCode();
    await p.query('INSERT INTO password_resets (email, codigo, expira) VALUES (?,?,?)', [email, code, new Date(Date.now()+15*60*1000)]);
    try { await sendCodeByGmail(email, code); }
    catch(e) { console.log('gmail:', e.message); return res.status(500).json({ error: 'No pude enviar el Gmail. Revisá GMAIL_USER/APP_PASS del backend.' }); }
    res.json({ ok: true, sent: true });
  } catch(e) { console.log('forgot:', e.message); res.status(500).json({ error: 'No pude procesar. Revisá MySQL.' }); }
});

// POST /api/auth/reset {email, codigo, password} -> cambia contraseña
app.post('/api/auth/reset', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const email = String(req.body?.email || '').trim().toLowerCase();
    const codigo = String(req.body?.codigo || '').trim();
    const password = String(req.body?.password || '');
    if(!/^\d{6}$/.test(codigo)) return res.status(400).json({ error: 'Código 6 dígitos' });
    if(password.length < 6) return res.status(400).json({ error: 'Contraseña mín 6' });
    const p = await db();
    const [rows] = await p.query('SELECT * FROM password_resets WHERE email=? AND usado=0 ORDER BY id DESC LIMIT 1', [email]);
    if(!rows.length || rows[0].codigo !== codigo || new Date(rows[0].expira) < new Date())
      return res.status(400).json({ error: 'Código incorrecto o vencido' });
    const hash = await bcrypt.hash(password, 10);
    await p.query('UPDATE clientes SET pass_hash=? WHERE email=?', [hash, email]);
    await p.query('UPDATE password_resets SET usado=1 WHERE id=?', [rows[0].id]);
    res.json({ ok: true });
  } catch(e) { console.log('reset:', e.message); res.status(500).json({ error: 'No pude cambiarla. Revisá MySQL.' }); }
});

// Promos: ACACIA10 10% todos, MIEMBRO15 15% solo miembros (logueados en MySQL)
const CUPON_DDL = `CREATE TABLE IF NOT EXISTS cupones (
  id INT AUTO_INCREMENT PRIMARY KEY, codigo VARCHAR(40) NOT NULL,
  descuento DECIMAL(4,3) NOT NULL, email VARCHAR(190) NOT NULL DEFAULT '',
  solo_miembros TINYINT DEFAULT 0, activo TINYINT DEFAULT 1,
  usado TINYINT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(codigo, email))`;
async function ensureCupones(p){
  await p.query(CUPON_DDL);
  for(const c of ['solo_miembros','activo']){
    try { await p.query(`ALTER TABLE cupones ADD COLUMN IF NOT EXISTS ${c} TINYINT DEFAULT ${c==='activo'?1:0}`); } catch {}
  }
}
app.post('/api/promos/validate', async (req, res) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase();
    const email = String(req.body?.email || '').trim().toLowerCase();
    if(code === 'ACACIA10') return res.json({ ok: true, code, desc: 0.10 });
    if(code === 'MIEMBRO15'){
      if(!email) return res.status(400).json({ error: 'MIEMBRO15 solo para miembros logueados' });
      const p = await db();
      const [rows] = await p.query('SELECT id FROM clientes WHERE email=?', [email]);
      if(!rows.length) return res.status(400).json({ error: 'MIEMBRO15 solo para miembros registrados' });
      return res.json({ ok: true, code, desc: 0.15 });
    }
    // cupones de admin: activos, no usados; respeta email y solo_miembros
    try {
      const p = await db();
      await ensureCupones(p);
      const [rows] = await p.query('SELECT * FROM cupones WHERE codigo=? AND activo=1 AND usado=0 AND (email=? OR email="") LIMIT 1', [code, email]);
      if(rows.length){
        const c = rows[0];
        if(c.solo_miembros){
          if(!email) return res.status(400).json({ error: 'Ese cupón es solo para miembros' });
          const [m] = await p.query('SELECT id FROM clientes WHERE email=?', [email]);
          if(!m.length) return res.status(400).json({ error: 'Ese cupón es solo para miembros registrados' });
        }
        return res.json({ ok: true, code, desc: Number(c.descuento) });
      }
    } catch(e) { console.log('cupones:', e.message); }
    res.status(400).json({ error: 'Cupón inválido. Probá ACACIA10' });
  } catch(e) { res.status(500).json({ error: 'Error validando' }); }
});

// Puntos: 1 punto cada $1000 de compra. Resumen + suma + cupones del miembro
app.get('/api/miembro/resumen', async (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    const p = await db();
    try { await p.query('ALTER TABLE clientes ADD COLUMN IF NOT EXISTS puntos INT DEFAULT 0'); } catch {}
    await ensureCupones(p);
    const [cli] = await p.query('SELECT puntos FROM clientes WHERE email=?', [email]);
    if(!cli.length) return res.status(400).json({ error: 'No miembro' });
    const [cups] = await p.query('SELECT codigo, descuento, usado, solo_miembros, activo, email AS para_email FROM cupones WHERE (email=? OR email="") AND activo=1 ORDER BY id DESC LIMIT 20', [email]);
    res.json({ ok: true, puntos: cli[0].puntos || 0, cupones: cups });
  } catch(e) { res.status(500).json({ error: 'Error' }); }
});

// POST /api/pedido/cerrar {email, total, cupon} -> suma puntos y marca cupón usado
app.post('/api/pedido/cerrar', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const total = Number(req.body?.total || 0);
    const cupon = String(req.body?.cupon || '').trim().toUpperCase();
    const provincia = String(req.body?.provincia || '').slice(0,80);
    const items = JSON.stringify(req.body?.items || []).slice(0,4000);
    if(!email) return res.json({ ok: true, puntos: 0 });
    const p = await db();
    try { await p.query('ALTER TABLE clientes ADD COLUMN IF NOT EXISTS puntos INT DEFAULT 0'); } catch {}
    const pts = Math.floor(total / 1000);
    if(pts > 0) await p.query('UPDATE clientes SET puntos = puntos + ? WHERE email=?', [pts, email]);
    if(cupon && cupon !== 'ACACIA10' && cupon !== 'MIEMBRO15')
      await p.query('UPDATE cupones SET usado=1 WHERE codigo=? AND (email=? OR email="")', [cupon, email]);
    try { await p.query('INSERT INTO pedidos (email,total,provincia,items) VALUES (?,?,?,?)', [email, total, provincia, items]); } catch {}
    const [cli] = await p.query('SELECT puntos FROM clientes WHERE email=?', [email]);
    res.json({ ok: true, puntos: cli.length ? cli[0].puntos : pts });
  } catch(e) { res.json({ ok: true, demo: true }); }
});

// Admin: crear cupón (sesión admin con token, o clave x-admin-key)
app.post('/api/admin/cupon', async (req, res) => {
  try {
    const tok = req.headers['x-admin-token'] || '';
    const key = req.headers['x-admin-key'] || '';
    if(!(tok && adminTokens.has(tok)) && key !== (process.env.ADMIN_KEY || 'acacia-admin'))
      return res.status(401).json({ error: 'Sin permiso' });
    const email = String(req.body?.email || '').trim().toLowerCase();
    const codigo = String(req.body?.codigo || '').trim().toUpperCase();
    const desc = Number(req.body?.descuento || 0);
    const soloM = req.body?.soloMiembros ? 1 : 0;
    if(!/^[A-Z0-9]{4,20}$/.test(codigo) || !(desc > 0 && desc < 1)) return res.status(400).json({ error: 'Código A-Z0-9 4-20 y descuento 0-1 (ej 0.20)' });
    const p = await db();
    await ensureCupones(p);
    await p.query('INSERT INTO cupones (codigo, descuento, email, solo_miembros) VALUES (?,?,?,?)', [codigo, desc, email, soloM]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.code === 'ER_DUP_ENTRY' ? 'Ese cupón ya existe' : 'Error' }); }
});
// Admin: listar / editar / borrar cupones
function requireAdmin(req, res, next){
  const t = req.headers['x-admin-token'] || '';
  if(t && adminTokens.has(t)) return next();
  res.status(401).json({ error: 'Admin no logueado' });
}
app.get('/api/admin/cupones', requireAdmin, async (req, res) => {
  try { await ensureCupones(await db()); const [rows] = await (await db()).query('SELECT * FROM cupones ORDER BY id DESC LIMIT 100'); res.json({ ok: true, cupones: rows }); }
  catch(e) { res.status(500).json({ error: 'Error' }); }
});
app.put('/api/admin/cupones/:id', requireAdmin, async (req, res) => {
  try {
    const { codigo, descuento, email, solo_miembros, activo } = req.body || {};
    await (await db()).query('UPDATE cupones SET codigo=COALESCE(?,codigo), descuento=COALESCE(?,descuento), email=COALESCE(?,email), solo_miembros=COALESCE(?,solo_miembros), activo=COALESCE(?,activo) WHERE id=?',
      [codigo??null, descuento??null, email??null, solo_miembros??null, activo??null, req.params.id]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Error' }); }
});
app.delete('/api/admin/cupones/:id', requireAdmin, async (req, res) => {
  try { await (await db()).query('DELETE FROM cupones WHERE id=?', [req.params.id]); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: 'Error' }); }
});

// ===== ADMIN (demo local: cambiar ADMIN_USER/ADMIN_PASS en .env para producción) =====
const ADMIN_USER = process.env.ADMIN_USER || 'admin-acacia';
const ADMIN_PASS = process.env.ADMIN_PASS || 'aca.admin98';
const adminTokens = new Map();
async function initShopTables(){
  const p = await db();
  await p.query(`CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL UNIQUE,
    usuario VARCHAR(60) UNIQUE, pass_hash VARCHAR(255),
    nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) DEFAULT '', telefono VARCHAR(40) DEFAULT '',
    nacimiento DATE NULL, acepto_terminos TINYINT(1) DEFAULT 1,
    puntos INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await p.query(`CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(60) PRIMARY KEY, nombre VARCHAR(120) NOT NULL, precio INT NOT NULL DEFAULT 0,
    categoria VARCHAR(40) DEFAULT 'mujer', color VARCHAR(40) DEFAULT '', img TEXT DEFAULT '',
    descrip TEXT DEFAULT '', stock INT DEFAULT 10)`);
  await p.query(`CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) DEFAULT '', total INT DEFAULT 0,
    provincia VARCHAR(80) DEFAULT '', items TEXT DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(email), INDEX(provincia))`);
  await p.query(`CREATE TABLE IF NOT EXISTS visitas (
    id INT AUTO_INCREMENT PRIMARY KEY, pagina VARCHAR(120) DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const [rows] = await p.query('SELECT COUNT(*) c FROM productos');
  if(!rows[0].c){
    const seed = [
      ['pollera-tiare','Pollera tiare',21990,'mujer','Beige','https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000405382-16a7959d2f2435a85117892384089343-480-0.webp','Pollera tiare. Envío gratis.',2],
      ['vestido-helecho','Vestido helecho',26690,'mujer','Marrón','https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000393704-d052442b0ddbbbf42e17887202792111-480-0.webp','Vestido helecho.',1],
      ['musculosa-azalea','Musculosa Lycra Azalea',18200,'mujer','Negro','https://dcdn-us.mitiendanube.com/stores/008/201/704/products/1000395703-95f4f1dbec47d2dc0517887028203195-480-0.webp','Microfibra Lycra.',1]
    ];
    for(const s of seed) await p.query('INSERT INTO productos (id,nombre,precio,categoria,color,img,descrip,stock) VALUES (?,?,?,?,?,?,?,?)', s);
  }
}
function requireAdmin(req, res, next){
  const t = req.headers['x-admin-token'] || '';
  if(t && adminTokens.has(t)) return next();
  res.status(401).json({ error: 'Admin no logueado' });
}
app.post('/api/admin/login', (req, res) => {
  const { usuario, password } = req.body || {};
  if(usuario === ADMIN_USER && password === ADMIN_PASS){
    const tok = Math.random().toString(36).slice(2) + Date.now().toString(36);
    adminTokens.set(tok, Date.now());
    return res.json({ ok: true, token: tok });
  }
  res.status(401).json({ error: 'Usuario o contraseña admin incorrectos' });
});
// Productos públicos (con stock). Si MySQL cae, el front usa lista local.
app.get('/api/productos', async (req, res) => {
  try { await initShopTables(); const [rows] = await (await db()).query('SELECT * FROM productos'); res.json({ ok: true, productos: rows }); }
  catch(e) { res.status(500).json({ error: 'Sin DB' }); }
});
// Visita (contador de visualizaciones)
app.post('/api/visita', async (req, res) => {
  try { await initShopTables(); await (await db()).query('INSERT INTO visitas (pagina) VALUES (?)', [String(req.body?.pagina||'/').slice(0,120)]); } catch {}
  res.json({ ok: true });
});
// Stats admin
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    await initShopTables();
    const p = await db();
    const [[u]] = await p.query('SELECT COUNT(*) c FROM clientes');
    const [[v]] = await p.query('SELECT COUNT(*) c FROM pedidos');
    const [[vt]] = await p.query('SELECT COALESCE(SUM(total),0) t FROM pedidos');
    const [[vs]] = await p.query('SELECT COUNT(*) c FROM visitas');
    const [prov] = await p.query('SELECT provincia, COUNT(*) n, COALESCE(SUM(total),0) total FROM pedidos GROUP BY provincia ORDER BY n DESC LIMIT 15');
    const [stock] = await p.query('SELECT id, nombre, stock, precio, img FROM productos ORDER BY stock ASC');
    res.json({ ok: true, usuarios: u.c, ventas: v.c, totalVentas: vt.t, visitas: vs.c, porProvincia: prov, stock });
  } catch(e) { res.status(500).json({ error: 'Error stats' }); }
});
app.get('/api/admin/pedidos', requireAdmin, async (req, res) => {
  try { const [rows] = await (await db()).query('SELECT * FROM pedidos ORDER BY id DESC LIMIT 100'); res.json({ ok: true, pedidos: rows }); }
  catch(e) { res.status(500).json({ error: 'Error' }); }
});
app.get('/api/admin/usuarios', requireAdmin, async (req, res) => {
  try { const [rows] = await (await db()).query('SELECT id,email,usuario,nombre,apellido,puntos,created_at FROM clientes ORDER BY id DESC LIMIT 200'); res.json({ ok: true, usuarios: rows }); }
  catch(e) { res.status(500).json({ error: 'Error' }); }
});
app.put('/api/admin/productos/:id', requireAdmin, async (req, res) => {
  try {
    const { nombre, precio, img, stock, categoria, color, descrip } = req.body || {};
    await (await db()).query('UPDATE productos SET nombre=COALESCE(?,nombre), precio=COALESCE(?,precio), img=COALESCE(?,img), stock=COALESCE(?,stock), categoria=COALESCE(?,categoria), color=COALESCE(?,color), descrip=COALESCE(?,descrip) WHERE id=?',
      [nombre??null, precio??null, img??null, stock??null, categoria??null, color??null, descrip??null, req.params.id]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Error' }); }
});
app.post('/api/admin/productos', requireAdmin, async (req, res) => {
  try {
    const { id, nombre, precio, categoria, color, img, descrip, stock } = req.body || {};
    if(!id || !nombre) return res.status(400).json({ error: 'id y nombre obligatorios' });
    await (await db()).query('INSERT INTO productos (id,nombre,precio,categoria,color,img,descrip,stock) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre),precio=VALUES(precio),categoria=VALUES(categoria),color=VALUES(color),img=VALUES(img),descrip=VALUES(descrip),stock=VALUES(stock)',
      [id, nombre, Number(precio)||0, categoria||'mujer', color||'', img||'', descrip||'', Number(stock)||0]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: 'Error' }); }
});
// Subir foto de producto (multipart campo "foto", máx 5MB, solo imágenes). Devuelve {url}
app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  try {
    const fs = require('fs'), path = require('path');
    const multer = require('multer');
    const dir = path.join(__dirname, 'uploads');
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const storage = multer.diskStorage({
      destination: dir,
      filename: (r, f, cb) => cb(null, Date.now() + '-' + f.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_'))
    });
    const up = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (r, f, cb) => cb(null, /^image\//.test(f.mimetype)) }).single('foto');
    up(req, res, err => {
      if(err) return res.status(400).json({ error: 'Archivo inválido (solo imágenes hasta 5MB)' });
      if(!req.file) return res.status(400).json({ error: 'Subí una imagen' });
      res.json({ ok: true, url: '/uploads/' + req.file.filename, full: `http://localhost:${PORT}/uploads/` + req.file.filename });
    });
  } catch(e) { res.status(500).json({ error: 'Error subiendo' }); }
});
// POST /api/auth/request-code { email } (legado, se mantiene por compatibilidad)
app.post('/api/auth/request-code', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email inválido' });
    const code = genCode();
    const expira = new Date(Date.now() + 10*60*1000);
    try {
      const p = await db();
      await p.query('INSERT INTO codigos (email, codigo, expira) VALUES (?,?,?)', [email, code, expira]);
    } catch(e) { console.log('MySQL no disponible:', e.message); }
    try {
      await sendCodeByGmail(email, code);
    } catch(e) {
      console.log('Gmail no configurado:', e.message);
      return res.status(500).json({ error: 'No pude enviar el email. Configurá GMAIL_USER y GMAIL_APP_PASS en el backend .env' });
    }
    res.json({ ok: true, sent: true });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Error' }); }
});

// POST /api/auth/verify { email, codigo, nombre, apellido, nacimiento, acepto }
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, codigo, nombre, apellido, nacimiento, acepto } = req.body || {};
    const em = String(email||'').trim().toLowerCase();
    if(!/^\d{6}$/.test(String(codigo||''))) return res.status(400).json({ error: 'Código inválido' });
    if(!nombre || !apellido) return res.status(400).json({ error: 'Faltan datos' });
    if(!acepto) return res.status(400).json({ error: 'Aceptá términos' });
    try {
      const p = await db();
      const [rows] = await p.query('SELECT * FROM codigos WHERE email=? ORDER BY id DESC LIMIT 1', [em]);
      if(rows.length && rows[0].codigo === String(codigo) && new Date(rows[0].expira) > new Date()){
        await p.query('INSERT INTO clientes (email,nombre,apellido,nacimiento) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellido=VALUES(apellido), nacimiento=VALUES(nacimiento)', [em, nombre, apellido, nacimiento || null]);
        return res.json({ ok: true, user: { email: em, nombre, apellido } });
      }
      return res.status(400).json({ error: 'Código incorrecto o vencido. Revisá tu Gmail.' });
    } catch(e) {
      console.log('MySQL error:', e.message);
      return res.status(500).json({ error: 'No pude validar. Revisá que MySQL esté corriendo e importaste acacia.sql' });
    }
  } catch(e) { console.error(e); res.status(500).json({ error: 'Error' }); }
});

// POST /api/create-preference  { items: [{title, quantity, unit_price}], payerEmail }
app.post('/api/create-preference', async (req, res) => {
  try {
    if (!MP_TOKEN || MP_TOKEN.includes('xxxx')) {
      return res.status(500).json({ error: 'Falta MP_ACCESS_TOKEN en .env (usá credencial TEST de developers.mercadopago.com)' });
    }
    const { items, payerEmail } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    const body = {
      items: items.map(i => ({
        title: String(i.title).slice(0, 60),
        quantity: Number(i.quantity) || 1,
        currency_id: 'ARS',
        unit_price: Number(i.unit_price)
      })),
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: (process.env.FRONT_URL || 'http://localhost:5500') + '/?pago=exito',
        failure: (process.env.FRONT_URL || 'http://localhost:5500') + '/?pago=fallo',
        pending: (process.env.FRONT_URL || 'http://localhost:5500') + '/?pago=pendiente'
      },
      auto_return: 'approved',
      statement_descriptor: 'ACACIA',
      external_reference: 'acacia-' + Date.now()
    };

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + MP_TOKEN },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    // data.init_point (prod) y data.sandbox_init_point (test)
    res.json({ id: data.id, init_point: data.sandbox_init_point || data.init_point, raw: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error creando preferencia' });
  }
});

app.listen(PORT, () => {
  console.log('Acacia backend en http://localhost:' + PORT);
  initShopTables().then(()=>console.log('Tablas listas')).catch(e=>console.log('Tablas pendientes:', e.message));
});
