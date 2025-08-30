const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve todos os arquivos estáticos

// Habilita CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rota raiz para evitar erros
app.get('/', (req, res) => {
    res.json({ message: 'API do Mercado funcionando!' });
});

// Garantir que a pasta data existe
if (!fs.existsSync('data')) {
    fs.mkdirSync('data', { recursive: true });
}

// Inicializar db.json se não existir
if (!fs.existsSync('data/db.json')) {
    fs.writeFileSync('data/db.json', JSON.stringify({ carousel: [], products: [] }, null, 2));
}

// Rotas da API (mantenha as existentes...)
app.get('/api/carousel', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
        res.json(db.carousel || []);
    } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
        res.status(500).json({ error: 'Erro ao carregar carrossel' });
    }
});

app.post('/api/carousel', (req, res) => {
  try {
    let db = { carousel: [], products: [] };
    
    // Carregar dados existentes
    if (fs.existsSync('data/db.json')) {
      db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
    }
    
    const newItem = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      category: req.body.category,
      status: req.body.status,
      image: req.body.image || 'https://via.placeholder.com/300x200?text=Imagem',
      date: new Date().toISOString()
    };
    
    db.carousel.push(newItem);
    
    // Garantir que a pasta data existe
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
    
    // Salvar dados
    fs.writeFileSync('data/db.json', JSON.stringify(db, null, 2));
    
    res.json({ success: true, item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API para produtos
app.get('/api/products', (req, res) => {
  try {
    if (fs.existsSync('data/db.json')) {
      const db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
      res.json(db.products || []);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar produtos' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    let db = { carousel: [], products: [] };
    
    if (fs.existsSync('data/db.json')) {
      db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
    }
    
    const newProduct = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      status: req.body.status,
      image: req.body.image || 'https://via.placeholder.com/200x150?text=Produto',
      date: new Date().toISOString()
    };
    
    db.products.push(newProduct);
    
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
    
    fs.writeFileSync('data/db.json', JSON.stringify(db, null, 2));
    
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel admin: http://localhost:${PORT}/admin.html`);
}); 