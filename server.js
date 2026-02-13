const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = req.uploadId || uuidv4();
    req.uploadId = id;
    const dir = path.join(DATA_DIR, id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const names = { photo1: 'photo1.jpg', photo2: 'photo2.jpg', photo3: 'photo3.jpg' };
    const field = file.fieldname;
    cb(null, names[field] || path.basename(file.originalname) || 'photo.jpg');
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('请上传图片（JPG/PNG/GIF/WEBP）'));
  }
}).fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 }
]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const templateHtml = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

function renderPage(data) {
  return templateHtml
    .replace(/\{\{name\}\}/g, escapeHtml(data.name || 'TA'))
    .replace(/\{\{days\}\}/g, escapeHtml(String(data.days || '365')))
    .replace(/\{\{age\}\}/g, escapeHtml(String(data.age || '22')))
    .replace(/\{\{from\}\}/g, escapeHtml(data.from || '某个很爱你的人'));
}

function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s).replace(/[&<>"']/g, c => map[c] || c);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create', (req, res, next) => {
  req.uploadId = uuidv4();
  next();
}, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message || '上传失败' });
    }
    const id = req.uploadId;
    const dir = path.join(DATA_DIR, id);
    const name = (req.body.name || '').trim() || 'TA';
    const days = (req.body.days || '').trim() || '365';
    const age = (req.body.age || '').trim() || '22';
    const from = (req.body.from || '').trim() || '某个很爱你的人';

    const hasAll = fs.existsSync(path.join(dir, 'photo1.jpg')) &&
      fs.existsSync(path.join(dir, 'photo2.jpg')) &&
      fs.existsSync(path.join(dir, 'photo3.jpg'));

    if (!hasAll) {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
      return res.status(400).json({ ok: false, error: '请上传 3 张照片（回忆1、回忆2、回忆3）' });
    }

    const html = renderPage({ name, days, age, from });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const pageUrl = `${baseUrl}/b/${id}`;
    res.json({ ok: true, id, url: pageUrl });
  });
});

app.get('/b/:id', (req, res) => {
  const dir = path.join(DATA_DIR, req.params.id);
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(file)) return res.status(404).send('页面不存在或已过期');
  res.type('html').send(fs.readFileSync(file, 'utf8'));
});

app.get('/b/:id/:file', (req, res) => {
  const dir = path.join(DATA_DIR, req.params.id);
  const file = path.join(dir, req.params.file);
  const allowed = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
  if (!allowed.includes(req.params.file) || !fs.existsSync(file)) return res.status(404).send('Not found');
  res.sendFile(file);
});

app.listen(PORT, () => {
  console.log(`生日惊喜服务已启动: http://localhost:${PORT}`);
});
