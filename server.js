const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 靜態檔案服務
app.use(express.static(path.join(__dirname)));

// 所有路由都回傳 index.html (用於 SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎨 前端伺服器啟動成功，端口：${PORT}`);
  console.log(`🌐 訪問地址：http://localhost:${PORT}`);
});