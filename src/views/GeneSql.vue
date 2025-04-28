<template>
    <div class="gene-container">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="文件描述">
          <el-input v-model="form.fileDesc" placeholder="请输入文件描述"></el-input>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="form.fileName" placeholder="请输入文件名"></el-input>
        </el-form-item>
        <el-form-item label="区域编码">
          <el-input v-model="form.areaCode" placeholder="请输入区域编码"></el-input>
        </el-form-item>
        <el-form-item label="常量名">
          <el-input v-model="form.constantName" placeholder="请输入常量名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">生成</el-button>
        </el-form-item>
      </el-form>
  

      <div class="result-container">
      <el-row :gutter="20" style="width: 100%;">
        <el-col :span="12">
          <el-alert type="success"  :closable="false"  class="result-section">
            <template #title>
              <div class="alert-header">
                <span>生成的SQL</span>
                <el-button 
                  size="small" 
                  type="success" 
                  @click="handleCopySql" 
                  :icon="DocumentCopy"
                  title="复制SQL"
                />
              </div>
            </template>
            <pre class="code-block">{{ result?.sql || ' ' }}</pre>
          </el-alert>
        </el-col>
        <el-col :span="12">
          <el-alert type="warning"  :closable="false"  class="result-section">
            <template #title>
              <div class="alert-header">
                <span>生成的Java枚举</span>
                <el-button 
                  size="small" 
                  type="warning" 
                  @click="handleCopyEnum" 
                  :icon="DocumentCopy"
                  title="复制枚举"
                />
              </div>
            </template>
            <pre class="code-block">{{ result.enumCode }}</pre>
          </el-alert>
        </el-col>
      </el-row>
    </div>




    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { geneFileSql } from '@/network/base';
  import { ElMessage } from 'element-plus';
  import { DocumentCopy } from '@element-plus/icons-vue'; // 新增图标引入

  const handleCopy = async (text, successMessage) => {
  try {
    // 尝试使用 Clipboard API
    await navigator.clipboard.writeText(text);
    ElMessage.success(successMessage);
  } catch (err) {
    // 如果 Clipboard API 失败，则回退到使用 document.execCommand
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      ElMessage.success(successMessage);
    } catch (execErr) {
      ElMessage.error('复制失败');
    }
  }
};

// 使用封装的函数
const handleCopySql = () => {
  handleCopy(result.value.sql, 'SQL已复制到剪贴板');
};

const handleCopyEnum = () => {
  handleCopy(result.value.enumCode, '枚举代码已复制到剪贴板');
};


  const form = ref({
    fileDesc: '',
    fileName: '',
    areaCode: '',
    constantName: ''
  });
  
  const result = ref({
  sql: '',
  enumCode: ''
});

  const loading = ref(false);
  
  const handleSubmit = async () => {
    try {
      loading.value = true;
      const response = await geneFileSql(form.value);
      result.value = response.data;
    } catch (error) {
      console.error('生成失败:', error);
      ElMessage.error('生成失败');
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

  .result-container {
    margin-top: 20px;
  }
  
  .code-block {
    background: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: monospace;
    height: 400px; /* 固定高度 */
    overflow: auto; /* 添加滚动条 */
  }
  
  .el-alert {
    height: 100%;
  }
  
  .el-alert__content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  </style>