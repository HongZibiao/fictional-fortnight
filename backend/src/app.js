const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入数据库连接
const connectDB = require('./config/db');

// 导入路由
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const classRoutes = require('./routes/classes');
const statsRoutes = require('./routes/stats');

// 导入中间件
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 连接数据库
connectDB();

// 配置CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/stats', statsRoutes);

// 错误处理中间件
app.use(errorHandler);

module.exports = app;