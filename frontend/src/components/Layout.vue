<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <h1>少儿编程培训管理系统</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" :src="userAvatar"></el-avatar>
            <span>{{ user?.name || '用户' }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <div class="layout-body">
      <!-- 侧边栏 -->
      <el-aside class="layout-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
          :unique-opened="true"
        >
          <el-menu-item index="/">
            <el-icon><house /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/students">
            <el-icon><User /></el-icon>
            <span>学生管理</span>
          </el-menu-item>
          <el-menu-item index="/courses">
            <el-icon><reading /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/classes">
            <el-icon><collection /></el-icon>
            <span>班级管理</span>
          </el-menu-item>
          <el-menu-item index="/stats">
            <el-icon><data-analysis /></el-icon>
            <span>统计报表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="layout-main">
        <slot></slot>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { ArrowDown, House, User, Reading, Collection, DataAnalysis } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const userAvatar = ref('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20teacher%20avatar&image_size=square');

const activeMenu = computed(() => {
  return route.path;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.getProfile();
    } catch (error) {
      authStore.logout();
      router.push('/login');
    }
  }
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-info span {
  margin: 0 8px;
}

.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.layout-sidebar {
  width: 200px;
  background: #303133;
  overflow-y: auto;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu .el-menu-item {
  color: #000;
  margin: 10px 0;
  border-radius: 0 20px 20px 0;
}

.sidebar-menu .el-menu-item.is-active {
  background: #409EFF;
  color: #fff;
}

.sidebar-menu .el-menu-item:hover {
  background: #409EFF;
  color: #fff;
}

.layout-main {
  flex: 1;
  background: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>