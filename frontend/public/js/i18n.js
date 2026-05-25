/* ============================================================
   PRWP i18n — Bilingual Module (中文 / English)
   ============================================================ */

const i18n = (() => {
  let currentLang = localStorage.getItem('prwp_lang') || 'zh';

  const translations = {
    zh: {
      // --- App ---
      'app.name':    'PRWP',
      'app.fullname':'精密电阻焊平台',
      'app.version': 'v1.0',

      // --- Nav ---
      'nav.overview':    '平台总览',
      'nav.core':        '核心库',
      'nav.advanced':    '高级库',
      'nav.system':      '系统层',

      // --- Libraries ---
      'lib.01.name':  '材料库',
      'lib.01.en':    'Material Library',
      'lib.01.desc':  '定义所有焊接材料的物理特性、可焊性等级与工艺推荐',
      'lib.02.name':  '界面库',
      'lib.02.en':    'Interface Library',
      'lib.02.desc':  '分析材料配对界面特性、热集中难度与氧化风险',
      'lib.03.name':  '工艺模板库',
      'lib.03.en':    'Process Template Library',
      'lib.03.desc':  '标准化工艺方法论，定义控制模式与参数曲线',
      'lib.04.name':  '电源库',
      'lib.04.en':    'Power System Library',
      'lib.04.desc':  '电源能力模型，匹配设备与工艺需求',
      'lib.05.name':  '机构库',
      'lib.05.en':    'Mechanical Head Library',
      'lib.05.desc':  '焊头结构、随动能力与压力控制模型',
      'lib.06.name':  '电极库',
      'lib.06.en':    'Electrode Library',
      'lib.06.desc':  '电极材料、几何形状与寿命预测',
      'lib.07.name':  '传感闭环库',
      'lib.07.en':    'Sensor & Closed-Loop Library',
      'lib.07.desc':  '传感器类型、采样率与闭环控制策略',
      'lib.08.name':  '波形库',
      'lib.08.en':    'Waveform Library',
      'lib.08.desc':  '标准波形、失效波形与黄金窗口数据库',
      'lib.09.name':  '失效库',
      'lib.09.en':    'Failure Library',
      'lib.09.desc':  '失效模式物理机制、波形特征与纠正措施',
      'lib.10.name':  'DOE验证库',
      'lib.10.en':    'DOE Validation Library',
      'lib.10.desc':  '实验设计、参数窗口与CPK优化结果',
      'lib.11.name':  '量产窗口库',
      'lib.11.en':    'Production Window Library',
      'lib.11.desc':  '黄金参数窗口、报警阈值与SPC控制',
      'lib.12.name':  'EMC与水冷库',
      'lib.12.en':    'EMC & Water Cooling Library',
      'lib.12.desc':  '布线规范、接地设计与冷却系统管理',
      'lib.13.name':  '控制软件库',
      'lib.13.en':    'Control Software Library',
      'lib.13.desc':  '焊接控制OS、配方管理与MES接口',
      'lib.14.name':  'AI工艺引擎',
      'lib.14.en':    'AI Process Engine',
      'lib.14.desc':  '智能工艺推荐、参数预测与风险预判',
      'lib.15.name':  '项目案例库',
      'lib.15.en':    'Project Case Library',
      'lib.15.desc':  '实际项目数据积累、问题解决方案沉淀',

      // --- Dashboard ---
      'dash.title':     '平台总览',
      'dash.subtitle':  'PRWP 精密电阻焊平台 — 知识系统骨架 v1.0',
      'dash.stats.materials':   '材料对象',
      'dash.stats.interfaces':  '界面配对',
      'dash.stats.failures':    '失效模式',
      'dash.stats.templates':   '工艺模板',
      'dash.stats.active':      '活跃库',
      'dash.flow.title':        '平台核心逻辑链',
      'dash.flow.subtitle':     'PRWP 知识推导流',
      'dash.libs.title':        '15 个知识库',
      'dash.libs.subtitle':     '平台知识架构全览',
      'dash.status.active':     '已激活',
      'dash.status.soon':       '开发中',
      'dash.status.planned':    '规划中',

      // --- Material ---
      'mat.title':          '材料库',
      'mat.subtitle':       '定义焊接材料的物理特性与工艺推荐参数',
      'mat.id':             '材料编号',
      'mat.name':           '材料名称',
      'mat.category':       '类别',
      'mat.conductivity':   '导电性',
      'mat.thermal':        '导热性',
      'mat.hardness':       '硬度',
      'mat.melting':        '熔点',
      'mat.oxidation':      '氧化行为',
      'mat.contact_r':      '接触电阻',
      'mat.weldability':    '可焊性等级',
      'mat.splash':         '飞溅风险',
      'mat.crack':          '裂纹风险',
      'mat.rec_current':    '推荐电流密度',
      'mat.rec_pressure':   '推荐压力',
      'mat.rec_waveform':   '推荐波形',
      'mat.notes':          '备注',

      // --- Interface ---
      'ifc.title':          '界面库',
      'ifc.subtitle':       '分析材料配对界面的焊接特性与失效风险',
      'ifc.material_a':     '材料 A',
      'ifc.material_b':     '材料 B',
      'ifc.type':           '界面类型',
      'ifc.heat_diff':      '热集中难度',
      'ifc.oxide_risk':     '氧化风险',
      'ifc.current_stable': '电流路径稳定性',
      'ifc.rec_process':    '推荐工艺模型',
      'ifc.failures':       '已知失效模式',

      // --- Failure ---
      'fail.title':         '失效库',
      'fail.subtitle':      '电阻焊失效模式、物理机制与纠正措施',
      'fail.mechanism':     '物理机制',
      'fail.waveform':      '波形特征',
      'fail.mechanical':    '机械特征',
      'fail.root_cause':    '根因',
      'fail.correction':    '纠正措施',

      // --- Process ---
      'proc.title':         '工艺模板库',
      'proc.subtitle':      '标准化工艺方法论与参数模板',
      'proc.control_mode':  '控制模式',
      'proc.sensor_req':    '传感需求',
      'proc.rec_electrode': '推荐电极',
      'proc.known_risks':   '已知风险',
      'proc.applies_to':    '适用材料',

      // --- Knowledge Chain ---
      'kc.title':           '知识推导链',
      'kc.subtitle':        '从材料到工艺参数的完整推导路径示例',

      // --- Common ---
      'common.high':        '高',
      'common.medium':      '中',
      'common.low':         '低',
      'common.very_high':   '极高',
      'common.coming_soon': '开发中',
      'common.data_schema': '数据结构预览',
      'common.see_all':     '查看全部',
      'common.back':        '返回',
      'common.p0':          'P0 最高优先级',
      'common.p1':          'P1 高优先级',
      'common.p2':          'P2 标准',
    },

    en: {
      // --- App ---
      'app.name':    'PRWP',
      'app.fullname':'Precision Resistance Welding Platform',
      'app.version': 'v1.0',

      // --- Nav ---
      'nav.overview':    'Overview',
      'nav.core':        'Core Libraries',
      'nav.advanced':    'Advanced Libraries',
      'nav.system':      'System Layer',

      // --- Libraries ---
      'lib.01.name':  'Material Library',
      'lib.01.en':    'Material Library',
      'lib.01.desc':  'Physical properties, weldability levels and process recommendations for all welding materials',
      'lib.02.name':  'Interface Library',
      'lib.02.en':    'Interface Library',
      'lib.02.desc':  'Material pairing interface characteristics, heat concentration difficulty and oxidation risk',
      'lib.03.name':  'Process Templates',
      'lib.03.en':    'Process Template Library',
      'lib.03.desc':  'Standardized process methodology defining control modes and parameter curves',
      'lib.04.name':  'Power System Library',
      'lib.04.en':    'Power System Library',
      'lib.04.desc':  'Power source capability models matching equipment to process requirements',
      'lib.05.name':  'Mechanical Head Library',
      'lib.05.en':    'Mechanical Head Library',
      'lib.05.desc':  'Welding head structure, follow-up capability and force control models',
      'lib.06.name':  'Electrode Library',
      'lib.06.en':    'Electrode Library',
      'lib.06.desc':  'Electrode materials, geometry and life expectancy prediction',
      'lib.07.name':  'Sensor & Closed-Loop',
      'lib.07.en':    'Sensor & Closed-Loop Library',
      'lib.07.desc':  'Sensor types, sampling rates and closed-loop control strategies',
      'lib.08.name':  'Waveform Library',
      'lib.08.en':    'Waveform Library',
      'lib.08.desc':  'Standard waveforms, failure waveforms and golden window database',
      'lib.09.name':  'Failure Library',
      'lib.09.en':    'Failure Library',
      'lib.09.desc':  'Failure mode physics, waveform signatures and corrective actions',
      'lib.10.name':  'DOE Validation',
      'lib.10.en':    'DOE Validation Library',
      'lib.10.desc':  'Design of experiments, parameter windows and CPK optimization',
      'lib.11.name':  'Production Window',
      'lib.11.en':    'Production Window Library',
      'lib.11.desc':  'Golden parameter windows, alarm thresholds and SPC control',
      'lib.12.name':  'EMC & Water Cooling',
      'lib.12.en':    'EMC & Water Cooling Library',
      'lib.12.desc':  'Cable routing, grounding design and cooling system management',
      'lib.13.name':  'Control Software',
      'lib.13.en':    'Control Software Library',
      'lib.13.desc':  'Welding control OS, recipe management and MES interface',
      'lib.14.name':  'AI Process Engine',
      'lib.14.en':    'AI Process Engine',
      'lib.14.desc':  'Intelligent process recommendation, parameter prediction and risk forecasting',
      'lib.15.name':  'Project Case Library',
      'lib.15.en':    'Project Case Library',
      'lib.15.desc':  'Real project data accumulation and solution knowledge base',

      // --- Dashboard ---
      'dash.title':     'Platform Overview',
      'dash.subtitle':  'PRWP Precision Resistance Welding Platform — Knowledge Skeleton v1.0',
      'dash.stats.materials':   'Materials',
      'dash.stats.interfaces':  'Interfaces',
      'dash.stats.failures':    'Failure Modes',
      'dash.stats.templates':   'Process Templates',
      'dash.stats.active':      'Active Libraries',
      'dash.flow.title':        'Platform Core Logic Chain',
      'dash.flow.subtitle':     'PRWP Knowledge Derivation Flow',
      'dash.libs.title':        '15 Knowledge Libraries',
      'dash.libs.subtitle':     'Complete Platform Architecture',
      'dash.status.active':     'Active',
      'dash.status.soon':       'In Development',
      'dash.status.planned':    'Planned',

      // --- Material ---
      'mat.title':          'Material Library',
      'mat.subtitle':       'Physical properties and process recommendations for welding materials',
      'mat.id':             'Material ID',
      'mat.name':           'Material Name',
      'mat.category':       'Category',
      'mat.conductivity':   'Conductivity',
      'mat.thermal':        'Thermal Conductivity',
      'mat.hardness':       'Hardness',
      'mat.melting':        'Melting Point',
      'mat.oxidation':      'Oxidation Behavior',
      'mat.contact_r':      'Contact Resistance',
      'mat.weldability':    'Weldability Level',
      'mat.splash':         'Splash Risk',
      'mat.crack':          'Crack Risk',
      'mat.rec_current':    'Recommended Current Density',
      'mat.rec_pressure':   'Recommended Pressure',
      'mat.rec_waveform':   'Recommended Waveform',
      'mat.notes':          'Notes',

      // --- Interface ---
      'ifc.title':          'Interface Library',
      'ifc.subtitle':       'Welding interface characteristics and failure risk analysis',
      'ifc.material_a':     'Material A',
      'ifc.material_b':     'Material B',
      'ifc.type':           'Interface Type',
      'ifc.heat_diff':      'Heat Concentration Difficulty',
      'ifc.oxide_risk':     'Oxidation Risk',
      'ifc.current_stable': 'Current Path Stability',
      'ifc.rec_process':    'Recommended Process Model',
      'ifc.failures':       'Known Failure Modes',

      // --- Failure ---
      'fail.title':         'Failure Library',
      'fail.subtitle':      'Resistance welding failure modes, mechanisms and corrective actions',
      'fail.mechanism':     'Physical Mechanism',
      'fail.waveform':      'Waveform Signature',
      'fail.mechanical':    'Mechanical Signature',
      'fail.root_cause':    'Root Cause',
      'fail.correction':    'Corrective Action',

      // --- Process ---
      'proc.title':         'Process Template Library',
      'proc.subtitle':      'Standardized process methodology and parameter templates',
      'proc.control_mode':  'Control Mode',
      'proc.sensor_req':    'Sensor Requirements',
      'proc.rec_electrode': 'Recommended Electrode',
      'proc.known_risks':   'Known Risks',
      'proc.applies_to':    'Applicable Materials',

      // --- Knowledge Chain ---
      'kc.title':           'Knowledge Chain',
      'kc.subtitle':        'Complete derivation path from material to process parameters',

      // --- Common ---
      'common.high':        'High',
      'common.medium':      'Medium',
      'common.low':         'Low',
      'common.very_high':   'Very High',
      'common.coming_soon': 'Coming Soon',
      'common.data_schema': 'Data Schema Preview',
      'common.see_all':     'See All',
      'common.back':        'Back',
      'common.p0':          'P0 Critical',
      'common.p1':          'P1 High',
      'common.p2':          'P2 Standard',
    }
  };

  const t = (key) => {
    const lang = translations[currentLang];
    return lang?.[key] || translations['zh'][key] || key;
  };

  const setLang = (lang) => {
    currentLang = lang;
    localStorage.setItem('prwp_lang', lang);
    document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  };

  const getLang = () => currentLang;

  return { t, setLang, getLang };
})();
