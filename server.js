const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, 'public')));

// Diğer tüm GET istekleri için 404 sayfası (API yollarını etkilemez)
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
