import { createRouter, createWebHistory } from 'vue-router'

// 基础路由配置
const routes = [
  {
    path: '/qrcode',  // 登录页面路由
    component: () => import('../views/qrcodeView.vue'),  // 异步加载登录组件
  },
  // 在路由数组中添加
{
  path: '/gene-sql',
  name: 'GeneSql',
  component: () => import('@/views/GeneSql.vue')
},
{
  path: '/sql-format',
  name: 'SqlFormat',
  component: () => import('../views/SqlFormat.vue'),
  meta: {
    title: 'SQL格式化工具'
  }
}
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),  // 使用HTML5历史模式
  routes,  // 配置静态路由
})

export default router
