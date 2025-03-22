const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // 用于生成 JWT
// const bcrypt = require('bcryptjs'); // 用于验证密码

const router = express.Router();

// 🔹 用户注册
router.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: '用户已存在' });
        }
        
        const user = new User({ name, email, password, age });
        await user.save();
        const token = user.generateAuthToken(); // 生成 Token
        res.status(201).json({ message: '用户注册成功', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔹 用户登录
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '用户不存在' });
        }
        
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: '密码错误' });
        }
        
        const token = user.generateAuthToken(); // 生成 Token
        res.json({ message: '登录成功', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔹 获取当前用户信息（需要认证）
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '未授权' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: '用户未找到' });
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: '无效的 Token' });
    }
});

module.exports = router;
