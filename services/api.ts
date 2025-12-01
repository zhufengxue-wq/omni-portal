import { UserProfile, Project, FinanceData, OmniItem, Transaction, ToolboxItem, AllianceTask } from '../types';

// ==========================================
// CLIENT-SIDE DATA ACCESS LAYER (In-Memory)
// ==========================================

const LUNA_AVATAR = "https://picsum.photos/400/400?random=10";

// Initial dataset for the application
const INITIAL_PROFILE: UserProfile = {
  name: "Luna",
  title: "超级个体 & AI 共创者",
  location: "中国 · 上海",
  intro: "致力于将艺术审美与前沿科技结合的创造者。擅长用 AI 放大创意半径，从抽象概念到落地产品的全链路闭环。 #飞书文档_核心交互设计 #EtherLand_视觉合伙人 #OmniPortal_独立开发 #元宇宙地产_视觉构建",
  tags: [],
  allianceAchievements: [
    {
        id: '1',
        title: '神奇学校 · 觉察系',
        detail: '高维智慧与内在工程 - 优秀毕业生',
        year: '2023',
        iconName: 'School',
        level: 'Master'
    },
    {
        id: '2',
        title: 'Omni Yard · 静安',
        detail: '城市更新项目共建人',
        year: '2024',
        iconName: 'Investment',
        level: 'L2 Investor'
    },
    {
        id: '3',
        title: '神奇联盟 · 社区贡献',
        detail: '年度最活跃连接者',
        year: '2023',
        iconName: 'Award',
        level: 'Top 1%'
    }
  ],
  zoneOfGenius: {
      enjoy: [
          "将抽象的灵感、梦境或直觉转化为可视化的现实",
          "在混乱的信息流中寻找秩序与美感的平衡",
          "与高维智慧进行深度的意识链接与对话"
      ],
      effortless: [
          "敏锐捕捉稍纵即逝的审美趋势与视觉通感",
          "跨越学科边界，快速整合资源并建立系统",
          "利用 AI 工具将 0 到 1 的原型搭建速度提升十倍"
      ]
  },
  skillStack: [
    {
      category: "沉浸创造 · Creative Flow",
      iconName: "Palette",
      color: "text-pink-500",
      bg: "bg-pink-50",
      skills: ["深夜写代码的心流", "周末下午的油画创作", "搭建 Notion 自动化系统", "打磨像素级 UI 细节"]
    },
    {
      category: "感官探索 · Sensory",
      iconName: "Activity",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      skills: ["探店上海法租界老洋房", "胶片摄影捕捉光影", "收集小众木质调香水", "手冲咖啡的仪式感"]
    },
    {
      category: "高能时刻 · High Energy",
      iconName: "Cpu",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      skills: ["解决复杂 Bug 的瞬间", "CrossFit 后的力竭感", "与创始人深度脑暴", "产品上线的发布时刻"]
    },
    {
      category: "深度连接 · Connection",
      iconName: "Brain",
      color: "text-purple-600",
      bg: "bg-purple-50",
      skills: ["组织 10 人内的私董会", "帮助他人厘清商业模式", "深度阅读哲学与心理学", "撰写长文复盘"]
    }
  ]
};

// State containers
let repositoryProfile: UserProfile = { ...INITIAL_PROFILE };

