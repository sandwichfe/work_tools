<template>
    <div class="sql-format-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>SQL格式化工具</span>
                <el-button type="primary" @click="formatSQL">格式化</el-button>
              </div>
            </template>
            
            <el-form>
              <el-form-item label="输入SQL">
                <el-input
                  v-model="inputSQL"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入需要格式化的INSERT SQL语句"
                />
              </el-form-item>
              
              <el-form-item label="格式化结果">
                <el-input
                  v-model="outputSQL"
                  type="textarea"
                  :rows="12"
                  readonly
                />
              </el-form-item>
            </el-form>
            
            <div class="button-container">
              <el-button 
                type="primary" 
                :icon="DocumentCopy"
                @click="copyToClipboard"
                :disabled="!outputSQL"
              >
                复制结果
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { DocumentCopy } from '@element-plus/icons-vue'
  
  const inputSQL = ref('')
  const outputSQL = ref('')
  
  function formatSQL() {
    if (!inputSQL.value.trim()) {
      ElMessage.warning('请输入SQL语句')
      return
    }
  
    try {
      const pattern = /INSERT INTO\s+"([^"]+)"\."([^"]+)"\s*\((.*?)\)\s*VALUES\s*(.*?);/s
      const match = inputSQL.value.match(pattern)
  
      if (!match) {
        ElMessage.error('SQL格式不正确')
        return
      }
  
      const tableName = match[2]
      const columnStr = match[3]
      const valuesStr = match[4]
  
      let result = `INSERT INTO ${tableName} (`
  
      // 处理列名
      const columns = columnStr.split(/\s*,\s*/)
      const maxColumnLength = Math.max(...columns.map(col => col.length))
  
      columns.forEach((col, index) => {
        result += col + ' '.repeat(maxColumnLength - col.length)
        if (index < columns.length - 1) {
          result += ', '
        }
      })
  
      result += ') \nVALUES '
  
      // 处理值
      const valuesSets = valuesStr.split(/\),\s*\(/)
      const maxValuesLength = Math.max(
        ...valuesSets.flatMap(set => 
          set.split(',').map(val => val.trim().replace(/^\(|\)$/g, '').length)
        )
      )
  
      valuesSets.forEach((valueSet, i) => {
        result += '    ('
        const values = valueSet.split(',').map(v => v.trim().replace(/^\(|\)$/g, ''))
        
        values.forEach((value, j) => {
          result += value + ' '.repeat(maxValuesLength - value.length)
          if (j < values.length - 1) {
            result += ', '
          }
        })
        
        result += ')'
        if (i < valuesSets.length - 1) {
          result += ',\n'
        }
      })
  
      result += ';\n'
      outputSQL.value = result
      ElMessage.success('格式化成功')
    } catch (error) {
      console.error(error)
      ElMessage.error('格式化失败')
    }
  }
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(outputSQL.value)
      ElMessage.success('复制成功')
    } catch (err) {
      ElMessage.error('复制失败')
    }
  }
  </script>
  
  <style scoped>
  .sql-format-container {
    padding: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  </style>