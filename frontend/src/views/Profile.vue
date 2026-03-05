<template>
  <Layout>
    <div class="profile-container">
      <h2>个人中心</h2>
      <el-card class="profile-card">
        <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="userForm.role" disabled>
              <el-option label="管理员" value="admin"></el-option>
              <el-option label="教师" value="teacher"></el-option>
              <el-option label="家长" value="parent"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password" placeholder="请输入新密码（留空表示不修改）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateProfile" :loading="loading">更新信息</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import { useAuthStore } from '../store/auth';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const userFormRef = ref(null);
const loading = ref(false);

const userForm = reactive({
  username: '',
  role: '',
  name: '',
  email: '',
  phone: '',
  password: ''
});

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' }
  ]
};

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const user = await authStore.getProfile();
    userForm.username = user.username;
    userForm.role = user.role;
    userForm.name = user.name;
    userForm.email = user.email;
    userForm.phone = user.phone;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
};

// 更新用户信息
const handleUpdateProfile = async () => {
  try {
    await userFormRef.value.validate();
    loading.value = true;
    
    const updateData = {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone
    };
    
    if (userForm.password) {
      updateData.password = userForm.password;
    }
    
    await authStore.updateProfile(updateData);
    
    // 显示成功消息
    ElMessage.success('个人信息更新成功');
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-container {
  padding: 20px 0;
}

.profile-container h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.profile-card {
  max-width: 600px;
}
</style>