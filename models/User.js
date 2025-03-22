const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 用于加密密码

const jwt = require('jsonwebtoken'); // 用于生成 JWT Token

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true }
});

// 加密密码
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 检查密码是否匹配
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// 生成JWT Token
UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return token;
};

module.exports = mongoose.model('User', UserSchema);
