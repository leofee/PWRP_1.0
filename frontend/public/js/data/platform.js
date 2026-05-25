/* ============================================================
   PRWP Platform Data — 15 Library Definitions
   ============================================================ */

const PLATFORM_DATA = {
  version: '1.0',
  libraries: [
    {
      id: '01', key: 'material',
      nameKey: 'lib.01.name', enKey: 'lib.01.en', descKey: 'lib.01.desc',
      status: 'active', priority: 'P0',
      route: '#material', count: 3, color: 'var(--lib-color-01)',
      icon: '⚗️',
    },
    {
      id: '02', key: 'interface',
      nameKey: 'lib.02.name', enKey: 'lib.02.en', descKey: 'lib.02.desc',
      status: 'active', priority: 'P0',
      route: '#interface', count: 3, color: 'var(--lib-color-02)',
      icon: '🔗',
    },
    {
      id: '03', key: 'process',
      nameKey: 'lib.03.name', enKey: 'lib.03.en', descKey: 'lib.03.desc',
      status: 'active', priority: 'P0',
      route: '#process', count: 5, color: 'var(--lib-color-03)',
      icon: '📐',
    },
    {
      id: '04', key: 'power',
      nameKey: 'lib.04.name', enKey: 'lib.04.en', descKey: 'lib.04.desc',
      status: 'soon', priority: 'P1',
      route: '#power', count: 0, color: 'var(--lib-color-04)',
      icon: '⚡',
    },
    {
      id: '05', key: 'head',
      nameKey: 'lib.05.name', enKey: 'lib.05.en', descKey: 'lib.05.desc',
      status: 'soon', priority: 'P1',
      route: '#head', count: 0, color: 'var(--lib-color-05)',
      icon: '🔩',
    },
    {
      id: '06', key: 'electrode',
      nameKey: 'lib.06.name', enKey: 'lib.06.en', descKey: 'lib.06.desc',
      status: 'soon', priority: 'P1',
      route: '#electrode', count: 0, color: 'var(--lib-color-06)',
      icon: '🔋',
    },
    {
      id: '07', key: 'sensor',
      nameKey: 'lib.07.name', enKey: 'lib.07.en', descKey: 'lib.07.desc',
      status: 'soon', priority: 'P1',
      route: '#sensor', count: 0, color: 'var(--lib-color-07)',
      icon: '📡',
    },
    {
      id: '08', key: 'waveform',
      nameKey: 'lib.08.name', enKey: 'lib.08.en', descKey: 'lib.08.desc',
      status: 'soon', priority: 'P1',
      route: '#waveform', count: 0, color: 'var(--lib-color-08)',
      icon: '〰️',
    },
    {
      id: '09', key: 'failure',
      nameKey: 'lib.09.name', enKey: 'lib.09.en', descKey: 'lib.09.desc',
      status: 'active', priority: 'P0',
      route: '#failure', count: 4, color: 'var(--lib-color-09)',
      icon: '⚠️',
    },
    {
      id: '10', key: 'doe',
      nameKey: 'lib.10.name', enKey: 'lib.10.en', descKey: 'lib.10.desc',
      status: 'planned', priority: 'P2',
      route: '#doe', count: 0, color: 'var(--lib-color-10)',
      icon: '📊',
    },
    {
      id: '11', key: 'production',
      nameKey: 'lib.11.name', enKey: 'lib.11.en', descKey: 'lib.11.desc',
      status: 'planned', priority: 'P2',
      route: '#production', count: 0, color: 'var(--lib-color-11)',
      icon: '🏭',
    },
    {
      id: '12', key: 'emc',
      nameKey: 'lib.12.name', enKey: 'lib.12.en', descKey: 'lib.12.desc',
      status: 'planned', priority: 'P2',
      route: '#emc', count: 0, color: 'var(--lib-color-12)',
      icon: '🛡️',
    },
    {
      id: '13', key: 'software',
      nameKey: 'lib.13.name', enKey: 'lib.13.en', descKey: 'lib.13.desc',
      status: 'planned', priority: 'P2',
      route: '#software', count: 0, color: 'var(--lib-color-13)',
      icon: '💻',
    },
    {
      id: '14', key: 'ai',
      nameKey: 'lib.14.name', enKey: 'lib.14.en', descKey: 'lib.14.desc',
      status: 'planned', priority: 'P2',
      route: '#ai', count: 0, color: 'var(--lib-color-14)',
      icon: '🧠',
    },
    {
      id: '15', key: 'cases',
      nameKey: 'lib.15.name', enKey: 'lib.15.en', descKey: 'lib.15.desc',
      status: 'planned', priority: 'P2',
      route: '#cases', count: 0, color: 'var(--lib-color-15)',
      icon: '📁',
    },
  ],

  // Core logic flow steps
  flowSteps: [
    { icon: '⚗️',  labelZh: '材料',     labelEn: 'Material',   subZh: '物性分析',   subEn: 'Properties' },
    { icon: '🔗',  labelZh: '界面',     labelEn: 'Interface',  subZh: '界面特征',   subEn: 'Characteristics' },
    { icon: '📐',  labelZh: '工艺模板', labelEn: 'Process',    subZh: '方法论',     subEn: 'Methodology' },
    { icon: '⚡',  labelZh: '设备能力', labelEn: 'Equipment',  subZh: '电源/机构',  subEn: 'Power/Head' },
    { icon: '🎯',  labelZh: '参数',     labelEn: 'Parameters', subZh: '初始窗口',   subEn: 'Init Window' },
    { icon: '🔥',  labelZh: '焊接',     labelEn: 'Welding',    subZh: '执行',       subEn: 'Execution' },
    { icon: '📡',  labelZh: '传感',     labelEn: 'Sensing',    subZh: '闭环反馈',   subEn: 'Feedback' },
    { icon: '✅',  labelZh: '质量',     labelEn: 'Quality',    subZh: '判断',       subEn: 'Judgment' },
    { icon: '📊',  labelZh: 'DOE',      labelEn: 'DOE',        subZh: '优化',       subEn: 'Optimize' },
    { icon: '🧠',  labelZh: '知识',     labelEn: 'Knowledge',  subZh: '沉淀',       subEn: 'Retention' },
  ],
};
