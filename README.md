# Omni Portal - 全景生活与超级个体平台

Omni Portal 是一个为「超级个体」打造的数字化全景平台。它集成了个人天赋管理、AI 辅助共创、财富可视化仪表盘以及基于 Token 经济的社区生活方式（Omni Life）。

本项目采用现代化的前端架构，支持单机离线运行（Client-Side Mode），并预留了对接企业级后端的接口层。

## ✨ 核心产品模块

1.  **Me Special (个人特质)**
    *   **天赋雷达图**: 多维度可视化展示审美、技术、智慧等核心能力。
    *   **AI 核心优势分析**: 集成 Gemini AI，自动分析个人 Bio 提取核心竞争力。
    *   **天赋技能栈**: 详细展示硬技能与软技能组合。

2.  **My Talents (天赋撮合)**
    *   **项目共创广场**: 浏览本地共创项目，匹配天赋角色。
    *   **AI 团队架构师**: 输入愿景，AI 自动生成团队架构与股权分配建议。
    *   **一人公司工具箱**: 提供合同、财务、品牌等 Solopreneur 必备工具。

3.  **My Wealth (财富管理)**
    *   可视化资产增长曲线。
    *   项目分红与日常消费记录追踪。
    *   被动收入监控。

4.  **Omni Life (全景生活)**
    *   **Token 经济**: 平台内服务、商品、酒店、活动均支持 Token 结算。
    *   **神奇学校**: 提供在线觉察练习、直播课程与冥想引导。
    *   **LBS 本地服务**: 基于地理位置（上海）推荐同频的高能量场域。
    *   **社交图谱**: 可视化查看每个项目/活动的发起人与参与者。

## 🛠 技术架构

*   **Core**: React 18+, TypeScript
*   **Build**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Visualization**: Recharts
*   **AI Engine**: Google Gemini API (`@google/genai`)
*   **Routing**: React Router DOM
*   **State Management**: React Context + Client-Side Repository Pattern

## 🚀 部署与运行

### 1. 环境准备

确保运行环境已安装 [Node.js](https://nodejs.org/) (推荐 v18+)。

```bash
npm install
# 或者
yarn
```

### 2. 配置 AI 能力

在项目根目录创建 `.env` 文件，填入 Google Gemini API Key 以激活 AI 分析功能：

```env
API_KEY=your_google_gemini_api_key_here
```

### 3. 启动应用

```bash
npm run dev
```

### 4. 生产环境构建

```bash
npm run build
```

构建产物位于 `dist` 目录，可直接部署至 Vercel, Netlify, Nginx 或任何静态资源服务器。

## 📂 目录规范

```
.
├── src/
│   ├── components/  # 核心 UI 组件
│   ├── context/     # 全局状态 (Auth 等)
│   ├── pages/       # 业务页面 (Profile, Projects, Finance, OmniLife)
│   ├── services/    # 核心服务层 (AI Service, Data Repository)
│   ├── types.ts     # 数据模型定义
│   ├── App.tsx      # 应用路由入口
│   └── index.tsx    # 启动文件
├── index.html       # 页面模版
└── vite.config.ts   # 工程配置
```

---
*Omni Portal Product Team*