// Updated Projects matching the "Super Individual / AI / Art" persona
let repositoryProjects: Project[] = [
  {
      id: 1,
      title: "AI 沉浸式五感疗愈展",
      description: "在西岸美术馆打造一场结合生成式 AI 视觉与 432Hz 疗愈声频的沉浸式体验。旨在通过科技手段，快速引导都市人进入 Theta 波深度放松状态。",
      progress: 45,
      rolesNeeded: ["生成式艺术家 (AIGC)", "音疗师", "空间交互设计"],
      detailedRoles: [
          { id: 'r1', title: '生成式艺术家 (AIGC)', requiredTalents: ['Midjourney', 'TouchDesigner', '视觉审美'], equityShare: 15, isFilled: false },
          { id: 'r2', title: '音疗师 (Sound Healing)', requiredTalents: ['颂钵', '声学', '疗愈'], equityShare: 10, isFilled: false },
          { id: 'r3', title: '空间交互设计', requiredTalents: ['Arduino', '空间设计', '用户体验'], equityShare: 12, isFilled: false }
      ],
      image: "https://picsum.photos/400/200?random=881",
      owner: 'Luna' // User initiated this
  },
  {
      id: 2,
      title: "DAO 驱动的数字游民村落",
      description: "位于安吉山谷的去中心化共居实验。不只是民宿，而是通过智能合约治理、Token 激励贡献的「创造者公社」。寻找懂 Web3 治理与乡村美学的共建者。",
      progress: 72,
      rolesNeeded: ["社区架构师", "Web3 开发者", "乡村美学设计师"],
      detailedRoles: [
          { id: 'r1', title: '社区架构师', requiredTalents: ['DAO治理', '社群运营', '规则设计'], equityShare: 20, isFilled: false },
          { id: 'r2', title: 'Web3 全栈开发', requiredTalents: ['Solidity', 'React', '智能合约'], equityShare: 18, isFilled: false },
          { id: 'r3', title: '乡村空间设计师', requiredTalents: ['建筑改造', '软装搭配', '自然美学'], equityShare: 15, isFilled: true }
      ],
      image: "https://picsum.photos/400/200?random=882",
      owner: 'DAO',
      isRecommended: true
  },
  {
      id: 3,
      title: "「未来的书」交互式灵感库",
      description: "打破线性阅读，构建一个基于 AI 知识图谱的非线性灵感获取产品。专为设计师与艺术家打造的第二大脑，让灵感连接像神经元一样流动。",
      progress: 20,
      rolesNeeded: ["知识图谱工程师", "UI/UX 设计师", "内容策展人"],
      detailedRoles: [
          { id: 'r1', title: '知识图谱工程师', requiredTalents: ['Neo4j', 'NLP', 'Python'], equityShare: 18, isFilled: false },
          { id: 'r2', title: '高级 UI/UX', requiredTalents: ['Figma', '交互动效', '极简主义'], equityShare: 15, isFilled: false },
          { id: 'r3', title: '内容策展总编', requiredTalents: ['审美', '编辑', '知识广度'], equityShare: 10, isFilled: false }
      ],
      image: "https://picsum.photos/400/200?random=883",
      owner: 'Luna' // User initiated this
  }
];

let repositoryTransactions: Transaction[] = [
    { id: 1, name: 'Omni 基地 (Bali) 分红', date: '今天, 09:00', amount: 150.00, type: 'income' },
    { id: 2, name: 'Omni Life 课程消费', date: '昨天, 09:15', amount: -500.00, type: 'expense' },
    { id: 3, name: '社区基金定投', date: '2024年6月12日', amount: -5000.00, type: 'investment' },
];

const INITIAL_FINANCE_BASE: FinanceData = {
  totalAssets: 1425900,
  monthlyPassiveIncome: 23250,
  monthlyExpense: 8120.50,
  activeProjects: [
      {
          id: 101,
          title: "Omni Yard · 静安共创空间",
          description: "城市更新实体空间项目",
          progress: 100,
          rolesNeeded: [],
          image: "https://picsum.photos/400/200?random=101",
          userEquity: 5.5,
          totalDividends: 45000,
          owner: 'Omni Alliance'
      },
      {
          id: 102,
          title: "AI 艺术策展小组",
          description: "数字化艺术画廊 DAO",
          progress: 80,
          rolesNeeded: [],
          image: "https://picsum.photos/400/200?random=102",
          userEquity: 12,
          totalDividends: 8600,
          owner: 'Luna'
      },
      {
          id: 103,
          title: "神奇学校 · 线上平台",
          description: "知识付费与社群运营",
          progress: 92,
          rolesNeeded: [],
          image: "https://picsum.photos/400/200?random=103",
          userEquity: 2.0,
          totalDividends: 1200,
          owner: 'Omni Alliance'
      }
  ],
  transactions: repositoryTransactions
};

