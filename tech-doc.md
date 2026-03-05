# 少儿编程培训学生管理系统技术方案

## 1. 系统架构

### 1.1 技术栈选择

#### 前端
- **框架**: Vue 3
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP请求**: Axios
- **表单验证**: VeeValidate
- **图表库**: ECharts
- **样式**: SCSS

#### 后端
- **语言**: Node.js
- **框架**: Express
- **数据库**: MongoDB
- **认证**: JWT
- **ORM**: Mongoose
- **API文档**: Swagger
- **日志**: Winston
- **测试**: Jest

### 1.2 系统模块

1. **用户管理模块**
   - 登录/注册
   - 权限控制
   - 个人信息管理

2. **学生管理模块**
   - 学生信息CRUD
   - 学生档案管理
   - 学习进度跟踪

3. **课程管理模块**
   - 课程信息CRUD
   - 课程内容管理
   - 课程进度管理

4. **班级管理模块**
   - 班级信息CRUD
   - 班级学生管理
   - 班级课程管理

5. **数据统计模块**
   - 学生统计
   - 课程统计
   - 班级统计
   - 财务统计

## 2. 数据库设计

### 2.1 集合设计

#### users 集合
```javascript
{
  _id: ObjectId,
  username: String,       // 用户名
  password: String,       // 密码（加密）
  role: String,           // 角色：admin/teacher/parent
  name: String,           // 真实姓名
  email: String,          // 邮箱
  phone: String,          // 电话
  createdAt: Date,
  updatedAt: Date
}
```

#### students 集合
```javascript
{
  _id: ObjectId,
  name: String,           // 姓名
  gender: String,         // 性别
  age: Number,            // 年龄
  grade: String,          // 年级
  parentName: String,     // 家长姓名
  parentPhone: String,    // 家长电话
  email: String,          // 邮箱
  address: String,        // 地址
  enrolledCourses: [      // 已报名课程
    {
      courseId: ObjectId,
      enrollmentDate: Date,
      progress: Number     // 学习进度（百分比）
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### courses 集合
```javascript
{
  _id: ObjectId,
  name: String,           // 课程名称
  description: String,    // 课程描述
  level: String,          // 难度级别
  duration: Number,       // 课程时长（小时）
  price: Number,          // 价格
  category: String,       // 课程类别
  createdAt: Date,
  updatedAt: Date
}
```

#### classes 集合
```javascript
{
  _id: ObjectId,
  name: String,           // 班级名称
  courseId: ObjectId,     // 关联课程
  teacherId: ObjectId,    // 关联老师
  studentIds: [ObjectId], // 学生ID数组
  startDate: Date,        // 开始日期
  endDate: Date,          // 结束日期
  schedule: String,       // 上课时间安排
  createdAt: Date,
  updatedAt: Date
}
```

## 3. API设计

### 3.1 认证相关
- **POST /api/auth/login** - 用户登录
- **POST /api/auth/register** - 用户注册
- **GET /api/auth/profile** - 获取用户信息
- **PUT /api/auth/profile** - 更新用户信息

### 3.2 学生管理
- **GET /api/students** - 获取学生列表
- **POST /api/students** - 创建学生
- **GET /api/students/:id** - 获取学生详情
- **PUT /api/students/:id** - 更新学生信息
- **DELETE /api/students/:id** - 删除学生

### 3.3 课程管理
- **GET /api/courses** - 获取课程列表
- **POST /api/courses** - 创建课程
- **GET /api/courses/:id** - 获取课程详情
- **PUT /api/courses/:id** - 更新课程信息
- **DELETE /api/courses/:id** - 删除课程

### 3.4 班级管理
- **GET /api/classes** - 获取班级列表
- **POST /api/classes** - 创建班级
- **GET /api/classes/:id** - 获取班级详情
- **PUT /api/classes/:id** - 更新班级信息
- **DELETE /api/classes/:id** - 删除班级

### 3.5 统计相关
- **GET /api/stats/students** - 学生统计
- **GET /api/stats/courses** - 课程统计
- **GET /api/stats/classes** - 班级统计
- **GET /api/stats/finance** - 财务统计

## 4. 前端设计

### 4.1 页面结构
- **登录/注册页**
- **仪表盘**
- **学生管理**
  - 学生列表
  - 学生详情
  - 添加学生
  - 编辑学生
- **课程管理**
  - 课程列表
  - 课程详情
  - 添加课程
  - 编辑课程
- **班级管理**
  - 班级列表
  - 班级详情
  - 添加班级
  - 编辑班级
- **统计报表**
  - 学生统计
  - 课程统计
  - 班级统计
  - 财务统计
- **个人中心**

### 4.2 功能特性
- 响应式设计
- 表单验证
- 数据表格
- 图表展示
- 权限控制
- 搜索筛选
- 分页功能

## 5. 部署方案

### 5.1 开发环境
- 前端：npm run dev
- 后端：node server.js
- 数据库：MongoDB本地实例

### 5.2 生产环境
- 前端：npm run build 构建静态文件
- 后端：使用PM2进程管理
- 数据库：MongoDB Atlas
- 部署平台：Vercel + Heroku

## 6. 安全考虑

- JWT认证
- 密码加密
- 输入验证
- CORS配置
- 防止SQL注入
- 日志记录

## 7. 性能优化

- 数据库索引
- 缓存策略
- 代码分割
- 图片优化
- 懒加载

## 8. 项目结构

### 8.1 前端结构
```
frontend/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   ├── views/           # 页面
│   ├── router/          # 路由
│   ├── store/           # 状态管理
│   ├── services/        # API服务
│   ├── utils/           # 工具函数
│   ├── styles/          # 样式
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 公共文件
├── package.json         # 依赖配置
└── vite.config.js       # Vite配置
```

### 8.2 后端结构
```
backend/
├── src/
│   ├── controllers/     # 控制器
│   ├── models/          # 模型
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── services/        # 服务
│   ├── utils/           # 工具函数
│   ├── config/          # 配置
│   └── app.js           # 应用入口
├── package.json         # 依赖配置
└── server.js            # 服务器启动文件
```