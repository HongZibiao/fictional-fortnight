const app = require('./src/app');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});