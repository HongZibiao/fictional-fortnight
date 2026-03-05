# Git上传指南

本指南将教你如何将少儿编程培训学生管理系统上传到Git仓库。

## 前提条件

1. 已安装 Git（可从 [Git官网](https://git-scm.com/downloads) 下载安装）
2. 已注册 GitHub/GitLab/Gitee 等 Git 托管服务账号

## 步骤一：初始化 Git 仓库

1. 打开命令提示符或 PowerShell，进入项目根目录：

```bash
cd d:\warehouse\newSd
```

2. 初始化 Git 仓库：

```bash
git init
```

## 步骤二：配置 Git 身份

1. 设置用户名：

```bash
git config --global user.name "你的用户名"
```

2. 设置邮箱：

```bash
git config --global user.email "你的邮箱"
```

## 步骤三：创建 .gitignore 文件

1. 在项目根目录创建 `.gitignore` 文件，添加以下内容：

```
# 依赖包
node_modules/

# 环境变量
.env

# 构建输出
frontend/dist/

# 日志文件
*.log

# IDE 配置
.vscode/
.idea/

# 操作系统文件
.DS_Store
Thumbs.db
```

## 步骤四：添加文件到暂存区

1. 添加所有文件到暂存区：

```bash
git add .
```

## 步骤五：提交更改

1. 提交更改并添加提交信息：

```bash
git commit -m "初始化项目：少儿编程培训学生管理系统"
```

## 步骤六：创建远程仓库

1. 登录你的 Git 托管服务（如 GitHub）
2. 创建一个新的仓库，复制仓库的 SSH 或 HTTPS 地址

## 步骤七：关联远程仓库

1. 关联远程仓库（将 `remote-url` 替换为你的仓库地址）：

```bash
git remote add origin <remote-url>
```

## 步骤八：推送代码

1. 推送代码到远程仓库：

```bash
git push -u origin master
```

如果你的默认分支是 `main`，则使用：

```bash
git push -u origin main
```

## 后续操作

### 查看状态

```bash
git status
```

### 添加新文件

```bash
git add <文件名>
git commit -m "添加新文件"
git push
```

### 提交修改

```bash
git add .
git commit -m "修改内容描述"
git push
```

## 常见问题

### 推送失败

如果遇到推送失败，可能是因为远程仓库不为空。可以使用强制推送：

```bash
git push -u origin master --force
```

### 分支管理

查看分支：

```bash
git branch
```

创建分支：

```bash
git branch <分支名>
```

切换分支：

```bash
git checkout <分支名>
```

合并分支：

```bash
git checkout master
git merge <分支名>
```

## 总结

通过以上步骤，你可以成功将项目上传到 Git 仓库，并进行版本控制和团队协作。