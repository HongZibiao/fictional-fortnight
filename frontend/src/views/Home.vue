<template>
  <Layout>
    <div class="home-container">
      <h2>仪表盘</h2>
      
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><user /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ studentCount }}</h3>
              <p>学生总数</p>
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon course-icon">
              <el-icon><reading /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ courseCount }}</h3>
              <p>课程总数</p>
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon class-icon">
              <el-icon><collection /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ classCount }}</h3>
              <p>班级总数</p>
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon revenue-icon">
              <el-icon><money /></el-icon>
            </div>
            <div class="stat-info">
              <h3>¥{{ totalRevenue }}</h3>
              <p>总收入</p>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-container">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>学生分布</span>
            </div>
          </template>
          <div id="studentChart" class="chart"></div>
        </el-card>
        
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>课程分布</span>
            </div>
          </template>
          <div id="courseChart" class="chart"></div>
        </el-card>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import { User, Reading, Collection, Money } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { api } from '../store/auth';

const studentCount = ref(0);
const courseCount = ref(0);
const classCount = ref(0);
const totalRevenue = ref(0);

// 获取统计数据
const fetchStats = async () => {
  try {
    const [studentStats, courseStats, classStats, financeStats] = await Promise.all([
      api.get('/stats/students'),
      api.get('/stats/courses'),
      api.get('/stats/classes'),
      api.get('/stats/finance')
    ]);
    
    studentCount.value = studentStats.data.totalStudents;
    courseCount.value = courseStats.data.totalCourses;
    classCount.value = classStats.data.totalClasses;
    totalRevenue.value = financeStats.data.totalRevenue;
    
    // 初始化图表
    initStudentChart(studentStats.data);
    initCourseChart(courseStats.data);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// 初始化学生分布图表
const initStudentChart = (data) => {
  const chart = echarts.init(document.getElementById('studentChart'));
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '学生分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.studentsByGender.map(item => ({
          value: item.count,
          name: item._id === 'male' ? '男' : item._id === 'female' ? '女' : '其他'
        }))
      }
    ]
  };
  chart.setOption(option);
};

// 初始化课程分布图表
const initCourseChart = (data) => {
  const chart = echarts.init(document.getElementById('courseChart'));
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '课程分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.coursesByCategory.map(item => ({
          value: item.count,
          name: item._id
        }))
      }
    ]
  };
  chart.setOption(option);
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.home-container {
  padding: 20px 0;
}

.home-container h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  transition: transform 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: #fff;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.class-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.revenue-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  border-radius: 10px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 300px;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 250px;
  }
}
</style>