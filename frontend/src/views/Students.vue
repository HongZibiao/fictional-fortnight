<template>
  <Layout>
    <div class="students-container">
      <div class="page-header">
        <h2>学生管理</h2>
        <el-button type="primary" @click="handleAddStudent">添加学生</el-button>
      </div>
      
      <!-- 搜索和筛选 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入学生姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchForm.gender" placeholder="请选择性别">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-input v-model="searchForm.grade" placeholder="请输入年级"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 学生列表 -->
      <el-card class="students-card">
        <el-table :data="students" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="scope">
              {{ scope.row.gender === 'male' ? '男' : scope.row.gender === 'female' ? '女' : '其他' }}
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" width="80"></el-table-column>
          <el-table-column prop="grade" label="年级" width="100"></el-table-column>
          <el-table-column prop="parentName" label="家长姓名" width="120"></el-table-column>
          <el-table-column prop="parentPhone" label="家长电话" width="150"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEditStudent(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteStudent(scope.row._id)">删除</el-button>
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
      
      <!-- 添加/编辑学生对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
      >
        <el-form :model="studentForm" :rules="rules" ref="studentFormRef" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name" placeholder="请输入学生姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="studentForm.gender" placeholder="请选择性别">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="studentForm.age" type="number" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="studentForm.grade" placeholder="请输入年级"></el-input>
          </el-form-item>
          <el-form-item label="家长姓名" prop="parentName">
            <el-input v-model="studentForm.parentName" placeholder="请输入家长姓名"></el-input>
          </el-form-item>
          <el-form-item label="家长电话" prop="parentPhone">
            <el-input v-model="studentForm.parentPhone" placeholder="请输入家长电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="studentForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="studentForm.address" type="textarea" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSaveStudent">保存</el-button>
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

const students = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const dialogTitle = ref('添加学生');
const studentFormRef = ref(null);
const loading = ref(false);

const searchForm = reactive({
  name: '',
  gender: '',
  grade: ''
});

const studentForm = reactive({
  name: '',
  gender: '',
  age: '',
  grade: '',
  parentName: '',
  parentPhone: '',
  email: '',
  address: '',
  enrolledCourses: []
});

const rules = {
  name: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '请输入正确的年龄', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
  ],
  parentName: [
    { required: true, message: '请输入家长姓名', trigger: 'blur' }
  ],
  parentPhone: [
    { required: true, message: '请输入家长电话', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ]
};

// 获取学生列表
const fetchStudents = async () => {
  try {
    loading.value = true;
    const response = await api.get('/students');
    students.value = response.data;
    total.value = response.data.length;
  } catch (error) {
    console.error('Failed to fetch students:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索学生
const handleSearch = () => {
  // 这里可以实现搜索逻辑
  fetchStudents();
};

// 重置搜索
const resetSearch = () => {
  searchForm.name = '';
  searchForm.gender = '';
  searchForm.grade = '';
  fetchStudents();
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchStudents();
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
  fetchStudents();
};

// 添加学生
const handleAddStudent = () => {
  dialogTitle.value = '添加学生';
  Object.keys(studentForm).forEach(key => {
    studentForm[key] = '';
  });
  studentForm.enrolledCourses = [];
  dialogVisible.value = true;
};

// 编辑学生
const handleEditStudent = (student) => {
  dialogTitle.value = '编辑学生';
  Object.assign(studentForm, student);
  dialogVisible.value = true;
};

// 保存学生
const handleSaveStudent = async () => {
  try {
    await studentFormRef.value.validate();
    loading.value = true;
    
    if (studentForm._id) {
      // 编辑学生
      await api.put(`/students/${studentForm._id}`, studentForm);
    } else {
      // 添加学生
      await api.post('/students', studentForm);
    }
    
    dialogVisible.value = false;
    fetchStudents();
  } catch (error) {
    console.error('Failed to save student:', error);
  } finally {
    loading.value = false;
  }
};

// 删除学生
const handleDeleteStudent = async (id) => {
  try {
    await api.delete(`/students/${id}`);
    fetchStudents();
  } catch (error) {
    console.error('Failed to delete student:', error);
  }
};

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped>
.students-container {
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

.students-card {
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