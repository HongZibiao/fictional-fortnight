<template>
  <Layout>
    <div class="stats-container">
      <h2>统计报表</h2>
      
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><user /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ studentStats.totalStudents }}</h3>
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
              <h3>{{ courseStats.totalCourses }}</h3>
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
              <h3>{{ classStats.totalClasses }}</h3>
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
              <h3>¥{{ financeStats.totalRevenue }}</h3>
              <p>总收入</p>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-container">
        <!-- 学生分布图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>学生性别分布</span>
            </div>
          </template>
          <div id="studentGenderChart" class="chart"></div>
        </el-card>
        
        <!-- 学生年龄分布图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>学生年龄分布</span>
            </div>
          </template>
          <div id="studentAgeChart" class="chart"></div>
        </el-card>
        
        <!-- 课程难度分布图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>课程难度分布</span>
            </div>
          </template>
          <div id="courseLevelChart" class="chart"></div>
        </el-card>
        
        <!-- 课程类别分布图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>课程类别分布</span>
            </div>
          </template>
          <div id="courseCategoryChart" class="chart"></div>
        </el-card>
        
        <!-- 班级规模分布图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>班级规模分布</span>
            </div>
          </template>
          <div id="classSizeChart" class="chart"></div>
        </el-card>
        
        <!-- 财务统计图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>财务统计</span>
            </div>
          </template>
          <div id="financeChart" class="chart"></div>
        </el-card>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Layout from '../components/Layout.vue';
import { User, Reading, Collection, Money } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { api } from '../store/auth';

const studentStats = ref({
  totalStudents: 0,
  studentsByGender: [],
  studentsByAge: [],
  studentsByGrade: []
});

const courseStats = ref({
  totalCourses: 0,
  coursesByLevel: [],
  coursesByCategory: [],
  averageCoursePrice: 0
});

const classStats = ref({
  totalClasses: 0,
  classesByCourse: [],
  averageClassSize: 0
});

const financeStats = ref({
  totalRevenue: 0
});

// 获取统计数据
const fetchStats = async () => {
  try {
    const [studentData, courseData, classData, financeData] = await Promise.all([
      api.get('/stats/students'),
      api.get('/stats/courses'),
      api.get('/stats/classes'),
      api.get('/stats/finance')
    ]);
    
    studentStats.value = studentData.data;
    courseStats.value = courseData.data;
    classStats.value = classData.data;
    financeStats.value = financeData.data;
    
    // 初始化图表
    initStudentGenderChart();
    initStudentAgeChart();
    initCourseLevelChart();
    initCourseCategoryChart();
    initClassSizeChart();
    initFinanceChart();
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// 初始化学生性别分布图表
const initStudentGenderChart = () => {
  const chart = echarts.init(document.getElementById('studentGenderChart'));
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
        name: '学生性别分布',
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
        data: studentStats.value.studentsByGender.map(item => ({
          value: item.count,
          name: item._id === 'male' ? '男' : item._id === 'female' ? '女' : '其他'
        }))
      }
    ]
  };
  chart.setOption(option);
};

// 初始化学生年龄分布图表
const initStudentAgeChart = () => {
  const chart = echarts.init(document.getElementById('studentAgeChart'));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: studentStats.value.studentsByAge.map(item => item._id)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '学生人数',
        type: 'bar',
        data: studentStats.value.studentsByAge.map(item => item.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  };
  chart.setOption(option);
};

// 初始化课程难度分布图表
const initCourseLevelChart = () => {
  const chart = echarts.init(document.getElementById('courseLevelChart'));
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
        name: '课程难度分布',
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
        data: courseStats.value.coursesByLevel.map(item => ({
          value: item.count,
          name: item._id === 'beginner' ? '初级' : item._id === 'intermediate' ? '中级' : '高级'
        }))
      }
    ]
  };
  chart.setOption(option);
};

// 初始化课程类别分布图表
const initCourseCategoryChart = () => {
  const chart = echarts.init(document.getElementById('courseCategoryChart'));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courseStats.value.coursesByCategory.map(item => item._id),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '课程数量',
        type: 'bar',
        data: courseStats.value.coursesByCategory.map(item => item.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f093fb' },
            { offset: 0.5, color: '#f5576c' },
            { offset: 1, color: '#f5576c' }
          ])
        }
      }
    ]
  };
  chart.setOption(option);
};

// 初始化班级规模分布图表
const initClassSizeChart = () => {
  const chart = echarts.init(document.getElementById('classSizeChart'));
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['小班(1-5人)', '中班(6-10人)', '大班(11-20人)', '超大班(20人以上)']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '班级数量',
        type: 'bar',
        data: [2, 5, 3, 1], // 模拟数据
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4facfe' },
            { offset: 0.5, color: '#00f2fe' },
            { offset: 1, color: '#00f2fe' }
          ])
        }
      }
    ]
  };
  chart.setOption(option);
};

// 初始化财务统计图表
const initFinanceChart = () => {
  const chart = echarts.init(document.getElementById('financeChart'));
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'line',
        stack: 'Total',
        data: [12000, 19000, 15000, 20000, 18000, 25000], // 模拟数据
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(67, 233, 123, 0.5)' },
            { offset: 1, color: 'rgba(56, 249, 215, 0.1)' }
          ])
        },
        lineStyle: {
          color: '#43e97b'
        },
        itemStyle: {
          color: '#43e97b'
        }
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
.stats-container {
  padding: 20px 0;
}

.stats-container h2 {
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