const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 靜態檔案服務
app.use(express.static(path.join(__dirname)));

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: '北商熱音社前端服務 - Vercel',
    timestamp: new Date().toISOString()
  });
});

// 所有路由回傳 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel 會自動處理端口，本地開發時使用
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🎨 前端伺服器啟動成功，端口：${PORT}`);
  });
}

// 導出給 Vercel 使用
module.exports = app;