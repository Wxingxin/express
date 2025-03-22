const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users'); // 引入用户路由
const jwt = require('jsonwebtoken');  // 导入 jsonwebtoken


const app = express();
const PORT = process.env.PORT || 8080;

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/express-demo')
    .then(() => console.log('✅ MongoDB 连接成功'))
    .catch(err => console.error('❌ MongoDB 连接失败', err));

// 中间件
app.use(cors());
app.use(express.json());

// 绑定用户路由
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