const INITIAL_OMNI_ITEMS: OmniItem[] = [
  // === RWA Items (New Feature) ===
  {
      id: 991,
      type: 'rwa',
      title: "Omni Bamboo · Bali",
      subtitle: "巴厘岛 · 乌布竹林共居基地",
      price: "12%",
      unit: "APY",
      image: "https://picsum.photos/400/300?random=991",
      tag: "实体资产",
      avatars: [LUNA_AVATAR, "https://picsum.photos/100/100?random=310"],
      description: "Omni 社区首个众筹建立的海外基地。坐落于乌布（Ubud）的稻田与竹林之间，由知名竹建筑师设计。项目包含 12 间数字游民公寓和 1 个 300平米的开放式 Co-working Space。",
      apy: "12%",
      minInvestment: "1000 USDT",
      benefits: ["每年 7 天免费居住权", "餐饮服务 8 折", "季度运营分红"]
  },
  {
      id: 992,
      type: 'rwa',
      title: "Lisbon Nomad Hub",
      subtitle: "葡萄牙 · 里斯本老城改造",
      price: "8.5%",
      unit: "APY",
      image: "https://picsum.photos/400/300?random=992",
      tag: "实体资产",
      avatars: ["https://picsum.photos/100/100?random=311"],
      description: "位于里斯本阿尔法玛（Alfama）区的百年老建筑改造项目。我们将这座废弃的修道院改造为集居住、办公、Web3 孵化器于一体的游民中心。不仅仅是房产，更是通往欧洲创投圈的物理入口。",
      apy: "8.5%",
      minInvestment: "5000 USDT",
      benefits: ["欧盟创业签证咨询通道", "每年 14 天免费居住", "本地活动优先权"]
  },

  // === Token Gated Event ===
  {
      id: 609,
      type: 'events',
      title: "Private Angel Dinner",
      subtitle: "外滩 3 号 · 仅限 Omni OG",
      date: "周六, 19:00",
      price: "Token Gated",
      image: "https://picsum.photos/400/300?random=609",
      tag: "核心圈层",
      dist: "1.2 km",
      avatars: ["https://picsum.photos/100/100?random=290"],
      description: "这是一场私密的闭门晚宴，仅邀请持有 Omni OG NFT 或资产等级 L3 以上的会员参加。我们将讨论 2025 年的加密市场趋势以及 Omni Life 的下一站选址。",
      tokenGate: "Hold > 1000 $OMNI or OG NFT"
  },

  // === Existing Items (Preserved) ===
  {
      id: 701,
      type: 'travel',
      title: "冰岛 · 追逐太阳风的尽头",
      subtitle: "极光摄影 + 冰川徒步 7 日",
      date: "2024.11.15",
      price: "🪙 3,8000",
      image: "https://picsum.photos/400/300?random=701",
      tag: "全球旅居",
      avatars: [LUNA_AVATAR, "https://picsum.photos/100/100?random=301", "https://picsum.photos/100/100?random=302"],
      description: "这是一次前往世界尽头的探险。我们将避开游客区，深入冰岛南部的瓦特纳冰川腹地。行程亮点包含：\n1. 蓝冰洞探险与专业人像摄影\n2. 私人黑沙滩骑马体验\n3. 追逐极光的玻璃屋住宿\n4. 蓝湖温泉疗愈\n适合渴望在极致自然中找回敬畏感的旅人。全程配备专业向导与摄影师。"
  },
  {
      id: 401,
      type: 'goods',
      title: "景德镇 · 侘寂手作陶具",
      subtitle: "孤品 · 像风留下的痕迹",
      price: "🪙 1,280",
      image: "https://picsum.photos/400/300?random=401",
      tag: "生活美学",
      avatars: ["https://picsum.photos/100/100?random=221"],
      description: "每一件陶器都由景德镇青年陶艺家手工拉胚、修坯，并使用天然草木灰釉在柴窑中烧制 72 小时。由于火痕的不可控性，每一只杯子都是世间独一无二的孤品。表面保留了粗粝的颗粒感，手感温润厚实。在快节奏的都市生活中，这套茶具提醒我们回归当下的每一次呼吸与触碰。"
  },
  {
      id: 406,
      type: 'goods',
      title: "独立设计 · 「流动的风」丝麻长袍",
      subtitle: "限量 10 件 · 天然草木染",
      price: "🪙 2,200",
      image: "https://picsum.photos/400/300?random=406",
      tag: "穿搭艺术",
      avatars: ["https://picsum.photos/100/100?random=226"],
      description: "这是一件“会呼吸”的衣服。设计师选用了来自云贵的野生丝麻面料，通过手工植物染色呈现出类似晨雾般的灰蓝色调。剪裁上采用了零浪费的东方平面制版，没有任何拉链或扣子，完全依靠系带调整，包容任何体型的同时，让身体在行走间感受到风的流动。"
  },
  {
    id: 5,
    type: 'places',
    title: "Omni 北海道滑雪度假屋",
    subtitle: "平台自营 · 二世谷 · 全球旅居",
    price: "🪙 3,500",
    unit: "/ 晚",
    image: "https://picsum.photos/400/300?random=15",
    tag: "全球旅居",
    rating: 4.9,
    avatars: [LUNA_AVATAR, "https://picsum.photos/100/100?random=208"],
    description: "Omni Portal 全球旅居计划的第一站 —— 北海道二世谷（Niseko）。这栋由日本知名建筑师隈研吾团队设计的木质别墅，坐落在森林深处，拥有私汤温泉和能够直望羊蹄山的落地窗。作为平台自营物业，Omni 会员享有专属折扣和优先预订权。屋内配备全套智能家居和高速网络，不仅适合滑雪度假，更是数字游民完美的冬日办公基地。"
  },
  {
      id: 7,
      type: 'places',
      title: "养云安缦 · 隐世之旅",
      subtitle: "会员专属：春日花艺疗愈",
      price: "🪙 4,500",
      unit: "/ 晚",
      image: "https://picsum.photos/400/300?random=17",
      tag: "会员特权",
      rating: 5.0,
      avatars: [LUNA_AVATAR, "https://picsum.photos/100/100?random=214"],
      description: "这是一场专为 Omni 会员定制的周末隐世体验。下榻在上海市郊由明清古宅修复而成的养云安缦，感受楠木与石材构建的静谧气场。本次套餐特别包含了一场「春日花艺疗愈」工作坊，由知名花艺艺术家亲自指导，在古树下修剪花枝，体验植物带来的生命力与宁静。含双人早餐及一次 60 分钟的水疗体验。"
  },
  {
      id: 605,
      type: 'events',
      title: "大师级调香工作坊",
      subtitle: "法租界 · 寻找你的灵魂香气",
      date: "周日, 14:00",
      price: "🪙 980",
      image: "https://picsum.photos/400/300?random=605",
      tag: "美学沙龙",
      dist: "0.8 km",
      avatars: ["https://picsum.photos/100/100?random=227"],
      description: "香气是灵魂的隐形衣裳。在这次工作坊中，我们将跟随法国格拉斯香水学院认证的调香师，学习识别 30 种珍稀天然香料。不只是简单的混合，而是通过冥想的方式，找到与你当下能量同频的气味，亲手调制一瓶 30ml 的专属香水。在法租界的百年洋房里，度过一个充满嗅觉惊喜的下午。"
  },
  {
      id: 801,
      type: 'investment',
      title: "AIGC 独角兽早期基金 II 期",
      subtitle: "硅谷头部 VC 领投 · 锁定未来",
      price: "🪙 50,000",
      unit: "/ 份 起",
      image: "https://picsum.photos/400/300?random=801",
      tag: "高科技投资",
      avatars: [LUNA_AVATAR, "https://picsum.photos/100/100?random=305", "https://picsum.photos/100/100?random=306"],
      description: "Omni Portal 与硅谷一线基金合作，为会员提供参与下一代 AI 基础设施的入场券。本期基金重点关注：\n1. 具身智能 (Embodied AI)\n2. AI 视频生成模型\n3. 垂直领域的 Agent 平台\n历史年化回报率 25%+，锁定期 3 年。作为 LP，你还将获得与被投企业创始人闭门交流的机会。"
  }
];

