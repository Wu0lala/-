import { ActivityCategory, EnergyLevel, Language } from './types';

export const translations = {
  en: {
    appTitle: 'DailyFlow',
    reset: 'Reset',
    settings: 'Settings',
    history: 'History & Stats',
    timelineTitle: "Timeline",
    entries: 'entries',
    noActivities: 'No activities yet',
    noActivitiesSub: 'Tap the + button to start logging your day.',
    addBtn: 'Add Activity',
    analyzing: 'Analyzing Schedule...',
    generate: 'Generate Daily Review',
    deleteConfirm: 'Delete this activity?',
    clearConfirm: 'Clear all logs for today?',
    errorNoActivities: 'Please add some activities first.',
    errorGeneric: 'Failed to analyze.',
    
    // Date & History
    viewDay: 'Day',
    viewWeek: 'Week',
    viewMonth: 'Month',
    totalDuration: 'Total Duration',
    hours: 'h',
    mins: 'm',
    
    // Form
    logActivity: 'Log Activity',
    activityName: 'Activity Name',
    activityNamePlaceholder: 'e.g., Deep Work Project A',
    startTime: 'Start Time',
    duration: 'Duration (mins)',
    category: 'Category',
    energyLabel: 'Energy',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'How did it go?',
    save: 'Save Activity',

    // Analysis
    analysisTitle: 'Gemini Analysis',
    close: 'Close',
    efficiencyScore: 'Efficiency Score',
    keyInsights: 'Key Insights',
    suggestions: 'Suggestions',
    optimizedSchedule: 'Optimized Schedule',

    // Stats
    timeDistribution: 'Time Distribution',
    noData: 'No data to visualize',

    // Settings
    settingsTitle: 'Settings',
    language: 'Language',
    apiBaseUrl: 'API Base URL (Optional)',
    apiBaseUrlHelp: 'Use a custom proxy URL if Gemini is blocked in your region (e.g., China/Russia). Leave empty for default.',
    usePublicProxy: 'Use Public Proxy',
    saveSettings: 'Save Settings',
    dataManagement: 'Data Management',
    exportData: 'Export Data (JSON)',
    importData: 'Import Data',
    importSuccess: 'Data imported successfully!',
    importError: 'Invalid data file.',

    // Enums
    categories: {
      [ActivityCategory.WORK]: 'Work',
      [ActivityCategory.LEARNING]: 'Learning',
      [ActivityCategory.HEALTH]: 'Health',
      [ActivityCategory.LEISURE]: 'Leisure',
      [ActivityCategory.CHORE]: 'Chore',
      [ActivityCategory.SOCIAL]: 'Social',
      [ActivityCategory.OTHER]: 'Other',
    },
    energyLevels: {
      [EnergyLevel.HIGH]: 'High',
      [EnergyLevel.MEDIUM]: 'Medium',
      [EnergyLevel.LOW]: 'Low',
    }
  },
  zh: {
    appTitle: 'DailyFlow 日常流',
    reset: '重置',
    settings: '设置',
    history: '历史统计',
    timelineTitle: "时间轴",
    entries: '条记录',
    noActivities: '暂无活动记录',
    noActivitiesSub: '点击 + 按钮开始记录你的一天',
    addBtn: '添加活动',
    analyzing: '正在分析日程...',
    generate: '生成日报分析',
    deleteConfirm: '删除这条活动?',
    clearConfirm: '清空今日所有记录?',
    errorNoActivities: '请先添加一些活动记录',
    errorGeneric: '分析失败，请检查设置',

    // Date & History
    viewDay: '日',
    viewWeek: '周',
    viewMonth: '月',
    totalDuration: '总时长',
    hours: '小时',
    mins: '分钟',

    // Form
    logActivity: '记录活动',
    activityName: '活动名称',
    activityNamePlaceholder: '例如：深度工作 项目A',
    startTime: '开始时间',
    duration: '时长 (分钟)',
    category: '分类',
    energyLabel: '精力状态',
    notes: '备注 (选填)',
    notesPlaceholder: '感觉如何？完成得怎么样？',
    save: '保存活动',

    // Analysis
    analysisTitle: 'Gemini 智能分析',
    close: '关闭',
    efficiencyScore: '效率评分',
    keyInsights: '关键洞察',
    suggestions: '改进建议',
    optimizedSchedule: '优化后的日程建议',

    // Stats
    timeDistribution: '时间分布',
    noData: '暂无数据可展示',

    // Settings
    settingsTitle: '应用设置',
    language: '语言 (Language)',
    apiBaseUrl: 'API 代理地址 (Base URL)',
    apiBaseUrlHelp: '如果您在中国大陆或俄罗斯等无法直接访问 Gemini 的地区，请输入自定义代理地址。留空则使用默认地址。',
    usePublicProxy: '使用公共代理 (修复连接)',
    saveSettings: '保存设置',
    dataManagement: '数据管理',
    exportData: '导出备份 (JSON)',
    importData: '导入备份',
    importSuccess: '数据导入成功！',
    importError: '文件格式错误，导入失败。',

    // Enums
    categories: {
      [ActivityCategory.WORK]: '工作',
      [ActivityCategory.LEARNING]: '学习',
      [ActivityCategory.HEALTH]: '健康',
      [ActivityCategory.LEISURE]: '休闲',
      [ActivityCategory.CHORE]: '杂务',
      [ActivityCategory.SOCIAL]: '社交',
      [ActivityCategory.OTHER]: '其他',
    },
    energyLevels: {
      [EnergyLevel.HIGH]: '充沛',
      [EnergyLevel.MEDIUM]: '一般',
      [EnergyLevel.LOW]: '疲惫',
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];