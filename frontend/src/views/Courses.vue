<template>
  <Layout>
    <div class="courses-container">
      <div class="page-header">
        <h2>课程管理</h2>
        <el-button type="primary" @click="handleAddCourse">添加课程</el-button>
      </div>
      
      <!-- 搜索和筛选 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="课程名称">
            <el-input v-model="searchForm.name" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="难度级别">
            <el-select v-model="searchForm.level" placeholder="请选择难度级别">
              <el-option label="初级" value="beginner"></el-option>
              <el-option label="中级" value="intermediate"></el-option>
              <el-option label="高级" value="advanced"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <el-input v-model="searchForm.category" placeholder="请输入课程类别"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 课程列表 -->
      <el-card class="courses-card">
        <el-table :data="courses" style="width: 100%">
          <el-table-column prop="name" label="课程名称" width="180"></el-table-column>
          <el-table-column prop="description" label="课程描述"></el-table-column>
          <el-table-column prop="level" label="难度级别" width="120">
            <template #default="scope">
              {{ scope.row.level === 'beginner' ? '初级' : scope.row.level === 'intermediate' ? '中级' : '高级' }}
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="课程时长(小时)" width="120"></el-table-column>
          <el-table-column prop="price" label="价格(元)" width="100">
            <template #default="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="category" label="课程类别" width="120"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditCourse(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteCourse(scope.row._id)">删除</el-button>
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
      
      <!-- 添加/编辑课程对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
      >
        <el-form :model="courseForm" :rules="rules" ref="courseFormRef" label-width="100px">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="courseForm.name" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="课程描述" prop="description">
            <el-input v-model="courseForm.description" type="textarea" placeholder="请输入课程描述"></el-input>
          </el-form-item>
          <el-form-item label="难度级别" prop="level">
            <el-select v-model="courseForm.level" placeholder="请选择难度级别">
              <el-option label="初级" value="beginner"></el-option>
              <el-option label="中级" value="intermediate"></el-option>
              <el-option label="高级" value="advanced"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程时长" prop="duration">
            <el-input v-model.number="courseForm.duration" type="number" placeholder="请输入课程时长(小时)"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="courseForm.price" type="number" placeholder="请输入价格(元)"></el-input>
          </el-form-item>
          <el-form-item label="课程类别" prop="category">
            <el-input v-model="courseForm.category" placeholder="请输入课程类别"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSaveCourse">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import { api } from '../store/auth';

const courses = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const dialogTitle = ref('添加课程');
const courseFormRef = ref(null);
const loading = ref(false);

const searchForm = reactive({
  name: '',
  level: '',
  category: ''
});

const courseForm = reactive({
  name: '',
  description: '',
  level: '',
  duration: '',
  price: '',
  category: ''
});

const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入课程描述', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择难度级别', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入课程时长', trigger: 'blur' },
    { type: 'number', message: '请输入正确的课程时长', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', message: '请输入正确的价格', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请输入课程类别', trigger: 'blur' }
  ]
};

// 获取课程列表
const fetchCourses = async () => {
  try {
    loading.value = true;
    const response = await api.get('/courses');
    courses.value = response.data;
    total.value = response.data.length;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索课程
const handleSearch = () => {
  // 这里可以实现搜索逻辑
  fetchCourses();
};

// 重置搜索
const resetSearch = () => {
  searchForm.name = '';
  searchForm.level = '';
  searchForm.category = '';
  fetchCourses();
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchCourses();
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
  fetchCourses();
};

// 添加课程
const handleAddCourse = () => {
  dialogTitle.value = '添加课程';
  Object.keys(courseForm).forEach(key => {
    courseForm[key] = '';
  });
  dialogVisible.value = true;
};

// 编辑课程
const handleEditCourse = (course) => {
  dialogTitle.value = '编辑课程';
  Object.assign(courseForm, course);
  dialogVisible.value = true;
};

// 保存课程
const handleSaveCourse = async () => {
  try {
    await courseFormRef.value.validate();
    loading.value = true;
    
    if (courseForm._id) {
      // 编辑课程
      await api.put(`/courses/${courseForm._id}`, courseForm);
    } else {
      // 添加课程
      await api.post('/courses', courseForm);
    }
    
    dialogVisible.value = false;
    fetchCourses();
  } catch (error) {
    console.error('Failed to save course:', error);
  } finally {
    loading.value = false;
  }
};

// 删除课程
const handleDeleteCourse = async (id) => {
  try {
    await api.delete(`/courses/${id}`);
    fetchCourses();
  } catch (error) {
    console.error('Failed to delete course:', error);
  }
};

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
.courses-container {
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

.courses-card {
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