const INITIAL_TOOLBOX_ITEMS: ToolboxItem[] = [
    { id: 'tool-1', category: 'tools', name: "AI 智能助理", desc: "自动回复与日程管理", iconName: "Bot", features: ["智能邮件回复", "会议自动纪要", "行程冲突检测", "每日待办生成"], actionLabel: "启动助理" },
    { id: 'tool-2', category: 'tools', name: "合同生成器", desc: "标准商业合作协议", iconName: "FileText", features: ["KOL 合作协议模版", "股权代持协议", "服务外包合同", "电子签名集成"], actionLabel: "创建合同" },
    { id: 'tool-3', category: 'tools', name: "自动记账", desc: "税务与流水追踪", iconName: "Calculator", features: ["银行流水同步", "发票OCR识别", "税务自动预估", "利润表生成"], actionLabel: "查看报表" },
    { id: 'tool-4', category: 'tools', name: "品牌设计包", desc: "Logo 与 视觉系统", iconName: "PenTool", features: ["AI Logo 生成", "品牌色板推荐", "社媒封面模版", "名片设计导出"], actionLabel: "生成设计" },
    { id: 'think-1', category: 'thinkTank', name: "行业趋势雷达", desc: "AI 驱动的市场洞察", iconName: "Radar", features: ["Web3 赛道周报", "AIGC 应用案例库", "创投融资数据", "竞品动态监控"] },
    { id: 'think-2', category: 'thinkTank', name: "超级个体SOP库", desc: "成熟的变现方法论", iconName: "BookOpen", features: ["知识付费SOP", "私域运营SOP", "个人IP打造路径", "直播带货脚本"] },
    { id: 'think-3', category: 'thinkTank', name: "专家网络咨询", desc: "按分钟付费的智囊团", iconName: "Users", features: ["约见法律顾问", "税务筹划专家", "技术架构咨询", "品牌营销导师"] },
    { id: 'think-4', category: 'thinkTank', name: "全球游民指南", desc: "签证/税务/居住攻略", iconName: "Globe", features: ["数字游民签证政策", "联合办公地图", "生活成本对比", "当地社群入口"] }
];

