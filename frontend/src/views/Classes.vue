<template>
  <Layout>
    <div class="classes-container">
      <div class="page-header">
        <h2>班级管理</h2>
        <el-button type="primary" @click="handleAddClass">添加班级</el-button>
      </div>
      
      <!-- 搜索和筛选 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="班级名称">
            <el-input v-model="searchForm.name" placeholder="请输入班级名称"></el-input>
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="searchForm.courseId" placeholder="请选择课程">
              <el-option v-for="course in courses" :key="course._id" :label="course.name" :value="course._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 班级列表 -->
      <el-card class="classes-card">
        <el-table :data="classes" style="width: 100%">
          <el-table-column prop="name" label="班级名称" width="180"></el-table-column>
          <el-table-column label="课程名称" width="180">
            <template #default="scope">
              {{ getCourseName(scope.row.courseId) }}
            </template>
          </el-table-column>
          <el-table-column label="教师姓名" width="120">
            <template #default="scope">
              {{ getTeacherName(scope.row.teacherId) }}
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始日期" width="120">
            <template #default="scope">
              {{ formatDate(scope.row.startDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="结束日期" width="120">
            <template #default="scope">
              {{ formatDate(scope.row.endDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="schedule" label="上课时间" width="150"></el-table-column>
          <el-table-column label="学生人数" width="100">
            <template #default="scope">
              {{ scope.row.studentIds?.length || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditClass(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteClass(scope.row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      
      <!-- 添加/编辑班级对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
      >
        <el-form :model="classForm" :rules="rules" ref="classFormRef" label-width="100px">
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="classForm.name" placeholder="请输入班级名称"></el-input>
          </el-form-item>
          <el-form-item label="课程" prop="courseId">
            <el-select v-model="classForm.courseId" placeholder="请选择课程">
              <el-option v-for="course in courses" :key="course._id" :label="course.name" :value="course._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师" prop="teacherId">
            <el-select v-model="classForm.teacherId" placeholder="请选择教师">
              <el-option v-for="teacher in teachers" :key="teacher._id" :label="teacher.name" :value="teacher._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="classForm.startDate" type="date" placeholder="请选择开始日期" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker v-model="classForm.endDate" type="date" placeholder="请选择结束日期" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="上课时间" prop="schedule">
            <el-input v-model="classForm.schedule" placeholder="请输入上课时间安排"></el-input>
          </el-form-item>
          <el-form-item label="学生" prop="studentIds">
            <el-select v-model="classForm.studentIds" multiple placeholder="请选择学生">
              <el-option v-for="student in students" :key="student._id" :label="student.name" :value="student._id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSaveClass">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Layout from '../components/Layout.vue';
import { api } from '../store/auth';

const classes = ref([]);
const courses = ref([]);
const teachers = ref([]);
const students = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const dialogTitle = ref('添加班级');
const classFormRef = ref(null);
const loading = ref(false);

const searchForm = reactive({
  name: '',
  courseId: ''
});

const classForm = reactive({
  name: '',
  courseId: '',
  teacherId: '',
  studentIds: [],
  startDate: '',
  endDate: '',
  schedule: ''
});

const rules = {
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' }
  ],
  courseId: [
    { required: true, message: '请选择课程', trigger: 'change' }
  ],
  teacherId: [
    { required: true, message: '请选择教师', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ],
  schedule: [
    { required: true, message: '请输入上课时间安排', trigger: 'blur' }
  ]
};

// 获取班级列表
const fetchClasses = async () => {
  try {
    loading.value = true;
    const response = await api.get('/classes');
    classes.value = response.data;
    total.value = response.data.length;
  } catch (error) {
    console.error('Failed to fetch classes:', error);
  } finally {
    loading.value = false;
  }
};

// 获取课程列表
const fetchCourses = async () => {
  try {
    const response = await api.get('/courses');
    courses.value = response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
};

// 获取教师列表
const fetchTeachers = async () => {
  try {
    // 这里简化处理，实际应该从用户列表中筛选出教师角色的用户
    const response = await api.get('/auth/profile');
    teachers.value = [response.data]; // 临时处理，实际应该获取所有教师
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
  }
};

// 获取学生列表
const fetchStudents = async () => {
  try {
    const response = await api.get('/students');
    students.value = response.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

// 搜索班级
const handleSearch = () => {
  // 这里可以实现搜索逻辑
  fetchClasses();
};

// 重置搜索
const resetSearch = () => {
  searchForm.name = '';
  searchForm.courseId = '';
  fetchClasses();
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchClasses();
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
  fetchClasses();
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// 获取课程名称
const getCourseName = (courseId) => {
  const course = courses.value.find(c => c._id === courseId);
  return course ? course.name : '';
};

// 获取教师名称
const getTeacherName = (teacherId) => {
  const teacher = teachers.value.find(t => t._id === teacherId);
  return teacher ? teacher.name : '';
};

// 添加班级
const handleAddClass = () => {
  dialogTitle.value = '添加班级';
  Object.keys(classForm).forEach(key => {
    if (key === 'studentIds') {
      classForm[key] = [];
    } else {
      classForm[key] = '';
    }
  });
  dialogVisible.value = true;
};

// 编辑班级
const handleEditClass = (classData) => {
  dialogTitle.value = '编辑班级';
  Object.assign(classForm, classData);
  dialogVisible.value = true;
};

// 保存班级
const handleSaveClass = async () => {
  try {
    await classFormRef.value.validate();
    loading.value = true;
    
    if (classForm._id) {
      // 编辑班级
      await api.put(`/classes/${classForm._id}`, classForm);
    } else {
      // 添加班级
      await api.post('/classes', classForm);
    }
    
    dialogVisible.value = false;
    fetchClasses();
  } catch (error) {
    console.error('Failed to save class:', error);
  } finally {
    loading.value = false;
  }
};

// 删除班级
const handleDeleteClass = async (id) => {
  try {
    await api.delete(`/classes/${id}`);
    fetchClasses();
  } catch (error) {
    console.error('Failed to delete class:', error);
  }
};

onMounted(async () => {
  await Promise.all([
    fetchClasses(),
    fetchCourses(),
    fetchTeachers(),
    fetchStudents()
  ]);
});
</script>

<style scoped>
.classes-container {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.search-card {
  margin-bottom: 20px;
}

.classes-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>