const INITIAL_ALLIANCE_TASKS: AllianceTask[] = [
    {
        id: 1,
        title: "Omni Portal 视觉系统升级",
        description: "为联盟核心产品设计一套全新的 UI Kit，包含组件库与设计规范。要求体现「高维审美」与「科技感」。",
        reward: 5000,
        type: "Design",
        requiredSkills: ["UI/UX", "Figma", "Design System"],
        difficulty: "Hard",
        applicants: 12,
        isMatched: true
    },
    {
        id: 2,
        title: "AI 行业日报内容策展",
        description: "负责筛选每日最新的 AI 行业资讯，并撰写简短的中文解读。需要对 AIGC 工具流有深度理解。",
        reward: 800,
        type: "Content",
        requiredSkills: ["AIGC", "内容写作", "信息筛选"],
        difficulty: "Easy",
        applicants: 5,
        isMatched: true
    },
    {
        id: 3,
        title: "Alliance Discord 社区运营",
        description: "负责维护 DAO 社区活跃度，组织每周一次的线上 AMA 活动。",
        reward: 1500,
        type: "Ops",
        requiredSkills: ["社区运营", "沟通能力", "活动策划"],
        difficulty: "Medium",
        applicants: 28,
        isMatched: false
    }
];

// LATENCY REMOVED: 0ms for instant feel
const withLatency = <T>(data: T, ms: number = 0): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

export const api = {
  getUserProfile: async (): Promise<UserProfile> => withLatency({...repositoryProfile}),
  updateUserProfile: async (updated: UserProfile): Promise<UserProfile> => {
      repositoryProfile = { ...updated };
      return withLatency(repositoryProfile);
  },
  getProjects: async (): Promise<Project[]> => withLatency([...repositoryProjects]),
  getMyInitiatedProjects: async (): Promise<Project[]> => {
      const allProjects = [...repositoryProjects, ...INITIAL_FINANCE_BASE.activeProjects];
      const uniqueProjects = Array.from(new Map(allProjects.map(item => [item.id, item])).values());
      const myProjects = uniqueProjects.filter(p => p.owner === 'Luna');
      return withLatency(myProjects);
  },
  getProjectById: async (id: number | string): Promise<Project | undefined> => {
      const project = [...repositoryProjects, ...INITIAL_FINANCE_BASE.activeProjects].find(p => p.id.toString() === id.toString());
      return withLatency(project);
  },
  createProject: async (project: Project): Promise<Project> => {
    const newProject = { ...project, id: Date.now(), owner: 'Luna' };
    repositoryProjects.unshift(newProject);
    return withLatency(newProject);
  },
  getFinanceData: async (): Promise<FinanceData> => withLatency({ ...INITIAL_FINANCE_BASE, transactions: [...repositoryTransactions] }),
  loadMoreTransactions: async (): Promise<Transaction[]> => {
    const newTx: Transaction[] = [
        { id: Date.now() + 1, name: 'Apple One 订阅', date: '3天前', amount: -35.00, type: 'expense' },
        { id: Date.now() + 2, name: '知识星球收入', date: '5天前', amount: 890.00, type: 'income' },
        { id: Date.now() + 3, name: '美股分红', date: '上周', amount: 120.50, type: 'investment' },
    ];
    repositoryTransactions.push(...newTx);
    return withLatency(newTx);
  },
  getOmniLifeItems: async (): Promise<OmniItem[]> => withLatency(INITIAL_OMNI_ITEMS),
  getOmniItemById: async (id: number | string): Promise<OmniItem | undefined> => {
      const item = INITIAL_OMNI_ITEMS.find(i => i.id.toString() === id.toString());
      return withLatency(item);
  },
  getToolboxItems: async (): Promise<ToolboxItem[]> => withLatency(INITIAL_TOOLBOX_ITEMS),
  getToolboxItemById: async (id: string): Promise<ToolboxItem | undefined> => {
      const item = INITIAL_TOOLBOX_ITEMS.find(i => i.id === id);
      return withLatency(item);
  },
  getAllianceTasks: async (): Promise<AllianceTask[]> => withLatency(INITIAL_ALLIANCE_TASKS)
};